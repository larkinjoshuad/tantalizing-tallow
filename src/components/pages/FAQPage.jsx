import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { BRAND } from "../../lib/constants";
import { setMeta, setFAQSchema, setBreadcrumbSchema, setSpeakableSchema, PAGE_SEO } from "../../lib/seo";

// ─── FAQ Data ───
// Structured for both UI rendering AND JSON-LD FAQPage schema (AEO critical).
// Each Q&A is a direct, concise answer — optimized for AI answer engine extraction.
const FAQS = [
  {
    q: "What is tallow and why is it good for skin?",
    a: "Tallow is rendered fat from grass-fed cattle. It's rich in vitamins A, D, E, and K, plus fatty acids that closely mirror the lipids in human skin. This makes it one of the most biocompatible moisturizers available — it absorbs deeply without clogging pores.",
  },
  {
    q: "Is tallow comedogenic? Will it clog my pores?",
    a: "Grass-fed tallow is actually low on the comedogenic scale. Because its fatty acid profile is so similar to our skin's own sebum, it absorbs efficiently rather than sitting on top of the skin. Many of our customers with acne-prone skin have seen great results.",
  },
  {
    q: "Are your products safe for sensitive skin?",
    a: "Absolutely. We use no synthetic fragrances, preservatives, or fillers. Our Blue Tansy and Lavender & Magnesium lines are specifically formulated for sensitive and reactive skin types.",
  },
  {
    q: "How should I store my tallow products?",
    a: "Store in a cool, dry place away from direct sunlight. Tallow-based products are naturally stable, but extreme heat can soften them. If they soften, just pop them in the fridge for 20 minutes.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes! We offer free shipping on all orders of $75 or more. Orders ship on Mondays and Tuesdays.",
  },
  {
    q: "What's your return policy?",
    a: "We want you to love your products. If you're not satisfied, reach out within 30 days of delivery and we'll work with you to make it right.",
  },
  {
    q: "Are your products cruelty-free?",
    a: "Yes. We never test on animals. Our tallow is ethically sourced as a byproduct of grass-fed, pasture-raised cattle from small farms.",
  },
  {
    q: "How long do the products last?",
    a: "Most of our products have a shelf life of 6-12 months when stored properly. Because we don't use synthetic preservatives, we recommend using them within that window for the best experience.",
  },
  {
    q: "Can I use tallow products on my baby?",
    a: "Many parents love tallow for baby skin because of its gentle, all-natural formula. Our unscented options or the Vanilla Body Butter are popular choices. As always, do a small patch test first.",
  },
  {
    q: "What makes Tantalizing Tallow different from other tallow brands?",
    a: "Every batch is whipped by hand in small quantities. We use only grass-fed, triple-filtered tallow paired with wildcrafted botanicals. No mass production, no shortcuts — just real skincare made with intention.",
  },
  {
    q: "What is the best tallow face cream for dry skin?",
    a: "For dry skin, our Frankincense & Manuka Honey Face Cream ($40) with high-potency Manuka honey 1122+ delivers the most intense hydration. For a budget-friendly option, the Frankincense & Vanilla Face Cream ($22) with Manuka honey 829+ is excellent. Both deeply nourish depleted skin and support a healthy skin barrier.",
  },
  {
    q: "What tallow products help with acne?",
    a: "Our Clarifying Face Cream (also called Clear & Calm) is specifically formulated for acne-prone and oily skin. It contains Manuka honey 829+, black seed oil, tea tree oil, and helichrysum — ingredients known to calm breakouts while hydrating without clogging pores. Layer it over our HydraBloom Hyaluronic Acid Serum for balanced, clear skin.",
  },
  {
    q: "Do you have skincare products for men?",
    a: "Yes! Our Rugged Revival face cream ($20) from the Men's Collection is a rich, masculine face cream with vanilla-infused tallow, Manuka honey 829, and castor oil. It deeply hydrates rough, dry skin and leaves a subtle, cologne-inspired scent. Perfect for men who want effective, natural skincare.",
  },
  {
    q: "What is beef tallow moisturizer?",
    a: "Beef tallow moisturizer is a natural skincare product made from rendered grass-fed beef fat. Tallow's fatty acid profile is remarkably similar to human skin lipids, making it one of the most biocompatible moisturizers in nature. It absorbs deeply, delivers vitamins A, D, E, and K, and supports the skin barrier without synthetic ingredients. Tantalizing Tallow whips ours into a cloud-like consistency with wildcrafted botanicals.",
  },
  {
    q: "Is tallow better than regular moisturizer?",
    a: "Grass-fed tallow offers several advantages over conventional moisturizers: it contains no synthetic preservatives, parabens, or petroleum derivatives. Its fatty acid profile closely mirrors human skin lipids, so it absorbs more efficiently than many commercial creams. Tallow also naturally contains fat-soluble vitamins (A, D, E, K) that support skin repair and barrier function.",
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  const C = BRAND.colors;

  return (
    <div
      style={{
        borderBottom: `1px solid ${C.border}`,
      }}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          itemProp="name"
          style={{ color: C.text, fontSize: 16, fontWeight: 600, paddingRight: 16 }}
        >
          {faq.q}
        </span>
        <ChevronDown
          size={20}
          color={C.gold}
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>
      {/* Always render the answer in DOM for crawlers, visually hide when closed */}
      <div
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
        style={{
          paddingBottom: open ? 20 : 0,
          maxHeight: open ? 500 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, padding-bottom 0.3s ease",
        }}
      >
        <p
          itemProp="text"
          style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.8, margin: 0 }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const C = BRAND.colors;

  useEffect(() => {
    // Page-level SEO
    setMeta(PAGE_SEO.faq);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "FAQ" },
    ]);
    // AEO: FAQPage structured data — the highest-impact AEO schema
    setFAQSchema(FAQS);
    // AEO: Mark FAQ content as speakable for voice assistants
    setSpeakableSchema(["[itemtype='https://schema.org/Answer'] [itemprop='text']"]);
  }, []);

  return (
    <section
      style={{ maxWidth: 800, margin: "0 auto", padding: "60px 32px" }}
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          margin: "0 0 8px",
          color: C.text,
          textAlign: "center",
        }}
      >
        Frequently Asked Questions
      </h1>
      <p
        style={{
          color: C.textMuted,
          fontSize: 16,
          margin: "0 0 40px",
          textAlign: "center",
        }}
      >
        Everything you need to know about tallow skincare
      </p>

      <div style={{ borderTop: `1px solid ${C.border}` }}>
        {FAQS.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 8 }}>
          Still have questions?
        </p>
        <button
          onClick={() => {
            const btn = document.querySelector('[aria-label="Open TallowExpert chat"]');
            if (btn) btn.click();
          }}
          style={{
            padding: "14px 32px",
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            border: "none",
            color: "#0a0a0a",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Ask TallowExpert
        </button>
      </div>
    </section>
  );
}
