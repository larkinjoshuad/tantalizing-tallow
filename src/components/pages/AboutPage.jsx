import { useEffect } from "react";
import { BRAND } from "../../lib/constants";
import { setMeta, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";
import { Heart, Leaf, Sparkles, Shield, MapPin, Calendar } from "lucide-react";

export default function AboutPage() {
  const C = BRAND.colors;

  useEffect(() => {
    setMeta(PAGE_SEO.about);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Our Story" },
    ]);
  }, []);

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
            Luxurious skincare rooted in ancestral wisdom — handcrafted in small
            batches by a family-run kitchen in the high desert of California.
          </p>
        </div>
      </section>

      {/* Founder block */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "64px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
          }}
        >
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "32px 40px",
            }}
          >
            <h2
              style={{
                color: C.gold,
                fontSize: 24,
                fontWeight: 700,
                margin: "0 0 12px",
                letterSpacing: "0.02em",
              }}
            >
              Meet Sarah
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                color: C.textMuted,
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color={C.goldDark} />
                Tehachapi, California
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} color={C.goldDark} />
                Founded September 2024
              </span>
            </div>
            <p style={{ color: C.text, fontSize: 17, lineHeight: 1.9, margin: "0 0 16px" }}>
              Tantalizing Tallow began on a chilly Sunday morning at the stove.
              I was rendering grass-fed beef tallow for cooking — part of a
              quiet commitment to ancestral food in our home — when I looked at
              the pure golden fat pooling in the pot and wondered out loud:{" "}
              <em>what if this could nourish more than our meals?</em>
            </p>
            <p style={{ color: C.text, fontSize: 17, lineHeight: 1.9, margin: "0 0 16px" }}>
              I whipped a small batch by hand. Then I tried it with vanilla,
              then jasmine, then turmeric, then a pinch of sweet orange. My
              kitchen turned into a botanical apothecary. I gave little jars to
              friends. I posted one photo on social media.
            </p>
            <p style={{ color: C.text, fontSize: 17, lineHeight: 1.9, margin: 0 }}>
              By nightfall, I had twenty orders. Tantalizing Tallow has been
              hand-whipped, hand-labeled, and hand-shipped from our family
              kitchen ever since.
            </p>
          </div>
        </div>
      </section>

      {/* How we make it */}
      <section
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "64px 32px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              color: C.text,
              fontSize: 28,
              fontWeight: 700,
              textAlign: "center",
              margin: "0 0 32px",
            }}
          >
            How Every Jar Is Made
          </h2>
          <div style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.9 }}>
            <p style={{ margin: "0 0 16px" }}>
              We start with grass-fed beef tallow from pasture-raised cattle.
              It's slowly rendered, strained, and triple-filtered until it's a
              pure, soft gold.
            </p>
            <p style={{ margin: "0 0 16px" }}>
              Then it's whipped by hand to a cloud-like consistency and blended
              with wildcrafted botanicals, infused oils, essential oils, and
              the occasional Manuka honey or bakuchiol. No synthetic
              preservatives. No parabens. No fillers.
            </p>
            <p style={{ margin: 0 }}>
              Every product is made in small batches. Our husband shows up at
              the farmers market with a grin and a box of Luxe jars. Our older
              kids help label after homework. Every first-time order gets a
              handwritten thank-you note.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "64px 32px" }}>
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
                title: "Skin-First Care",
                text: "Tallow mirrors the lipids already in your skin. It absorbs efficiently and feels at home on the skin.",
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
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "32px 32px 80px", textAlign: "center" }}>
        <p
          style={{
            color: C.goldLight,
            fontSize: 20,
            fontStyle: "italic",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          We don't just make balm — we make buttery rituals for skin that tells your story.
        </p>
        <p style={{ color: C.textMuted, fontSize: 15, marginTop: 24 }}>
          Questions, wholesale inquiries, or just want to say hi?{" "}
          <a
            href="/contact"
            style={{ color: C.gold, textDecoration: "none", fontWeight: 600 }}
          >
            Get in touch →
          </a>
        </p>
      </section>
    </>
  );
}
