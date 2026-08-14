import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import NameSearchHero from "../islands/NameSearchHero";
import { resolveNameSearch } from "../lib/estimation/resolveNameSearch";

describe("Phase B: Homepage Name Checker UX & Inline Results", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // 1. Direct resolver check
  it("resolves unindexed names correctly into modelled result mode", () => {
    const res = resolveNameSearch({ firstName: "Rahul" });
    expect(res.mode).toBe("modelled");
    expect(res.displayName).toBe("Rahul");
    expect(res.userFacingLabel).toBe("Statistical estimate");
    expect(res.detailedProfileUrl).toBeNull();
  });

  // 2. First Name Search (Verified)
  it("renders verified first-name demographic results inline on submit without redirect", async () => {
    const { container, getByLabelText, getByRole, getByText } = render(<NameSearchHero />);
    const input = getByLabelText("First Name (or Full Name)");
    fireEvent.change(input, { target: { value: "David" } });
    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelector("h3")?.textContent).toBe("David");
      expect(getByText(/source-backed profile/i)).toBeDefined();
      expect(getByText(/view detailed profile/i)).toBeDefined();
    });

    const link = getByRole("link", { name: /view detailed profile/i });
    expect(link.getAttribute("href")).toBe("/name/David");
  });

  // 3. First Name Search (Modelled)
  it("renders modelled statistical estimate for unindexed names without fake profile URLs", async () => {
    const { container, getAllByText } = render(<NameSearchHero />);
    const input = container.querySelector<HTMLInputElement>("#first-name-input")!;
    fireEvent.change(input, { target: { value: "Zendaya" } });
    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelector("h3")?.textContent).toBe("Zendaya");
      expect(getAllByText(/statistical estimate/i).length).toBeGreaterThan(0);
      expect(container.querySelector("a[href='/name/Zendaya']")).toBeNull();
      expect(container.querySelector("a[href*='view detailed']")).toBeNull();
    });
  });

  // 4. Full Name Mode & Search
  it("allows switching to full-name mode and checking full-name combinations inline", async () => {
    const { container, getByRole, getByText } = render(<NameSearchHero />);
    const fullNameToggle = getByRole("button", { name: /full name/i });
    fireEvent.click(fullNameToggle);

    const firstInput = container.querySelector("#first-name-input")!;
    const lastInput = container.querySelector("#last-name-input")!;

    fireEvent.change(firstInput, { target: { value: "David" } });
    fireEvent.change(lastInput, { target: { value: "Smith" } });

    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelector("h3")?.textContent).toBe("David Smith");
      expect(getByText(/full name analysis/i)).toBeDefined();
      expect(getByText(/surname signal/i)).toBeDefined();
    });
  });

  // 5. Unicode Names
  it("supports Unicode names like José without stripping diacritics", async () => {
    const { container, getByLabelText, getByText } = render(<NameSearchHero />);
    const input = getByLabelText("First Name (or Full Name)");
    fireEvent.change(input, { target: { value: "José" } });
    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(getByText(/source-backed profile/i)).toBeDefined();
    });
  });

  // 6. Check Another Name / Reset
  it("resets inline results when 'Check Another Name' is clicked", async () => {
    const { container, getByLabelText, getByRole, queryByText } = render(<NameSearchHero />);
    const input = getByLabelText("First Name (or Full Name)");
    fireEvent.change(input, { target: { value: "Mary" } });
    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelector("h3")?.textContent).toBe("Mary");
    });

    const resetBtn = getByRole("button", { name: /check another name/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(queryByText(/estimated u\.s\. living bearers/i)).toBeNull();
    });
  });

  // 7. Example Chips
  it("triggers inline search when an example chip is clicked", async () => {
    const { container, getByRole, getByText } = render(<NameSearchHero />);
    const chip = getByRole("button", { name: "Olivia" });
    fireEvent.click(chip);

    await waitFor(() => {
      expect(container.querySelector("h3")?.textContent).toBe("Olivia");
      expect(getByText(/source-backed profile/i)).toBeDefined();
      expect(getByText(/view detailed profile/i)).toBeDefined();
    });
  });
});
