import { afterEach, describe, expect, it, vi } from "vitest";
import { getNameData } from "@/data/nameData";
import { detectGender, detectGenderAsync } from "@/lib/genderDetection";

describe("name result fallbacks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates safe, non-fabricated structure for unknown names", () => {
    const data = getNameData("meresfg");

    expect(data.name).toBe("Meresfg");
    expect(data.count).toBe(0);
    expect(data.rank).toBe(0);
    expect(data.origin).toBe("");
    expect(data.meaning).toBe("");
    expect(Object.keys(data.decade_popularity).length).toBe(0);
  });

  it("keeps local gender estimation when the API returns no gender", async () => {
    const local = detectGender("mapuii");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: false, fallback: true, gender: null }) }),
    );

    await expect(detectGenderAsync("mapuii")).resolves.toEqual(local);
  });

  it("uses the API only to override gender when a valid result is returned", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, gender: "male", confidence: 95, source: "genderize" }) }),
    );

    await expect(detectGenderAsync("dawnga")).resolves.toMatchObject({
      gender: "male",
      confidence: 95,
      source: "genderize",
    });
  });
});
