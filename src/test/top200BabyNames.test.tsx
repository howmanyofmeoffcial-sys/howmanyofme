import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Top200BabyNamesSection } from "../islands/tools/Top200BabyNamesSection";
import ssa2025Raw from "../data/raw/ssa/ssa_2025.json";

describe("Phase: Baby Names Page Top 200 Boys & Girls Directory", () => {
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

  it("renders the 2025 heading and Top 10 preview cards", () => {
    render(<Top200BabyNamesSection />);
    expect(screen.getByText(/popular baby names in 2025/i)).toBeDefined();
    expect(screen.getByText(/top 10 baby boy names preview/i)).toBeDefined();

    // Check top boys anchors
    expect(screen.getAllByText("Liam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Noah").length).toBeGreaterThan(0);
  });

  it("allows switching to Top 200 Girls tab and renders Olivia at rank #1", () => {
    render(<Top200BabyNamesSection />);
    const girlsTab = screen.getByRole("tab", { name: /top 200 girls/i });
    fireEvent.click(girlsTab);

    expect(screen.getByText(/top 10 baby girl names preview/i)).toBeDefined();
    expect(screen.getAllByText("Olivia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Charlotte").length).toBeGreaterThan(0);
  });

  it("filters names inside the table via search input", () => {
    render(<Top200BabyNamesSection />);
    const searchInput = screen.getByPlaceholderText(/filter boy names in this ranking/i);
    fireEvent.change(searchInput, { target: { value: "Theodore" } });

    expect(screen.getAllByText("Theodore").length).toBeGreaterThan(0);
  });

  it("filters rank cutoffs when Top 50 or Top 100 buttons are clicked", () => {
    render(<Top200BabyNamesSection />);
    const top50Btn = screen.getByRole("button", { name: /top 50/i });
    fireEvent.click(top50Btn);
    expect(top50Btn.className).toContain("bg-primary");
  });
});
