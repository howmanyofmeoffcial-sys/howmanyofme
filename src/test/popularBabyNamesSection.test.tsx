import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PopularBabyNamesSection } from "../islands/homepage/PopularBabyNamesSection";
import ssa2025Raw from "../data/raw/ssa/ssa_2025.json";

describe("Phase: Homepage 2025 Popular Baby Names Section", () => {
  it("renders the 2025 heading and SSA release badge", () => {
    render(<PopularBabyNamesSection />);
    expect(screen.getByText(/popular baby names in 2025/i)).toBeDefined();
    expect(screen.getByText(/official ssa release/i)).toBeDefined();
  });

  it("renders top 30 boys by default with verified official rankings", () => {
    render(<PopularBabyNamesSection />);
    // Check Top 5 Boys benchmarks
    expect(screen.getByText("Liam")).toBeDefined();
    expect(screen.getByText("Noah")).toBeDefined();
    expect(screen.getByText("Oliver")).toBeDefined();
    expect(screen.getByText("Theodore")).toBeDefined();
    expect(screen.getByText("Henry")).toBeDefined();
    expect(screen.getByText("Luca")).toBeDefined();
    expect(screen.getByText("Isaac")).toBeDefined();

    // Check birth count formatting
    expect(screen.getByText(/20,818 births/i)).toBeDefined();
  });

  it("allows switching to Girls tab and displays top 30 girls", () => {
    render(<PopularBabyNamesSection />);
    const girlsTab = screen.getByRole("tab", { name: /girls/i });
    fireEvent.click(girlsTab);

    // Check Top 5 Girls benchmarks
    expect(screen.getByText("Olivia")).toBeDefined();
    expect(screen.getByText("Charlotte")).toBeDefined();
    expect(screen.getByText("Emma")).toBeDefined();
    expect(screen.getByText("Amelia")).toBeDefined();
    expect(screen.getByText("Sophia")).toBeDefined();
    expect(screen.getByText("Nova")).toBeDefined();

    // Check birth count formatting
    expect(screen.getByText(/13,544 births/i)).toBeDefined();
  });

  it("provides accessible WAI-ARIA tab controls", () => {
    render(<PopularBabyNamesSection />);
    const boysTab = screen.getByRole("tab", { name: /boys/i });
    const girlsTab = screen.getByRole("tab", { name: /girls/i });

    expect(boysTab.getAttribute("aria-selected")).toBe("true");
    expect(girlsTab.getAttribute("aria-selected")).toBe("false");

    fireEvent.click(girlsTab);
    expect(boysTab.getAttribute("aria-selected")).toBe("false");
    expect(girlsTab.getAttribute("aria-selected")).toBe("true");
  });

  it("contains discovery CTAs to baby-names directory and popularity checker", () => {
    render(<PopularBabyNamesSection />);
    const allNamesLink = screen.getByRole("link", { name: /browse all 200 baby names/i });
    const checkerLink = screen.getByRole("link", { name: /check a name's popularity/i });

    expect(allNamesLink.getAttribute("href")).toBe("/tools/baby-names");
    expect(checkerLink.getAttribute("href")).toBe("/tools/popularity-checker");
  });
});
