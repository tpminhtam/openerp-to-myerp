import { describe, expect, it } from "vitest";
import { replay, type ReplayInvoice } from "./replay";
import { applyEdit, diffTrees, mergeTrees, validateTree, type ConfigTree } from "./config";
import type { TaxDef } from "./tax";

const s15: TaxDef = { code: "S15", name: "Sale VAT 15%", type: "percent", amount: "0.15", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: false, sequence: 10, active: true };
const s6: TaxDef = { ...s15, code: "S6", name: "Sale VAT 6%", amount: "0.06" };
const base: ConfigTree = { taxes: { S15: s15, S6: s6 } };
const invoices: ReplayInvoice[] = [
  { number: "INV/1", kind: "customer", partner: "Agrolait", date: "2026-01-05", state: "open", currency: "EUR", lines: [{ lineNo: 1, quantity: "2", priceUnitMinor: 10000, taxCodes: ["S15"] }], storedTaxMinor: 3000 },
  { number: "INV/2", kind: "customer", partner: "Delta PC", date: "2026-02-05", state: "paid", currency: "EUR", lines: [{ lineNo: 1, quantity: "1", priceUnitMinor: 5000, taxCodes: ["S6"] }], storedTaxMinor: 300 },
  { number: "INV/3", kind: "customer", partner: "Zenith", date: "2026-03-05", state: "open", currency: "EUR", lines: [{ lineNo: 1, quantity: "3", priceUnitMinor: 1000, taxCodes: ["S15"] }, { lineNo: 2, quantity: "1", priceUnitMinor: 1000, taxCodes: ["S6"] }], storedTaxMinor: 510 },
];

describe("impact replay", () => {
  it("A: no edit → nothing moves and every stored tax is reproduced", () => {
    const r = replay(base, base, invoices);
    expect(r.headline).toBe("No change: 3 invoices replayed, none moved.");
    expect(r.parity).toEqual([]);
  });
  it("B: S15 0.15 → 0.16 moves only the invoices that use it, by 1 % of their base", () => {
    const headTree = applyEdit(base, "taxes.S15.amount", "0.16");
    const r = replay(base, headTree, invoices);
    expect(r.headline).toBe("2 of 3 invoices move by EUR 2.30.");
    expect(r.byTax[0]).toMatchObject({ taxCode: "S15", invoices: 2, delta: 230 });
    expect(r.movers[0].number).toBe("INV/1");
  });
  it("D: a rename moves no money", () => {
    const r = replay(base, applyEdit(base, "taxes.S15.name", "Standard rate"), invoices);
    expect(r.invoicesChanged).toBe(0);
    expect(diffTrees(base, applyEdit(base, "taxes.S15.name", "Standard rate"))).toEqual([{ path: "taxes.S15.name", before: "Sale VAT 15%", after: "Standard rate" }]);
  });
  it("C: config-loads fails when a referenced tax is deactivated or a rate is out of range", () => {
    const off = applyEdit(base, "taxes.S6.active", false);
    expect(validateTree(off, new Set(["S6"]))).toEqual(["tax S6 is referenced by open invoices but is inactive"]);
    expect(validateTree(applyEdit(base, "taxes.S15.amount", "1.5"), new Set())).toContain("S15: percent amount must be in [0, 1)");
    expect(() => applyEdit(base, "taxes.NOPE.amount", "0.1")).toThrow(/No tax with code NOPE/);
  });
  it("three-way merge: different fields merge, the same field conflicts", () => {
    const ours = applyEdit(base, "taxes.S15.amount", "0.16");
    const theirs = applyEdit(base, "taxes.S15.name", "Standard 15");
    const m = mergeTrees(base, ours, theirs);
    expect(m.clean).toBe(true);
    expect(m.tree.taxes.S15).toMatchObject({ amount: "0.16", name: "Standard 15" });
    const conflict = mergeTrees(base, ours, applyEdit(base, "taxes.S15.amount", "0.17"));
    expect(conflict.conflicts).toEqual(["taxes.S15.amount"]);
  });
});
