import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  createCart, addCartLines, getVariantId, buildShopifyCartUrl,
} from "../lib/shopify";

const CartContext = createContext(null);

// ─── Cart persistence ───
// The cart previously lived only in React memory, so ANY full page load —
// a refresh, or the checkout redirect bouncing back to our domain — wiped
// it and the customer saw "Your cart is empty". Persist to localStorage.
const CART_STORAGE_KEY = "tt_cart_v1";

function loadPersistedCart() {
  // SSR guard: entry-server renders this provider in Node at build time
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // Sanitize: only keep well-formed entries; cap qty and list length so a
    // tampered localStorage value can't produce absurd carts
    return arr
      .filter(
        (i) =>
          i &&
          typeof i.handle === "string" &&
          typeof i.price === "number" &&
          Number.isFinite(i.qty) &&
          i.qty > 0
      )
      .map((i) => ({ ...i, qty: Math.min(99, Math.floor(i.qty)) }))
      .slice(0, 50);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadPersistedCart);
  const [shopifyCart, setShopifyCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Persist on every cart change (quota errors and private-mode failures
  // are non-fatal — the cart just won't survive a reload)
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  // If the user navigates to checkout and comes back via the browser's
  // back/forward cache, the page is restored with checkoutLoading still
  // true — the button would be stuck on "Preparing checkout…" forever.
  // pageshow with event.persisted fires exactly on bfcache restores.
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) setCheckoutLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  const addItem = useCallback((product, qty = 1) => {
    // Resolve variantId from Shopify map if not already on the product
    const variantId = product.variantId || getVariantId(product.handle, product.price);

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        return updated;
      }
      return [...prev, { ...product, qty, variantId }];
    });
    triggerFlash();

    // Async Shopify cart sync
    if (variantId) {
      (async () => {
        try {
          let cart = shopifyCart;
          if (!cart) cart = await createCart();
          if (cart) {
            const updated = await addCartLines(cart.id, variantId, qty);
            setShopifyCart(updated);
          }
        } catch (err) {
          console.warn("[Cart] Shopify sync failed:", err.message);
        }
      })();
    }
  }, [shopifyCart]);

  const updateQty = useCallback((index, newQty) => {
    if (newQty <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, qty: newQty } : item))
      );
    }
  }, []);

  const removeItem = useCallback((index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Checkout flow — myshopify-direct strategy.
   *
   * Why not use shopifyCart.checkoutUrl from the Storefront API? That URL
   * is rendered using the Shopify-side primary domain. With our domain
   * config (apex 307 → www) and Shopify's primary-domain redirect, the
   * customer's browser ping-pongs between www and apex/myshopify, hitting
   * ERR_TOO_MANY_REDIRECTS. The fix on Shopify's side is to change the
   * primary domain to www, but until that's done, we force checkout to
   * use tantalizingtallow.myshopify.com directly so the customer arrives
   * at the checkout page without any redirect chain.
   *
   * Cost: customer's URL bar shows tantalizingtallow.myshopify.com during
   * checkout (lower visual trust). Benefit: checkout actually works.
   *
   * Once Shopify primary is fixed to www, revert this to the prior
   * Tier 1 → Tier 2 → Tier 3 strategy and use the API-returned checkoutUrl.
   */
  const checkout = useCallback(async () => {
    setCheckoutLoading(true);

    // First-choice: build a permalink directly on myshopify with item
    // variant IDs. Shopify creates a cart and lands on its own
    // /checkouts/cn/<token> page — no redirect chain involved.
    const permalink = buildShopifyCartUrl(items);
    if (permalink) {
      window.location.href = permalink;
      return;
    }

    // Fallback: variant IDs not yet resolved (slow connection or first
    // page load). Try the Storefront API to create a cart, then convert
    // its checkoutUrl host to myshopify so the customer skips the loop.
    try {
      const lines = items
        .map((item) => {
          const vid = item.variantId || getVariantId(item.handle, item.price);
          return vid ? { merchandiseId: vid, quantity: item.qty } : null;
        })
        .filter(Boolean);

      if (lines.length > 0) {
        const cart = await createCart(lines);
        if (cart?.checkoutUrl) {
          setShopifyCart(cart);
          // Replace any primary-domain host with myshopify so the
          // checkout URL doesn't loop through Vercel's domain redirects.
          const safeUrl = cart.checkoutUrl.replace(
            /^https:\/\/(www\.)?tantalizingtallow\.com/,
            "https://tantalizingtallow.myshopify.com"
          );
          window.location.href = safeUrl;
          return;
        }
      }
    } catch (err) {
      console.warn("[Cart] On-demand checkout creation failed:", err.message);
    }

    // Last resort — couldn't build a cart at all.
    window.location.href = "https://tantalizingtallow.myshopify.com/cart";
    setCheckoutLoading(false);
  }, [items]);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, updateQty, removeItem, checkout,
        isOpen, setIsOpen, flash, totalQty, subtotal, checkoutLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
