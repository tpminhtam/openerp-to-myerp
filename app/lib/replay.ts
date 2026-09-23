/** The impact check: replay every invoice's lines through two configurations and report the money that moves. Pure. */
import { computeAll, type TaxDef } from "./tax";
import type { ConfigTree } from "./config";
import { formatMoney } from "./money";

export interface ReplayInvoice {
  number: string; kind: string; partner: string; date: string; state: string; currency: string;
  lines: { lineNo: number; quantity: string; priceUnitMinor: number; taxCodes: string[] }[];
  storedTaxMinor: number;
}

export interface InvoiceImpact {
  number: string; kind: string; partner: string; date: string; state: string; currency: string;
  baseTaxMinor: number; headTaxMinor: number; deltaMinor: number;
  baseDisplay: string; headDisplay: string; deltaDisplay: string;
}

export interface ReplayResult {
  invoicesReplayed: number; invoicesChanged: number;
  totalsByCurrency: { currency: string; base: number; head: number; delta: number; baseDisplay: string; headDisplay: string; deltaDisplay: string }[];
  byTax: { taxCode: string; taxName: string; currency: string; base: number; head: number; delta: number; baseDisplay: string; headDisplay: string; deltaDisplay: string; invoices: number }[];
  movers: InvoiceImpact[];
  parity: { number: string; stored: number; recomputed: number }[]; // lines where recomputing under base != stored
  errors: { number: string; error: string }[];
  durationMs: number;
  headline: string;
}

function taxesFor(tree: ConfigTree, codes: string[]): TaxDef[] {
  return codes.map((c) => tree.taxes[c]).filter((t): t is TaxDef => Boolean(t));
}

export function invoiceTax(tree: ConfigTree, inv: ReplayInvoice): { total: bigint; byTax: Map<string, bigint> } {
  let total = 0n;
  const byTax = new Map<string, bigint>();
  for (const line of inv.lines) {
    const r = computeAll(taxesFor(tree, line.taxCodes), BigInt(line.priceUnitMinor), line.quantity);
    for (const t of r.taxes) {
      total += t.amountMinor;
      byTax.set(t.code, (byTax.get(t.code) ?? 0n) + t.amountMinor);
    }
  }
  return { total, byTax };
}

export function replay(base: ConfigTree, headTree: ConfigTree, invoices: ReplayInvoice[]): ReplayResult {
  const started = Date.now();
  const impacts: InvoiceImpact[] = [];
  const errors: { number: string; error: string }[] = [];
  const parity: { number: string; stored: number; recomputed: number }[] = [];
  const taxBase = new Map<string, bigint>();
  const taxHead = new Map<string, bigint>();
  const taxInvoices = new Map<string, Set<string>>();
  const byCurrency = new Map<string, { base: bigint; head: bigint }>();
  for (const inv of invoices) {
    try {
      const b = invoiceTax(base, inv);
      const h = invoiceTax(headTree, inv);
      if (Number(b.total) !== inv.storedTaxMinor) parity.push({ number: inv.number, stored: inv.storedTaxMinor, recomputed: Number(b.total) });
      for (const [code, amt] of b.byTax) taxBase.set(code, (taxBase.get(code) ?? 0n) + amt);
      for (const [code, amt] of h.byTax) taxHead.set(code, (taxHead.get(code) ?? 0n) + amt);
      for (const code of new Set([...b.byTax.keys(), ...h.byTax.keys()])) {
        if ((b.byTax.get(code) ?? 0n) !== (h.byTax.get(code) ?? 0n)) {
          if (!taxInvoices.has(code)) taxInvoices.set(code, new Set());
          taxInvoices.get(code)!.add(inv.number);
        }
      }
      const cur = byCurrency.get(inv.currency) ?? { base: 0n, head: 0n };
      cur.base += b.total; cur.head += h.total; byCurrency.set(inv.currency, cur);
      const delta = h.total - b.total;
      impacts.push({
        number: inv.number, kind: inv.kind, partner: inv.partner, date: inv.date, state: inv.state, currency: inv.currency,
        baseTaxMinor: Number(b.total), headTaxMinor: Number(h.total), deltaMinor: Number(delta),
        baseDisplay: formatMoney(b.total, inv.currency), headDisplay: formatMoney(h.total, inv.currency), deltaDisplay: formatMoney(delta, inv.currency),
      });
    } catch (e) {
      errors.push({ number: inv.number, error: String((e as Error).message).slice(0, 200) });
    }
  }
  const changed = impacts.filter((i) => i.deltaMinor !== 0);
  const currency = invoices[0]?.currency ?? "EUR";
  const byTax = [...new Set([...taxBase.keys(), ...taxHead.keys()])]
    .map((code) => {
      const b = taxBase.get(code) ?? 0n; const h = taxHead.get(code) ?? 0n;
      const name = headTree.taxes[code]?.name ?? base.taxes[code]?.name ?? code;
      return { taxCode: code, taxName: name, currency, base: Number(b), head: Number(h), delta: Number(h - b), baseDisplay: formatMoney(b, currency), headDisplay: formatMoney(h, currency), deltaDisplay: formatMoney(h - b, currency), invoices: taxInvoices.get(code)?.size ?? 0 };
    })
    .filter((r) => r.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const totalsByCurrency = [...byCurrency.entries()].map(([c, v]) => ({ currency: c, base: Number(v.base), head: Number(v.head), delta: Number(v.head - v.base), baseDisplay: formatMoney(v.base, c), headDisplay: formatMoney(v.head, c), deltaDisplay: formatMoney(v.head - v.base, c) }));
  const movers = [...changed].sort((a, b) => Math.abs(b.deltaMinor) - Math.abs(a.deltaMinor)).slice(0, 25);
  const moves = totalsByCurrency.filter((t) => t.delta !== 0).map((t) => t.deltaDisplay).join(", ");
  const headline = changed.length === 0
    ? `No change: ${impacts.length} invoices replayed, none moved.`
    : `${changed.length} of ${impacts.length} invoices move by ${moves || "no net change in tax"}.`;
  return { invoicesReplayed: impacts.length, invoicesChanged: changed.length, totalsByCurrency, byTax, movers, parity, errors, durationMs: Date.now() - started, headline };
}
