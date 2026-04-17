#!/usr/bin/env node
// Pre-render Script: generates static HTML for every route after vite build.
// Each page gets: SSR React content, route-specific meta/OG/Twitter tags, JSON-LD.
// Output: dist/[route]/index.html — Vercel serves these before the SPA fallback.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { render } = await import("./dist/server/entry-server.js");

const { PRODUCTS } = await import("./src/lib/constants.js")
  .catch(() => {
    console.warn("Could not import constants.js");
    return { PRODUCTS: [] };
  });

const SITE_URL = "https://www.tantalizingtallow.com";
const SITE_NAME = "Tantalizing Tallow";
const DEFAULT_IMAGE = "https://tantalizingtallow.com/cdn/shop/files/rn-image_picker_lib_temp_e92dfc5c-6957-496d-bc61-457818162326.png";
const DEFAULT_DESC = "Handcrafted tallow skincare made from grass-fed, triple-filtered beef tallow and wildcrafted botanicals. Face creams, body butters, serums, and more — 100% natural, preservative-free, whipped by hand.";

const template = readFileSync(resolve(__dirname, "dist/index.html"), "utf-8");

function getCategoryLabel(cat) {
  const map = { face:"Face Cream", body:"Body Butter", cleanser:"Cleanser", serum:"Serum", hair:"Hair Care", lips:"Lip Care", sun:"Sun Care", mens:"Men's Skincare" };
  return map[cat] || "Skincare";
}

function escHtml(str) {
  return String(str || "").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function organizationSchema() {
  return { "@context":"https://schema.org","@type":"Organization",name:SITE_NAME,url:SITE_URL,logo:`${SITE_URL}/logo.jpg`,description:DEFAULT_DESC,foundingDate:"2024",contactPoint:{"@type":"ContactPoint",contactType:"customer service",availableLanguage:"English"} };
}
function webSiteSchema() {
  return { "@context":"https://schema.org","@type":"WebSite",name:SITE_NAME,url:SITE_URL,description:DEFAULT_DESC,potentialAction:{"@type":"SearchAction",target:`${SITE_URL}/products?q={search_term_string}`,"query-input":"required name=search_term_string"} };
}
function productSchema(product) {
  const url = `${SITE_URL}/product/${product.handle}`;
  const schema = { "@context":"https://schema.org","@type":"Product",name:product.name,description:product.description,image:product.image||DEFAULT_IMAGE,url,brand:{"@type":"Brand",name:SITE_NAME},offers:{"@type":"Offer",price:product.price,priceCurrency:"USD",availability:"https://schema.org/InStock",url,seller:{"@type":"Organization",name:SITE_NAME}},category:getCategoryLabel(product.category),material:"Grass-fed beef tallow" };
  if (product.rating) schema.aggregateRating = { "@type":"AggregateRating",ratingValue:product.rating,reviewCount:product.reviews||1,bestRating:5,worstRating:1 };
  if (product.ingredients) schema.additionalProperty = product.ingredients.map(ing=>( {"@type":"PropertyValue",name:"Ingredient",value:ing} ));
  return schema;
}
function breadcrumbSchema(items) {
  return { "@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items.map((item,i)=>( {"@type":"ListItem",position:i+1,name:item.name,item:item.url?`${SITE_URL}${item.url}`:undefined} )) };
}
function itemListSchema() {
  return { "@context":"https://schema.org","@type":"ItemList",name:"Tantalizing Tallow Products",description:"Complete collection of handcrafted tallow skincare products",numberOfItems:PRODUCTS?.length||0,itemListElement:(PRODUCTS||[]).map((p,i)=>( {"@type":"ListItem",position:i+1,url:`${SITE_URL}/product/${p.handle}`,name:p.name,image:p.image} )) };
}

function faqSchema() {
  const FAQS = [
    {q:"What is tallow and why is it good for skin?",a:"Tallow is rendered fat from grass-fed cattle. It's rich in vitamins A, D, E, and K, plus fatty acids that closely mirror the lipids in human skin, making it one of the most biocompatible moisturizers available."},
    {q:"Is tallow comedogenic? Will it clog my pores?",a:"Grass-fed tallow is low on the comedogenic scale. Its fatty acid profile mirrors human sebum so it absorbs efficiently. Many customers with acne-prone skin have seen great results."},
    {q:"Are your products safe for sensitive skin?",a:"Absolutely. We use no synthetic fragrances, preservatives, or fillers. Our Blue Tansy and Lavender & Magnesium lines are formulated for sensitive and reactive skin types."},
    {q:"How should I store my tallow products?",a:"Store in a cool, dry place away from direct sunlight. If products soften from heat, pop them in the fridge for 20 minutes."},
    {q:"Do you offer free shipping?",a:"Yes! We offer free shipping on all orders of $75 or more. Orders ship on Mondays and Tuesdays."},
    {q:"What's your return policy?",a:"If you're not satisfied, reach out within 30 days of delivery and we'll work with you to make it right."},
    {q:"Are your products cruelty-free?",a:"Yes. We never test on animals. Our tallow is ethically sourced as a byproduct of grass-fed, pasture-raised cattle from small farms."},
    {q:"How long do the products last?",a:"Most products have a shelf life of 6-12 months when stored properly. We recommend using within that window for the best experience."},
    {q:"Can I use tallow products on my baby?",a:"Many parents love tallow for baby skin. Our unscented options or the Vanilla Body Butter are popular. Always do a small patch test first."},
    {q:"What makes Tantalizing Tallow different?",a:"Every batch is whipped by hand in small quantities using only grass-fed, triple-filtered tallow paired with wildcrafted botanicals. No mass production, no shortcuts."},
    {q:"What is the best tallow face cream for dry skin?",a:"For dry skin, our Frankincense & Manuka Honey Face Cream ($40) with Manuka honey 1122+ delivers the most intense hydration."},
    {q:"What tallow products help with acne?",a:"Our Clarifying Face Cream is formulated for acne-prone skin with Manuka honey 829+, black seed oil, tea tree oil, and helichrysum."},
    {q:"Do you have skincare products for men?",a:"Yes! Our Rugged Revival face cream ($20) is a rich masculine face cream with vanilla-infused tallow, Manuka honey 829, and castor oil."},
    {q:"What is beef tallow moisturizer?",a:"Beef tallow moisturizer is made from rendered grass-fed beef fat. Its fatty acid profile is remarkably similar to human skin lipids, making it one of the most biocompatible moisturizers in nature."},
    {q:"Is tallow better than regular moisturizer?",a:"Grass-fed tallow contains no synthetic preservatives, parabens, or petroleum derivatives. Its fatty acid profile closely mirrors human skin lipids so it absorbs more efficiently than many commercial creams."},
  ];
  return { "@context":"https://schema.org","@type":"FAQPage",mainEntity:FAQS.map(faq=>( {"@type":"Question",name:faq.q,acceptedAnswer:{"@type":"Answer",text:faq.a}} )) };
}

function generateHead(route) {
  let title, description, url, image, ogType, jsonLdBlocks;

  const staticPages = {
    "/": { title:`${SITE_NAME} — Handcrafted Tallow Skincare | Natural Face Creams & Body Butters`, description:"Discover handcrafted tallow skincare made from grass-fed, triple-filtered beef tallow and wildcrafted botanicals. Face creams, body butters, serums, lip balms — 100% natural, preservative-free, whipped by hand in small batches.", url:SITE_URL, jsonLd:[organizationSchema(),webSiteSchema()] },
    "/products": { title:`Shop All Tallow Skincare Products | ${SITE_NAME}`, description:"Browse 18+ handcrafted tallow skincare products: face creams, body butters, serums, cleansing balms, hair oils, lip balms, and sun protection. All natural, grass-fed tallow, no preservatives. Free shipping on $75+.", url:`${SITE_URL}/products`, jsonLd:[organizationSchema(),webSiteSchema(),itemListSchema()] },
    "/about": { title:`Our Story — Why Grass-Fed Tallow Skincare | ${SITE_NAME}`, description:"Learn why Tantalizing Tallow uses grass-fed, triple-filtered beef tallow as the base for every product. Small-batch, handcrafted skincare with wildcrafted botanicals, zero synthetic preservatives.", url:`${SITE_URL}/about`, jsonLd:[organizationSchema(),webSiteSchema()] },
    "/faq": { title:`Tallow Skincare FAQ — Common Questions Answered | ${SITE_NAME}`, description:"Get answers to common questions about tallow skincare: Is tallow comedogenic? Is it safe for sensitive skin? How to store tallow products? Learn everything about grass-fed tallow moisturizers.", url:`${SITE_URL}/faq`, jsonLd:[organizationSchema(),webSiteSchema(),faqSchema()] },
  };

  if (staticPages[route]) {
    const page = staticPages[route];
    title=page.title; description=page.description; url=page.url; image=DEFAULT_IMAGE; ogType="website"; jsonLdBlocks=page.jsonLd;
  } else if (route.startsWith("/product/")) {
    const handle = route.replace("/product/","");
    const product = PRODUCTS?.find(p=>p.handle===handle);
    if (product) {
      title=`${product.name} — Natural Tallow ${getCategoryLabel(product.category)} | ${SITE_NAME}`;
      const skinTypes = product.skinType ? product.skinType.filter(s=>s!=="all").map(s=>s.replace("-"," ")).join(", ") : "";
      description=`${product.name} by ${SITE_NAME} — ${product.shortDesc||product.description.slice(0,120)}. Made with ${product.ingredients.slice(0,3).join(", ")}. Best for ${skinTypes} skin. $${product.price}. Free shipping on orders $75+.`;
      url=`${SITE_URL}/product/${product.handle}`; image=product.image||DEFAULT_IMAGE; ogType="product";
      jsonLdBlocks=[organizationSchema(),productSchema(product),breadcrumbSchema([{name:"Home",url:"/"},{name:"Products",url:"/products"},{name:product.name}])];
    }
  }

  if (!title) { title=`${SITE_NAME} — Handcrafted Tallow Skincare`; description=DEFAULT_DESC; url=`${SITE_URL}${route}`; image=DEFAULT_IMAGE; ogType="website"; jsonLdBlocks=[organizationSchema()]; }

  const metaHtml = `
    <title>${escHtml(title)}</title>
    <meta name="description" content="${escHtml(description)}" />
    <link rel="canonical" href="${escHtml(url)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${escHtml(url)}" />
    <meta property="og:title" content="${escHtml(title)}" />
    <meta property="og:description" content="${escHtml(description)}" />
    <meta property="og:image" content="${escHtml(image)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escHtml(title)}" />
    <meta name="twitter:description" content="${escHtml(description)}" />
    <meta name="twitter:image" content="${escHtml(image)}" />`;

  const jsonLdHtml = (jsonLdBlocks||[]).map(data=>`<script type="application/ld+json">${JSON.stringify(data)}</script>`).join("\n    ");
  return { metaHtml, jsonLdHtml };
}

function getRoutes() {
  const routes = ["/","/products","/about","/faq"];
  if (PRODUCTS) { for (const p of PRODUCTS) routes.push(`/product/${p.handle}`); }
  return routes;
}

function injectIntoTemplate(templateHtml, route, appHtml) {
  const { metaHtml, jsonLdHtml } = generateHead(route);
  let html = templateHtml;

  // Remove static per-page tags that will be replaced
  html = html.replace(/<title>.*?<\/title>/, "");
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, "");
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, "");

  // Remove static OG / Twitter block using comment anchors in index.html
  html = html.replace(
    /<!-- Open Graph \/ Facebook -->[\s\S]*?<!-- Twitter Card -->/,
    "<!-- Open Graph + Twitter: see injected meta below -->\n    <!-- Twitter Card -->"
  );
  html = html.replace(
    /<!-- Twitter Card -->[\s\S]*?<!-- Preconnect/,
    "<!-- Twitter + OG: injected -->\n\n    <!-- Preconnect"
  );

  // Inject route-specific meta + JSON-LD before </head>
  html = html.replace("</head>", `${metaHtml}\n    ${jsonLdHtml}\n  </head>`);

  // Inject SSR HTML into #root
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  return html;
}

async function main() {
  const routes = getRoutes();
  console.log(`\n🔨 Pre-rendering ${routes.length} routes...\n`);
  let success = 0; let failed = 0;

  for (const route of routes) {
    try {
      const appHtml = render(route);
      const fullHtml = injectIntoTemplate(template, route, appHtml);
      let outPath = route === "/" ? resolve(__dirname, "dist/index.html") : resolve(__dirname, `dist${route}/index.html`);
      const outDir = dirname(outPath);
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
      writeFileSync(outPath, fullHtml);
      success++;
      console.log(`  ✓ ${route}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${route}: ${err.message}`);
    }
  }

  console.log(`\n✅ Pre-rendered: ${success}/${routes.length} routes`);
  if (failed > 0) { console.log(`⚠️  Failed: ${failed} routes`); process.exit(1); }
}

main().catch(err => { console.error("Pre-render failed:", err); process.exit(1); });
