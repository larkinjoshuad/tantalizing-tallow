import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TallowExpertChat from "./TallowExpertChat";

const { addItem } = vi.hoisted(() => ({ addItem: vi.fn() }));
vi.mock("../../context/CartContext", () => ({ useCart: () => ({ addItem }) }));

describe("TallowExpert product facts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn(() => { throw new Error("No external calls in this test"); }));
    Element.prototype.scrollIntoView = vi.fn();
    addItem.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("gives the composer and send control descriptive accessible names", () => {
    render(<TallowExpertChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open TallowExpert chat" }));
    expect(screen.getByRole("textbox", { name: "Message TallowExpert" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toHaveAttribute("type", "button");
  });

  it("renders direct answers and usable product links for both production-baseline prompts without provider or cart calls", async () => {
    render(<TallowExpertChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open TallowExpert chat" }));
    const composer = screen.getByRole("textbox");
    const prompts = [
      "What are the listed ingredients and exact net contents of Luxe Face Cream? Please give a product source link and say if the size in ounces or grams is not established by the published listing.",
      "What is the exact net weight or volume of Luxe Face Cream? Is that size published, or unknown?",
    ];
    for (const prompt of prompts) {
      fireEvent.change(composer, { target: { value: prompt } });
      fireEvent.keyDown(composer, { key: "Enter" });
      await act(async () => { await vi.runAllTimersAsync(); });
    }
    expect(screen.getAllByText(/is unknown from the current product listing/i)).toHaveLength(2);
    const links = screen.getAllByRole("link", { name: "Luxe Face Cream product listing" });
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute("href", "/product/luxe-face-cream");
    expect(composer).toHaveValue("");
    expect(fetch).not.toHaveBeenCalled();
    expect(addItem).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
  });
});
