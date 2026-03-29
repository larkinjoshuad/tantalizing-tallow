/**
 * Shopify Storefront API — Headless Commerce Layer
 *
 * Setup:
 * 1. Shopify Admin → Settings → Apps → Develop apps → Create app
 * 2. Configure Storefront API scopes (see .env.example)
 * 3. Install app → Copy Storefront access token → paste in .env
 */

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || "tantalizingtallow.myshopify.com";
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "";
const API_VERSION = "2024-10";
const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

// ─── GraphQL Client ───
async function shopifyFetch(query, variables = {}) {
  if (!STOREFRONT_TOKEN) {
    console.warn("[Shopify] No storefront token set — using static product data.");
    return null;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Shopify API ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join(", "));
  return json.data;
}

// ─── Products ───
export async function fetchAllProducts() {
  const data = await shopifyFetch(`
    query {
      products(first: 50, sortKey: BEST_SELLING) {
        edges { node {
          id title handle description availableForSale
          priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          images(first: 4) { edges { node { url altText width height } } }
          variants(first: 10) { edges { node {
            id title availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          } } }
        } }
      }
    }
  `);
  if (!data) return null; // caller falls back to static data
  return data.products.edges.map(({ node }) => transformProduct(node));
}

export async function fetchProductByHandle(handle) {
  const data = await shopifyFetch(
    `query ($handle: String!) {
      product(handle: $handle) {
        id title handle description descriptionHtml availableForSale
        priceRange { minVariantPrice { amount } maxVariantPrice { amount } }
        images(first: 6) { edges { node { url altText width height } } }
        variants(first: 20) { edges { node {
          id title availableForSale
          price { amount }
          compareAtPrice { amount }
          selectedOptions { name value }
          image { url }
        } } }
      }
    }`,
    { handle }
  );
  if (!data?.product) return null;
  return transformProduct(data.product);
}

// ─── Cart ───
export async function createCart(lines = []) {
  const data = await shopifyFetch(
    `mutation ($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`
  , { lines });
  if (!data) return null;
  if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
  return data.cartCreate.cart;
}

export async function addCartLines(cartId, variantId, quantity = 1) {
  const data = await shopifyFetch(
    `mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId, lineId, quantity) {
  const data = await shopifyFetch(
    `mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId, lineIds) {
  const data = await shopifyFetch(
    `mutation ($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lineIds }
  );
  return data.cartLinesRemove.cart;
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) { edges { node {
      id quantity
      merchandise { ... on ProductVariant {
        id title
        price { amount }
        product { title handle images(first:1) { edges { node { url } } } }
      } }
    } } }
  }
`;

// ─── Helpers ───
function transformProduct(node) {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    available: node.availableForSale,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    priceMax: parseFloat(node.priceRange.maxVariantPrice.amount),
    hasMultiplePrices:
      node.priceRange.minVariantPrice.amount !== node.priceRange.maxVariantPrice.amount,
    images: node.images.edges.map(({ node: img }) => ({
      url: img.url,
      alt: img.altText || node.title,
      width: img.width,
      height: img.height,
    })),
    variants: node.variants.edges.map(({ node: v }) => ({
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      price: parseFloat(v.price.amount),
      compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
      options: v.selectedOptions,
      image: v.image?.url,
    })),
  };
}

// ─── Analytics ───
export function trackEvent(name, data = {}) {
  if (window.gtag) window.gtag("event", name, data);
  if (import.meta.env.DEV) console.log(`[Analytics] ${name}`, data);
}
