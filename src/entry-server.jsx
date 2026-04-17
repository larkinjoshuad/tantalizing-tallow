// ─── Server Entry Point for Pre-rendering ───
// Renders the React app to an HTML string using StaticRouter.
// Used at build time by prerender.mjs to generate static HTML for each route.
// Does NOT handle <head> manipulation — that is done by the prerender script
// using data from constants.js and seo.jsx PAGE_SEO config.

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./components/home/HomePage.jsx";
import ProductsPage from "./components/product/ProductsPage.jsx";
import ProductDetail from "./components/product/ProductDetail.jsx";
import AboutPage from "./components/pages/AboutPage.jsx";
import FAQPage from "./components/pages/FAQPage.jsx";
import { Routes, Route } from "react-router-dom";
import { BRAND } from "./lib/constants.js";

// Minimal placeholder for non-live pages
function PlaceholderPage({ title }) {
  const C = BRAND.colors;
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
      <h1 style={{ color: C.text, fontSize: 36, marginBottom: 16 }}>{title}</h1>
      <p style={{ color: C.textMuted, fontSize: 16 }}>
        This page is coming soon. Use the TallowExpert chat for help in the meantime!
      </p>
    </div>
  );
}

/**
 * Render a given URL path to an HTML string.
 * @param {string} url - The route path (e.g., "/products", "/product/blue-tansy-whipped-face-cream")
 * @returns {string} - The rendered HTML string (content inside <div id="root">)
 */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <CartProvider>
        <div
          style={{
            background: BRAND.colors.bg,
            minHeight: "100vh",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: BRAND.colors.text,
          }}
        >
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
              <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
              <Route path="*" element={<PlaceholderPage title="404 — Page Not Found" />} />
            </Routes>
          </main>
          <Footer />
          {/* CartDrawer and TallowExpertChat are interactive-only — skip in SSR */}
        </div>
      </CartProvider>
    </StaticRouter>
  );
}