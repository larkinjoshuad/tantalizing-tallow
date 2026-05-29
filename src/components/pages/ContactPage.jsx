import { useEffect } from "react";
import { BRAND } from "../../lib/constants";
import { setMeta, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";
import { Mail, Sparkles, MessageCircle, MapPin, Clock } from "lucide-react";

const CONTACT_EMAIL = "sarahjlarkin21@gmail.com";
const INSTAGRAM_HANDLE = "tantalizingtallow";
const TIKTOK_HANDLE = "tantalizingtallow";

export default function ContactPage() {
  const C = BRAND.colors;

  useEffect(() => {
    setMeta(PAGE_SEO.contact);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Contact" },
    ]);
  }, []);

  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 32px" }}>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          margin: "0 0 8px",
          color: C.text,
          textAlign: "center",
        }}
      >
        Get in Touch
      </h1>
      <p
        style={{
          color: C.textMuted,
          fontSize: 16,
          margin: "0 0 40px",
          textAlign: "center",
        }}
      >
        We read every message personally. Reach out about orders, ingredients,
        wholesale, or just to say hi.
      </p>

      {/* Primary contact card */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
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
          <Mail size={24} color={C.gold} />
        </div>
        <h2
          style={{
            color: C.text,
            fontSize: 18,
            fontWeight: 600,
            margin: "0 0 8px",
          }}
        >
          Email us
        </h2>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{
            color: C.gold,
            fontSize: 17,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 12,
            wordBreak: "break-all",
          }}
        >
          {CONTACT_EMAIL}
        </a>
        <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>
          Sarah personally answers every message. Most replies within 24–48 hours, Mon–Fri.
        </p>
      </div>

      {/* What to email about */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { title: "Orders & shipping", text: "Order status, tracking, address changes, or anything that arrived damaged." },
          { title: "Wholesale & gift sets", text: "Boutique, salon, and gift inquiries for retail partners." },
          { title: "Ingredients & allergies", text: "We're happy to walk through any product's ingredient list with you." },
          { title: "Press & collaboration", text: "Editorial, content collaborations, and brand partnerships." },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3
              style={{
                color: C.goldLight,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: "0 0 8px",
              }}
            >
              {item.title}
            </h3>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Location & hours */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
          marginBottom: 40,
          padding: "24px 0",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <MapPin size={20} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              Where we make it
            </div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>
              Tehachapi, California
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Clock size={20} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              Shipping schedule
            </div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>
              Orders ship Monday & Tuesday. Free shipping over $75.
            </div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div style={{ textAlign: "center" }}>
        <p style={{ color: C.textMuted, fontSize: 14, margin: "0 0 16px" }}>
          Follow along on social for new launches and small-batch drops:
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              color: C.text,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} color={C.gold} />
            Instagram @{INSTAGRAM_HANDLE}
          </a>
          <a
            href={`https://tiktok.com/@${TIKTOK_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              color: C.text,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <MessageCircle size={16} color={C.gold} />
            TikTok @{TIKTOK_HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}
