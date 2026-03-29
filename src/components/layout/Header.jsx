import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND } from "../../lib/constants";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { totalQty, setIsOpen, flash } = useCart();
  const location = useLocation();
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
            height: 110,
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
                height: 100,
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
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                padding: 4,
              }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                padding: 4,
              }}
              aria-label="Account"
            >
              <User size={20} />
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
    </>
  );
}
