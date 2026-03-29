import { createContext, useContext, useState, useCallback } from "react";
import { createCart, addCartLines, updateCartLines, removeCartLines } from "../lib/shopify";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [shopifyCart, setShopifyCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        return updated;
      }
      return [...prev, { ...product, qty }];
    });
    triggerFlash();

    // Async Shopify sync (fire and forget for now)
    if (product.variantId) {
      (async () => {
        try {
          let cart = shopifyCart;
          if (!cart) cart = await createCart();
          if (cart) {
            const updated = await addCartLines(cart.id, product.variantId, qty);
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

  const checkout = useCallback(() => {
    if (shopifyCart?.checkoutUrl) {
      window.location.href = shopifyCart.checkoutUrl;
    } else {
      // Fallback: redirect to Shopify store
      window.open("https://tantalizingtallow.com/cart", "_blank");
    }
  }, [shopifyCart]);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, updateQty, removeItem, checkout,
        isOpen, setIsOpen, flash, totalQty, subtotal,
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
