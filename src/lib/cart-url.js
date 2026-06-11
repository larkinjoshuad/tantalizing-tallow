/**
 * Parser for Shopify cart-permalink paths that bounce back to our domain.
 *
 * When checkout() sends a customer to
 *   tantalizingtallow.myshopify.com/cart/52395634262380:1
 * and Shopify's primary domain is misconfigured to a domain we serve,
 * Shopify 301s them to
 *   www.tantalizingtallow.com/cart/52395634262380:1
 * which lands on our React /cart/* route. This parser extracts the
 * variant/quantity pairs from that path so CartPage can restore the items
 * instead of showing an empty cart.
 *
 * Strict by design: only digit-colon-digit pairs are accepted. Anything
 * else (letters, traversal sequences, saved-cart tokens like /cart/c/...)
 * returns [] and the page renders the normal cart view.
 */
export function parseCartPermalinkPath(pathname) {
  if (typeof pathname !== "string") return [];
  const m = pathname.match(/^\/cart\/((?:\d+:\d+)(?:,\d+:\d+)*)\/?$/);
  if (!m) return [];
  return m[1].split(",").map((pair) => {
    const [variantId, rawQty] = pair.split(":");
    const qty = Math.max(1, Math.min(99, parseInt(rawQty, 10) || 1));
    return { variantId, qty };
  });
}
