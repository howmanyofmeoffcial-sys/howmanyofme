import { describe, it, expect } from "vitest";
import {
  resolveFirstName,
  resolveSurname,
  resolveFullName,
} from "../lib/name-resolver";

describe("Phase 22: Unified Name Resolver & Data Model", () => {
  // 1. Verified First Names
  it("resolves James with high confidence and verified SSA & Census data", () => {
    const res = resolveFirstName("James");
    expect(res.status).toBe("verified");
    expect(res.confidence).toBe("high");
    expect(res.availability.ssaHistorical).toBe(true);
    expect(res.availability.censusFirstName).toBe(true);
    expect(res.ssa).not.toBeNull();
    expect(res.ssa?.totalBirths).toBeGreaterThan(4000000);
    expect(res.derivedLivingBearers.metricType).toBe("derived");
  });

  it("resolves Liam with SSA 2025 rank #1 male data", () => {
    const res = resolveFirstName("Liam");
    expect(res.status).toBe("verified");
    expect(res.availability.ssa2025).toBe(true);
    expect(res.latestSsa).not.toBeNull();
    expect(res.latestSsa?.rank).toBe(1);
    expect(res.latestSsa?.sex).toBe("M");
  });

  it("resolves Olivia with SSA 2025 rank #1 female data", () => {
    const res = resolveFirstName("Olivia");
    expect(res.status).toBe("verified");
    expect(res.availability.ssa2025).toBe(true);
    expect(res.latestSsa?.rank).toBe(1);
    expect(res.latestSsa?.sex).toBe("F");
  });

  it("resolves José handling accents and diacritics", () => {
    const res = resolveFirstName("José");
    expect(res.status).toBe("verified");
    expect(res.displayName).toBe("José");
    expect(res.derivedLivingBearers.count).toBeGreaterThan(0);
  });

  // 2. Modelled Unindexed Names
  it("resolves Rahul transparently as a modelled estimate without fake SSA records", () => {
    const res = resolveFirstName("Rahul");
    expect(res.status).toBe("modelled");
    expect(res.confidence).toBe("low");
    expect(res.availability.ssaHistorical).toBe(false);
    expect(res.availability.censusFirstName).toBe(false);
    expect(res.ssa).toBeNull();
    expect(res.census).toBeNull();
    expect(res.derivedLivingBearers.metricType).toBe("estimated");
    expect(res.derivedLivingBearers.count).toBeGreaterThan(0);
  });

  it("resolves Priya, Muhammad, and Yuki consistently", () => {
    const priya = resolveFirstName("Priya");
    const yuki = resolveFirstName("Yuki");
    const muhammad = resolveFirstName("Muhammad");

    expect(priya.status).toBe("modelled");
    expect(yuki.status).toBe("modelled");
    expect(muhammad.status).toBe("verified");
  });

  // 3. Surname Resolution
  it("resolves Smith with observed Census 2020 frequency", () => {
    const res = resolveSurname("Smith");
    expect(res.status).toBe("verified");
    expect(res.availability.censusSurname).toBe(true);
    expect(res.censusFrequency?.count).toBeGreaterThan(2000000);
    expect(res.censusFrequency?.metricType).toBe("observed");
  });

  it("resolves Garcia with observed Census frequency", () => {
    const res = resolveSurname("Garcia");
    expect(res.status).toBe("verified");
    expect(res.availability.censusSurname).toBe(true);
    expect(res.censusFrequency?.metricType).toBe("observed");
    expect(res.censusFrequency?.count).toBeGreaterThan(1000000);
  });

  it("resolves Patel with modelled frequency estimate when outside top-50 index", () => {
    const res = resolveSurname("Patel");
    expect(res.status).toBe("modelled");
    expect(res.availability.censusSurname).toBe(false);
    expect(res.censusFrequency).not.toBeNull();
    expect(res.censusFrequency?.metricType).toBe("estimated");
  });

  // 4. Full Name Joint Probability Resolution
  it("resolves James Smith under statistical independence with high confidence", () => {
    const res = resolveFullName("James", "Smith");
    expect(res.status).toBe("verified");
    expect(res.confidence).toBe("high");
    expect(res.jointEstimate).not.toBeNull();
    expect(res.jointEstimate?.estimatedPeople).toBeGreaterThan(10000);
    expect(res.jointEstimate?.metricType).toBe("derived");
  });

  it("resolves Rahul Patel with modelled first name and observed surname", () => {
    const res = resolveFullName("Rahul", "Patel");
    expect(res.status).toBe("modelled");
    expect(res.confidence).toBe("low");
    expect(res.jointEstimate).not.toBeNull();
    expect(res.jointEstimate?.estimatedPeople).toBeGreaterThan(0);
  });

  // 5. Invalid Input
  it("handles invalid inputs with clear error descriptions", () => {
    const res = resolveFirstName("12345");
    expect(res.status).toBe("invalid");
    expect(res.derivedLivingBearers.metricType).toBe("unavailable");
  });
});
