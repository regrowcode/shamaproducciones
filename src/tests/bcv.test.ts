import { describe, it, expect } from "vitest";
import { usdToBs, bsToUsd, formatUsd, formatBs, DEFAULT_BCV_RATE } from "../lib/bcv";

describe("BCV Currency Conversion", () => {
  it("converts USD to Bolívares correctly based on rate", () => {
    const rate = 50.0;
    const usd = 10;
    expect(usdToBs(usd, rate)).toBe(500.0);
  });

  it("handles decimal precision in conversions", () => {
    const rate = 52.45;
    const usd = 35;
    expect(usdToBs(usd, rate)).toBe(1835.75);
  });

  it("converts Bolívares to USD correctly", () => {
    const rate = 50.0;
    const bs = 500;
    expect(bsToUsd(bs, rate)).toBe(10.0);
  });

  it("returns 0 for negative amounts", () => {
    expect(usdToBs(-10, 50)).toBe(0);
    expect(bsToUsd(-100, 50)).toBe(0);
  });

  it("formats USD currency string properly", () => {
    const formatted = formatUsd(80);
    expect(formatted).toContain("80.00");
  });

  it("formats Bolívares currency string properly", () => {
    const formatted = formatBs(1500);
    expect(formatted).toContain("1.500,00");
  });
});
