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
    text: "For combination concerns, tallow is actually ideal — it's bioidentical to your skin's sebum so it balances rather than overloads. Here's what I'd suggest:\n\n**Start with:** Cleansing Balm + Hyaluronic Acid Serum (universal base)\n**Face:** Blue Tansy (calms everything — acne, sensitivity, redness)\n**Body:** Vanilla Sugar Creme (gentle, all-skin-types)\n**Night:** Magnesium Sleep Balm (helps skin repair overnight)\n\nTallow adapts to what your skin needs — most customers with combo concerns see improvement in 1-2 weeks.",
    products: [3, 10, 1, 17, 11],
  },

  // ── Specific Products ──
  products: {
    blueTansy: {
      text: "**Blue Tansy** is our bestselling face cream — azulene from blue tansy calms breakouts, redness, and inflammation. Great for sensitive and acne-prone skin. 4.9★ from 47 reviews.",
      products: [1],
    },
    clarifying: {
      text: "The **Clarifying Face Cream** is a lightweight, non-comedogenic formula for acne-prone and oily skin. Tea tree and niacinamide balance sebum without clogging pores. 4.8★.",
      products: [2],
    },
    cleansingBalm: {
      text: "Our **Cleansing Balm** melts away makeup and daily grime while preserving your moisture barrier. Perfect for double-cleansing. $12, 4.7★.",
      products: [3],
    },
    vanillaBodyButter: {
      text: "Our body butters range from $6 to $20! **Vanilla Tallow Body Butter** (best value, from $6), **Custom Whipped** ($20, choose your scent), or **Frosted Mint Shimmer** ($16, subtle glow).",
      products: [4, 5, 8],
    },
    customButter: {
      text: "**Custom Whipped Body Butter** — your tallow, your way! Choose pure unscented, essential oil blends, or fragrance options. Hand-whipped texture, ultra-moisturizing. $20, 4.8★.",
      products: [5],
    },
    frankManuka: {
      text: "**Frankincense & Manuka Honey Face Cream** — 1122+ MGO Manuka honey for unmatched antibacterial healing, frankincense for cellular renewal. $40, 5.0★. Our most luxurious face cream.",
      products: [6],
    },
    frankVanilla: {
      text: "**Frankincense & Vanilla Face Cream** — frankincense stimulates collagen while vanilla soothes. A daily ritual for graceful aging. $22, 4.8★.",
      products: [7],
    },
    shimmer: {
      text: "**Frosted Mint Shimmer Body Butter** — cooling mint meets subtle shimmer for skin that glows! A fun, playful option for nights out or everyday radiance. $16, 4.7★.",
      products: [8],
    },
    hairOil: {
      text: "**Hair & Scalp Oil** — rosemary, castor oil, argan, and biotin nourish from root to tip. Promotes growth, reduces frizz, adds shine. $18, 4.6★.",
      products: [9],
    },
    hyaluronic: {
      text: "**Hyaluronic Acid Serum** — layer under tallow cream for max hydration. Draws moisture in and locks it. Lightweight, all skin types. $12, 4.7★.",
      products: [10],
    },
    sleepBalm: {
      text: "**Lavender & Vanilla Magnesium Sleep Balm** — magnesium absorbs through skin to relax muscles. Lavender + vanilla create the ultimate bedtime ritual. From $18, 4.9★, fan favorite!",
      products: [11],
    },
    luxe: {
      text: "The **Luxe Face Cream** is our crown jewel — triple-filtered tallow, bakuchiol, squalane, frankincense, rose otto, and 24K gold flakes. $60, 5.0★. Our most premium offering.",
      products: [12],
    },
    lipBalm: {
      text: "**Minted Vanilla Lip Balm** with Manuka honey — 102 reviews, 4.9★! Heals cracked lips, buttery smooth, never waxy. From $6.",
      products: [13],
    },
    turmeric: {
      text: "**Orange Blossom & Turmeric Face Cream** brightens your complexion and fades dark spots. Vitamin C + turmeric extract even out skin tone. $20, 4.8★.",
      products: [14],
    },
    sunVeil: {
      text: "**Sun Veil** — mineral-based sun protection in a tallow base. Non-nano zinc oxide, no white cast, no chemical filters. $15, 4.6★.",
      products: [15],
    },
    coffeeScrub: {
      text: "**Vanilla Espresso Coffee Sugar Scrub** — coffee grounds exfoliate while caffeine boosts circulation. Turns your shower into a spa. $12, 4.8★.",
      products: [16],
    },
    vanillaSugarCreme: {
      text: "**Vanilla Sugar Creme** — dessert for your skin! Smells like vanilla cupcakes, leaves skin impossibly soft. Rich hydration with a mood-boosting scent. $20, 4.9★.",
      products: [17],
    },
    ruggedRevival: {
      text: "**Rugged Revival — Men's Collection** — cedarwood, sandalwood, and black pepper. Post-shave healing, deep moisture, no-nonsense. From $10, 4.7★.",
      products: [18],
    },
  },

  // ── Skin Concerns ──
  skinTypes: {
    acne: {
      text: "For acne-prone skin, I'd recommend our **Blue Tansy** cream — blue tansy's azulene is a natural anti-inflammatory that calms breakouts without harsh chemicals. The **Clarifying Face Cream** is another excellent choice, formulated to balance sebum without clogging pores.",
      products: [1, 2],
    },
    dry: {
      text: "Dry skin loves tallow because it's the closest thing to our skin's natural sebum. I'd recommend our **Vanilla Sugar Creme** for body and the **Frankincense & Vanilla Face Cream** for your face — frankincense stimulates collagen while deeply nourishing. For extreme dryness, the **Luxe Face Cream** is unmatched.",
      products: [17, 7, 12],
    },
    sensitive: {
      text: "Sensitive skin is exactly what tallow was made for. Our **Blue Tansy** line is specifically designed for reactive skin — it calms redness and inflammation. Start gentle, and your skin will thank you.",
      products: [1],
    },
    aging: {
      text: "For anti-aging, you want our powerhouses: **Frankincense & Manuka Honey Face Cream** (the 1122+ MGO Manuka is incredible for cellular renewal) or our **Luxe Face Cream** with bakuchiol, squalane, and 24K gold. Pair with the **Hyaluronic Acid Serum** underneath for maximum plumping.",
      products: [6, 12, 10],
    },
    oily: {
      text: "Even oily skin needs moisture — it's often overproducing oil because it's actually dehydrated. The **Clarifying Face Cream** balances sebum production naturally. Layer the **Hyaluronic Acid Serum** underneath for lightweight hydration.",
      products: [2, 10],
    },
    dull: {
      text: "To brighten dull skin, the **Orange Blossom & Turmeric Face Cream** is your answer — turmeric fades dark spots while orange blossom revitalizes. Follow with the **Coffee Sugar Scrub** weekly to exfoliate and boost circulation.",
      products: [14, 16],
    },
  },

  // ── Skin Conditions (NEW) ──
  skinConditions: {
    text: "While we're not doctors, many customers with **eczema, psoriasis, and scarring** report great results with tallow — its biocompatible fatty acids support the skin barrier. Try **Blue Tansy** for inflammation or **Vanilla Body Butter** for gentle, full-body moisture. Always patch-test first!",
    products: [1, 4, 17],
  },

  // ── Routines ──
  routine: {
    text: "Here's a simple tallow skincare routine:\n\n**Morning:** Cleansing Balm → Hyaluronic Acid Serum → Face Cream of choice → Sun Veil\n\n**Evening:** Cleansing Balm → Hyaluronic Acid Serum → Face Cream → Magnesium Sleep Balm on wrists\n\nWant me to customize this for your specific skin concerns?",
    products: [3, 10, 15, 11],
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
    text: "I focus on Tantalizing Tallow products specifically! Here's what makes us special: our tallow is grass-fed and triple-filtered, with a fatty acid profile nearly identical to human sebum — so it absorbs deeply and delivers vitamins A, D, E, K directly. We formulate with premium actives like 1122+ MGO Manuka honey, bakuchiol, and blue tansy. What skin concern can I help match to a product?",
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
    text: "For men's skincare, our **Rugged Revival** collection is built with cedarwood, sandalwood, and black pepper — effective without any floral notes. Great post-shave healing too.",
    products: [18],
  },
  lips: {
    text: "Our **Minted Vanilla Lip Balm** with Manuka honey is a customer favorite — over 100 reviews! It heals cracked lips and stays buttery smooth, never waxy.",
    products: [13],
  },
  hair: {
    text: "The **Hair & Scalp Oil** promotes growth with rosemary and castor oil in a tallow base. It strengthens follicles, reduces frizz, and adds shine.",
    products: [9],
  },
  sleep: {
    text: "The **Lavender & Vanilla Magnesium Sleep Balm** is incredible — magnesium absorbs through skin to relax muscles while lavender calms the mind. Apply to feet, wrists, or temples before bed.",
    products: [11],
  },
  sun: {
    text: "Our **Sun Veil** uses non-nano zinc oxide in a tallow base for mineral sun protection without the white cast. No chemical filters, just clean protection that moisturizes while it shields.",
    products: [15],
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
  { pattern: /\brecipe\b|homemade|\bDIY\b|make.*(my own|your own|at home|from scratch)|how.*make.*tallow|how.*render|formul(a|ation)|ingredient.*list.*mak(e|ing)|whip.*my own|batch.*my own/, key: "recipeDiy" },
  // Other brands/competitors — redirect without engaging on competitor products
  { pattern: /\bCeraVe\b|\bDrunk Elephant\b|\bVintage Tradition\b|\bFATCO\b|\bAquaphor\b|\bNourishing Biologicals\b|\bBeekman\b|\bPrimally Pure\b|\bBuffalo Gal\b|\bVintage\s+Tradition\b|\bretinol\b|\btretinoin\b|\baccutane\b|\bother brand/i, key: "otherBrand" },

  // Combo intents (catches "X AND Y" before single-concern patterns)
  { pattern: /\b(dry|acne|oily|sensitive|aging|mature)\b.+\b(and|but|plus|also)\b.+\b(dry|acne|oily|sensitive|aging|wrinkle|breakout|flaky)\b/, key: "comboIntent" },
  { pattern: /combination skin/, key: "comboIntent" },

  // Specific product mentions (highest priority)
  { pattern: /blue tansy/i, key: "products.blueTansy" },
  { pattern: /clarifying/i, key: "products.clarifying" },
  { pattern: /cleansing balm/i, key: "products.cleansingBalm" },
  { pattern: /luxe/i, key: "products.luxe" },
  { pattern: /frankincense.*(manuka|honey)|manuka.*(frank|cream)/i, key: "products.frankManuka" },
  { pattern: /frankincense.*(vanilla|face)/i, key: "products.frankVanilla" },
  { pattern: /turmeric|orange blossom/i, key: "products.turmeric" },
  { pattern: /shimmer|frosted mint|glitter/i, key: "products.shimmer" },
  { pattern: /custom|my own scent|choose.*scent/i, key: "products.customButter" },
  { pattern: /coffee.*(scrub|sugar)|sugar.*(scrub|coffee)|exfoliat/i, key: "products.coffeeScrub" },
  { pattern: /vanilla sugar|sugar creme/i, key: "products.vanillaSugarCreme" },
  { pattern: /rugged|revival/i, key: "products.ruggedRevival" },
  { pattern: /sleep balm|magnesium balm/i, key: "products.sleepBalm" },
  { pattern: /hyaluronic|\bserum\b(?!.*before|\bafter\b)/i, key: "products.hyaluronic" },
  { pattern: /sun veil/i, key: "products.sunVeil" },
  { pattern: /hair oil|scalp oil/i, key: "products.hairOil" },
  { pattern: /\blip balm\b|minted vanilla/i, key: "products.lipBalm" },
  { pattern: /body butter|vanilla.*butter/i, key: "products.vanillaBodyButter" },

  // Skin concerns (v3 — expanded keywords, negative lookaheads)
  { pattern: /\bacne\b|breakout|pimple|blemish|comedogenic|\bclog/, key: "skinTypes.acne" },
  { pattern: /\bdry\b(?!.*\bwet\b)|\bflak|tight(?:ness)?|dehydrat|cracked|peeling|dryness|moisturiz/, key: "skinTypes.dry" },
  { pattern: /\bsensitive\b|\breact(?:ive)?\b|\bredness\b|\bred\b(?!uc)|rosacea|irritat|burning/, key: "skinTypes.sensitive" },
  { pattern: /aging|wrinkle|anti.?age|\bmature\b|collagen|fine line|crow.?s feet|laugh line|sagging|younger|50\+/, key: "skinTypes.aging" },
  { pattern: /\boily\b|\bshiny\b|oil control|sebum|greasy|t.?zone/, key: "skinTypes.oily" },
  { pattern: /\bdull\b|dark spot|bright|glow|hyperpigment|uneven.*tone|dark circle|dark mark|melasma|radian/, key: "skinTypes.dull" },

  // Skin conditions (NEW)
  { pattern: /eczema|psoriasis|keratosis|dermatitis|\brash\b|stretch mark|\bscar\b|wound|\bburn\b|tattoo aftercare|diaper rash|cradle cap|cellulite|insect bite|hives/, key: "skinConditions" },

  // Routines
  { pattern: /\broutine\b|\bregimen\b|\bmorning\b(?!.*ship)|skincare.*order|layer.*product|what.*use.*daily|what.*first|AM.*PM|beginner/, key: "routine" },

  // How to use (NEW)
  { pattern: /how (much|often|long)|appl(y|ication)|refrigerat|shelf life|expir|patch test|\bstore\b|melt|under makeup|wet or dry|wash.*off|overuse|mix.*product|multiple product|use on.*body/, key: "howToUse" },

  // Complaints & support (NEW v3)
  { pattern: /complaint|bad reaction|didn.?t work|not happy|didn.?t like|had a reaction|texture.*weird|smells? different|damaged.*arrived|wrong product/, key: "complaint" },

  // Comparisons (BEFORE tallow — catches "tallow vs X" before bare "tallow")
  { pattern: /\bvs\b|compar|versus|better than|differ(?:ent|ence)|how do you/, key: "comparison" },

  // Education (expanded v3)
  { pattern: /\btallow\b|what is tallow|why tallow|grass.?fed|ancestral skin|beef fat|animal fat|rendered fat|fatty acid/, key: "tallow" },

  // Returns & policies (BEFORE shipping — catches "modify/cancel order")
  { pattern: /return|refund|exchange|cancel|money back|payment|promo|discount|wholesale|subscription|afterpay|loyalty|modify.*order/, key: "returns" },

  // Shipping
  { pattern: /\bship|deliver|\border\b(?!.*skin)/, key: "shipping" },

  // Men's (word-boundary fixed)
  { pattern: /\bmen(?:'s)?\b|\bguys?\b|\bshav(?:e|ing)\b|razor|beard|masculine/, key: "mens" },

  // Lips (word-boundary fixed)
  { pattern: /\blip\b|\blips\b|\bchap/, key: "lips" },

  // Hair (v3 — add dandruff)
  { pattern: /\bhair\b|\bscalp\b|frizz|dandruff/, key: "hair" },

  // Sleep (v3 — expanded)
  { pattern: /\bsleep\b|\brelax\b|\bmagnesium\b|insomnia|bedtime|wind down|can.?t sleep|restless/, key: "sleep" },

  // Sun (v3 — expanded)
  { pattern: /\bsun\b|\bspf\b|sunscreen|zinc oxide|mineral.*protect|white cast|sunburn/, key: "sun" },

  // Gifts / popular (v3 — expanded)
  { pattern: /\bgift\b|\bbest seller\b|\bpopular\b|\bfavorite\b|top rated|what.*try first|what do you sell|what products|starter/, key: "popular" },

  // Budget
  { pattern: /cheap|budget|\bvalue\b|affordable|under \$|save money|student/, key: "budget" },

  // Ingredients & safety (NEW)
  { pattern: /ingredient|pregnan|nursing|allergen|allergy|vegan|organic|cruelty.?free|paraben|preservative|fragrance.?free|EWG|non.?toxic|tested.*animal/, key: "ingredients" },

  // Business questions (NEW)
  { pattern: /where.*located|physical store|visit.*workshop|small batch|who makes|your story|how.*start|social media|pop.?up|local pickup|collab|affili|press|hiring/, key: "business" },

  // Greeting (LAST — standalone greetings + common follow-ups like "hi there", "hey!")
  { pattern: /^\s*(hello|hi|hey|hiya|howdy)\s*[!.,]*\s*$/i, key: "greeting" },
  { pattern: /\b(hello|hi|hey)\s*[,!]\s*(i need|i'm new|first time|love your|there)/i, key: "greeting" },
  { pattern: /^(hello|hi|hey|hiya|howdy)[!. ]*$/i, key: "greeting" },
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
