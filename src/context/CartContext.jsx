import { createContext, useContext, useState, useCallback } from "react";
import {
  createCart, addCartLines, getVariantId, buildShopifyCartUrl,
} from "../lib/shopify";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [shopifyCart, setShopifyCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
   * Checkout flow — 3-tier strategy:
   * 1. Use Shopify API checkoutUrl (if cart was synced during addItem)
   * 2. Build checkout on-the-fly from items (if sync failed but we have variant IDs)
   * 3. Build Shopify /cart/ permalink (always works if variant IDs are available)
   */
  const checkout = useCallback(async () => {
    // Tier 1: API checkout URL already available
    if (shopifyCart?.checkoutUrl) {
      window.location.href = shopifyCart.checkoutUrl;
      return;
    }

    setCheckoutLoading(true);

    // Tier 2: Try creating a Shopify cart with all items right now
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
          window.location.href = cart.checkoutUrl;
          return;
        }
      }
    } catch (err) {
      console.warn("[Cart] On-demand checkout creation failed:", err.message);
    }

    // Tier 3: Build Shopify /cart/ permalink (works without API)
    const permalink = buildShopifyCartUrl(items);
    if (permalink) {
      window.location.href = permalink;
    } else {
      // Last resort — shouldn't happen, but handle gracefully
      window.open("https://tantalizingtallow.myshopify.com/cart", "_blank");
    }

    setCheckoutLoading(false);
  }, [shopifyCart, items]);

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
