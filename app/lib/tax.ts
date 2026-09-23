/**
 * A faithful port of OpenERP 7.0's account.tax.compute_all
 * (legacy/openerp-7.0/addons/account/account.py: compute_all, _compute, _unit_compute, _unit_compute_inv),
 * restricted to the tax types the modern system keeps: percent and fixed. Python-code taxes are refused.
 *
 * Legacy semantics preserved:
 *  - taxes apply in `sequence` order;
 *  - a percent tax computes on the running unit price; with `includeBaseAmount` its amount is added to the
 *    unit price the *next* tax computes on;
 *  - per tax, the amount is unit-amount × quantity rounded to the currency precision (Python 2.7 round:
 *    half away from zero), and totals are sums of those rounded amounts;
 *  - price-included taxes are backed out of the unit price first (compute_inv), then excluded taxes run on
 *    the tax-exclusive unit price.
 * Money is integer minor units; rates are decimal strings; nothing here uses floating point.
 */
import { applyRate, divRoundHalfUp, rateToPpm, RATE_SCALE } from "./money";

export type TaxType = "percent" | "fixed";
export type TaxUse = "sale" | "purchase" | "all";

export interface TaxDef {
  code: string;
  name: string;
  type: TaxType;
  /** decimal string: "0.15" for a 15 % tax, or a minor-unit amount for `fixed` ("500" = EUR 5.00 per unit) */
  amount: string;
  typeTaxUse: TaxUse;
  priceInclude: boolean;
  includeBaseAmount: boolean;
  sequence: number;
  active: boolean;
  /** account the collected/paid tax posts to */
  accountCode?: string;
  description?: string;
}

export interface TaxLineResult {
  code: string;
  name: string;
  /** unit price the tax computed on (minor units, may include earlier taxes) */
  baseUnitMinor: bigint;
  amountMinor: bigint;
  accountCode?: string;
}

export interface ComputeAllResult {
  /** total without taxes */
  totalMinor: bigint;
  /** total with taxes */
  totalIncludedMinor: bigint;
  taxes: TaxLineResult[];
}

/** quantity is a decimal string ("3", "2.5"); returned as a scaled bigint with 6 decimals. */
function quantityScaled(quantity: string): bigint {
  return rateToPpm(quantity);
}

function mulQty(minor: bigint, qtyScaled: bigint): bigint {
  return divRoundHalfUp(minor * qtyScaled, RATE_SCALE);
}

/** _unit_compute: per-unit amounts in sequence, with include_base_amount stacking. Amounts are exact (scaled ×1e6). */
function unitCompute(taxes: TaxDef[], priceUnitMinor: bigint): { tax: TaxDef; unitAmountScaled: bigint; baseUnitMinor: bigint }[] {
  const out: { tax: TaxDef; unitAmountScaled: bigint; baseUnitMinor: bigint }[] = [];
  let cur = priceUnitMinor * RATE_SCALE; // scaled unit price
  for (const tax of taxes) {
    let amountScaled: bigint;
    if (tax.type === "percent") {
      amountScaled = divRoundHalfUp(cur * rateToPpm(tax.amount), RATE_SCALE);
    } else {
      amountScaled = rateToPpm(tax.amount); // fixed: minor units per unit, scaled
    }
    out.push({ tax, unitAmountScaled: amountScaled, baseUnitMinor: divRoundHalfUp(cur, RATE_SCALE) });
    if (tax.includeBaseAmount) cur += amountScaled;
  }
  return out;
}

/** _compute: amount = round(unit_amount × quantity, precision) per tax. */
function computeExcluded(taxes: TaxDef[], priceUnitMinor: bigint, qtyScaled: bigint): TaxLineResult[] {
  return unitCompute(taxes, priceUnitMinor).map(({ tax, unitAmountScaled, baseUnitMinor }) => ({
    code: tax.code,
    name: tax.description ? `${tax.description} - ${tax.name}` : tax.name,
    baseUnitMinor,
    amountMinor: divRoundHalfUp(unitAmountScaled * qtyScaled, RATE_SCALE * RATE_SCALE),
    accountCode: tax.accountCode,
  }));
}

/** _unit_compute_inv / compute_inv: back price-included taxes out of the unit price. */
function computeIncluded(taxes: TaxDef[], priceUnitMinor: bigint, qtyScaled: bigint): TaxLineResult[] {
  if (taxes.length === 0) return [];
  // Legacy: for percent taxes without include_base_amount, the exclusive price is price / (1 + Σ rates);
  // fixed taxes are subtracted first. Stacked (include_base_amount) included taxes are rare; treated in sequence.
  const reversed = [...taxes].reverse();
  let curScaled = priceUnitMinor * RATE_SCALE;
  let parentTot = 0n;
  for (const t of reversed) if (t.type === "percent" && !t.includeBaseAmount) parentTot += rateToPpm(t.amount);
  const results: TaxLineResult[] = [];
  for (const t of reversed) {
    if (t.type === "fixed" && !t.includeBaseAmount) curScaled -= rateToPpm(t.amount);
  }
  for (const t of reversed) {
    let amountScaled: bigint;
    if (t.type === "percent") {
      if (t.includeBaseAmount) {
        // amount such that base + amount = cur: amount = cur - cur/(1+rate)
        const rate = rateToPpm(t.amount);
        const base = divRoundHalfUp(curScaled * RATE_SCALE, RATE_SCALE + rate);
        amountScaled = curScaled - base;
        curScaled = base;
      } else {
        amountScaled = divRoundHalfUp(curScaled * rateToPpm(t.amount), RATE_SCALE + parentTot);
      }
    } else {
      amountScaled = rateToPpm(t.amount);
    }
    results.push({
      code: t.code,
      name: t.description ? `${t.description} - ${t.name}` : t.name,
      baseUnitMinor: divRoundHalfUp(curScaled, RATE_SCALE),
      amountMinor: divRoundHalfUp(amountScaled * qtyScaled, RATE_SCALE * RATE_SCALE),
      accountCode: t.accountCode,
    });
  }
  return results.reverse();
}

export function computeAll(taxes: TaxDef[], priceUnitMinor: bigint, quantity: string, forceExcluded = false): ComputeAllResult {
  const active = taxes.filter((t) => t.active).sort((a, b) => a.sequence - b.sequence);
  for (const t of active) {
    if ((t.type as string) === "code") throw new Error(`Tax ${t.code} is a Python-code tax; the modern system refuses runtime code in configuration`);
  }
  const qty = quantityScaled(quantity);
  let totalEx = mulQty(priceUnitMinor, qty);
  let totalIn = totalEx;
  const tin = forceExcluded ? [] : active.filter((t) => t.priceInclude);
  const tex = forceExcluded ? active : active.filter((t) => !t.priceInclude);
  const included = computeIncluded(tin, priceUnitMinor, qty);
  for (const r of included) totalEx -= r.amountMinor;
  // totlex_qty = totalex / quantity  (the tax-exclusive unit price)
  const unitEx = qty === 0n ? 0n : divRoundHalfUp(totalEx * RATE_SCALE, qty);
  const excluded = computeExcluded(tex, unitEx, qty);
  for (const r of excluded) totalIn += r.amountMinor;
  return { totalMinor: totalEx, totalIncludedMinor: totalIn, taxes: [...included, ...excluded] };
}
