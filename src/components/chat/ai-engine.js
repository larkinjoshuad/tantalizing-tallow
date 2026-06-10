/**
 * TallowExpert AI — Intent Classification & Response Engine v3
 *
 * Phase 1: Pattern-matching with word-boundary fixes, product-name
 *          detection, expanded coverage (works offline, instant)
 * Phase 2: Swap in Claude API for dynamic, conversational responses
 *
 * v2 fixes (from 10K simulation):
 *   - Word boundaries on 'men', 'red', 'hi/hey', 'tallow/what is/why'
 *   - Greeting moved to last (no longer swallows prefixed questions)
 *   - Specific product name matching (18/18 coverage)
 *   - New intents: skin conditions, how-to-use, returns, comparisons, business
 *
 * v3 fixes (from deep failure analysis — 11 fixes, ~777 questions recovered):
 *   - Combo-intent handler (FIRST pattern) for "X AND Y" skin concerns
 *   - Returns before shipping (catches "modify/cancel order")
 *   - Comparison broadened: "how do you", "other brand"
 *   - Serum negative lookahead (prevents "before/after serums" false match)
 *   - Dry negative lookahead (prevents "wet or dry" false match)
 *   - Greeting catches common follow-ups ("hi there", "hey!")
 *   - Expanded keywords: acne, dry, sensitive, aging, oily, dull, tallow, popular, sleep, sun, hair
 *   - New intent: complaint/support
 */

const RESPONSES = {
  greeting:
    "Welcome to Tantalizing Tallow! I'm TallowExpert, your personal skincare advisor. I can help you find the perfect tallow-based products for your skin. What's your skin type or main concern?",

  // ── Combo Intent (NEW v3) ──
  comboIntent: {
    text: "For combination concerns, tallow is actually ideal — it's bioidentical to your skin's sebum so it balances rather than overloads. Here's what I'd suggest:\n\n**Start with:** Cleansing Balm + Hyaluronic Acid Serum (universal base)\n**Face:** Blue Tansy (calms everything — acne, sensitivity, redness)\n**Body:** Fragrance of the Month body butter (gentle, all-skin-types)\n**Night:** Magnesium Sleep Balm (helps skin repair overnight)\n\nTallow adapts to what your skin needs — most customers with combo concerns see improvement in 1-2 weeks.",
    products: [3, 10, 1, 17, 11],
  },

  // ── Specific Products ──
  products: {
    blueTansy: {
      text: "**Blue Tansy** is our bestselling face cream — formulated with blue tansy to soothe the look of redness on sensitive and blemish-prone skin. 4.9★ from 47 reviews.",
      products: [1],
    },
    clarifying: {
      text: "The **Clarifying Face Cream** is a lightweight, low-comedogenic formula for blemish-prone and oily skin. Tea tree oil and Manuka honey 829+ support a balanced-looking complexion. 4.8★.",
      products: [2],
    },
    cleansingBalm: {
      text: "Our **Cleansing Balm** melts away makeup and daily grime while preserving your moisture barrier. Perfect for double-cleansing. $12, 4.7★.",
      products: [3],
    },
    vanillaBodyButter: {
      text: "Our body butters range from $6 to $24! **Vanilla Tallow Body Butter** (best value, from $6), **Custom Whipped** ($20, choose your scent), or **Summer Shimmer** ($24, radiant sunkissed glow).",
      products: [4, 5, 8],
    },
    customButter: {
      text: "**Custom Whipped Body Butter** — your tallow, your way! Choose pure unscented, essential oil blends, or fragrance options. Hand-whipped texture, ultra-moisturizing. $20, 4.8★.",
      products: [5],
    },
    frankManuka: {
      text: "**Frankincense & Manuka Honey Face Cream** — high-grade Manuka honey 1122+ paired with frankincense for deeply soothing, nourishing care. $40, 5.0★. Our most premium face cream.",
      products: [6],
    },
    frankVanilla: {
      text: "**Frankincense & Vanilla Face Cream** — frankincense and vanilla-infused tallow create a comforting daily ritual that supports a smoother, softer-looking complexion. $22, 4.8★.",
      products: [7],
    },
    shimmer: {
      text: "**Summer Shimmer Body Butter** — a luxurious whipped body butter with a radiant, sunkissed golden shimmer! Perfect for events, date nights, or everyday radiance. $24, 4.7★.",
      products: [8],
    },
    hairOil: {
      text: "**Hair & Scalp Oil** — castor oil, argan oil, Manuka honey, and rosemary nourish the scalp and condition hair from root to tip. Supports the appearance of thicker, shinier hair. $18, 4.6★.",
      products: [9],
    },
    hyaluronic: {
      text: "**Hyaluronic Acid Serum** — layer under tallow cream for max hydration. Draws moisture in and locks it. Lightweight, all skin types. $12, 4.7★.",
      products: [10],
    },
    sleepBalm: {
      text: "**Lavender & Vanilla Magnesium Sleep Balm** — magnesium chloride paired with calming lavender and warm vanilla creates the ultimate bedtime ritual. From $18, 4.9★, fan favorite!",
      products: [11],
    },
    luxe: {
      text: "The **Luxe Face Cream** is our crown jewel — grass-fed tallow, Manuka honey, bakuchiol, rosehip oil, tamanu oil, and sea buckthorn. $60, 5.0★. Our most premium offering.",
      products: [12],
    },
    lipBalm: {
      text: "**Minted Vanilla Lip Balm** with Manuka honey — 102 reviews, 4.9★! Softens dry lips, buttery smooth, never waxy. From $6.",
      products: [13],
    },
    turmeric: {
      text: "**Orange Blossom & Turmeric Face Cream** supports a brighter-looking complexion and a more even-looking tone with turmeric and orange blossom. $22, 4.8★.",
      products: [14],
    },
    coffeeScrub: {
      text: "**Vanilla Espresso Coffee Sugar Scrub** — espresso grounds and brown sugar gently exfoliate while grass-fed tallow and castor oil leave skin feeling soft. Turns your shower into a warm, spa-like ritual. $12, 4.8★.",
      products: [16],
    },
    fragranceOfMonth: {
      text: "Our **Fragrance of the Month** body butter features a new limited-edition scent each month! Same premium grass-fed tallow base, always a new sensory experience. From $20, 4.9★. Grab it before it rotates!",
      products: [17],
    },
    ruggedRevival: {
      text: "**Rugged Revival — Men's Collection** — a rich, masculine face cream with Manuka honey 829 and vanilla-infused tallow. Deeply conditioning post-shave, with a subtle cologne-inspired scent. $20, 4.7★.",
      products: [18],
    },
  },

  // ── Skin Concerns ──
  skinTypes: {
    acne: {
      text: "For blemish-prone skin, I'd recommend our **Blue Tansy** cream — blue tansy is known for soothing the look of redness on reactive, blemish-prone skin. The **Clarifying Face Cream** is another favorite, formulated for a balanced-looking complexion without a heavy feel.",
      products: [1, 2],
    },
    dry: {
      text: "Dry skin loves tallow because it mirrors the lipids already in your skin. I'd recommend our **Fragrance of the Month** body butter or **Vanilla Tallow Body Butter** for body, and the **Frankincense & Vanilla Face Cream** for your face — rich, nourishing, and supportive of a smoother-looking complexion. For very dry skin, the **Luxe Face Cream** is unmatched.",
      products: [17, 7, 12],
    },
    sensitive: {
      text: "Sensitive skin is exactly what tallow was made for. Our **Blue Tansy** line is specifically designed for reactive skin — it soothes the look of redness on irritated complexions. Start gentle, and your skin will thank you.",
      products: [1],
    },
    aging: {
      text: "For mature skin, our powerhouses are the **Frankincense & Manuka Honey Face Cream** (with high-grade Manuka 1122+ for deep nourishment) and the **Luxe Face Cream** featuring bakuchiol, rosehip, tamanu, and sea buckthorn for a smoother-looking complexion. Pair with the **Hyaluronic Acid Serum** underneath for a plumper look.",
      products: [6, 12, 10],
    },
    oily: {
      text: "Even oily skin needs hydration — often it overproduces oil because it's dehydrated. The **Clarifying Face Cream** supports a balanced-looking complexion without a heavy feel. Layer the **Hyaluronic Acid Serum** underneath for lightweight hydration.",
      products: [2, 10],
    },
    dull: {
      text: "To support a brighter look, the **Orange Blossom & Turmeric Face Cream** is a favorite — turmeric and orange blossom support a more even-looking tone. Follow with the **Coffee Sugar Scrub** weekly on body to exfoliate.",
      products: [14, 16],
    },
  },

  // ── Skin Conditions ──
  skinConditions: {
    text: "We can't give medical advice — please talk to your dermatologist about specific conditions. What I can share: many customers with reactive skin love tallow because it's a gentle, nutrient-dense moisturizer that supports the skin barrier. **Blue Tansy** is our most-loved option for reactive skin, and **Vanilla Body Butter** is our simplest, most minimalist body moisturizer. Always patch-test first!",
    products: [1, 4, 17],
  },

  // ── Routines ──
  routine: {
    text: "I'd love to build you a personalized routine! To get it right, I need a few details:\n\n1. **What's your skin type?** (oily, dry, combo, sensitive, or not sure)\n2. **Top skin concern?** (acne, aging, dryness, hyperpigmentation, redness, or general glow)\n3. **How many steps do you prefer?** (simple 2-3 steps, or full AM/PM routine)\n\nJust answer those and I'll put together something tailored to you!",
    products: [],
  },
  // ── Full Routines by Skin Type ──
  routines: {
    sensitive: {
      text: "Here's your **full sensitive skin routine** — gentle, soothing, no harsh ingredients:\n\n☀️ **AM Routine:**\n1. **Cleansing Balm** ($12) — gentle cleanse without stripping\n2. **Hyaluronic Acid Serum** ($12) — lightweight hydration layer\n3. **Blue Tansy Face Cream** (from $20) — soothes the look of redness on reactive skin\n4. *Add a broad-spectrum sunscreen of your choice (we don't currently offer one)*\n\n🌙 **PM Routine:**\n1. **Cleansing Balm** — thorough cleanse\n2. **Hyaluronic Acid Serum** — overnight hydration boost\n3. **Blue Tansy Face Cream** — nourishment while you sleep\n4. **Magnesium Sleep Balm** (from $18) — apply to wrists/temples for a relaxing wind-down\n\n**Weekly:** Coffee Sugar Scrub ($12) on body only (skip face)\n\nTotal routine: ~$62 (add a few products to qualify for free shipping at $75+)",
      products: [3, 10, 1, 11, 16],
    },
    dry: {
      text: "Here's your **full dry skin routine** — deep hydration and nourishment:\n\n☀️ **AM Routine:**\n1. **Cleansing Balm** ($12) — melts away buildup without stripping moisture\n2. **Hyaluronic Acid Serum** ($12) — draws moisture into skin\n3. **Frankincense & Vanilla Face Cream** ($22) — rich daily nourishment\n4. *Add a broad-spectrum sunscreen of your choice*\n\n🌙 **PM Routine:**\n1. **Cleansing Balm** — gentle double-cleanse\n2. **Hyaluronic Acid Serum** — overnight hydration\n3. **Frankincense & Manuka Honey Face Cream** ($40) — premium nourishment with Manuka 1122+\n4. **Vanilla Tallow Body Butter** (from $6) — full body moisture\n\n**Weekly:** Coffee Sugar Scrub ($12)\n**Lips:** Minted Vanilla Lip Balm (from $6)\n\nTotal routine: ~$110 (free shipping included!)",
      products: [3, 10, 7, 6, 4, 16, 13],
    },
    acne: {
      text: "Here's your **full blemish-prone skin routine** — balanced skin without stripping:\n\n☀️ **AM Routine:**\n1. **Cleansing Balm** ($12) — removes excess oil gently\n2. **Hyaluronic Acid Serum** ($12) — lightweight hydration (low-comedogenic)\n3. **Clarifying Face Cream** ($20) — tea tree + Manuka 829+ for a balanced complexion\n4. *Add a broad-spectrum sunscreen of your choice*\n\n🌙 **PM Routine:**\n1. **Cleansing Balm** — thorough cleanse\n2. **Hyaluronic Acid Serum** — overnight hydration\n3. **Blue Tansy Face Cream** (from $20) — soothes the look of reactive, blemish-prone skin overnight\n\n**Weekly:** Coffee Sugar Scrub ($12) on body, skip face\n\nTotal routine: ~$76 (qualifies for free shipping!)",
      products: [3, 10, 2, 1, 16],
    },
    aging: {
      text: "Here's your **full routine for mature skin** — nourishment and a more radiant look:\n\n☀️ **AM Routine:**\n1. **Cleansing Balm** ($12) — preserves moisture while cleansing\n2. **Hyaluronic Acid Serum** ($12) — supports a plumper look\n3. **Frankincense & Vanilla Face Cream** ($22) — daily nourishment with Manuka 829+\n4. *Add a broad-spectrum sunscreen of your choice — daily SPF is the single biggest support for mature skin*\n\n🌙 **PM Routine:**\n1. **Cleansing Balm** — gentle double-cleanse\n2. **Hyaluronic Acid Serum** — overnight hydration\n3. **Luxe Face Cream** ($60) — bakuchiol, rosehip, tamanu, sea buckthorn for a smoother-looking complexion\n4. **Magnesium Sleep Balm** (from $18) — relaxing wind-down\n\n**Weekly:** Coffee Sugar Scrub ($12)\n**Lips:** Minted Vanilla Lip Balm (from $6)\n\nTotal routine: ~$142 (free shipping!)",
      products: [3, 10, 7, 12, 11, 16, 13],
    },
    oily: {
      text: "Here's your **full oily skin routine** — balanced without stripping:\n\n☀️ **AM Routine:**\n1. **Cleansing Balm** ($12) — oil-cleansing supports balanced-looking skin\n2. **Hyaluronic Acid Serum** ($12) — lightweight hydration your skin craves\n3. **Clarifying Face Cream** ($20) — supports a balanced complexion\n4. *Add a broad-spectrum sunscreen of your choice*\n\n🌙 **PM Routine:**\n1. **Cleansing Balm** — thorough cleanse\n2. **Hyaluronic Acid Serum** — overnight hydration\n3. **Blue Tansy Face Cream** (from $20) — soothes the look of redness on reactive skin\n\n**Weekly:** Coffee Sugar Scrub ($12) on body\n\nTotal routine: ~$76 (qualifies for free shipping!)",
      products: [3, 10, 2, 1, 16],
    },
    general: {
      text: "Here's your **full glow routine** — the complete Tantalizing Tallow experience:\n\n☀️ **AM Routine:**\n1. **Cleansing Balm** ($12) — fresh, clean canvas\n2. **Hyaluronic Acid Serum** ($12) — base hydration layer\n3. **Orange Blossom & Turmeric Face Cream** ($22) — supports a brighter-looking complexion\n4. *Add a broad-spectrum sunscreen of your choice*\n\n🌙 **PM Routine:**\n1. **Cleansing Balm** — double-cleanse\n2. **Hyaluronic Acid Serum** — overnight hydration\n3. **Frankincense & Vanilla Face Cream** ($22) — rich nourishment\n4. **Magnesium Sleep Balm** (from $18) — relaxation ritual\n\n**Body:** Summer Shimmer Body Butter ($24) for events, Vanilla Tallow (from $6) for daily\n**Weekly:** Coffee Sugar Scrub ($12)\n**Lips:** Minted Vanilla Lip Balm (from $6)\n\nTotal routine: ~$134 (free shipping!)",
      products: [3, 10, 14, 7, 11, 8, 4, 16, 13],
    },
  },

  // ── How To Use (NEW) ──
  howToUse: {
    text: "**General usage tips:** Apply a pea-sized amount for face, a quarter-size for body. Use on slightly damp skin for best absorption. Our products have a **6-12 month shelf life** — store in a cool, dry place. Refrigeration extends freshness. If it melts in transit, just re-chill — the formula is perfectly fine! Always patch-test new products on your inner wrist first.",
    products: [],
  },

  // ── Education ──
  tallow: {
    text: "Tallow is rendered beef fat — and it's incredible for skin because its fatty acid profile is nearly identical to human sebum. This means it absorbs deeply, doesn't clog pores, and delivers vitamins A, D, E, and K directly where your skin needs them. Ours is grass-fed, slowly rendered, and triple-filtered for purity.",
    products: [],
  },

  // ── Ingredients & Safety (NEW) ──
  ingredients: {
    text: "All products use **grass-fed tallow, natural essential oils, and clean ingredients** — no parabens, no synthetic fragrances, no preservatives. We're cruelty-free (never tested on animals). For pregnancy or nursing: our unscented **Custom Whipped Body Butter** is the safest bet — always consult your doctor with specific concerns. Full ingredient lists are on each product page!",
    products: [5],
  },

  // ── Shipping ──
  shipping: {
    text: "We ship orders on **Mondays and Tuesdays only** to ensure freshness — our products are preservative-free, so we minimize transit time. **Free shipping on orders of $75 or more!** Store products in a cool, dry place; refrigeration is ideal.",
    products: [],
  },

  // ── Returns & Policies (NEW) ──
  returns: {
    text: "For returns, exchanges, refunds, or order issues, please reach out to us directly at our contact page — we're a small batch business and we'll take care of you personally! We accept all major payment methods. Reach out for wholesale inquiries.",
    products: [],
  },

  // ── Comparisons ──
  comparison: {
    text: "I focus on Tantalizing Tallow products specifically! Here's what makes us special: our tallow is grass-fed and triple-filtered, with a fatty acid profile that mirrors human skin lipids — so it absorbs efficiently and delivers vitamins A, D, E, and K. We formulate with premium ingredients like high-grade Manuka honey 1122+, bakuchiol, and blue tansy. What skin concern can I help match to a product?",
    products: [6, 12],
  },

  // ── Complaints & Support (NEW v3) ──
  complaint: {
    text: "I'm sorry to hear that! We take every concern seriously. Please reach out directly through our contact page — as a small-batch business, we handle every case personally and will make it right. If you had a skin reaction, stop use immediately and let us know the product and your skin type so we can help.",
    products: [],
  },

  // ── Recipe/DIY Guardrail ──
  recipeDiy: {
    text: "We appreciate the curiosity! However, we don't share product recipes or formulations — each one is carefully developed and handcrafted in small batches to ensure quality and safety. Our products use grass-fed tallow that's slowly rendered and triple-filtered with premium actives you won't find in DIY recipes. Can I help you find the right product instead?",
    products: [],
  },

  // ── Competitor/Other Brand Guardrail ──
  otherBrand: {
    text: "I'm here to help with Tantalizing Tallow products specifically! What I can tell you is that our tallow is grass-fed, slowly rendered, and triple-filtered — and we formulate with premium actives like Manuka honey, bakuchiol, and blue tansy that set us apart. What skin concern can I help you with today?",
    products: [],
  },

  // ── Business (NEW) ──
  business: {
    text: "We're a small-batch, handcrafted tallow skincare company. Every product is slowly rendered and triple-filtered by hand. Follow us on social media for pop-up events and new releases! For collaborations, wholesale, affiliate, or press inquiries, please reach out through our contact page.",
    products: [],
  },

  mens: {
    text: "For men's skincare, our **Rugged Revival** face cream uses vanilla-infused tallow, Manuka honey 829, and castor oil for a rich, conditioning daily moisturizer with a subtle cologne-inspired scent. Deeply nourishing post-shave too.",
    products: [18],
  },
  lips: {
    text: "Our **Minted Vanilla Lip Balm** with Manuka honey is a customer favorite — over 100 reviews! It softens dry lips and stays buttery smooth, never waxy.",
    products: [13],
  },
  hair: {
    text: "The **Hair & Scalp Oil** features castor oil, argan oil, Manuka honey, and rosemary in a tallow base. It conditions the scalp and supports the appearance of shinier, fuller-looking hair.",
    products: [9],
  },
  sleep: {
    text: "The **Lavender & Vanilla Magnesium Sleep Balm** is a fan favorite — magnesium chloride paired with lavender and vanilla for a calming wind-down ritual. Apply to feet, wrists, or temples before bed.",
    products: [11],
  },
  sun: {
    text: "We're currently reformulating our daily outdoor balm and it's not available right now. For sun protection, we recommend a broad-spectrum SPF from a trusted source. Once our new formula is ready, we'll announce it on email and social!",
    products: [],
  },
  popular: {
    text: "Our most popular picks: **Minted Vanilla Lip Balm** (102 reviews!), **Vanilla Tallow Body Butter** (best value), **Lavender & Vanilla Magnesium Sleep Balm** (fan favorite), and **Blue Tansy** (bestseller for face). Any of these make great gifts!",
    products: [13, 4, 11, 1],
  },
  budget: {
    text: "Great skincare doesn't have to break the bank! Our **Vanilla Tallow Body Butter** starts at just $6, the **Lip Balm** from $6, and the **Cleansing Balm** and **Coffee Sugar Scrub** are both $12. You can build a solid routine under $40.",
    products: [4, 13, 3, 16],
  },
  default: {
    text: "I can help with product recommendations, skincare routines, ingredient questions, or anything about tallow skincare. Try asking about your skin type, a specific product name, or say 'build me a routine'!",
    products: [],
  },
};

// ── Intent patterns → response key (ORDER MATTERS — more specific first) ──
const INTENT_MAP = [
  // ── GUARDRAILS (highest priority — intercept before anything else) ──
  // Recipe/DIY — block recipe sharing, homemade instructions, formulation requests
  { pattern: /\brecipe\b|homemade|\bdiy\b|make.*(my own|your own|at home|from scratch)|how.*make.*tallow|how.*render|\brender.*my own\b|\brender.*tallow\b|formul(a|ation)|ingredient.*list.*mak(e|ing)|whip.*my own|batch.*my own/, key: "recipeDiy" },
  // Other brands/competitors — redirect without engaging on competitor products
  { pattern: /\bCeraVe\b|\bDrunk Elephant\b|\bVintage Tradition\b|\bFATCO\b|\bAquaphor\b|\bNourishing Biologicals\b|\bBeekman\b|\bPrimally Pure\b|\bBuffalo Gal\b|\bVintage\s+Tradition\b|\bretinol\b|\btretinoin\b|\baccutane\b/i, key: "otherBrand" },

  // Combo intents (catches "X AND Y" before single-concern patterns)
  { pattern: /\b(dry|acne|oily|sensitive|aging|mature)\b.+\b(and|but|plus|also)\b.+\b(dry|dryness|acne|oily|sensitive|aging|wrinkle|breakout|flaky)\b/, key: "comboIntent" },
  { pattern: /combination skin/, key: "comboIntent" },

  // Specific product mentions (highest priority)
  { pattern: /blue tansy/i, key: "products.blueTansy" },
  { pattern: /clarifying/i, key: "products.clarifying" },
  { pattern: /cleansing balm/i, key: "products.cleansingBalm" },
  { pattern: /luxe/i, key: "products.luxe" },
  { pattern: /frankincense.*(manuka|honey)|manuka.*(frank|cream)/i, key: "products.frankManuka" },
  { pattern: /frankincense.*(vanilla|face)/i, key: "products.frankVanilla" },
  { pattern: /turmeric|orange blossom/i, key: "products.turmeric" },
  { pattern: /shimmer|summer shimmer|frosted mint|glitter|sunkissed|sun kissed/i, key: "products.shimmer" },
  { pattern: /custom(?!er)|my own scent|choose.*scent/i, key: "products.customButter" },
  { pattern: /coffee.*(scrub|sugar)|sugar.*(scrub|coffee)|exfoliat/i, key: "products.coffeeScrub" },
  { pattern: /vanilla sugar|sugar creme|fragrance of the month|monthly scent|limited edition/i, key: "products.fragranceOfMonth" },
  { pattern: /rugged|revival/i, key: "products.ruggedRevival" },
  { pattern: /sleep balm|magnesium balm/i, key: "products.sleepBalm" },
  { pattern: /hyaluronic|\bserum\b(?!.*before|\bafter\b)/i, key: "products.hyaluronic" },
  { pattern: /hair oil|scalp oil/i, key: "products.hairOil" },
  { pattern: /\blip balm\b|minted vanilla/i, key: "products.lipBalm" },
  { pattern: /body butter|vanilla.*butter/i, key: "products.vanillaBodyButter" },

  // ── Full Routine Builders (BEFORE single skin concerns — catches "sensitive, full routine") ──
  { pattern: /\bsensitive\b.*\b(routine|regimen|full|AM|PM|step)/i, key: "routines.sensitive" },
  { pattern: /\b(routine|regimen|full|AM|PM|step).*\bsensitive\b/i, key: "routines.sensitive" },
  { pattern: /\b(dry|dryness|dehydrat)\b.*\b(routine|regimen|full|AM|PM|step)/i, key: "routines.dry" },
  { pattern: /\b(routine|regimen|full|AM|PM|step).*\b(dry|dryness)\b/i, key: "routines.dry" },
  { pattern: /\b(acne|breakout|blemish)\b.*\b(routine|regimen|full|AM|PM|step)/i, key: "routines.acne" },
  { pattern: /\b(routine|regimen|full|AM|PM|step).*\b(acne|breakout|blemish)\b/i, key: "routines.acne" },
  { pattern: /\b(routine|regimen|full|AM|PM|step)\b.*\bfor\b.*\b(acne|breakout|blemish)/i, key: "routines.acne" },
  { pattern: /\b(aging|mature|wrinkle|anti.?age|fine line)\b.*\b(routine|regimen|full|AM|PM|step)/i, key: "routines.aging" },
  { pattern: /\b(routine|regimen|full|AM|PM|step).*\b(aging|mature|wrinkle|anti.?age)\b/i, key: "routines.aging" },
  { pattern: /\b(routine|regimen|full|AM|PM|step)\b.*\bfor\b.*\b(aging|wrinkle|anti.?age|fine line)/i, key: "routines.aging" },
  { pattern: /\b(oily|oil control|sebum)\b.*\b(routine|regimen|full|AM|PM|step)/i, key: "routines.oily" },
  { pattern: /\b(routine|regimen|full|AM|PM|step).*\b(oily|oil control)\b/i, key: "routines.oily" },
  { pattern: /\b(glow|bright|radian).*\b(routine|regimen|full|AM|PM|step)/i, key: "routines.general" },
  { pattern: /\b(routine|regimen|full|AM|PM|step).*\b(glow|bright|radian)/i, key: "routines.general" },
  { pattern: /\b(routine|regimen|full|AM|PM|step)\b.*\bfor\b.*\b(glow|bright|radian)/i, key: "routines.general" },

  // Skin concerns (v3 — expanded keywords, negative lookaheads)
  { pattern: /\bacne\b|breakout|pimple|blemish|comedogenic|\bclog/, key: "skinTypes.acne" },
  { pattern: /(?<!wet.{1,5})\bdry\b(?!.*\bwet\b)(?!.*(?:frizz|hair|scalp))|\bflak|tight(?:ness)?|dehydrat|cracked|peeling|dryness(?!.*(?:frizz|hair))|moisturiz/, key: "skinTypes.dry" },
  { pattern: /\bsensitive\b|\breact(?:ive)?\b|\bredness\b|\bred\b(?!uc)|rosacea|irritat|burning/, key: "skinTypes.sensitive" },
  { pattern: /aging|wrinkle|anti.?age|\bmature\b|collagen|fine line|crow.?s feet|laugh line|sagging|younger|\b50\b|\b60\b|\b70\b/, key: "skinTypes.aging" },
  { pattern: /\boily\b|\bshiny\b|oil control|sebum|greasy|t.?zone/, key: "skinTypes.oily" },
  { pattern: /\bdull\b|dark spot|bright|glow|hyperpigment|uneven.*tone|dark circle|dark mark|melasma|radian/, key: "skinTypes.dull" },

  // Skin conditions (NEW)
  { pattern: /eczema|psoriasis|keratosis|dermatitis|\brash\b|stretch mark|\bscar\b|wound|\bburn\b|tattoo aftercare|diaper rash|cradle cap|cellulite|insect bite|hives/, key: "skinConditions" },

  // Sleep+routine combo (before generic routine — exclude "morning and night")
  { pattern: /bedtime.*routine|sleep.*routine|routine.*sleep|routine.*bedtime|(?<!morning.*)night.*routine|before bed.*routine/, key: "sleep" },

  // Routines
  { pattern: /\broutine\b|\bregimen\b|\bmorning\b(?!.*ship)|skincare.*order|layer.*product|what.*use.*daily|what.*(?<!try )first|AM.*PM|beginner/, key: "routine" },

  // How to use (NEW) — negative lookahead prevents "how long for delivery" matching here
  { pattern: /how (much|often)|how long(?!.*(deliver|ship|arriv|order))|\bapply\b|application|refrigerat|shelf life|expir|patch test|(?<!physical )\bstore\b|melt|under makeup|wet or dry|wash.*off|overuse|mix.*product|multiple product|use on.*body/, key: "howToUse" },

  // Complaints & support (NEW v3)
  { pattern: /complaint|bad reaction|didn.?t work|not happy|didn.?t like|had a reaction|texture.*weird|smells? different|\bdamaged\b|wrong product/, key: "complaint" },

  // Comparisons (BEFORE tallow — catches "tallow vs X" before bare "tallow")
  { pattern: /\bvs\b|compar|versus|better than|differ(?:ent|ence)|how do you|other brand/, key: "comparison" },

  // Education (expanded v3)
  { pattern: /\btallow\b|what is tallow|why tallow|grass.?fed|ancestral skin|beef fat|animal fat|rendered fat|fatty acid/, key: "tallow" },

  // Returns & policies (BEFORE shipping — catches "modify/cancel order")
  { pattern: /return|refund|exchange|cancel|money back|payment|promo|discount|wholesale|subscription|afterpay|loyalty|modify.*order/, key: "returns" },

  // Shipping
  { pattern: /\bship|deliver|\border\b(?!.*skin)/, key: "shipping" },

  // Men's (word-boundary fixed)
  { pattern: /\bmen(?:'s)?\b|\bguys?\b|\bshav(?:e|ing)\b|razor|beard|masculine|boyfriend|husband/, key: "mens" },

  // Lips (word-boundary fixed)
  { pattern: /\blip\b|\blips\b|\bchap/, key: "lips" },

  // Hair (v3 — add dandruff)
  { pattern: /\bhair\b|\bscalp\b|frizz|dandruff/, key: "hair" },

  // Sleep (v3 — expanded)
  { pattern: /\bsleep\b|\brelax|\bmagnesium\b|insomnia|bedtime|\bbed\b|wind down|can.?t sleep|restless/, key: "sleep" },

  // Sun (v3 — expanded)
  { pattern: /\bsun\b|\bspf\b|sunscreen|zinc oxide|mineral.*protect|white cast|sunburn/, key: "sun" },

  // Gifts / popular (v3 — expanded)
  { pattern: /\bgift\b|\bbest seller\b|\bbest sellers\b|\bbestseller\b|\bpopular\b|\bfavorite\b|top rated|what.*try first|what do you sell|what products|starter/, key: "popular" },

  // Budget
  { pattern: /cheap|budget|\bvalue\b|affordable|under \$|save money|student/, key: "budget" },

  // Ingredients & safety (NEW)
  { pattern: /ingredient|pregnan|nursing|allergen|allergy|vegan|organic|cruelty.?free|paraben|preservative|fragrance.?free|EWG|non.?toxic|tested.*animal/, key: "ingredients" },

  // Business questions (NEW)
  { pattern: /where.*located|physical store|visit.*workshop|small batch|who makes|your story|how.*start|social media|pop.?up|local pickup|collab|affili|press|hiring/, key: "business" },

  // Greeting (LAST — standalone greetings + common follow-ups like "hi there", "hey!")
  { pattern: /^\s*(hello|hi|hey|hiya|howdy)\s*[!.,]*\s*$/i, key: "greeting" },
  { pattern: /\b(hello|hi|hey)\s*[,!]?\s*(i need|i'm new|first time|love your|there)\b/i, key: "greeting" },
  { pattern: /^(hello|hi|hey|hiya|howdy)[!. ]*$/i, key: "greeting" },
  { pattern: /^hey!\s/i, key: "greeting" },
];

function resolve(key) {
  const parts = key.split(".");
  let obj = RESPONSES;
  for (const p of parts) obj = obj[p];
  if (typeof obj === "string") return { text: obj, products: [] };
  return obj;
}

/**
 * Sync regex engine — returns { text, products, source } instantly.
 * source: "regex" if matched, "fallback" if no pattern hit.
 */
export function getAIResponse(input) {
  const lower = input.toLowerCase();
  for (const { pattern, key } of INTENT_MAP) {
    if (pattern.test(lower)) {
      const res = resolve(key);
      return { ...res, source: "regex" };
    }
  }
  return { ...RESPONSES.default, source: "fallback" };
}

/**
 * Phase 2: Claude API fallback for queries the regex engine can't handle.
 * Called only when getAIResponse returns source === "fallback".
 * Sends the message + recent conversation history to the serverless proxy.
 *
 * @param {string} message - The user's current message
 * @param {Array} history - Recent conversation turns [{role, text}, ...]
 * @returns {Promise<{text: string, products: number[]}>}
 */
const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL || "/api/chat";

export async function getClaudeResponse(message, history = []) {
  try {
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    if (!res.ok) {
      console.warn("Claude API returned", res.status);
      return {
        text: RESPONSES.default.text,
        products: [],
      };
    }

    const data = await res.json();
    return {
      text: data.text || RESPONSES.default.text,
      products: Array.isArray(data.products) ? data.products : [],
    };
  } catch (err) {
    console.warn("Claude API fetch failed:", err);
    return {
      text: RESPONSES.default.text,
      products: [],
    };
  }
}

export const SUGGESTED_QUESTIONS = [
  "What's good for acne?",
  "Build me a routine",
  "Why tallow?",
  "Best sellers?",
];

export const GREETING = RESPONSES.greeting;
