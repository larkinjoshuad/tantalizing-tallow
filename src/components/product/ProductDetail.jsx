import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Minus, Plus, Truck, Leaf, Shield, Star } from "lucide-react";
import { BRAND, PRODUCTS, getProductImage } from "../../lib/constants";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { handle } = useParams();
  const product = PRODUCTS.find((p) => p.handle === handle);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const C = BRAND.colors;

  if (!product) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ color: C.text }}>Product not found</h2>
        <Link to="/products" style={{ color: C.gold }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <Link
        to="/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: C.gold,
          textDecoration: "none",
          fontSize: 15,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* Image */}
        <div style={{ borderRadius: 20, overflow: "hidden", position: "relative" }}>
          <img
            src={getProductImage(product)}
            alt={product.name}
            style={{ width: "100%", display: "block" }}
          />
        </div>

        {/* Info */}
        <div>
          <h1 style={{ color: C.text, fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.rating) ? C.gold : "transparent"}
                stroke={C.gold}
                strokeWidth={1.5}
              />
            ))}
            <span style={{ color: C.textMuted, fontSize: 14, marginLeft: 6 }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <p style={{ color: C.gold, fontSize: 28, fontWeight: 700, margin: "0 0 20px" }}>
            {product.priceFrom ? "From " : ""}${product.price.toFixed(2)}
          </p>

          <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.7, margin: "0 0 24px" }}>
            {product.description}
          </p>

          {/* Benefits */}
          <div style={{ margin: "0 0 24px" }}>
            <h4
              style={{
                color: C.goldLight,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 12px",
              }}
            >
              Key Benefits
            </h4>
            {product.benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Sparkles size={14} color={C.gold} />
                <span style={{ color: C.text, fontSize: 14 }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{ margin: "0 0 24px" }}>
            <h4
              style={{
                color: C.goldLight,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 12px",
              }}
            >
              Ingredients
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  style={{
                    background: C.accent,
                    color: C.textMuted,
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Qty + Add to Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: C.surface,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{
                  background: "none",
                  border: "none",
                  color: C.text,
                  padding: "12px 16px",
                  cursor: "pointer",
                }}
              >
                <Minus size={16} />
              </button>
              <span style={{ color: C.text, padding: "0 16px", fontSize: 16, fontWeight: 600 }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  background: "none",
                  border: "none",
                  color: C.text,
                  padding: "12px 16px",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              style={{
                flex: 1,
                padding: "14px 32px",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                border: "none",
                color: "#0a0a0a",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Add to Cart — ${(product.price * qty).toFixed(2)}
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: 24,
              paddingTop: 16,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {[
              { icon: Truck, text: "Free shipping $75+" },
              { icon: Leaf, text: "100% Natural" },
              { icon: Shield, text: "Preservative-free" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={16} color={C.goldDark} />
                <span style={{ color: C.textMuted, fontSize: 12 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
