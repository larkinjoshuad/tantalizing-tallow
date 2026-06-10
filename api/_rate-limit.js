/**
 * In-memory rate limiter for /api/chat.
 *
 * Best-effort per-instance limiter. Vercel serverless functions can run as
 * multiple instances concurrently, so a determined attacker could exceed the
 * limit by ~Nx where N is the active instance count. That's still a hard cap
 * on the worst case (typically 5-20x the configured limit), versus the prior
 * unlimited state where one attacker could exhaust the Anthropic budget.
 *
 * For stricter limits, the right next step is Marketplace Redis (Upstash) —
 * see CLAUDE.md project conventions. That's deferred to a follow-up PR.
 *
 * Algorithm: sliding-window counter (newest-first array of timestamps per IP),
 * windowed to MAX_WINDOW_MS. O(1) check, O(N) prune where N = requests in window.
 *
 * Memory protection: hard cap on the number of distinct IPs tracked. Once the
 * cap is hit, the oldest entry is evicted (LRU-ish via insertion order in Map).
 */

const MAX_REQUESTS = 10;            // per IP per window
const WINDOW_MS = 60_000;           // 60 seconds
const MAX_TRACKED_IPS = 5000;       // ~80KB at 16 bytes per entry; cheap

const requestLog = new Map();       // ip -> [timestampMs, timestampMs, ...]

/**
 * Check whether a request from the given IP is allowed.
 * @param {string} ip
 * @returns {{ allowed: boolean, retryAfterSeconds?: number }}
 */
export function checkRateLimit(ip) {
  if (!ip) {
    // No IP available (shouldn't happen on Vercel) — allow but log
    console.warn("[rate-limit] no IP available, allowing");
    return { allowed: true };
  }

  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  // Eviction: if we're at the cap and this IP isn't tracked, drop the oldest entry
  if (!requestLog.has(ip) && requestLog.size >= MAX_TRACKED_IPS) {
    const oldestKey = requestLog.keys().next().value;
    requestLog.delete(oldestKey);
  }

  // Prune old timestamps for this IP, then check
  const timestamps = (requestLog.get(ip) || []).filter((t) => t > cutoff);

  if (timestamps.length >= MAX_REQUESTS) {
    // Compute when the oldest request will fall out of the window
    const oldestInWindow = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  // Move to end of insertion order for LRU eviction (delete + re-set)
  requestLog.delete(ip);
  requestLog.set(ip, timestamps);

  return { allowed: true };
}

/**
 * Extract the client IP from a Vercel request.
 * Prefers x-forwarded-for (Vercel sets this), falls back to x-real-ip.
 * x-forwarded-for may be a comma-separated list; the leftmost entry is the
 * original client.
 */
export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const first = (Array.isArray(xff) ? xff[0] : xff).split(",")[0].trim();
    if (first) return first;
  }
  const xri = req.headers["x-real-ip"];
  if (xri) return Array.isArray(xri) ? xri[0] : xri;
  return null;
}
