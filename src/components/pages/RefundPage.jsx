import { useEffect } from "react";
import { BRAND } from "../../lib/constants";
import { setMeta, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";

const CONTACT_EMAIL = "sarahjlarkin21@gmail.com";
const LAST_UPDATED = "May 2026";

export default function RefundPage() {
  const C = BRAND.colors;

  useEffect(() => {
    setMeta(PAGE_SEO.refunds);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Refund & Returns" },
    ]);
  }, []);

  return (
    <article style={legalStyles(C).page}>
      <header style={legalStyles(C).header}>
        <h1 style={legalStyles(C).h1}>Refund & Returns</h1>
        <p style={legalStyles(C).muted}>Last updated: {LAST_UPDATED}</p>
      </header>

      <p style={legalStyles(C).body}>
        We want you to love every jar. If something isn't right, reach out and
        we'll make it right. We're a small family business — there's no
        bureaucracy, no scripts. Just Sarah on the other end.
      </p>

      <Section c={C} title="30-day satisfaction policy">
        <p style={legalStyles(C).body}>
          If you're not satisfied with your purchase, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={legalStyles(C).link}>
            {CONTACT_EMAIL}
          </a>{" "}
          within 30 days of delivery. Include your order number and a quick
          note about what happened. We'll work with you on a refund,
          replacement, or store credit — whatever makes it right.
        </p>
      </Section>

      <Section c={C} title="Damaged or lost orders">
        <p style={legalStyles(C).body}>
          If your order arrives damaged, or never arrives at all, email us
          within 7 days of the expected delivery date with your order number
          and (for damaged items) a photo if possible. We'll replace or
          refund the affected items at no cost to you.
        </p>
      </Section>

      <Section c={C} title="How refunds work">
        <ul style={legalStyles(C).list}>
          <li>Refunds go back to the original payment method.</li>
          <li>Most refunds process within 3–5 business days after we approve them.</li>
          <li>Your bank may take an additional 5–10 business days to post the refund.</li>
          <li>Shipping costs (if any) are refunded for damaged or wrong items.</li>
        </ul>
      </Section>

      <Section c={C} title="Returns">
        <p style={legalStyles(C).body}>
          Because our products are personal-care items, we generally don't
          require you to ship the product back — keep it, donate it, or
          dispose of it. If we do request a return for any reason, we'll
          provide a prepaid label.
        </p>
      </Section>

      <Section c={C} title="Shipping schedule">
        <p style={legalStyles(C).body}>
          We ship Mondays and Tuesdays to minimize transit time (our products
          are preservative-free, so freshness matters). Most US orders arrive
          within 3–7 business days after shipping. Free shipping on orders
          over $75.
        </p>
      </Section>

      <Section c={C} title="Allergies and sensitivities">
        <p style={legalStyles(C).body}>
          Full ingredient lists are on every product page. We strongly
          recommend a patch test before first use, especially if you have
          known allergies or sensitive skin. If you have a reaction, stop
          using the product and email us — we'll work with you on a refund
          and we'd love to know which ingredient caused it so we can help
          others avoid it too.
        </p>
      </Section>

      <Section c={C} title="Wholesale & bulk orders">
        <p style={legalStyles(C).body}>
          Wholesale and large-volume orders are handled separately. Reach out
          at {CONTACT_EMAIL} for terms.
        </p>
      </Section>

      <Section c={C} title="Questions">
        <p style={legalStyles(C).body}>
          Anything not covered here?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={legalStyles(C).link}>
            Email us
          </a>{" "}
          — we'll always work with you.
        </p>
      </Section>
    </article>
  );
}

function Section({ c, title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={legalStyles(c).h2}>{title}</h2>
      {children}
    </section>
  );
}

function legalStyles(C) {
  return {
    page: { maxWidth: 760, margin: "0 auto", padding: "60px 32px 80px" },
    header: { marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` },
    h1: { color: C.text, fontSize: 36, fontWeight: 700, margin: "0 0 8px" },
    h2: { color: C.gold, fontSize: 22, fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.01em" },
    body: { color: C.textMuted, fontSize: 16, lineHeight: 1.8, margin: "0 0 16px" },
    list: { color: C.textMuted, fontSize: 16, lineHeight: 1.9, paddingLeft: 24, margin: "0 0 16px" },
    muted: { color: C.textMuted, fontSize: 14, margin: 0 },
    link: { color: C.gold, textDecoration: "underline", textDecorationColor: `${C.gold}55` },
  };
}
