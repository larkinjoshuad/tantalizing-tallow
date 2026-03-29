import { Link } from "react-router-dom";
import { BRAND } from "../../lib/constants";

export default function Footer() {
  const C = BRAND.colors;

  return (
    <footer
      style={{
        borderTop: `1px solid ${C.border}`,
        padding: "48px 32px 32px",
        marginTop: 64,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <img
                src="/logo.jpg"
                alt="Tantalizing Tallow"
                style={{ height: 48, width: "auto", objectFit: "contain" }}
                onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
              />
            </div>
            <p
              style={{
                color: C.textMuted,
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 300,
              }}
            >
              Whipped, wildcrafted, and wonder-filled. Skincare with heritage,
              elegance, and a wink of playful indulgence.
            </p>
          </div>
          {[
            {
              title: "Shop",
              links: [
                { label: "Face Creams", to: "/products?cat=face" },
                { label: "Body Butters", to: "/products?cat=body" },
                { label: "Serums", to: "/products?cat=serum" },
                { label: "Hair Care", to: "/products?cat=hair" },
                { label: "Men's Line", to: "/products?cat=mens" },
              ],
            },
            {
              title: "Help",
              links: [
                { label: "FAQ", to: "/faq" },
                { label: "Shipping Info", to: "/faq" },
                { label: "Returns", to: "/faq" },
                { label: "Contact Us", to: "/contact" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "Our Story", to: "/about" },
                { label: "Ingredients", to: "/about" },
                { label: "Blog", to: "/blog" },
                { label: "Wholesale", to: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  color: C.goldLight,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 16px",
                }}
              >
                {col.title}
              </h4>
              {col.links.map((link) => (
                <div key={link.label} style={{ marginBottom: 10 }}>
                  <Link
                    to={link.to}
                    style={{
                      color: C.textMuted,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span style={{ color: C.textMuted, fontSize: 13 }}>
            &copy; 2026 TantalizingTallow. Powered by Shopify.
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
              (link) => (
                <span
                  key={link}
                  style={{
                    color: C.textMuted,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {link}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
