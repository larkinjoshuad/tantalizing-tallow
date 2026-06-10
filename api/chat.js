/**
 * Vercel Serverless Function — TallowExpert Claude API Proxy
 *
 * Called only when the regex engine falls to fallback (~13% of queries).
 * Keeps the Anthropic API key server-side. Returns a JSON response with
 * { text, products } matching the regex engine's response shape.
 *
 * Hardening (PR #2):
 * - CORS allowlist (no more wildcard origin)
 * - In-memory per-IP rate limit (10 req / 60s)
 * - Migrated from raw fetch to @anthropic-ai/sdk
 * - Prompt caching on the static system prompt (~90% read cost reduction
 *   for cached portion)
 * - Model: claude-haiku-4-5 (was claude-sonnet-4-20250514)
 *   Rationale: TallowExpert is product Q&A on a small DTC site; Haiku is
 *   more than capable here and ~80% cheaper than Sonnet. Easy to swap up
 *   if quality issues surface.
 * - Typed exception handling via Anthropic SDK error classes
 */

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./_system-prompt.js";
import { checkRateLimit, getClientIp } from "./_rate-limit.js";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 400;

// Origins allowed to call this endpoint. Localhost not included on purpose —
// `vite dev` doesn't need to hit prod chat. If a dev needs to, they can run
// the API locally via `vercel dev` which uses the same origin.
const ALLOWED_ORIGINS = new Set([
  "https://tantalizingtallow.com",
  "https://www.tantalizingtallow.com",
]);

// Singleton SDK client. Picks up ANTHROPIC_API_KEY from process.env.
let _client = null;
function getClient() {
  if (!_client) _client = new Anthropic();
  return _client;
}

// Standard fallback response for any error. Keeps shape consistent with success.
const FALLBACK_RESPONSE = {
  text: "I'm having a brief connection issue. Try asking about your skin type or a specific product — I can usually help with those instantly!",
  products: [],
};

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  // Chat responses are per-user and must never be cached by intermediaries
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit before doing any work (and before consuming API tokens)
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    res.setHeader("Retry-After", String(rl.retryAfterSeconds));
    return res.status(429).json({
      text: "I'm getting a lot of questions right now — please give me a moment and try again!",
      products: [],
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[chat] ANTHROPIC_API_KEY not set");
    return res.status(500).json({
      text: "I'm having trouble connecting right now. In the meantime, try asking about your skin type, a specific product name, or say 'build me a routine'!",
      products: [],
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: "Message too long (max 1000 chars)" });
    }
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "Invalid history" });
    }

    // Build conversation history (last 6 turns max to control token usage).
    // Each turn's text is capped at 1000 chars — same limit as the live
    // message — so a crafted history can't smuggle megabytes of input
    // tokens past the message-length check.
    const conversationMessages = [];
    const recentHistory = history.slice(-6);
    for (const turn of recentHistory) {
      if (!turn || typeof turn.text !== "string") continue;
      conversationMessages.push({
        role: turn.role === "ai" ? "assistant" : "user",
        content: turn.text.slice(0, 1000),
      });
    }
    conversationMessages.push({ role: "user", content: message });

    const client = getClient();

    // Caching: put cache_control on the system prompt itself (the stable prefix).
    // The user message comes after, so it doesn't break the cached prefix.
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: conversationMessages,
    });

    // Log cache effectiveness (visible in Vercel runtime logs)
    if (response.usage) {
      console.log(
        `[chat] usage: input=${response.usage.input_tokens} cache_read=${response.usage.cache_read_input_tokens || 0} cache_write=${response.usage.cache_creation_input_tokens || 0} output=${response.usage.output_tokens}`
      );
    }

    const rawText = response.content?.[0]?.type === "text"
      ? response.content[0].text
      : "";

    // Parse the structured JSON response Claude is instructed to return.
    let parsed;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // JSON parse failed — fall through to raw text
    }

    if (parsed && typeof parsed.text === "string") {
      return res.status(200).json({
        text: parsed.text,
        products: Array.isArray(parsed.products) ? parsed.products : [],
      });
    }

    // Fallback: use raw text, no product cards
    return res.status(200).json({
      text: rawText || "I can help with product recommendations, routines, and ingredient questions. What's your skin concern?",
      products: [],
    });
  } catch (err) {
    // Typed exception handling per Anthropic SDK conventions.
    // Order matters: check most specific first.
    if (err instanceof Anthropic.RateLimitError) {
      console.error("[chat] Anthropic rate limit hit:", err.message);
      res.setHeader("Retry-After", "30");
      return res.status(429).json(FALLBACK_RESPONSE);
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("[chat] Anthropic auth error — check ANTHROPIC_API_KEY:", err.message);
      return res.status(500).json(FALLBACK_RESPONSE);
    }
    if (err instanceof Anthropic.BadRequestError) {
      console.error("[chat] Anthropic bad request:", err.message);
      return res.status(500).json(FALLBACK_RESPONSE);
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`[chat] Anthropic API error ${err.status}:`, err.message);
      return res.status(502).json(FALLBACK_RESPONSE);
    }
    console.error("[chat] Unexpected error:", err);
    return res.status(500).json({
      text: "Something went wrong on my end. Try asking about a specific product or your skin type!",
      products: [],
    });
  }
}
