import { describe, it, expect } from "vitest";
import { parseCartPermalinkPath } from "./cart-url";

describe("parseCartPermalinkPath", () => {
  it("parses a single variant:qty pair", () => {
    expect(parseCartPermalinkPath("/cart/52395634262380:1")).toEqual([
      { variantId: "52395634262380", qty: 1 },
    ]);
  });

  it("parses multiple comma-separated pairs", () => {
    expect(parseCartPermalinkPath("/cart/111:2,222:3")).toEqual([
      { variantId: "111", qty: 2 },
      { variantId: "222", qty: 3 },
    ]);
  });

  it("tolerates a trailing slash", () => {
    expect(parseCartPermalinkPath("/cart/111:2/")).toEqual([
      { variantId: "111", qty: 2 },
    ]);
  });

  it("clamps quantity to 1..99", () => {
    expect(parseCartPermalinkPath("/cart/111:0")[0].qty).toBe(1);
    expect(parseCartPermalinkPath("/cart/111:500")[0].qty).toBe(99);
  });

  it("returns [] for the bare cart page", () => {
    expect(parseCartPermalinkPath("/cart")).toEqual([]);
    expect(parseCartPermalinkPath("/cart/")).toEqual([]);
  });

  it("returns [] for saved-cart token URLs (/cart/c/...)", () => {
    expect(parseCartPermalinkPath("/cart/c/hWNChaoLa51slrDabfmr0oDA")).toEqual([]);
  });

  it("returns [] for malicious or malformed input", () => {
    expect(parseCartPermalinkPath("/cart/../../etc/passwd")).toEqual([]);
    expect(parseCartPermalinkPath("/cart/<script>alert(1)</script>")).toEqual([]);
    expect(parseCartPermalinkPath("/cart/abc:1")).toEqual([]);
    expect(parseCartPermalinkPath("/cart/111:1,bogus")).toEqual([]);
    expect(parseCartPermalinkPath(null)).toEqual([]);
    expect(parseCartPermalinkPath(undefined)).toEqual([]);
  });

  it("returns [] for non-cart paths", () => {
    expect(parseCartPermalinkPath("/products")).toEqual([]);
    expect(parseCartPermalinkPath("/")).toEqual([]);
  });
});
