// ─── SEO & AEO Utility ───
// Centralized meta tag management, structured data (JSON-LD),
// and Answer Engine Optimization for Tantalizing Tallow.
//
// No external dependencies — uses vanilla DOM manipulation
// compatible with React 19 + Vite SPA.

const SITE_URL = "https://www.tantalizingtallow.com";
const SITE_NAME = "Tantalizing Tallow";
const DEFAULT_IMAGE = "https://tantalizingtallow.com/cdn/shop/files/rn-image_picker_lib_temp_e92dfc5c-6957-496d-bc61-457818162326.png";
const DEFAULT_DESCRIPTION = "Handcrafted tallow skincare made from grass-fed, triple-filtered beef tallow and wildcrafted botanicals. Face creams, body butters, serums, and more — 100% natural, preservative-free, whipped by hand.";

// ─── Meta Tag Manager ───
// Sets/updates meta tags in <head> without react-helmet dependency
export function setMeta(tags) {
  // Title
  if (tags.title) {
    document.title = tags.title.includes(SITE_NAME)
      ? tags.title
      : `${tags.title} | ${SITE_NAME}`;
  }

  const metaTags = {
    description: tags.description || DEFAULT_DESCRIPTION,
    // Open Graph
    "og:title": tags.title || SITE_NAME,
    "og:description": tags.description || DEFAULT_DESCRIPTION,
    "og:image": tags.image || DEFAULT_IMAGE,
    "og:url": tags.url || SITE_URL,
    "og:type": tags.ogType || "website",
    "og:site_name": SITE_NAME,
    // Twitter Card
    "twitter:card": "summary_large_image",
    "twitter:title": tags.title || SITE_NAME,
    "twitter:description": tags.description || DEFAULT_DESCRIPTION,
    "twitter:image": tags.image || DEFAULT_IMAGE,
  };

  // Set canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = tags.url || SITE_URL;

  // Set/update meta tags
  Object.entries(metaTags).forEach(([key, value]) => {
    const isOg = key.startsWith("og:") || key.startsWith("twitter:");
    const attr = isOg ? "property" : "name";
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = value;
  });
}

// ─── JSON-LD Structured Data ───
// Injects or updates a JSON-LD script tag by id
export function setJsonLd(id, data) {
  let script = document.getElementById(`jsonld-${id}`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `jsonld-${id}`;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

// Remove a JSON-LD block by id (cleanup on unmount)
export function removeJsonLd(id) {
  const script = document.getElementById(`jsonld-${id}`);
  if (script) script.remove();
}

// ─── Organization Schema (global, set once) ───
export function setOrganizationSchema() {
  setJsonLd("organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpg`,
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2024",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
  });
}

// ─── WebSite Schema with SearchAction (global) ───
export function setWebSiteSchema() {
  setJsonLd("website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

// ─── Product Schema ───
export function setProductSchema(product) {
  const url = `${SITE_URL}/product/${product.handle}`;
  setJsonLd("product", {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    category: getCategoryLabel(product.category),
    material: "Grass-fed beef tallow",
    additionalProperty: product.ingredients
      ? product.ingredients.map((ing) => ({
          "@type": "PropertyValue",
          name: "Ingredient",
          value: ing,
        }))
      : undefined,
  });
}

// ─── BreadcrumbList Schema ───
export function setBreadcrumbSchema(items) {
  setJsonLd("breadcrumb", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  });
}

// ─── FAQ Schema (AEO critical) ───
export function setFAQSchema(faqs) {
  setJsonLd("faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  });
}

// ─── ItemList Schema (for product collection pages) ───
export function setItemListSchema(products) {
  setJsonLd("itemlist", {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tantalizing Tallow Products",
    description: "Complete collection of handcrafted tallow skincare products",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.handle}`,
      name: p.name,
      image: p.image,
    })),
  });
}

// ─── Speakable Schema (AEO for voice assistants) ───
export function setSpeakableSchema(cssSelectors) {
  setJsonLd("speakable", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  });
}

// ─── Helper: category ID to label ───
function getCategoryLabel(cat) {
  const map = {
    face: "Face Cream",
    body: "Body Butter",
    cleanser: "Cleanser",
    serum: "Serum",
    hair: "Hair Care",
    lips: "Lip Care",
    sun: "Sun Care",
    mens: "Men's Skincare",
  };
  return map[cat] || "Skincare";
}

// ─── SEO-Optimized Product Description Generator ───
// Creates unique, keyword-rich descriptions for product pages
export function getProductSeoDescription(product) {
  const skinTypes = product.skinType
    ? product.skinType
        .filter((s) => s !== "all")
        .map((s) => s.replace("-", " "))
        .join(", ")
    : "";
  return `${product.name} by Tantalizing Tallow — ${product.shortDesc || product.description.slice(0, 120)}. Made with ${product.ingredients.slice(0, 3).join(", ")}. Best for ${skinTypes} skin. $${product.price}. Free shipping on orders $75+.`;
}

// ─── SEO-Optimized Product Title Generator ───
export function getProductSeoTitle(product) {
  const category = getCategoryLabel(product.category);
  return `${product.name} — Natural Tallow ${category} | ${SITE_NAME}`;
}

// ─── Constants for page-level SEO ───
export const PAGE_SEO = {
  home: {
    title: `${SITE_NAME} — Handcrafted Tallow Skincare | Natural Face Creams & Body Butters`,
    description:
      "Discover handcrafted tallow skincare made from grass-fed, triple-filtered beef tallow and wildcrafted botanicals. Face creams, body butters, serums, lip balms — 100% natural, preservative-free, whipped by hand in small batches.",
    url: SITE_URL,
  },
  products: {
    title: `Shop All Tallow Skincare Products | ${SITE_NAME}`,
    description:
      "Browse 18+ handcrafted tallow skincare products: face creams, body butters, serums, cleansing balms, hair oils, lip balms, and sun protection. All natural, grass-fed tallow, no preservatives. Free shipping on $75+.",
    url: `${SITE_URL}/products`,
  },
  about: {
    title: `Our Story — Why Grass-Fed Tallow Skincare | ${SITE_NAME}`,
    description:
      "Learn why Tantalizing Tallow uses grass-fed, triple-filtered beef tallow as the base for every product. Small-batch, handcrafted skincare with wildcrafted botanicals, zero synthetic preservatives.",
    url: `${SITE_URL}/about`,
  },
  faq: {
    title: `Tallow Skincare FAQ — Common Questions Answered | ${SITE_NAME}`,
    description:
      "Get answers to common questions about tallow skincare: Is tallow comedogenic? Is it safe for sensitive skin? How to store tallow products? Learn everything about grass-fed tallow moisturizers.",
    url: `${SITE_URL}/faq`,
  },
};
