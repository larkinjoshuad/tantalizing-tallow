import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/layout/CartDrawer";
import TallowExpertChat from "./components/chat/TallowExpertChat";
import HomePage from "./components/home/HomePage";
import ProductsPage from "./components/product/ProductsPage";
import ProductDetail from "./components/product/ProductDetail";
import AboutPage from "./components/pages/AboutPage";
import FAQPage from "./components/pages/FAQPage";
import { BRAND } from "./lib/constants";

export default function App() {
  return (
    <BrowserRouter>
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
          <CartDrawer />
          <TallowExpertChat />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

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
