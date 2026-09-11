import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PRODUCTS } from "../../lib/constants";
import ProductDetail from "./ProductDetail";

const { addItem } = vi.hoisted(() => ({ addItem: vi.fn() }));
vi.mock("../../context/CartContext", () => ({ useCart: () => ({ addItem }) }));

function renderProduct() {
  const product = PRODUCTS[0];
  render(
    <MemoryRouter initialEntries={[`/product/${product.handle}`]}>
      <Routes>
        <Route path="/product/:handle" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>,
  );
  return product;
}

describe("product quantity", () => {
  beforeEach(() => addItem.mockClear());

  it("names both controls and exposes quantity changes to assistive technology", () => {
    renderProduct();
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toHaveAttribute("type", "button");
    const increase = screen.getByRole("button", { name: "Increase quantity" });
    expect(increase).toHaveAttribute("type", "button");
    const quantity = screen.getByRole("status", { name: "Quantity" });
    expect(quantity).toHaveAttribute("aria-live", "polite");
    expect(quantity).toHaveAttribute("aria-atomic", "true");
    expect(quantity).toHaveTextContent("1");
    fireEvent.click(increase);
    expect(quantity).toHaveTextContent("2");
  });

  it("keeps a minimum of one and updates the total and cart handoff", () => {
    const product = renderProduct();
    const decrease = screen.getByRole("button", { name: "Decrease quantity" });
    const increase = screen.getByRole("button", { name: "Increase quantity" });
    const quantity = screen.getByRole("status", { name: "Quantity" });
    fireEvent.click(decrease);
    expect(quantity).toHaveTextContent("1");
    fireEvent.click(increase);
    fireEvent.click(increase);
    fireEvent.click(decrease);
    expect(quantity).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: `Add to Cart — $${(product.price * 2).toFixed(2)}` }));
    expect(addItem).toHaveBeenCalledExactlyOnceWith(product, 2);
    fireEvent.click(decrease);
    fireEvent.click(decrease);
    expect(quantity).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: `Add to Cart — $${product.price.toFixed(2)}` })).toBeInTheDocument();
  });
});
