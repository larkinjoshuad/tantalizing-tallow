import { Search, ShoppingCart, Menu, X, MessageCircle, Sparkles, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BRAND } from "../../lib/constants";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { totalQty, setIsOpen, flash } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const C = BRAND.colors;

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "About", to: "/about" },
    { label: "FAQ", to: "/faq" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div
        style={{
          background: `linear-gradient(90deg, ${C.gold}20, ${C.goldLight}15, ${C.gold}20)`,
          padding: "10px 16px",
          textAlign: "center",
          fontSize: 14,
          color: C.goldLight,
          borderBottom: `1px solid ${C.gold}20`,
        }}
      >
        Free shipping on orders of $75 or more
      </div>

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: `${C.bg}ee`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 150,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src="/logo.jpg"
              alt="Tantalizing Tallow"
              style={{
                height: 140,
                width: "auto",
                objectFit: "contain",
              }}
              onError={(e) => {
                // Fallback to SVG if PNG not yet uploaded
                e.target.onerror = null;
                e.target.src = "/logo.svg";
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  color: C.textMuted,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "0.03em",
                  padding: "4px 0",
                  borderBottom:
                    location.pathname === item.to
                      ? `2px solid ${C.gold}`
                      : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <button
              onClick={() => navigate("/products")}
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                padding: 4,
              }}
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                position: "relative",
                padding: 4,
                transform: flash ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.3s",
              }}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    background: C.gold,
                    borderRadius: "50%",
                    color: "#0a0a0a",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalQty}
                </span>
              )}
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                padding: 4,
                display: "none",
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div
            className="mobile-menu-panel"
            style={{
              padding: "16px 0",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 32px",
                  color: C.text,
                  textDecoration: "none",
                  fontSize: 16,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* TallowExpert helper bar — frames as a Q&A widget, not an ad */}
      <section
        aria-label="Ask the TallowExpert assistant"
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Icon + prompt */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `${C.gold}1f`,
                border: `1px solid ${C.gold}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HelpCircle size={16} color={C.gold} />
            </div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>
              Have a skin question?{" "}
              <span style={{ color: C.textMuted, fontWeight: 500 }}>
                Try asking:
              </span>
            </div>
          </div>

          {/* Example question chips — clicking opens the chat */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "What's good for dry skin?",
              "Build me a routine",
              "Tell me about Manuka honey",
            ].map((q) => (
              <button
                key={q}
                onClick={(e) => {
                  e.stopPropagation();
                  const btn = document.querySelector('[aria-label="Open TallowExpert chat"]');
                  if (btn) {
                    btn.click();
                    // Pre-fill the chat input via a custom event the chat
                    // panel listens for. If not yet wired, the chat still
                    // opens — user types or picks a suggestion.
                    window.dispatchEvent(
                      new CustomEvent("tallow:ask", { detail: { question: q } })
                    );
                  }
                }}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  padding: "8px 14px",
                  borderRadius: 18,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${C.gold}aa`;
                  e.currentTarget.style.background = `${C.gold}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.card;
                }}
              >
                {q}
              </button>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const btn = document.querySelector('[aria-label="Open TallowExpert chat"]');
                if (btn) btn.click();
              }}
              style={{
                background: "transparent",
                border: "none",
                color: C.goldLight,
                padding: "8px 6px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Ask something else <MessageCircle size={13} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
