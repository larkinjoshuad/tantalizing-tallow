import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { fireEvent, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";
import { render as renderServer } from "./entry-server";
import { PRODUCTS } from "./lib/constants";

vi.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
vi.mock("@vercel/speed-insights/react", () => ({ SpeedInsights: () => null }));
const shopify = vi.hoisted(() => ({
  loadVariantMap: vi.fn(),
  findHandleByVariantNumericId: vi.fn(),
  getVariantId: vi.fn(),
  createCart: vi.fn(),
  addCartLines: vi.fn(),
}));
vi.mock("./lib/shopify", () => shopify);

let root;
let container;
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  container?.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

it.each(["immediate", "delayed"])("preserves saved quantity and normalizes a cart return with %s variant lookup", async (timing) => {
  localStorage.clear();
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  let finishLookup;
  const lookup = timing === "immediate"
    ? Promise.resolve()
    : new Promise((resolve) => { finishLookup = resolve; });
  shopify.loadVariantMap.mockReturnValue(lookup);
  shopify.findHandleByVariantNumericId.mockReturnValue({ handle: PRODUCTS[0].handle });
  shopify.getVariantId.mockReturnValue("gid://shopify/ProductVariant/123");
  shopify.createCart.mockResolvedValue(null);
  const path = "/cart/123:2";
  window.history.replaceState(null, "", path);
  container = document.createElement("div");
  container.innerHTML = renderServer(path);
  const savedItems = [{ ...PRODUCTS[0], qty: 2 }];
  localStorage.setItem("tt_cart_v1", JSON.stringify(savedItems));
  const storageWrites = vi.spyOn(Storage.prototype, "setItem");
  document.body.append(container);
  const onRecoverableError = vi.fn();
  await act(async () => {
    root = hydrateRoot(container, <App />, { onRecoverableError });
  });
  if (timing === "delayed") {
    expect(window.location.pathname).toBe(path);
    expect(JSON.parse(localStorage.getItem("tt_cart_v1"))).toEqual(savedItems);
    await act(async () => finishLookup());
  }
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(shopify.findHandleByVariantNumericId).toHaveBeenCalledExactlyOnceWith("123");
  expect(within(container).getByRole("button", { name: "Cart" })).toHaveTextContent("2");
  expect(JSON.parse(localStorage.getItem("tt_cart_v1"))).toEqual(savedItems);
  expect(storageWrites).not.toHaveBeenCalledWith("tt_cart_v1", "[]");
  expect(window.location.pathname).toBe("/cart");
  expect(shopify.createCart).not.toHaveBeenCalled();
  expect(shopify.addCartLines).not.toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled();
});

it("restores a returning customer's cart after hydration without replacing the page or clearing storage", async () => {
  localStorage.clear();
  const path = "/product/blue-tansy-whipped-face-cream";
  window.history.replaceState(null, "", path);
  container = document.createElement("div");
  container.innerHTML = renderServer(path);
  const savedItems = [{ ...PRODUCTS[0], qty: 2 }];
  localStorage.setItem("tt_cart_v1", JSON.stringify(savedItems));
  const storageWrites = vi.spyOn(Storage.prototype, "setItem");
  document.body.append(container);
  const originalHeading = within(container).getByRole("heading", { name: "Blue Tansy" });
  const onRecoverableError = vi.fn();
  await act(async () => {
    root = hydrateRoot(container, <App />, { onRecoverableError });
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(within(container).getByRole("heading", { name: "Blue Tansy" })).toBe(originalHeading);
  expect(within(container).getByRole("button", { name: "Cart" })).toHaveTextContent("2");
  expect(JSON.parse(localStorage.getItem("tt_cart_v1"))).toEqual(savedItems);
  expect(storageWrites).not.toHaveBeenCalledWith("tt_cart_v1", "[]");
});

it("hydrates the actual prerendered product without replacing it and opens chat", async () => {
  localStorage.clear();
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  const path = "/product/blue-tansy-whipped-face-cream";
  window.history.replaceState(null, "", path);
  container = document.createElement("div");
  container.innerHTML = renderServer(path);
  document.body.append(container);
  const originalHeading = within(container).getByRole("heading", { name: "Blue Tansy" });
  const onRecoverableError = vi.fn();
  await act(async () => {
    root = hydrateRoot(container, <App />, { onRecoverableError });
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(within(container).getByRole("heading", { name: "Blue Tansy" })).toBe(originalHeading);
  fireEvent.click(within(container).getByRole("button", { name: "Open TallowExpert chat" }));
  expect(within(container).getByRole("button", { name: "Close chat" })).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
