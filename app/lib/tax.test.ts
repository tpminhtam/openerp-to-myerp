import { describe, expect, it } from "vitest";
import { computeAll, type TaxDef } from "./tax";
import { formatMoney, rateToPpm } from "./money";

const sale15: TaxDef = { code: "S15", name: "Sale VAT 15%", type: "percent", amount: "0.15", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: false, sequence: 1, active: true };
const sale6: TaxDef = { ...sale15, code: "S6", name: "Sale VAT 6%", amount: "0.06" };
const eco: TaxDef = { code: "ECO", name: "Eco levy 2% (in base)", type: "percent", amount: "0.02", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: true, sequence: 0, active: true };
const fixed: TaxDef = { code: "FX", name: "Fixed EUR 1.00 per unit", type: "fixed", amount: "100", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: false, sequence: 2, active: true };
const inc15: TaxDef = { ...sale15, code: "S15I", name: "Sale VAT 15% (included)", priceInclude: true };

describe("compute_all port (legacy account.tax semantics)", () => {
  it("percent: unit × qty × rate, rounded half-up per tax", () => {
    // 3 × EUR 33.33 at 15 %: legacy round(4.9995 × 3, 2) = round(14.9985, 2) = 15.00
    const r = computeAll([sale15], 3333n, "3");
    expect(r.totalMinor).toBe(9999n);
    expect(r.taxes[0].amountMinor).toBe(1500n);
    expect(r.totalIncludedMinor).toBe(11499n);
  });
  it("two independent taxes both compute on the same base", () => {
    const r = computeAll([sale15, sale6], 10000n, "1");
    expect(r.taxes.map((t) => t.amountMinor)).toEqual([1500n, 600n]);
    expect(r.totalIncludedMinor).toBe(12100n);
  });
  it("include_base_amount stacks: the next tax computes on price + earlier tax", () => {
    // eco 2 % on 100.00 = 2.00; VAT 15 % on 102.00 = 15.30
    const r = computeAll([eco, sale15], 10000n, "1");
    expect(r.taxes.map((t) => [t.code, t.amountMinor])).toEqual([["ECO", 200n], ["S15", 1530n]]);
    expect(r.totalIncludedMinor).toBe(11730n);
  });
  it("fixed tax is per unit times quantity", () => {
    const r = computeAll([fixed], 5000n, "4");
    expect(r.taxes[0].amountMinor).toBe(400n);
  });
  it("price-included VAT is backed out of the price", () => {
    // 115.00 incl. 15 %: base 100.00, tax 15.00
    const r = computeAll([inc15], 11500n, "1");
    expect(r.totalMinor).toBe(10000n);
    expect(r.taxes[0].amountMinor).toBe(1500n);
    expect(r.totalIncludedMinor).toBe(11500n);
  });
  it("force_excluded treats an included tax as excluded", () => {
    const r = computeAll([inc15], 10000n, "1", true);
    expect(r.totalIncludedMinor).toBe(11500n);
  });
  it("sequence orders taxes regardless of array order", () => {
    const r = computeAll([sale15, eco], 10000n, "1");
    expect(r.taxes.map((t) => t.code)).toEqual(["ECO", "S15"]);
  });
  it("inactive taxes are skipped and Python-code taxes are refused", () => {
    expect(computeAll([{ ...sale15, active: false }], 10000n, "1").taxes).toHaveLength(0);
    expect(() => computeAll([{ ...sale15, type: "code" as never }], 10000n, "1")).toThrow(/Python-code/);
  });
  it("rounding is half away from zero, as Python 2.7 round()", () => {
    // 0.5 cent cases: 1.00 × 0.125 = 0.125 -> 0.13
    const r = computeAll([{ ...sale15, amount: "0.125" }], 100n, "1");
    expect(r.taxes[0].amountMinor).toBe(13n);
  });
  it("money formatting", () => {
    expect(formatMoney(481240, "EUR")).toBe("EUR 4,812.40");
    expect(formatMoney(-5, "EUR")).toBe("-EUR 0.05");
    expect(rateToPpm("0.15")).toBe(150000n);
  });
});
