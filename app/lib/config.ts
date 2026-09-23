import type { TaxDef } from "./tax";

/** The configuration under version control: the tax table, keyed by tax code. */
export type ConfigTree = { taxes: Record<string, TaxDef> };

export type Diff = { path: string; before: unknown; after: unknown };

/** Field-level diff between two trees, as `taxes.<code>.<field>` paths. */
export function diffTrees(base: ConfigTree, head: ConfigTree): Diff[] {
  const out: Diff[] = [];
  const codes = new Set([...Object.keys(base.taxes), ...Object.keys(head.taxes)]);
  for (const code of [...codes].sort()) {
    const b = base.taxes[code];
    const h = head.taxes[code];
    if (!b) { out.push({ path: `taxes.${code}`, before: undefined, after: h }); continue; }
    if (!h) { out.push({ path: `taxes.${code}`, before: b, after: undefined }); continue; }
    const fields = new Set([...Object.keys(b), ...Object.keys(h)]);
    for (const f of [...fields].sort()) {
      const bv = (b as unknown as Record<string, unknown>)[f];
      const hv = (h as unknown as Record<string, unknown>)[f];
      if (JSON.stringify(bv) !== JSON.stringify(hv)) out.push({ path: `taxes.${code}.${f}`, before: bv, after: hv });
    }
  }
  return out;
}

export type MergeResult = { clean: boolean; tree: ConfigTree; conflicts: string[]; applied: string[] };

/** Structural three-way merge at the path level: both agree → take it; one side changed → take that side; both changed differently → conflict. */
export function mergeTrees(base: ConfigTree, ours: ConfigTree, theirs: ConfigTree): MergeResult {
  const oursDiff = new Map(diffTrees(base, ours).map((d) => [d.path, d]));
  const theirsDiff = new Map(diffTrees(base, theirs).map((d) => [d.path, d]));
  const result: ConfigTree = { taxes: JSON.parse(JSON.stringify(ours.taxes)) };
  const conflicts: string[] = [];
  const applied: string[] = [];
  for (const [path, d] of theirsDiff) {
    const o = oursDiff.get(path);
    if (o && JSON.stringify(o.after) !== JSON.stringify(d.after)) { conflicts.push(path); continue; }
    if (o) continue; // both made the same change
    setPath(result, path, d.after);
    applied.push(path);
  }
  return { clean: conflicts.length === 0, tree: result, conflicts, applied };
}

function setPath(tree: ConfigTree, path: string, value: unknown): void {
  const [, code, field] = path.split(".");
  if (!field) {
    if (value === undefined) delete tree.taxes[code];
    else tree.taxes[code] = value as TaxDef;
    return;
  }
  if (!tree.taxes[code]) return;
  (tree.taxes[code] as unknown as Record<string, unknown>)[field] = value;
}

/** Set one field by path (`taxes.S15.amount`), refusing paths that do not exist. */
export function applyEdit(tree: ConfigTree, path: string, value: unknown): ConfigTree {
  const [root, code, field] = path.split(".");
  if (root !== "taxes" || !code) throw new Error(`Unknown path ${path}`);
  const next: ConfigTree = { taxes: JSON.parse(JSON.stringify(tree.taxes)) };
  if (!field) throw new Error("Edits address one field; to add or remove a tax use addTax/removeTax");
  if (!next.taxes[code]) throw new Error(`No tax with code ${code}`);
  if (!(field in next.taxes[code])) throw new Error(`Tax ${code} has no field ${field}`);
  (next.taxes[code] as unknown as Record<string, unknown>)[field] = value;
  return next;
}

/** config-loads: is the tree valid at all? */
export function validateTree(tree: ConfigTree, referencedCodes: Set<string>): string[] {
  const problems: string[] = [];
  for (const [code, t] of Object.entries(tree.taxes)) {
    if (t.code !== code) problems.push(`${code}: code field does not match key`);
    if (!["percent", "fixed"].includes(t.type)) problems.push(`${code}: type "${t.type}" is not allowed (Python-code taxes are refused)`);
    if (!/^\d+(\.\d{1,6})?$/.test(String(t.amount))) problems.push(`${code}: amount "${t.amount}" is not a decimal`);
    else if (t.type === "percent" && (Number(t.amount) < 0 || Number(t.amount) >= 1)) problems.push(`${code}: percent amount must be in [0, 1)`);
    if (!["sale", "purchase", "all"].includes(t.typeTaxUse)) problems.push(`${code}: typeTaxUse "${t.typeTaxUse}" is not allowed`);
    if (!Number.isInteger(t.sequence)) problems.push(`${code}: sequence must be an integer`);
  }
  for (const code of referencedCodes) {
    const t = tree.taxes[code];
    if (!t) problems.push(`tax ${code} is referenced by invoices but is missing from the configuration`);
    else if (!t.active) problems.push(`tax ${code} is referenced by open invoices but is inactive`);
  }
  return problems;
}
