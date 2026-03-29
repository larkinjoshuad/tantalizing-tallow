/**
 * Vercel Serverless Function — TallowExpert Claude API Proxy
 *
 * Called only when the regex engine falls to fallback (~13% of queries).
 * Keeps the Anthropic API key server-side. Returns a JSON response with
 * { text, products } matching the regex engine's response shape.
 */

import { SYSTEM_PROMPT } from "./_system-prompt.js";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export default async function handler(req, res) {
  // CORS headers for the frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set");
    return res.status(500).json({
      text: "I'm having trouble connecting right now. In the meantime, try asking about your skin type, a specific product name, or say 'build me a routine'!",
      products: [],
    });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.length > 1000) {
      return res.status(400).json({ error: "Invalid message" });
    }

    // Build conversation history (last 6 turns max to control token usage)
    const conversationMessages = [];
    const recentHistory = history.slice(-6);
    for (const turn of recentHistory) {
      conversationMessages.push({
        role: turn.role === "ai" ? "assistant" : "user",
        content: turn.text,
      });
    }
    conversationMessages.push({ role: "user", content: message });

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: conversationMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(502).json({
        text: "I'm having a brief connection issue. Try asking about your skin type or a specific product — I can usually help with those instantly!",
        products: [],
      });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "";

    // Parse the structured response from Claude
    // Claude is instructed to return JSON: { "text": "...", "products": [ids] }
    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parsing fails, use the raw text
    }

    if (parsed && parsed.text) {
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
    console.error("Chat handler error:", err);
    return res.status(500).json({
      text: "Something went wrong on my end. Try asking about a specific product or your skin type!",
      products: [],
    });
  }
}
