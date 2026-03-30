// Vercel Serverless Function: Dynamic Open Graph meta tags for social sharing
// This function generates proper meta tags for link previews when shared on
// social media, Slack, Discord, etc. — since SPAs don't have these in the
// initial HTML that social crawlers see.
//
// Usage: Social platforms fetch /api/og-image?path=/product/blue-tansy-whipped-face-cream
// and get proper Open Graph tags for rich link previews.

import { PRODUCTS } from "./_products-data.js";

const SITE_URL = "https://www.tantalizingtallow.com";
const SITE_NAME = "Tantalizing Tallow";
const DEFAULT_IMAGE = "https://tantalizingtallow.com/cdn/shop/files/rn-image_picker_lib_temp_e92dfc5c-6957-496d-bc61-457818162326.png";
const DEFAULT_DESC = "Handcrafted tallow skincare made from grass-fed, triple-filtered beef tallow and wildcrafted botanicals. 100% natural, preservative-free, whipped by hand.";

export default function handler(req, res) {
  const path = req.query.path || "/";
  const meta = getMetaForPath(path);

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");

  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta property="og:type" content="${meta.ogType}" />
  <meta property="og:url" content="${meta.url}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image}" />
  <link rel="canonical" href="${meta.url}" />
  ${meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : ""}
  <meta http-equiv="refresh" content="0;url=${meta.url}" />
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
  ${meta.extraHtml || ""}
</body>
</html>`);
}

function getMetaForPath(path) {
  // Product page
  const productMatch = path.match(/^\/product\/(.+)$/);
  if (productMatch) {
    const handle = productMatch[1];
    const product = PRODUCTS.find((p) => p.handle === handle);
    if (product) {
      return {
        title: `${product.name} — Natural Tallow Skincare | ${SITE_NAME}`,
        description: `${product.shortDesc || product.description.slice(0, 150)}. Made with ${product.ingredients.slice(0, 3).join(", ")}. $${product.price}. Free shipping on $75+.`,
        image: product.image || DEFAULT_IMAGE,
        url: `${SITE_URL}/product/${handle}`,
        ogType: "product",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.image,
          url: `${SITE_URL}/product/${handle}`,
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: product.rating ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews || 1,
          } : undefined,
        },
        extraHtml: `<img src="${product.image}" alt="${product.name}" /><p>Price: $${product.price}</p>`,
      };
    }
  }

  // Products listing
  if (path === "/products") {
    return {
      title: `Shop All Tallow Skincare Products | ${SITE_NAME}`,
      description: "Browse 18+ handcrafted tallow skincare products: face creams, body butters, serums, cleansing balms, hair oils, and more. All natural, grass-fed tallow. Free shipping on $75+.",
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/products`,
      ogType: "website",
    };
  }

  // About
  if (path === "/about") {
    return {
      title: `Our Story — Why Grass-Fed Tallow Skincare | ${SITE_NAME}`,
      description: "Learn why Tantalizing Tallow uses grass-fed, triple-filtered beef tallow paired with wildcrafted botanicals. Small-batch, handcrafted skincare with zero synthetic preservatives.",
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/about`,
      ogType: "website",
    };
  }

  // FAQ
  if (path === "/faq") {
    return {
      title: `Tallow Skincare FAQ — Common Questions Answered | ${SITE_NAME}`,
      description: "Get answers to common questions about tallow skincare: Is tallow comedogenic? Is it safe for sensitive skin? How to store tallow products?",
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/faq`,
      ogType: "website",
    };
  }

  // Homepage (default)
  return {
    title: `${SITE_NAME} — Handcrafted Tallow Skincare | Natural Face Creams & Body Butters`,
    description: DEFAULT_DESC,
    image: DEFAULT_IMAGE,
    url: SITE_URL,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESC,
    },
  };
}
