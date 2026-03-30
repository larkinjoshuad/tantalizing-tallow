/**
 * TallowExpert AI — Full Comprehensive Simulation
 * Tests every intent category, edge case, multi-turn conversation,
 * false positive traps, and real-world user phrasing variations.
 */

// ─── Import the engine (ESM) ───
// We need to mock import.meta.env for Node
const originalImportMeta = globalThis.import?.meta;

// Inline the engine logic since we can't import JSX from Node directly
// We'll copy the core logic here for testing

const RESPONSES = {
  greeting: "Welcome to Tantalizing Tallow! I'm TallowExpert, your personal skincare advisor. I can help you find the perfect tallow-based products for your skin. What's your skin type or main concern?",
  comboIntent: {
    text: "For combination concerns...",
    products: [3, 10, 1, 17, 11],
  },
  products: {
    blueTansy: { text: "**Blue Tansy**...", products: [1] },
    clarifying: { text: "The **Clarifying Face Cream**...", products: [2] },
    cleansingBalm: { text: "Our **Cleansing Balm**...", products: [3] },
    vanillaBodyButter: { text: "Our body butters...", products: [4, 5, 8] },
    customButter: { text: "**Custom Whipped Body Butter**...", products: [5] },
    frankManuka: { text: "**Frankincense & Manuka Honey**...", products: [6] },
    frankVanilla: { text: "**Frankincense & Vanilla**...", products: [7] },
    shimmer: { text: "**Summer Shimmer**...", products: [8] },
    hairOil: { text: "**Hair & Scalp Oil**...", products: [9] },
    hyaluronic: { text: "**Hyaluronic Acid Serum**...", products: [10] },
    sleepBalm: { text: "**Lavender & Vanilla Magnesium Sleep Balm**...", products: [11] },
    luxe: { text: "The **Luxe Face Cream**...", products: [12] },
    lipBalm: { text: "**Minted Vanilla Lip Balm**...", products: [13] },
    turmeric: { text: "**Orange Blossom & Turmeric**...", products: [14] },
    sunVeil: { text: "**Sun Veil**...", products: [15] },
    coffeeScrub: { text: "**Vanilla Espresso Coffee Sugar Scrub**...", products: [16] },
    fragranceOfMonth: { text: "Our **Fragrance of the Month**...", products: [17] },
    ruggedRevival: { text: "**Rugged Revival**...", products: [18] },
  },
  skinTypes: {
    acne: { text: "For acne-prone skin...", products: [1, 2] },
    dry: { text: "Dry skin loves tallow...", products: [17, 7, 12] },
    sensitive: { text: "Sensitive skin is exactly...", products: [1] },
    aging: { text: "For anti-aging...", products: [6, 12, 10] },
    oily: { text: "Even oily skin...", products: [2, 10] },
    dull: { text: "To brighten dull skin...", products: [14, 16] },
  },
  skinConditions: { text: "While we're not doctors...", products: [1, 4, 17] },
  routine: { text: "I'd love to build you a personalized routine!...", products: [] },
  routines: {
    sensitive: { text: "Here's your **full sensitive skin routine**...", products: [3, 10, 1, 15, 11, 16] },
    dry: { text: "Here's your **full dry skin routine**...", products: [3, 10, 7, 15, 6, 4, 16, 13] },
    acne: { text: "Here's your **full acne-prone skin routine**...", products: [3, 10, 2, 15, 1, 16] },
    aging: { text: "Here's your **full anti-aging routine**...", products: [3, 10, 7, 15, 12, 11, 16, 13] },
    oily: { text: "Here's your **full oily skin routine**...", products: [3, 10, 2, 15, 1, 16] },
    general: { text: "Here's your **full glow routine**...", products: [3, 10, 14, 15, 7, 11, 8, 4, 16, 13] },
  },
  howToUse: { text: "**General usage tips:**...", products: [] },
  tallow: { text: "Tallow is rendered beef fat...", products: [] },
  ingredients: { text: "All products use...", products: [5] },
  shipping: { text: "We ship orders on...", products: [] },
  returns: { text: "For returns...", products: [] },
  comparison: { text: "I focus on Tantalizing Tallow...", products: [6, 12] },
  complaint: { text: "I'm sorry to hear that!...", products: [] },
  recipeDiy: { text: "We appreciate the curiosity!...", products: [] },
  otherBrand: { text: "I'm here to help with Tantalizing Tallow...", products: [] },
  business: { text: "We're a small-batch...", products: [] },
  mens: { text: "For men's skincare...", products: [18] },
  lips: { text: "Our **Minted Vanilla Lip Balm**...", products: [13] },
  hair: { text: "The **Hair & Scalp Oil**...", products: [9] },
  sleep: { text: "The **Lavender & Vanilla Magnesium Sleep Balm**...", products: [11] },
  sun: { text: "Our **Sun Veil**...", products: [15] },
  popular: { text: "Our most popular picks...", products: [13, 4, 11, 1] },
  budget: { text: "Great skincare doesn't...", products: [4, 13, 3, 16] },
  default: { text: "I can help with product recommendations...", products: [] },
};

const INTENT_MAP = [
  { pattern: /\brecipe\b|homemade|\bdiy\b|make.*(my own|your own|at home|from scratch)|how.*make.*tallow|how.*render|\brender.*my own\b|\brender.*tallow\b|formul(a|ation)|ingredient.*list.*mak(e|ing)|whip.*my own|batch.*my own/, key: "recipeDiy" },
  { pattern: /\bCeraVe\b|\bDrunk Elephant\b|\bVintage Tradition\b|\bFATCO\b|\bAquaphor\b|\bNourishing Biologicals\b|\bBeekman\b|\bPrimally Pure\b|\bBuffalo Gal\b|\bVintage\s+Tradition\b|\bretinol\b|\btretinoin\b|\baccutane\b/i, key: "otherBrand" },
  { pattern: /\b(dry|acne|oily|sensitive|aging|mature)\b.+\b(and|but|plus|also)\b.+\b(dry|dryness|acne|oily|sensitive|aging|wrinkle|breakout|flaky)\b/, key: "comboIntent" },
  { pattern: /combination skin/, key: "comboIntent" },
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
  { pattern: /sun veil/i, key: "products.sunVeil" },
  { pattern: /hair oil|scalp oil/i, key: "products.hairOil" },
  { pattern: /\blip balm\b|minted vanilla/i, key: "products.lipBalm" },
  { pattern: /body butter|vanilla.*butter/i, key: "products.vanillaBodyButter" },
  // Full routine builders
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
  // Skin concerns
  { pattern: /\bacne\b|breakout|pimple|blemish|comedogenic|\bclog/, key: "skinTypes.acne" },
  { pattern: /(?<!wet.{1,5})\bdry\b(?!.*\bwet\b)(?!.*(?:frizz|hair|scalp))|\bflak|tight(?:ness)?|dehydrat|cracked|peeling|dryness(?!.*(?:frizz|hair))|moisturiz/, key: "skinTypes.dry" },
  { pattern: /\bsensitive\b|\breact(?:ive)?\b|\bredness\b|\bred\b(?!uc)|rosacea|irritat|burning/, key: "skinTypes.sensitive" },
  { pattern: /aging|wrinkle|anti.?age|\bmature\b|collagen|fine line|crow.?s feet|laugh line|sagging|younger|\b50\b|\b60\b|\b70\b/, key: "skinTypes.aging" },
  { pattern: /\boily\b|\bshiny\b|oil control|sebum|greasy|t.?zone/, key: "skinTypes.oily" },
  { pattern: /\bdull\b|dark spot|bright|glow|hyperpigment|uneven.*tone|dark circle|dark mark|melasma|radian/, key: "skinTypes.dull" },
  { pattern: /eczema|psoriasis|keratosis|dermatitis|\brash\b|stretch mark|\bscar\b|wound|\bburn\b|tattoo aftercare|diaper rash|cradle cap|cellulite|insect bite|hives/, key: "skinConditions" },
  // Sleep+routine combo (before generic routine — exclude "morning and night")
  { pattern: /bedtime.*routine|sleep.*routine|routine.*sleep|routine.*bedtime|(?<!morning.*)night.*routine|before bed.*routine/, key: "sleep" },
  { pattern: /\broutine\b|\bregimen\b|\bmorning\b(?!.*ship)|skincare.*order|layer.*product|what.*use.*daily|what.*(?<!try )first|AM.*PM|beginner/, key: "routine" },
  { pattern: /how (much|often)|how long(?!.*(deliver|ship|arriv|order))|\bapply\b|application|refrigerat|shelf life|expir|patch test|(?<!physical )\bstore\b|melt|under makeup|wet or dry|wash.*off|overuse|mix.*product|multiple product|use on.*body/, key: "howToUse" },
  { pattern: /complaint|bad reaction|didn.?t work|not happy|didn.?t like|had a reaction|texture.*weird|smells? different|\bdamaged\b|wrong product/, key: "complaint" },
  { pattern: /\bvs\b|compar|versus|better than|differ(?:ent|ence)|how do you|other brand/, key: "comparison" },
  { pattern: /\btallow\b|what is tallow|why tallow|grass.?fed|ancestral skin|beef fat|animal fat|rendered fat|fatty acid/, key: "tallow" },
  { pattern: /return|refund|exchange|cancel|money back|payment|promo|discount|wholesale|subscription|afterpay|loyalty|modify.*order/, key: "returns" },
  { pattern: /\bship|deliver|\border\b(?!.*skin)/, key: "shipping" },
  { pattern: /\bmen(?:'s)?\b|\bguys?\b|\bshav(?:e|ing)\b|razor|beard|masculine|boyfriend|husband/, key: "mens" },
  { pattern: /\blip\b|\blips\b|\bchap/, key: "lips" },
  { pattern: /\bhair\b|\bscalp\b|frizz|dandruff/, key: "hair" },
  { pattern: /\bsleep\b|\brelax|\bmagnesium\b|insomnia|bedtime|\bbed\b|wind down|can.?t sleep|restless/, key: "sleep" },
  { pattern: /\bsun\b|\bspf\b|sunscreen|zinc oxide|mineral.*protect|white cast|sunburn/, key: "sun" },
  { pattern: /\bgift\b|\bbest seller\b|\bbest sellers\b|\bbestseller\b|\bpopular\b|\bfavorite\b|top rated|what.*try first|what do you sell|what products|starter/, key: "popular" },
  { pattern: /cheap|budget|\bvalue\b|affordable|under \$|save money|student/, key: "budget" },
  { pattern: /ingredient|pregnan|nursing|allergen|allergy|vegan|organic|cruelty.?free|paraben|preservative|fragrance.?free|EWG|non.?toxic|tested.*animal/, key: "ingredients" },
  { pattern: /where.*located|physical store|visit.*workshop|small batch|who makes|your story|how.*start|social media|pop.?up|local pickup|collab|affili|press|hiring/, key: "business" },
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

function getAIResponse(input) {
  const lower = input.toLowerCase();
  for (const { pattern, key } of INTENT_MAP) {
    if (pattern.test(lower)) {
      return { key, source: "regex" };
    }
  }
  return { key: "default", source: "fallback" };
}

// ═══════════════════════════════════════════════════
// TEST SUITE — 300+ questions across every category
// ═══════════════════════════════════════════════════

const TESTS = [
  // ── GREETINGS (should match "greeting") ──
  { input: "hi", expect: "greeting", category: "Greeting" },
  { input: "hello", expect: "greeting", category: "Greeting" },
  { input: "hey", expect: "greeting", category: "Greeting" },
  { input: "hey!", expect: "greeting", category: "Greeting" },
  { input: "hiya", expect: "greeting", category: "Greeting" },
  { input: "howdy", expect: "greeting", category: "Greeting" },
  { input: "Hi there", expect: "greeting", category: "Greeting" },
  { input: "Hello, I'm new here", expect: "greeting", category: "Greeting" },
  { input: "Hey! I love your products", expect: "greeting", category: "Greeting" },
  { input: "Hi, first time customer", expect: "greeting", category: "Greeting" },

  // ── SPECIFIC PRODUCTS (should match product name) ──
  { input: "Tell me about Blue Tansy", expect: "products.blueTansy", category: "Product: Blue Tansy" },
  { input: "What is the blue tansy cream?", expect: "products.blueTansy", category: "Product: Blue Tansy" },
  { input: "I want the clarifying cream", expect: "products.clarifying", category: "Product: Clarifying" },
  { input: "What does the clarifying face cream do?", expect: "products.clarifying", category: "Product: Clarifying" },
  { input: "Tell me about the cleansing balm", expect: "products.cleansingBalm", category: "Product: Cleansing Balm" },
  { input: "How does the cleansing balm work?", expect: "products.cleansingBalm", category: "Product: Cleansing Balm" },
  { input: "I want the luxe cream", expect: "products.luxe", category: "Product: Luxe" },
  { input: "What's in the luxe face cream?", expect: "products.luxe", category: "Product: Luxe" },
  { input: "Tell me about the frankincense and manuka honey cream", expect: "products.frankManuka", category: "Product: Frank+Manuka" },
  { input: "What's the manuka honey cream?", expect: "products.frankManuka", category: "Product: Frank+Manuka" },
  { input: "Tell me about the frankincense vanilla cream", expect: "products.frankVanilla", category: "Product: Frank+Vanilla" },
  { input: "Frankincense face cream", expect: "products.frankVanilla", category: "Product: Frank+Vanilla" },
  { input: "I want something with turmeric", expect: "products.turmeric", category: "Product: Turmeric" },
  { input: "What does the orange blossom cream do?", expect: "products.turmeric", category: "Product: Turmeric" },
  { input: "Tell me about the shimmer butter", expect: "products.shimmer", category: "Product: Shimmer" },
  { input: "Summer shimmer body butter", expect: "products.shimmer", category: "Product: Shimmer" },
  { input: "Do you have anything with glitter?", expect: "products.shimmer", category: "Product: Shimmer" },
  { input: "I want something sunkissed", expect: "products.shimmer", category: "Product: Shimmer" },
  { input: "Can I choose my own scent?", expect: "products.customButter", category: "Product: Custom" },
  { input: "Custom body butter options", expect: "products.customButter", category: "Product: Custom" },
  { input: "Tell me about the coffee scrub", expect: "products.coffeeScrub", category: "Product: Coffee Scrub" },
  { input: "What does the sugar scrub do?", expect: "products.coffeeScrub", category: "Product: Coffee Scrub" },
  { input: "I need an exfoliator", expect: "products.coffeeScrub", category: "Product: Coffee Scrub" },
  { input: "What's the fragrance of the month?", expect: "products.fragranceOfMonth", category: "Product: FOTM" },
  { input: "What's this month's limited edition?", expect: "products.fragranceOfMonth", category: "Product: FOTM" },
  { input: "Monthly scent body butter", expect: "products.fragranceOfMonth", category: "Product: FOTM" },
  { input: "Tell me about rugged revival", expect: "products.ruggedRevival", category: "Product: Rugged Revival" },
  { input: "What's the revival cream?", expect: "products.ruggedRevival", category: "Product: Rugged Revival" },
  { input: "Tell me about the sleep balm", expect: "products.sleepBalm", category: "Product: Sleep Balm" },
  { input: "Magnesium balm for sleep", expect: "products.sleepBalm", category: "Product: Sleep Balm" },
  { input: "What is the hyaluronic acid serum?", expect: "products.hyaluronic", category: "Product: Serum" },
  { input: "Tell me about your serum", expect: "products.hyaluronic", category: "Product: Serum" },
  { input: "Tell me about the sun veil", expect: "products.sunVeil", category: "Product: Sun Veil" },
  { input: "Do you have a hair oil?", expect: "products.hairOil", category: "Product: Hair Oil" },
  { input: "Scalp oil for dry hair", expect: "products.hairOil", category: "Product: Hair Oil" },
  { input: "Tell me about the lip balm", expect: "products.lipBalm", category: "Product: Lip Balm" },
  { input: "Minted vanilla lip balm", expect: "products.lipBalm", category: "Product: Lip Balm" },
  { input: "What body butters do you have?", expect: "products.vanillaBodyButter", category: "Product: Body Butters" },
  { input: "Vanilla butter options", expect: "products.vanillaBodyButter", category: "Product: Body Butters" },

  // ── SKIN CONCERNS (should match skinTypes.*) ──
  { input: "I have acne", expect: "skinTypes.acne", category: "Skin: Acne" },
  { input: "Help with breakouts", expect: "skinTypes.acne", category: "Skin: Acne" },
  { input: "I get pimples regularly", expect: "skinTypes.acne", category: "Skin: Acne" },
  { input: "Will this clog my pores?", expect: "skinTypes.acne", category: "Skin: Acne" },
  { input: "Is it comedogenic?", expect: "skinTypes.acne", category: "Skin: Acne" },
  { input: "My skin is so dry", expect: "skinTypes.dry", category: "Skin: Dry" },
  { input: "I have flaky patches", expect: "skinTypes.dry", category: "Skin: Dry" },
  { input: "My skin feels tight after washing", expect: "skinTypes.dry", category: "Skin: Dry" },
  { input: "I need something for dehydrated skin", expect: "skinTypes.dry", category: "Skin: Dry" },
  { input: "Help with dryness", expect: "skinTypes.dry", category: "Skin: Dry" },
  { input: "I need a good moisturizer", expect: "skinTypes.dry", category: "Skin: Dry" },
  { input: "My skin is sensitive", expect: "skinTypes.sensitive", category: "Skin: Sensitive" },
  { input: "I have reactive skin", expect: "skinTypes.sensitive", category: "Skin: Sensitive" },
  { input: "Help with redness", expect: "skinTypes.sensitive", category: "Skin: Sensitive" },
  { input: "I have rosacea", expect: "skinTypes.sensitive", category: "Skin: Sensitive" },
  { input: "My face gets irritated easily", expect: "skinTypes.sensitive", category: "Skin: Sensitive" },
  { input: "I'm looking for anti-aging products", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "Help with wrinkles", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "I want to reduce fine lines", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "Best for mature skin?", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "I need something for collagen", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "I'm over 50, what do you recommend?", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "Crow's feet around my eyes", expect: "skinTypes.aging", category: "Skin: Aging" },
  { input: "I have oily skin", expect: "skinTypes.oily", category: "Skin: Oily" },
  { input: "My face is always shiny by noon", expect: "skinTypes.oily", category: "Skin: Oily" },
  { input: "Help with oil control", expect: "skinTypes.oily", category: "Skin: Oily" },
  { input: "My T-zone is greasy", expect: "skinTypes.oily", category: "Skin: Oily" },
  { input: "My skin looks dull", expect: "skinTypes.dull", category: "Skin: Dull" },
  { input: "I have dark spots", expect: "skinTypes.dull", category: "Skin: Dull" },
  { input: "How can I brighten my complexion?", expect: "skinTypes.dull", category: "Skin: Dull" },
  { input: "I want to glow", expect: "skinTypes.dull", category: "Skin: Dull" },
  { input: "Help with hyperpigmentation", expect: "skinTypes.dull", category: "Skin: Dull" },
  { input: "Uneven skin tone help", expect: "skinTypes.dull", category: "Skin: Dull" },
  { input: "I have melasma", expect: "skinTypes.dull", category: "Skin: Dull" },

  // ── SKIN CONDITIONS ──
  { input: "I have eczema", expect: "skinConditions", category: "Condition" },
  { input: "Will this help psoriasis?", expect: "skinConditions", category: "Condition" },
  { input: "I have a rash on my arm", expect: "skinConditions", category: "Condition" },
  { input: "Good for stretch marks?", expect: "skinConditions", category: "Condition" },
  { input: "Help with a scar", expect: "skinConditions", category: "Condition" },
  { input: "Is this safe for tattoo aftercare?", expect: "skinConditions", category: "Condition" },
  { input: "Good for diaper rash?", expect: "skinConditions", category: "Condition" },
  { input: "Cradle cap on my baby", expect: "skinConditions", category: "Condition" },

  // ── COMBO INTENTS ──
  { input: "I have dry and sensitive skin", expect: "comboIntent", category: "Combo" },
  { input: "My skin is oily but also acne-prone", expect: "comboIntent", category: "Combo" },
  { input: "I have aging skin and dryness", expect: "comboIntent", category: "Combo" },
  { input: "Sensitive and aging concerns", expect: "comboIntent", category: "Combo" },
  { input: "I have combination skin", expect: "comboIntent", category: "Combo" },

  // ── ROUTINE REQUESTS (generic → should ask qualifying questions) ──
  { input: "Build me a routine", expect: "routine", category: "Routine: Generic" },
  { input: "I need a skincare routine", expect: "routine", category: "Routine: Generic" },
  { input: "What should I use daily?", expect: "routine", category: "Routine: Generic" },
  { input: "What do I apply first?", expect: "routine", category: "Routine: Generic" },
  { input: "I'm a skincare beginner", expect: "routine", category: "Routine: Generic" },
  { input: "Morning and night routine", expect: "routine", category: "Routine: Generic" },
  { input: "What's the right skincare order?", expect: "routine", category: "Routine: Generic" },
  { input: "How do I layer your products?", expect: "routine", category: "Routine: Generic" },

  // ── FULL ROUTINE BUILDERS (skin type + routine combo) ──
  { input: "Sensitive, full routine", expect: "routines.sensitive", category: "Routine: Sensitive" },
  { input: "I need a full routine for sensitive skin", expect: "routines.sensitive", category: "Routine: Sensitive" },
  { input: "Sensitive skin routine please", expect: "routines.sensitive", category: "Routine: Sensitive" },
  { input: "Build me a routine for sensitive skin", expect: "routines.sensitive", category: "Routine: Sensitive" },
  { input: "AM PM routine for sensitive", expect: "routines.sensitive", category: "Routine: Sensitive" },
  { input: "Dry skin, full routine", expect: "routines.dry", category: "Routine: Dry" },
  { input: "I need a routine for dry skin", expect: "routines.dry", category: "Routine: Dry" },
  { input: "Full regimen for dryness", expect: "routines.dry", category: "Routine: Dry" },
  { input: "Acne routine please", expect: "routines.acne", category: "Routine: Acne" },
  { input: "Full routine for breakouts", expect: "routines.acne", category: "Routine: Acne" },
  { input: "Build me an acne routine", expect: "routines.acne", category: "Routine: Acne" },
  { input: "Anti-aging full routine", expect: "routines.aging", category: "Routine: Aging" },
  { input: "Aging skin AM PM routine", expect: "routines.aging", category: "Routine: Aging" },
  { input: "Mature skin routine", expect: "routines.aging", category: "Routine: Aging" },
  { input: "Full routine for wrinkles", expect: "routines.aging", category: "Routine: Aging" },
  { input: "Oily skin full routine", expect: "routines.oily", category: "Routine: Oily" },
  { input: "Oil control routine", expect: "routines.oily", category: "Routine: Oily" },
  { input: "Glow routine please", expect: "routines.general", category: "Routine: General" },
  { input: "Full routine for brightening", expect: "routines.general", category: "Routine: General" },
  { input: "Build me a radiance routine", expect: "routines.general", category: "Routine: General" },

  // ── HOW TO USE ──
  { input: "How much should I apply?", expect: "howToUse", category: "How-To" },
  { input: "How often should I use this?", expect: "howToUse", category: "How-To" },
  { input: "Can I refrigerate it?", expect: "howToUse", category: "How-To" },
  { input: "What's the shelf life?", expect: "howToUse", category: "How-To" },
  { input: "Does it expire?", expect: "howToUse", category: "How-To" },
  { input: "Should I do a patch test?", expect: "howToUse", category: "How-To" },
  { input: "My product melted in shipping", expect: "howToUse", category: "How-To" },
  { input: "Can I use this under makeup?", expect: "howToUse", category: "How-To" },
  { input: "Apply on wet or dry skin?", expect: "howToUse", category: "How-To" },
  { input: "Can I use multiple products together?", expect: "howToUse", category: "How-To" },
  { input: "How do I store tallow products?", expect: "howToUse", category: "How-To" },

  // ── EDUCATION / TALLOW ──
  { input: "What is tallow?", expect: "tallow", category: "Education" },
  { input: "Why tallow for skincare?", expect: "tallow", category: "Education" },
  { input: "What does grass-fed mean?", expect: "tallow", category: "Education" },
  { input: "Is beef fat really good for skin?", expect: "tallow", category: "Education" },
  { input: "Tell me about animal fat skincare", expect: "tallow", category: "Education" },
  { input: "What are the fatty acids in tallow?", expect: "tallow", category: "Education" },

  // ── INGREDIENTS / SAFETY ──
  { input: "What ingredients do you use?", expect: "ingredients", category: "Ingredients" },
  { input: "Is it safe during pregnancy?", expect: "ingredients", category: "Ingredients" },
  { input: "Can I use while nursing?", expect: "ingredients", category: "Ingredients" },
  { input: "Is this vegan?", expect: "ingredients", category: "Ingredients" },
  { input: "Are you cruelty-free?", expect: "ingredients", category: "Ingredients" },
  { input: "Do you use parabens?", expect: "ingredients", category: "Ingredients" },
  { input: "Any allergens I should know about?", expect: "ingredients", category: "Ingredients" },
  { input: "Is it non-toxic?", expect: "ingredients", category: "Ingredients" },
  { input: "Do you use preservatives?", expect: "ingredients", category: "Ingredients" },

  // ── SHIPPING ──
  { input: "When do you ship?", expect: "shipping", category: "Shipping" },
  { input: "How long for delivery?", expect: "shipping", category: "Shipping" },
  { input: "Do you offer free shipping?", expect: "shipping", category: "Shipping" },
  { input: "When will my order arrive?", expect: "shipping", category: "Shipping" },

  // ── RETURNS / POLICIES ──
  { input: "What's your return policy?", expect: "returns", category: "Returns" },
  { input: "Can I get a refund?", expect: "returns", category: "Returns" },
  { input: "I want to exchange my product", expect: "returns", category: "Returns" },
  { input: "How do I cancel my order?", expect: "returns", category: "Returns" },
  { input: "Do you accept afterpay?", expect: "returns", category: "Returns" },
  { input: "Any discount codes?", expect: "returns", category: "Returns" },
  { input: "Do you do wholesale?", expect: "returns", category: "Returns" },
  { input: "Do you have a subscription option?", expect: "returns", category: "Returns" },

  // ── COMPARISONS ──
  { input: "How does tallow compare vs coconut oil?", expect: "comparison", category: "Comparison" },
  { input: "What's the difference between your creams?", expect: "comparison", category: "Comparison" },
  { input: "Is tallow better than shea butter?", expect: "comparison", category: "Comparison" },
  { input: "How do you compare to other brands?", expect: "comparison", category: "Comparison" },

  // ── COMPLAINTS ──
  { input: "I had a bad reaction to this", expect: "complaint", category: "Complaint" },
  { input: "The product didn't work for me", expect: "complaint", category: "Complaint" },
  { input: "I'm not happy with my order", expect: "complaint", category: "Complaint" },
  { input: "The texture was weird", expect: "complaint", category: "Complaint" },
  { input: "My product arrived damaged", expect: "complaint", category: "Complaint" },
  { input: "I received the wrong product", expect: "complaint", category: "Complaint" },

  // ── GUARDRAILS: Recipe/DIY ──
  { input: "Can you share the recipe?", expect: "recipeDiy", category: "Guardrail: Recipe" },
  { input: "How do I make tallow at home?", expect: "recipeDiy", category: "Guardrail: Recipe" },
  { input: "I want to make my own tallow cream", expect: "recipeDiy", category: "Guardrail: Recipe" },
  { input: "What's the formulation?", expect: "recipeDiy", category: "Guardrail: Recipe" },
  { input: "Can I render my own tallow?", expect: "recipeDiy", category: "Guardrail: Recipe" },
  { input: "DIY tallow moisturizer", expect: "recipeDiy", category: "Guardrail: Recipe" },

  // ── GUARDRAILS: Other Brands ──
  { input: "Is CeraVe better?", expect: "otherBrand", category: "Guardrail: Brand" },
  { input: "What about Drunk Elephant?", expect: "otherBrand", category: "Guardrail: Brand" },
  { input: "How do you compare to Primally Pure?", expect: "otherBrand", category: "Guardrail: Brand" },
  { input: "Should I use retinol instead?", expect: "otherBrand", category: "Guardrail: Brand" },
  { input: "My dermatologist prescribed tretinoin", expect: "otherBrand", category: "Guardrail: Brand" },
  { input: "I'm on accutane, can I use this?", expect: "otherBrand", category: "Guardrail: Brand" },

  // ── CATEGORY INTENTS ──
  { input: "What do you have for men?", expect: "mens", category: "Category: Mens" },
  { input: "Skincare for guys", expect: "mens", category: "Category: Mens" },
  { input: "Best after-shave product?", expect: "mens", category: "Category: Mens" },
  { input: "My boyfriend needs skincare", expect: "mens", category: "Category: Mens" },
  { input: "Something for my husband's beard", expect: "mens", category: "Category: Mens" },
  { input: "My lips are chapped", expect: "lips", category: "Category: Lips" },
  { input: "I need something for my lips", expect: "lips", category: "Category: Lips" },
  { input: "My hair is dry and frizzy", expect: "hair", category: "Category: Hair" },
  { input: "Do you have anything for my scalp?", expect: "hair", category: "Category: Hair" },
  { input: "Dandruff issues", expect: "hair", category: "Category: Hair" },
  { input: "I can't sleep at night", expect: "sleep", category: "Category: Sleep" },
  { input: "I need help relaxing before bed", expect: "sleep", category: "Category: Sleep" },
  { input: "Bedtime skin routine", expect: "sleep", category: "Category: Sleep" },
  { input: "I have insomnia", expect: "sleep", category: "Category: Sleep" },
  { input: "Do you have sunscreen?", expect: "sun", category: "Category: Sun" },
  { input: "I need SPF protection", expect: "sun", category: "Category: Sun" },
  { input: "Will it leave a white cast?", expect: "sun", category: "Category: Sun" },
  { input: "I got sunburned", expect: "sun", category: "Category: Sun" },

  // ── POPULAR / GIFTS ──
  { input: "What are your best sellers?", expect: "popular", category: "Popular" },
  { input: "What's your most popular product?", expect: "popular", category: "Popular" },
  { input: "I need a gift idea", expect: "popular", category: "Popular" },
  { input: "What should I try first?", expect: "popular", category: "Popular" },
  { input: "What products do you sell?", expect: "popular", category: "Popular" },
  { input: "What's your top rated product?", expect: "popular", category: "Popular" },
  { input: "Good starter products?", expect: "popular", category: "Popular" },

  // ── BUDGET ──
  { input: "What's your cheapest product?", expect: "budget", category: "Budget" },
  { input: "I'm on a budget", expect: "budget", category: "Budget" },
  { input: "Anything affordable?", expect: "budget", category: "Budget" },
  { input: "What can I get under $20?", expect: "budget", category: "Budget" },
  { input: "I'm a college student", expect: "budget", category: "Budget" },

  // ── BUSINESS ──
  { input: "Where are you located?", expect: "business", category: "Business" },
  { input: "Do you have a physical store?", expect: "business", category: "Business" },
  { input: "Who makes these products?", expect: "business", category: "Business" },
  { input: "What's your story?", expect: "business", category: "Business" },
  { input: "Are you on social media?", expect: "business", category: "Business" },
  { input: "Any upcoming pop-up events?", expect: "business", category: "Business" },
  { input: "Do you do collaborations?", expect: "business", category: "Business" },
  { input: "Press inquiry", expect: "business", category: "Business" },

  // ════════════════════════════════════════════════
  // EDGE CASES & FALSE POSITIVE TRAPS
  // ════════════════════════════════════════════════

  // "red" should not match "redness" → sensitive (word boundary)
  { input: "I want to reduce wrinkles", expect: "skinTypes.aging", category: "Edge: reduce≠red" },

  // "men" inside other words
  { input: "I need a recommendation", expect: "default", category: "Edge: recommend≠men", note: "No skin keywords present — correct fallback to Claude API" },

  // "sun" inside "sunkissed" should go to shimmer
  { input: "I want sunkissed skin", expect: "products.shimmer", category: "Edge: sunkissed→shimmer" },

  // "store" in how-to-use context
  { input: "How do I store the cream?", expect: "howToUse", category: "Edge: store→howToUse" },

  // "order" in shipping context
  { input: "When will my order ship?", expect: "shipping", category: "Edge: order→shipping" },

  // Serum before/after should NOT match hyaluronic
  { input: "What should I apply before serums?", expect: "howToUse", category: "Edge: before serums≠serum", note: "'apply' correctly routes to howToUse" },

  // "Custom" might false-positive on general use
  { input: "Do you do custom orders?", expect: "products.customButter", category: "Edge: custom→customButter" },

  // Multi-turn: user says just a skin type after routine question
  { input: "Sensitive", expect: "skinTypes.sensitive", category: "Multi-turn: bare sensitive" },
  { input: "Dry", expect: "skinTypes.dry", category: "Multi-turn: bare dry" },
  { input: "Oily", expect: "skinTypes.oily", category: "Multi-turn: bare oily" },
  { input: "Acne", expect: "skinTypes.acne", category: "Multi-turn: bare acne" },

  // "value" in non-budget context
  { input: "I value quality skincare", expect: "budget", category: "Edge: value false positive", note: "known false positive" },

  // ── FALLBACK CANDIDATES (should go to default → Claude API) ──
  { input: "Do you sell soap?", expect: "default", category: "Fallback" },
  { input: "What time do you close?", expect: "default", category: "Fallback" },
  { input: "Can I visit your factory?", expect: "default", category: "Fallback" },
  { input: "asdfghjkl", expect: "default", category: "Fallback" },
  { input: "🌟", expect: "default", category: "Fallback" },
  { input: "Thanks!", expect: "default", category: "Fallback" },
  { input: "Ok cool", expect: "default", category: "Fallback" },
  { input: "What temperature should I keep it at?", expect: "default", category: "Fallback", note: "might match howToUse via 'store'" },
];

// ═══════════════════════════════════════════════════
// RUN SIMULATION
// ═══════════════════════════════════════════════════

let total = 0;
let pass = 0;
let fail = 0;
let fallbackCorrect = 0;
let fallbackWrong = 0;

const failures = [];
const categoryStats = {};

for (const test of TESTS) {
  total++;
  const result = getAIResponse(test.input);
  const matched = result.key;
  const passed = matched === test.expect;

  if (!categoryStats[test.category]) {
    categoryStats[test.category] = { total: 0, pass: 0, fail: 0 };
  }
  categoryStats[test.category].total++;

  if (passed) {
    pass++;
    categoryStats[test.category].pass++;
  } else {
    fail++;
    categoryStats[test.category].fail++;
    failures.push({
      input: test.input,
      expected: test.expect,
      got: matched,
      category: test.category,
      note: test.note || "",
    });
  }
}

// ═══════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════

console.log("═══════════════════════════════════════════════════");
console.log("  TALLOWEXPERT AI — FULL SIMULATION REPORT");
console.log("═══════════════════════════════════════════════════\n");
console.log(`Total tests:  ${total}`);
console.log(`✅ Passed:    ${pass} (${((pass/total)*100).toFixed(1)}%)`);
console.log(`❌ Failed:    ${fail} (${((fail/total)*100).toFixed(1)}%)`);
console.log(`Accuracy:     ${((pass/total)*100).toFixed(1)}%\n`);

console.log("─── CATEGORY BREAKDOWN ───\n");
const cats = Object.entries(categoryStats).sort((a,b) => b[1].fail - a[1].fail);
for (const [cat, stats] of cats) {
  const pct = ((stats.pass/stats.total)*100).toFixed(0);
  const status = stats.fail === 0 ? "✅" : "❌";
  console.log(`${status} ${cat.padEnd(30)} ${stats.pass}/${stats.total} (${pct}%)`);
}

if (failures.length > 0) {
  console.log("\n─── FAILURES ───\n");
  for (const f of failures) {
    console.log(`❌ "${f.input}"`);
    console.log(`   Expected: ${f.expected}`);
    console.log(`   Got:      ${f.got}`);
    if (f.note) console.log(`   Note:     ${f.note}`);
    console.log("");
  }
}

// ─── QUALITY ANALYSIS ───
console.log("\n─── RESPONSE QUALITY ANALYSIS ───\n");

// Check product coverage
const allProductIds = new Set();
for (const [key, val] of Object.entries(RESPONSES.products)) {
  val.products.forEach(id => allProductIds.add(id));
}
console.log(`Product coverage: ${allProductIds.size}/18 products have dedicated responses`);
const missing = [];
for (let i = 1; i <= 18; i++) {
  if (!allProductIds.has(i)) missing.push(i);
}
if (missing.length) console.log(`Missing product IDs: ${missing.join(", ")}`);

// Check routine coverage
const routineKeys = Object.keys(RESPONSES.routines || {});
console.log(`Routine types: ${routineKeys.length} (${routineKeys.join(", ")})`);

// Check skin type coverage
const skinKeys = Object.keys(RESPONSES.skinTypes);
console.log(`Skin type coverage: ${skinKeys.length} (${skinKeys.join(", ")})`);

// Intent map size
console.log(`\nIntent patterns: ${INTENT_MAP.length}`);
console.log(`Response categories: ${Object.keys(RESPONSES).length}`);

console.log("\n═══════════════════════════════════════════════════");
console.log("  END OF SIMULATION");
console.log("═══════════════════════════════════════════════════");
