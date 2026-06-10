import { useEffect } from "react";
import { BRAND } from "../../lib/constants";
import { setMeta, setBreadcrumbSchema, PAGE_SEO } from "../../lib/seo";

const CONTACT_EMAIL = "sarahjlarkin21@gmail.com";
const LAST_UPDATED = "May 2026";

export default function PrivacyPage() {
  const C = BRAND.colors;

  useEffect(() => {
    setMeta(PAGE_SEO.privacy);
    setBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Privacy Policy" },
    ]);
  }, []);

  return (
    <article style={legalStyles(C).page}>
      <header style={legalStyles(C).header}>
        <h1 style={legalStyles(C).h1}>Privacy Policy</h1>
        <p style={legalStyles(C).muted}>Last updated: {LAST_UPDATED}</p>
      </header>

      <p style={legalStyles(C).body}>
        Tantalizing Tallow ("we," "us") is a small-batch skincare brand based
        in Tehachapi, California. This Privacy Policy explains what
        information we collect when you visit tantalizingtallow.com or place
        an order, how we use it, and the choices you have. We aim to collect
        the minimum we need to run the business and ship your products to you.
      </p>

      <Section c={C} title="Information we collect">
        <ul style={legalStyles(C).list}>
          <li>
            <strong>Order information:</strong> name, email, shipping address,
            phone (optional), and the products you ordered. Payment is
            processed by Shopify; we never see your full card number.
          </li>
          <li>
            <strong>Account information</strong> if you create one: email and
            password (hashed by Shopify).
          </li>
          <li>
            <strong>Site usage data:</strong> pages visited, device type,
            referring URL, and approximate location, via Vercel Analytics,
            Vercel Speed Insights, and Google Analytics (if enabled).
          </li>
          <li>
            <strong>Chatbot conversations:</strong> messages you send to our
            TallowExpert AI assistant are processed by Anthropic. We don't
            store chat transcripts on our servers — they exist only for the
            duration of your session and in Anthropic's transient logs.
          </li>
          <li>
            <strong>Email communications</strong> if you message us at{" "}
            {CONTACT_EMAIL} — we keep these in Sarah's inbox for support
            history.
          </li>
        </ul>
      </Section>

      <Section c={C} title="How we use it">
        <ul style={legalStyles(C).list}>
          <li>To process and ship your orders</li>
          <li>To respond to questions and provide customer service</li>
          <li>To detect fraud and prevent abuse</li>
          <li>To improve the site (which pages are popular, which products people are looking at)</li>
          <li>If you opt in: to send you occasional emails about new launches</li>
        </ul>
        <p style={legalStyles(C).body}>
          We do not sell your data. We do not share it with advertisers. We
          do not build a marketing profile on you.
        </p>
      </Section>

      <Section c={C} title="Who we share it with">
        <p style={legalStyles(C).body}>
          We rely on a small number of trusted services to run the business.
          Each one only receives the information they need to do their job:
        </p>
        <ul style={legalStyles(C).list}>
          <li>
            <strong>Shopify</strong> — handles checkout, payment, and order
            management. Their privacy practices apply to the checkout flow.
          </li>
          <li>
            <strong>Vercel</strong> — hosts this website and provides
            analytics on site performance.
          </li>
          <li>
            <strong>Anthropic</strong> — powers the TallowExpert chat. They
            do not train on your messages.
          </li>
          <li>
            <strong>Google Analytics</strong> (if enabled) — provides
            aggregated visitor statistics.
          </li>
          <li>
            <strong>USPS / shipping carriers</strong> — to deliver your
            order.
          </li>
        </ul>
      </Section>

      <Section c={C} title="Cookies">
        <p style={legalStyles(C).body}>
          We use cookies for shopping cart state, authentication, and
          analytics. You can clear or block cookies in your browser settings;
          some features (like the cart) require cookies to work.
        </p>
      </Section>

      <Section c={C} title="Your rights">
        <p style={legalStyles(C).body}>
          You can ask us to show, correct, or delete the information we hold
          about you. Email {CONTACT_EMAIL} and we'll respond within 30 days.
          California residents have additional rights under the CCPA;
          residents of the EU/UK have rights under GDPR. We treat all
          customers the same regardless of location.
        </p>
      </Section>

      <Section c={C} title="Children">
        <p style={legalStyles(C).body}>
          Our products are intended for adults. We do not knowingly collect
          information from children under 13.
        </p>
      </Section>

      <Section c={C} title="Changes to this policy">
        <p style={legalStyles(C).body}>
          We'll update this page if our practices change. The "Last updated"
          date above will reflect the most recent revision.
        </p>
      </Section>

      <Section c={C} title="Contact">
        <p style={legalStyles(C).body}>
          Questions about your data, this policy, or anything else? Email{" "}
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
