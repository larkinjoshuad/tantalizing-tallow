import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BRAND, PRODUCTS, CATEGORIES } from "../../lib/constants";
import { setMeta, setItemListSchema, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";
import ProductCard from "./ProductCard";

export default function ProductsPage() {
  const C = BRAND.colors;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  useEffect(() => {
    setMeta(PAGE_SEO.products);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
    ]);
    setItemListSchema(PRODUCTS);
  }, []);

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleCat = (id) => {
    setActiveCategory(id);
    if (id === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ cat: id });
    }
  };

  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 8px", color: C.text }}>
        Shop All Products
      </h1>
      <p style={{ color: C.textMuted, fontSize: 16, margin: "0 0 32px" }}>
        Handcrafted tallow skincare — {PRODUCTS.length} products, all natural, all incredible
      </p>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 32,
          overflowX: "auto",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCat(cat.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border:
                activeCategory === cat.id
                  ? "none"
                  : `1px solid ${C.border}`,
              background:
                activeCategory === cat.id
                  ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
                  : "transparent",
              color: activeCategory === cat.id ? "#0a0a0a" : C.textMuted,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: C.textMuted, textAlign: "center", padding: 40 }}>
          No products in this category yet.
        </p>
      )}
    </section>
  );
}
