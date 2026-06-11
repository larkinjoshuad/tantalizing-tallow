import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Truck, ArrowLeft, ExternalLink } from "lucide-react";
import { BRAND, PRODUCTS, getProductImage } from "../../lib/constants";
import { useCart } from "../../context/CartContext";
import { setMeta, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";
import { parseCartPermalinkPath } from "../../lib/cart-url";
import { loadVariantMap, findHandleByVariantNumericId } from "../../lib/shopify";

export default function CartPage() {
  const C = BRAND.colors;
  const { items, addItem, updateQty, removeItem, subtotal, checkout, checkoutLoading } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const freeShip = subtotal >= BRAND.freeShipMin;
  const remaining = Math.max(0, BRAND.freeShipMin - subtotal);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    setMeta(PAGE_SEO.cart || {
      title: "Your Cart | Tantalizing Tallow",
      description: "Review your handcrafted tallow skincare items before checkout.",
      url: "https://www.tantalizingtallow.com/cart",
    });
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Cart" },
    ]);
  }, []);

  // ─── Permalink bounce recovery ───
  // If Shopify's primary-domain redirect bounced a cart permalink back to
  // us (/cart/52395634262380:1), restore those items into the local cart
  // instead of showing an empty page, then clean the URL to /cart.
  // Items already in the cart (by handle) are skipped so the persisted
  // cart doesn't get double-counted.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  const recoveredRef = useRef(false);
  useEffect(() => {
    if (recoveredRef.current) return;
    const entries = parseCartPermalinkPath(location.pathname);
    if (entries.length === 0) return;
    recoveredRef.current = true;
    let cancelled = false;
    (async () => {
      await loadVariantMap();
      if (cancelled) return;
      for (const { variantId, qty } of entries) {
        const match = findHandleByVariantNumericId(variantId);
        if (!match) continue;
        const product = PRODUCTS.find((p) => p.handle === match.handle);
        if (!product) continue;
        const alreadyInCart = itemsRef.current.some((i) => i.handle === product.handle);
        if (!alreadyInCart) addItem(product, qty);
      }
      navigate("/cart", { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, addItem, navigate]);

  if (items.length === 0) {
    return (
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <ShoppingCart size={56} color={C.gold} style={{ opacity: 0.4, marginBottom: 24 }} />
        <h1 style={{ color: C.text, fontSize: 32, fontWeight: 700, margin: "0 0 12px" }}>
          Your cart is empty
        </h1>
        <p style={{ color: C.textMuted, fontSize: 16, margin: "0 0 32px" }}>
          Browse our handcrafted tallow skincare and start your ritual.
        </p>
        <Link
          to="/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 32px",
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color: "#0a0a0a",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Shop All Products
        </Link>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px 80px" }}>
      <Link
        to="/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: C.gold,
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <h1 style={{ color: C.text, fontSize: 36, fontWeight: 700, margin: "0 0 8px" }}>
        Your Cart
      </h1>
      <p style={{ color: C.textMuted, fontSize: 15, margin: "0 0 32px" }}>
        {totalQty} {totalQty === 1 ? "item" : "items"} · review and check out below
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Items */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "88px 1fr auto",
                gap: 16,
                padding: 20,
                borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
                alignItems: "center",
              }}
            >
              <img
                src={getProductImage(item)}
                alt={item.name}
                loading="lazy"
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                  {item.name}
                </div>
                <div style={{ color: C.gold, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                      aria-label="Decrease quantity"
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
                    <span style={{ color: C.text, fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: "center" }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(i, item.qty + 1)}
                      aria-label="Increase quantity"
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
                      fontSize: 13,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>
                ${item.price.toFixed(2)} ea
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 24,
            position: "sticky",
            top: 24,
          }}
        >
          <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: "0 0 20px" }}>
            Order Summary
          </h2>

          {/* Free shipping bar */}
          {subtotal > 0 && !freeShip && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: C.goldLight, fontSize: 13, marginBottom: 8 }}>
                Add ${remaining.toFixed(2)} more for free shipping
              </div>
              <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(subtotal / BRAND.freeShipMin) * 100}%`,
                    background: C.gold,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          )}
          {subtotal > 0 && freeShip && (
            <div
              style={{
                marginBottom: 20,
                padding: "10px 12px",
                background: "#05966920",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 8,
              }}
            >
              <Truck size={14} color="#34d399" />
              <span style={{ color: "#34d399", fontSize: 13, fontWeight: 600 }}>
                Free shipping unlocked!
              </span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: C.textMuted, fontSize: 14 }}>
            <span>Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
            <span style={{ color: C.text, fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: C.textMuted, fontSize: 14 }}>
            <span>Shipping</span>
            <span style={{ color: C.text, fontWeight: 600 }}>{freeShip ? "Free" : "Calculated at checkout"}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 16,
              paddingTop: 16,
              borderTop: `1px solid ${C.border}`,
              marginBottom: 20,
            }}
          >
            <span style={{ color: C.text, fontSize: 16, fontWeight: 600 }}>Total</span>
            <span style={{ color: C.gold, fontSize: 22, fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={checkout}
            disabled={checkoutLoading}
            style={{
              width: "100%",
              padding: "14px 0",
              background: checkoutLoading ? C.textMuted : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              border: "none",
              color: "#0a0a0a",
              borderRadius: 12,
              cursor: checkoutLoading ? "wait" : "pointer",
              fontWeight: 700,
              fontSize: 16,
              opacity: checkoutLoading ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {checkoutLoading ? "Preparing checkout…" : (
              <>
                Continue to Checkout <ExternalLink size={16} />
              </>
            )}
          </button>

          <p style={{ color: C.textMuted, fontSize: 12, textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
            Checkout is hosted by Shopify on their secure payment domain.
            You'll see <span style={{ color: C.goldLight }}>tantalizingtallow.myshopify.com</span> in
            your address bar during payment — that's normal.
          </p>
        </aside>
      </div>
    </section>
  );
}
