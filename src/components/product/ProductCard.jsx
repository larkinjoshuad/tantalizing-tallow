import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND, getProductImage } from "../../lib/constants";
import { useCart } from "../../context/CartContext";

function Badge({ text, variant }) {
  const C = BRAND.colors;
  const styles = {
    default: { background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: "#0a0a0a" },
    premium: { background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "#fff" },
    value: { background: "linear-gradient(135deg, #059669, #34d399)", color: "#fff" },
  };
  const s =
    variant === "Premium" || variant === "Luxe"
      ? styles.premium
      : variant === "Best Value"
      ? styles.value
      : styles.default;

  return (
    <span
      style={{
        ...s,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 2,
      }}
    >
      {text}
    </span>
  );
}

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const C = BRAND.colors;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.2)",
        border: `1px solid ${hovered ? C.gold + "40" : C.border}`,
        position: "relative",
      }}
    >
      {product.badge && <Badge text={product.badge} variant={product.badge} />}

      <Link to={`/product/${product.handle}`} style={{ textDecoration: "none" }}>
        <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden" }}>
          <img
            src={getProductImage(product)}
            alt={product.name}
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            }}
          />
        </div>
        <div style={{ padding: "16px 20px 0" }}>
          <h3
            style={{
              color: C.text,
              fontSize: 16,
              fontWeight: 600,
              margin: "0 0 6px",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h3>
          <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 10px", lineHeight: 1.4 }}>
            {product.shortDesc}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: C.gold, fontSize: 18, fontWeight: 700 }}>
              {product.priceFrom ? "From " : ""}${product.price.toFixed(2)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.rating) ? C.gold : "transparent"}
                  stroke={C.gold}
                  strokeWidth={1.5}
                />
              ))}
              <span style={{ color: C.textMuted, fontSize: 13, marginLeft: 4 }}>
                ({product.reviews})
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div style={{ padding: "14px 20px 20px" }}>
        <button
          onClick={() => addItem(product)}
          style={{
            width: "100%",
            padding: "12px 0",
            background: hovered
              ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
              : "transparent",
            border: `1px solid ${C.gold}`,
            color: hovered ? "#0a0a0a" : C.gold,
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.3s ease",
            letterSpacing: "0.03em",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
