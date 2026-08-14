import { describe, it, expect } from "vitest";
import { resolveNameSearch } from "../lib/estimation/resolveNameSearch";
import { estimateFirstName } from "../lib/estimation/estimateFirstName";
import { getNameRecord } from "../lib/names/getNameRecord";
import { validateName } from "../lib/names/validateName";
import { getNameData } from "../data/nameData";

describe("Phase A: Name Estimation Engine & Full-Name Resolver", () => {
  // 1. Verified First-Name Lookup
  it("resolves verified first names with source-backed data and canonical profile URLs", () => {
    const result = resolveNameSearch({ firstName: "David" });

    expect(result.mode).toBe("verified");
    expect(result.queryType).toBe("first-name");
    expect(result.firstName).toBe("David");
    expect(result.estimatedPeople).toBeGreaterThan(100000);
    expect(result.confidence).toBe("high");
    expect(result.sourceType).toBe("official-data");
    expect(result.userFacingLabel).toBe("Source-backed profile");
    expect(result.detailedProfileUrl).toBe("/name/David");
    expect(result.supportingData?.firstName?.isIndexed).toBe(true);
  });

  // 2. Modelled First-Name Lookup
  it("resolves unindexed valid names into statistical estimates without fake profile URLs", () => {
    const result = resolveNameSearch({ firstName: "Rahul" });

    expect(result.mode).toBe("modelled");
    expect(result.queryType).toBe("first-name");
    expect(result.firstName).toBe("Rahul");
    expect(result.estimatedPeople).toBeGreaterThan(0);
    expect(result.confidence).toBe("moderate");
    expect(result.sourceType).toBe("derived-model");
    expect(result.userFacingLabel).toBe("Statistical estimate");
    expect(result.detailedProfileUrl).toBeNull(); // Must not generate fake URLs
    expect(result.warnings?.length).toBeGreaterThan(0);
  });

  // 3. Verified Full-Name Lookup
  it("resolves indexed canonical full-name combinations with source-backed profile data", () => {
    const result = resolveNameSearch({ firstName: "David", lastName: "Smith" });

    expect(result.mode).toBe("verified");
    expect(result.queryType).toBe("full-name");
    expect(result.firstName).toBe("David");
    expect(result.lastName).toBe("Smith");
    expect(result.displayName).toBe("David Smith");
    expect(result.estimatedPeople).toBeGreaterThan(0);
    expect(result.sourceType).toBe("derived-model");
    expect(result.userFacingLabel).toBe("Source-backed profile");
    expect(result.detailedProfileUrl).toBe("/people/david-smith");
    expect(result.supportingData?.firstName?.isIndexed).toBe(true);
    expect(result.supportingData?.lastName?.isIndexed).toBe(true);
  });

  // 4. Modelled Full-Name Lookup
  it("resolves unindexed full-name combinations using joint independence model", () => {
    const result = resolveNameSearch({ firstName: "Rahul", lastName: "Sharma" });

    expect(result.mode).toBe("modelled");
    expect(result.queryType).toBe("full-name");
    expect(result.firstName).toBe("Rahul");
    expect(result.lastName).toBe("Sharma");
    expect(result.displayName).toBe("Rahul Sharma");
    expect(result.estimatedPeople).toBeGreaterThanOrEqual(0);
    expect(result.sourceType).toBe("derived-model");
    expect(result.userFacingLabel).toBe("Statistical estimate");
    expect(result.detailedProfileUrl).toBeNull(); // Must not create arbitrary pages
    expect(result.warnings?.length).toBeGreaterThan(0);
  });

  // 5. Space-Separated Single Input Handling
  it("automatically resolves space-separated full names in the first-name field", () => {
    const result = resolveNameSearch({ firstName: "David Smith" });

    expect(result.queryType).toBe("full-name");
    expect(result.firstName).toBe("David");
    expect(result.lastName).toBe("Smith");
    expect(result.mode).toBe("verified");
  });

  // 6. Invalid Inputs
  it("rejects empty, numerical, URL, and spam strings with appropriate invalid modes", () => {
    const emptyResult = resolveNameSearch({ firstName: "" });
    expect(emptyResult.mode).toBe("invalid");
    expect(emptyResult.estimatedPeople).toBeNull();
    expect(emptyResult.userFacingLabel).toBe("Invalid input");

    const numberResult = resolveNameSearch({ firstName: "123456" });
    expect(numberResult.mode).toBe("invalid");
    expect(numberResult.errorReason).toContain("cannot contain numbers");

    const urlResult = resolveNameSearch({ firstName: "https://spam.com" });
    expect(urlResult.mode).toBe("invalid");

    const spamResult = resolveNameSearch({ firstName: "aaaaaaa" });
    expect(spamResult.mode).toBe("invalid");
  });

  // 7. Unicode Name Support
  it("supports international Unicode names correctly", () => {
    const joseValidation = validateName("José");
    expect(joseValidation.isValid).toBe(true);
    expect(joseValidation.normalized).toBe("José");

    const mariaEstimate = estimateFirstName("María");
    expect(mariaEstimate.mode).toBe("verified");
    expect(mariaEstimate.firstName).toBe("Maria");

    const zoeValidation = validateName("Zoë");
    expect(zoeValidation.isValid).toBe(true);

    const sorenValidation = validateName("Søren");
    expect(sorenValidation.isValid).toBe(true);

    const weiValidation = validateName("Wei");
    expect(weiValidation.isValid).toBe(true);
  });

  // 8. Hyphenated and Apostrophe Names
  it("properly validates and normalizes hyphenated and apostrophe names", () => {
    const hyphenated = validateName("Anne-Marie");
    expect(hyphenated.isValid).toBe(true);
    expect(hyphenated.normalized).toBe("Anne-Marie");

    const apostrophe = validateName("O'Connor");
    expect(apostrophe.isValid).toBe(true);
    expect(apostrophe.normalized).toBe("O'Connor");

    const minJun = validateName("Min-jun");
    expect(minJun.isValid).toBe(true);
  });

  // 9. DATA SAFETY & NO FABRICATED RANDOM FALLBACK TEST
  it("strictly enforces zero fabricated statistics for unindexed names", () => {
    const unknownName = "Xyloqwerty";
    const officialLookup = getNameRecord(unknownName);
    expect(officialLookup).toBeNull();

    const dataResult = getNameData(unknownName);
    // Must NOT contain fake rank, fake origin, fake meaning, or fake decade popularity
    expect(dataResult.rank).toBe(0);
    expect(dataResult.origin).not.toBe("Traditional");
    expect(dataResult.meaning).not.toBe("A name of enduring significance");
    expect(Object.keys(dataResult.decade_popularity).length).toBe(0);

    const estimatedResult = estimateFirstName(unknownName);
    expect(estimatedResult.mode).toBe("modelled");
    expect(estimatedResult.supportingData?.firstName?.rank).toBeNull();
    expect(estimatedResult.supportingData?.firstName?.gender).toBeNull();
    expect(estimatedResult.detailedProfileUrl).toBeNull();
  });
});
