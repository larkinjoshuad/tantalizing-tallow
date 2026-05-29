import { useEffect } from "react";
import { BRAND } from "../../lib/constants";
import { setMeta, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";

const CONTACT_EMAIL = "sarahjlarkin21@gmail.com";
const LAST_UPDATED = "May 2026";

export default function TermsPage() {
  const C = BRAND.colors;

  useEffect(() => {
    setMeta(PAGE_SEO.terms);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Terms of Service" },
    ]);
  }, []);

  return (
    <article style={legalStyles(C).page}>
      <header style={legalStyles(C).header}>
        <h1 style={legalStyles(C).h1}>Terms of Service</h1>
        <p style={legalStyles(C).muted}>Last updated: {LAST_UPDATED}</p>
      </header>

      <p style={legalStyles(C).body}>
        These terms apply to your use of tantalizingtallow.com and to any
        order you place with us. By using the site or buying a product, you
        agree to them. If you don't, please don't use the site.
      </p>

      <Section c={C} title="About our products">
        <p style={legalStyles(C).body}>
          Tantalizing Tallow products are <strong>cosmetics</strong>, not
          drugs. They are intended to cleanse, soften, beautify, and improve
          the appearance of skin. They are not intended to diagnose, treat,
          cure, or prevent any disease or medical condition. If you have a
          skin condition, please consult a healthcare professional.
        </p>
        <p style={legalStyles(C).body}>
          We make every product by hand in small batches in our home
          kitchen. Color, scent, and texture can vary slightly between
          batches. Please review the ingredients on each product page before
          buying, especially if you have known allergies. Patch-test before
          first use.
        </p>
      </Section>

      <Section c={C} title="Orders, pricing, and acceptance">
        <ul style={legalStyles(C).list}>
          <li>
            Prices and product descriptions are shown in USD. We try to keep
            them accurate but reserve the right to correct errors.
          </li>
          <li>
            Your order is an offer to buy. We accept the order when we ship
            it. We may decline or cancel an order at our discretion (for
            example, if a product is out of stock or if there's a pricing
            error).
          </li>
          <li>
            Orders ship on Mondays and Tuesdays. Free shipping on orders
            over $75.
          </li>
        </ul>
      </Section>

      <Section c={C} title="Account responsibilities">
        <p style={legalStyles(C).body}>
          If you create an account, you're responsible for keeping your
          login secure and for activity on your account. Let us know
          promptly if you suspect unauthorized access.
        </p>
      </Section>

      <Section c={C} title="Intellectual property">
        <p style={legalStyles(C).body}>
          The site, the Tantalizing Tallow brand, our product photography,
          logos, and product names are owned by us. You may share product
          photos and links with attribution. Please don't use our images for
          commercial purposes or copy our formulations.
        </p>
      </Section>

      <Section c={C} title="TallowExpert chat">
        <p style={legalStyles(C).body}>
          Our TallowExpert AI assistant offers general product information
          and routine suggestions. It is not a medical professional and its
          recommendations are not medical advice. If you have a skin
          condition, allergy, or sensitivity, please consult a healthcare
          professional.
        </p>
      </Section>

      <Section c={C} title="Disclaimer of warranties">
        <p style={legalStyles(C).body}>
          We do our best to make excellent products and accurate
          descriptions, but we provide the site and products "as is" and to
          the fullest extent allowed by law disclaim all warranties not
          expressly stated.
        </p>
      </Section>

      <Section c={C} title="Limitation of liability">
        <p style={legalStyles(C).body}>
          To the fullest extent allowed by law, our total liability for any
          claim related to a product or the site is limited to the amount
          you paid for the product in question. We're not liable for
          indirect or consequential damages.
        </p>
      </Section>

      <Section c={C} title="Governing law">
        <p style={legalStyles(C).body}>
          These terms are governed by the laws of the State of California.
          Disputes are subject to the exclusive jurisdiction of the courts
          located in Kern County, California.
        </p>
      </Section>

      <Section c={C} title="Changes">
        <p style={legalStyles(C).body}>
          We may update these terms from time to time. The "Last updated"
          date above will reflect the most recent revision.
        </p>
      </Section>

      <Section c={C} title="Contact">
        <p style={legalStyles(C).body}>
          Questions about these terms? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={legalStyles(C).link}>
            {CONTACT_EMAIL}
          </a>
          .
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
