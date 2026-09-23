import { head, treeAt } from "@/lib/vcs";
import { formatRate, formatMoney } from "@/lib/money";
import { Badge, Hash } from "@/components/Badge";
import { ProposeForms } from "@/components/ProposeForms";
import { currentActor } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Taxes() {
  const commit = await head("main");
  const tree = await treeAt(commit);
  const taxes = Object.values(tree.taxes).sort((a, b) => a.code.localeCompare(b.code));
  const actor = await currentActor();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Taxes · configuration in force</h1>
        <p className="text-sm text-[var(--muted)]">In OpenERP 7.0 these rates were floats edited in place on a form. Here the table is a content-addressed commit: <Hash value={commit} /> on the protected branch <span className="hash">main</span>, changed only by merge.</p>
      </div>
      <div className="panel overflow-x-auto">
        <table className="table">
          <thead><tr><th>Code</th><th>Name</th><th>Type</th><th className="num">Rate / amount</th><th>Use</th><th>Price incl.</th><th>In base</th><th className="num">Seq</th><th>Active</th><th>Account</th></tr></thead>
          <tbody>{taxes.map((t) => (
            <tr key={t.code}>
              <td className="hash">{t.code}</td><td>{t.name}</td><td>{t.type}</td>
              <td className="num">{t.type === "percent" ? formatRate(t.amount) : formatMoney(Number(t.amount), "EUR")}</td>
              <td>{t.typeTaxUse}</td><td>{t.priceInclude ? "yes" : ""}</td><td>{t.includeBaseAmount ? "yes" : ""}</td><td className="num">{t.sequence}</td>
              <td>{t.active ? <Badge kind="success">active</Badge> : <Badge kind="stale">inactive</Badge>}</td><td className="hash">{t.accountCode ?? ""}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <ProposeForms taxes={taxes} actorId={actor.id} />
    </div>
  );
}
