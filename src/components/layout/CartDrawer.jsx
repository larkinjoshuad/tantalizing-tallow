import { X, ShoppingCart, Minus, Plus, Truck } from "lucide-react";
import { BRAND, getProductImage } from "../../lib/constants";
import { useCart } from "../../context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, subtotal, checkout } = useCart();
  const C = BRAND.colors;
  const freeShip = subtotal >= BRAND.freeShipMin;
  const remaining = Math.max(0, BRAND.freeShipMin - subtotal);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1001 }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          maxWidth: "90vw",
          background: C.surface,
          zIndex: 1002,
          display: "flex",
          flexDirection: "column",
          borderLeft: `1px solid ${C.border}`,
          animation: "cartSlideIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 700 }}>
            Your Cart ({totalQty})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free shipping bar */}
        {subtotal > 0 && !freeShip && (
          <div style={{ padding: "12px 24px", background: C.accent }}>
            <div style={{ color: C.goldLight, fontSize: 13, marginBottom: 6 }}>
              Add ${remaining.toFixed(2)} more for free shipping!
            </div>
            <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
              <div
                style={{
                  height: "100%",
                  width: `${(subtotal / BRAND.freeShipMin) * 100}%`,
                  background: C.gold,
                  borderRadius: 2,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        )}
        {subtotal > 0 && freeShip && (
          <div
            style={{
              padding: "12px 24px",
              background: "#05966920",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Truck size={16} color="#34d399" />
            <span style={{ color: "#34d399", fontSize: 13, fontWeight: 600 }}>
              Free shipping unlocked!
            </span>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}>
              <ShoppingCart size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 16, margin: "0 0 4px" }}>Your cart is empty</p>
              <p style={{ fontSize: 13, margin: 0 }}>Ask TallowExpert for personalized recommendations!</p>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <img
                  src={getProductImage(item)}
                  alt={item.name}
                  style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                    {item.name}
                  </div>
                  <div style={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: C.card,
                        borderRadius: 8,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <button
                        onClick={() => updateQty(i, item.qty - 1)}
                        style={{
                          background: "none",
                          border: "none",
                          color: C.text,
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(i, item.qty + 1)}
                        style={{
                          background: "none",
                          border: "none",
                          color: C.text,
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: C.textMuted, fontSize: 16 }}>Subtotal</span>
              <span style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={checkout}
              style={{
                width: "100%",
                padding: "16px 0",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                border: "none",
                color: "#0a0a0a",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Checkout
            </button>
            <p style={{ color: C.textMuted, fontSize: 12, textAlign: "center", margin: "12px 0 0" }}>
              Secure checkout powered by Shopify
            </p>
          </div>
        )}
      </div>
    </>
  );
}
