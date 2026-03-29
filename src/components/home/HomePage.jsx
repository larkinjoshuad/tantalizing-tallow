import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, Leaf, Heart, Truck, Shield } from "lucide-react";
import { BRAND, PRODUCTS } from "../../lib/constants";
import ProductCard from "../product/ProductCard";

export default function HomePage() {
  const C = BRAND.colors;
  const featured = PRODUCTS.filter((p) => p.badge);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: 600,
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(135deg, ${C.bg}, #1a1408, ${C.bg})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "10%",
            transform: "translateY(-50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.gold}15, transparent 70%)`,
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            {/* TallowExpert CTA */}
            <div
              onClick={() => {
                const btn = document.querySelector('[aria-label="Open TallowExpert chat"]');
                if (btn) btn.click();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: `linear-gradient(135deg, ${C.gold}18, ${C.goldDark}12)`,
                border: `1px solid ${C.gold}40`,
                borderRadius: 16,
                padding: "14px 22px",
                marginBottom: 24,
                cursor: "pointer",
                transition: "all 0.3s",
                maxWidth: 480,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                }}
              >
                <Sparkles size={22} color="#0a0a0a" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.gold, fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  Meet TallowExpert AI
                </div>
                <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.4 }}>
                  Your personal skincare advisor — get product recommendations tailored to your skin
                </div>
              </div>
              <ChevronRight size={18} color={C.gold} style={{ flexShrink: 0 }} />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `${C.gold}15`,
                padding: "8px 18px",
                borderRadius: 30,
                marginBottom: 24,
                border: `1px solid ${C.gold}30`,
              }}
            >
              <Sparkles size={14} color={C.gold} />
              <span
                style={{
                  color: C.goldLight,
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                Whipped. Wildcrafted. Wonder-filled.
              </span>
            </div>

            <h1
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.1,
                margin: "0 0 20px",
                background: `linear-gradient(135deg, ${C.text}, ${C.gold})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Skincare that goes back to what works.
            </h1>

            <p style={{ color: C.textMuted, fontSize: 18, lineHeight: 1.7, margin: "0 0 36px" }}>
              {BRAND.tagline} Born from kitchen alchemy and skin chemistry, blending
              time-tested tallow with botanical magic.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link
                to="/products"
                style={{
                  padding: "16px 36px",
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  border: "none",
                  color: "#0a0a0a",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Shop Now <ChevronRight size={18} />
              </Link>
              <button
                style={{
                  padding: "16px 36px",
                  background: "transparent",
                  border: `1px solid ${C.gold}60`,
                  color: C.gold,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Ask TallowExpert
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "24px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {[
            { icon: Leaf, text: "100% Natural", sub: "No synthetic preservatives" },
            { icon: Heart, text: "Grass-Fed Tallow", sub: "Triple-filtered purity" },
            { icon: Truck, text: "Free Shipping $75+", sub: "Ships Mon & Tue" },
            { icon: Shield, text: "Whipped by Hand", sub: "Small-batch crafted" },
          ].map(({ icon: Icon, text, sub }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${C.gold}12`,
                  border: `1px solid ${C.gold}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color={C.gold} />
              </div>
              <div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{text}</div>
                <div style={{ color: C.textMuted, fontSize: 12 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 8px", color: C.text }}>
            Customer Favorites
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, margin: 0 }}>
            The products our community can't stop talking about
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            to="/products"
            style={{
              padding: "14px 40px",
              background: "transparent",
              border: `1px solid ${C.gold}`,
              color: C.gold,
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            View All Products <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        style={{
          background: `linear-gradient(180deg, ${C.surface}, ${C.bg})`,
          padding: "80px 32px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <img
            src="/logo.jpg"
            alt="Tantalizing Tallow"
            style={{ height: 80, width: "auto", objectFit: "contain", marginBottom: 24 }}
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
          />
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 20px", color: C.text }}>
            Our Story
          </h2>
          <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.8, margin: "0 0 16px" }}>
            In a world full of synthetic creams and confusing ingredients, Tantalizing Tallow
            began with a simple, luxurious idea: go back to what worked for our grandmothers —
            and make it glow for today.
          </p>
          <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.8, margin: "0 0 16px" }}>
            Born from kitchen alchemy and skin chemistry, our founder blended time-tested
            tallow with botanical magic. A line of skincare so rich, pure, and skin-loving, it
            feels like your face just got hugged by a cloud made of moonlight.
          </p>
          <p
            style={{
              color: C.goldLight,
              fontSize: 18,
              fontStyle: "italic",
              marginTop: 24,
            }}
          >
            We don't just make balm — we make buttery rituals for skin that tells your story.
          </p>
        </div>
      </section>
    </>
  );
}
