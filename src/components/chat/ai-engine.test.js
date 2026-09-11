import { describe, expect, it } from "vitest";
import { getAIResponse } from "./ai-engine";

const CONTENTS_PROMPTS = [
  "What are the listed ingredients and exact net contents of Luxe Face Cream? Please give a product source link and say if the size in ounces or grams is not established by the published listing.",
  "What is the exact net weight or volume of Luxe Face Cream? Is that size published, or unknown?",
];

describe("source-limited product facts", () => {
  it.each(CONTENTS_PROMPTS)("answers the exact net-contents prompt directly: %s", (prompt) => {
    const response = getAIResponse(prompt);
    expect(response.source).toBe("regex");
    expect(response.text).toMatch(/net weight or volume.*unknown/i);
    expect(response.text).toMatch(/current product listing/i);
    expect(response.text).not.toMatch(/\$60|crown jewel|5\.0/);
    expect(response.sources).toEqual([{ label: "Luxe Face Cream product listing", href: "/product/luxe-face-cream" }]);
    expect(response.products).toEqual([]);
  });

  it("answers the ingredients part from the listing without adding a formulation or size", () => {
    const { text } = getAIResponse(CONTENTS_PROMPTS[0]);
    for (const ingredient of ["Grass-fed tallow", "Manuka honey", "Bakuchiol", "Rosehip oil", "Tamanu oil", "Sea buckthorn"]) {
      expect(text.toLowerCase()).toContain(ingredient.toLowerCase());
    }
    expect(text).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:oz|ounces?|grams?|g|ml)\b/i);
  });

  it("does not substitute the price or a user-suggested weight for net contents", () => {
    const response = getAIResponse("Is Luxe Face Cream 60 grams, or what is the jar size?");
    expect(response.text).toMatch(/unknown/i);
    expect(response.text).not.toContain("60");
  });

  it("uses the named serum's actual ingredients instead of generic tallow claims", () => {
    const response = getAIResponse("What are the listed ingredients of Hyaluronic Acid Serum?");
    expect(response.text).toContain("Hyaluronic acid, Aloe vera, Frankincense, Helichrysum, Lemon");
    expect(response.text).not.toMatch(/grass-fed tallow|pregnan|safest|no preservatives/i);
    expect(response.sources).toEqual([{ label: "Hyaluronic Acid Serum product listing", href: "/product/hydrabloom-botanical-serum" }]);
  });

  it("supports a familiar product alias with the correct source and explicit unknown", () => {
    const response = getAIResponse("How many ounces are in Blue Tansy?");
    expect(response.text).toMatch(/unknown/i);
    expect(response.sources).toEqual([{ label: "Blue Tansy product listing", href: "/product/blue-tansy-whipped-face-cream" }]);
  });

  it.each([
    "What is the exact net weight of a Mystery Face Cream?",
    "What is the net weight of Luxe Face Cream and Blue Tansy?",
  ])("asks for an unambiguous product instead of guessing: %s", (prompt) => {
    const response = getAIResponse(prompt);
    expect(response.text).toMatch(/which product/i);
    expect(response.products).toEqual([]);
    expect(response.sources || []).toEqual([]);
  });

  it("keeps recipe and unrelated size wording out of the fact route", () => {
    expect(getAIResponse("Give me the formula and ingredients to make Luxe Face Cream at home").text).toMatch(/don't share product recipes/i);
    expect(getAIResponse("Does Luxe Face Cream reduce pore size?").text).not.toMatch(/net weight|unknown/i);
    expect(getAIResponse("How much Luxe Face Cream should I apply?").text).not.toMatch(/net weight|unknown/i);
  });
});
