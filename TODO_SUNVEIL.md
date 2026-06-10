# Sun Veil — Pulled Pending Reformulation

**Status:** Removed from storefront on the compliance-sweep branch.

## Why it was pulled

The product as formulated (25% non-nano zinc oxide) and marketed ("Natural tallow sun protection") falls under FDA OTC sunscreen drug regulation (21 CFR 352). We are not registered as an OTC drug manufacturer, do not have an FDA drug listing for this product, and the label does not carry a Drug Facts panel. Continuing to sell the product as a sunscreen exposes us to FDA warning letters and class-action liability.

## What this PR did

- Removed Sun Veil from `src/lib/constants.js` PRODUCTS array (was ID 15)
- Removed Sun Veil from `api/_products-data.js`
- Replaced Sun Veil section in `api/_system-prompt.js` with a "currently unavailable" instruction for TallowExpert
- Removed Sun Veil entry from `public/sitemap.xml`
- Removed Sun Veil product responses, intent patterns, and routine references from `src/components/chat/ai-engine.js`
- Removed "Sun Care" category from the products filter
- Added 301 redirect in `vercel.json` from `/product/tantalizingtallow-sun-veil` → `/products`
- Stripped "sun protection" / "SPF" / "sunscreen" language from all pages and the AI engine
- Strengthened TallowExpert guardrails (#13, #14, #15) to never recommend any TT product for sun protection

## Decisions Sarah needs to make before relaunch

### 1. Reformulate or comply?

| Option | Effort | Risk |
|---|---|---|
| **A. Reformulate to <5% zinc** — a true cosmetic balm, no sunscreen claims allowed | Low (single batch) | Lowest |
| **B. Pursue FDA OTC monograph compliance** — facility registration, drug listing, Drug Facts panel | Months + cost | Lowest legal risk if Sarah wants a real SPF product |
| **C. Discontinue the product entirely** | Zero | Zero |

### 2. New name (when ready)

Outdoor-themed, no "glow," no FDA-regulated language. Banked options:

- **Outdoor Veil Balm** — keeps "veil," outdoor positioning, no protection claim
- **Wanderer's Balm** — sensory, ancestral, evocative
- **Trail Veil Balm** — outdoor activity, specific use case
- **Wild Veil** — short, brand-coherent, ancestral
- **Solstice Balm** — seasonal, poetic, no UV implication
- **Open Air Balm** — descriptive, neutral

### 3. Product positioning copy (when ready)

A daily mineral balm with non-nano zinc oxide is a finishing balm, not sun protection. Acceptable claims:
- "Soft mineral finish"
- "Daily outdoor balm"
- "Conditions skin during time outside"

Unacceptable claims (regardless of formula):
- Any use of "sun," "SPF," "UV," "sunscreen," "sunblock," "protect," "shield" in a protective context
- Any implication the product reduces sunburn risk

## Follow-up tasks

1. Pause Sun Veil in Shopify admin (set as "draft" or unpublish)
2. Decide on reformulation path (option A, B, or C above)
3. If keeping the product, refund any pending Sun Veil orders or fulfill with explicit "not for sun protection" notice
4. When relaunching, open a new PR that adds the new SKU to `constants.js`, `_products-data.js`, `_system-prompt.js`, and `sitemap.xml`
