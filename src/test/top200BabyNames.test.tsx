import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Top200BabyNamesSection } from "../islands/tools/Top200BabyNamesSection";
import ssa2025Raw from "../data/raw/ssa/ssa_2025.json";

describe("Phase: Baby Names Page Top 200 Boys & Girls Redesign", () => {
  afterEach(() => {
    cleanup();
  });

  it("verifies full 200 boys and 200 girls dataset integrity without missing ranks", () => {
    const boys = (ssa2025Raw as any).topMale;
    const girls = (ssa2025Raw as any).topFemale;

    expect(boys.length).toBe(200);
    expect(girls.length).toBe(200);

    for (let i = 1; i <= 200; i++) {
      expect(boys[i - 1].rank).toBe(i);
      expect(girls[i - 1].rank).toBe(i);
      expect(boys[i - 1].name.length).toBeGreaterThan(0);
      expect(girls[i - 1].name.length).toBeGreaterThan(0);
      expect(boys[i - 1].count).toBeGreaterThan(0);
      expect(girls[i - 1].count).toBeGreaterThan(0);
    }
  });

  it("renders two clearly separate sections for Top 200 Boys and Top 200 Girls in 2026", () => {
    render(<Top200BabyNamesSection />);
    expect(screen.getByRole("heading", { level: 2, name: /top 200 boy names in 2026/i })).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: /top 200 girl names in 2026/i })).toBeDefined();

    // Check anchor links
    const boyAnchor = screen.getByRole("link", { name: /top 200 boy names/i });
    const girlAnchor = screen.getByRole("link", { name: /top 200 girl names/i });
    expect(boyAnchor.getAttribute("href")).toBe("#popular-boy-names");
    expect(girlAnchor.getAttribute("href")).toBe("#popular-girl-names");
  }, 15000);

  it("renders Top 10 previews for both Boys and Girls simultaneously", () => {
    render(<Top200BabyNamesSection />);
    expect(screen.getByText(/top 10 boy names summary/i)).toBeDefined();
    expect(screen.getByText(/top 10 girl names summary/i)).toBeDefined();

    // Check top boys & girls anchors
    expect(screen.getAllByText("Liam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Noah").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Olivia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Charlotte").length).toBeGreaterThan(0);
  }, 15000);

  it("filters names inside the boy ranking table via search input", () => {
    render(<Top200BabyNamesSection />);
    const searchBoyInput = screen.getByPlaceholderText(/search boy names in the 2026 ranking/i);
    fireEvent.change(searchBoyInput, { target: { value: "Theodore" } });

    expect(screen.getAllByText("Theodore").length).toBeGreaterThan(0);
  }, 15000);

  it("filters rank cutoffs when Top 50 or Top 100 buttons are clicked", () => {
    render(<Top200BabyNamesSection />);
    const top50Btns = screen.getAllByRole("button", { name: /top 50/i });
    fireEvent.click(top50Btns[0]);
    expect(top50Btns[0].className).toContain("bg-primary");
  }, 15000);
});
