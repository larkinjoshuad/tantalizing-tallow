import { BRAND } from "../../lib/constants";
import { Heart, Leaf, Sparkles, Shield } from "lucide-react";

export default function AboutPage() {
  const C = BRAND.colors;

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.bg}, #1a1408, ${C.bg})`,
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <img
            src="/logo.jpg"
            alt="Tantalizing Tallow"
            style={{ height: 120, width: "auto", objectFit: "contain", marginBottom: 32 }}
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
          />
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              margin: "0 0 20px",
              background: `linear-gradient(135deg, ${C.text}, ${C.gold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Story
          </h1>
          <p style={{ color: C.textMuted, fontSize: 18, lineHeight: 1.8, margin: 0 }}>
            Born from kitchen alchemy and skin chemistry, Tantalizing Tallow blends
            time-tested tallow with botanical magic.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 32px" }}>
        <h2 style={{ color: C.gold, fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
          Back to What Works
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.9, marginBottom: 20 }}>
          In a world full of synthetic creams and confusing ingredients, Tantalizing Tallow
          began with a simple, luxurious idea: go back to what worked for our grandmothers —
          and make it glow for today.
        </p>
        <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.9, marginBottom: 20 }}>
          Every product starts with grass-fed, triple-filtered beef tallow — the most
          biocompatible moisturizer nature ever made. Our skin recognizes it because it mirrors
          the fats already in our cell membranes. We pair it with wildcrafted botanicals,
          essential oils, and zero synthetic preservatives.
        </p>
        <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.9, marginBottom: 0 }}>
          Each batch is whipped by hand in small quantities. No factory lines, no
          mass production — just real skincare made with intention and care.
        </p>
      </section>

      {/* Values */}
      <section
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "64px 32px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2
            style={{
              color: C.text,
              fontSize: 28,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            What We Stand For
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
            }}
          >
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                text: "No synthetic preservatives, parabens, or fillers. Every ingredient serves your skin.",
              },
              {
                icon: Heart,
                title: "Grass-Fed Tallow",
                text: "Sourced from pasture-raised cattle. Triple-filtered for purity and whipped to perfection.",
              },
              {
                icon: Sparkles,
                title: "Small Batch",
                text: "Every jar is handcrafted in small batches to ensure quality and freshness in every scoop.",
              },
              {
                icon: Shield,
                title: "Skin-First Science",
                text: "Tallow mirrors human skin lipids. It absorbs deeply without clogging pores or leaving residue.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 28,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: `${C.gold}15`,
                    border: `1px solid ${C.gold}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Icon size={24} color={C.gold} />
                </div>
                <h3 style={{ color: C.text, fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 32px", textAlign: "center" }}>
        <p
          style={{
            color: C.goldLight,
            fontSize: 20,
            fontStyle: "italic",
            lineHeight: 1.8,
          }}
        >
          We don't just make balm — we make buttery rituals for skin that tells your story.
        </p>
      </section>
    </>
  );
}
