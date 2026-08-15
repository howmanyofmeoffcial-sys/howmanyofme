import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { PopularBabyNamesSection } from "../islands/homepage/PopularBabyNamesSection";

describe("Phase: Homepage 2025 Popular Baby Names Redesign", () => {
  it("renders the 2025 heading, May 2026 release note, and AEO summary", () => {
    render(<PopularBabyNamesSection />);
    expect(screen.getByText(/popular baby names in 2025/i)).toBeDefined();
    expect(screen.getByText(/official ssa release \(may 2026\)/i)).toBeDefined();
    expect(screen.getAllByText("Liam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Olivia").length).toBeGreaterThan(0);
  });

  it("renders Top 30 Boy Names and Top 30 Girl Names simultaneously in separate editorial columns", () => {
    render(<PopularBabyNamesSection />);
    expect(screen.getByRole("heading", { level: 3, name: /top 30 boy names/i })).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: /top 30 girl names/i })).toBeDefined();

    // Verify Top 10 Boys
    expect(screen.getAllByText("Liam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Noah").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Oliver").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Theodore").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Henry").length).toBeGreaterThan(0);
    expect(screen.getAllByText("James").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Elijah").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mateo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("William").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lucas").length).toBeGreaterThan(0);

    // Verify Top 10 Girls
    expect(screen.getAllByText("Olivia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Charlotte").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Emma").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Amelia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sophia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Isabella").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Evelyn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sofia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Eliana").length).toBeGreaterThan(0);
  });

  it("displays recorded births metrics rather than living population estimates", () => {
    render(<PopularBabyNamesSection />);
    expect(screen.getByText(/20,818 births/i)).toBeDefined();
    expect(screen.getByText(/13,544 births/i)).toBeDefined();
  });

  it("provides clean CTA to browse all 200 names in /tools/baby-names", () => {
    render(<PopularBabyNamesSection />);
    const link = screen.getByRole("link", { name: /browse all 200 boys & girls/i });
    expect(link.getAttribute("href")).toBe("/tools/baby-names");
  });
});
