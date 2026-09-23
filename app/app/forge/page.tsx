export const dynamic = "force-static";

const STAGES = [
  ["Modernize Legacy Code", "Pointed Forge at github.com/tpminhtam/openerp-to-myerp: the OpenERP 7.0 accounting module and its ORM core, unmodified, plus a context pack (intent, PRD, spec)."],
  ["Assessment · ForgeScore", "Forge read the legacy code (Python 2.7, in-house ORM, XML-RPC, taxes as floats edited in place, even taxes defined as runtime Python code) and scored it."],
  ["Intent", "Combined intent: preserve the ledger and OpenERP's tax computation, add version-controlled tax configuration with an impact replay, an AI agent as a governed principal, tamper-evident evidence."],
  ["PRD-Spec", "Business processes for change control, invoice-to-ledger parity and posting policy; business rules; NFRs; rollout."],
  ["Architecture", "Options with a migration and transformation plan, component boundaries, security and data flow."],
  ["User Stories", "Eight epics, 60-plus work orders (WO-051 … WO-105) with acceptance criteria and a requirements traceability matrix (REQ-001 … REQ-007)."],
  ["Testing", "56 functional test cases derived from the stories, plus smoke and regression suites."],
  ["Implementation", "The hackathon tenant exposed no coding agent and no API tokens, so the artifacts were downloaded and implemented with Claude Code from them, story by story, in this repository under app/."],
];

const WO = [
  ["WO-052", "Define tax change-control schemas", "prisma/schema.prisma: ConfigCommit, Ref, RefLog, ChangeRequest, Check, Review"],
  ["WO-067", "Implement content-addressed tax repository", "lib/vcs.ts + lib/canonical.ts: SHA-256 over canonical JSON, Git-style object framing, protected main"],
  ["WO-075", "Add tax branch editor diffs", "lib/config.ts diffTrees/applyEdit; /taxes propose form; /changes/[n] diff panel"],
  ["WO-082", "Add tax merge and load checks", "lib/config.ts mergeTrees/validateTree; merge-clean and config-loads checks"],
  ["WO-054", "Implement SOD tax reviews", "lib/sod.ts SOD-02, SOD-01, SOD-03 in order; blocked reviews stored"],
  ["WO-069", "Implement tax impact replay", "lib/replay.ts: pure replay over every invoice, headline, by-tax, movers, parity"],
  ["WO-095", "Implement governed tax merge gate", "lib/changes.ts merge(): three green checks + current approval + allowed actor; main moves; ref log"],
  ["WO-067", "Add hash-chained audit log", "lib/audit.ts: prevHash + canonical row → hash; verify endpoint; /audit"],
  ["WO-082", "Add governed Claude proposal tool", "/api/agent/propose: plain English → validated edit → change request opened as the agent"],
  ["WO-090", "Test Claude merge refusal evidence", "/api/changes/[n]/merge with X-Actor: claude → 403 SOD-02, blocked review, audit row"],
  ["WO-095", "Verify Claude impact explanations", "/api/agent/explain: every figure in the note checked against the impact result"],
  ["WO-057", "Port tax compute_all parity", "lib/tax.ts: faithful port of account.tax.compute_all with unit tests (lib/tax.test.ts)"],
  ["WO-065", "Test balanced ledger invariants", "seed asserts debits = credits; overview shows the check; trial balance nets to zero"],
  ["WO-073 / WO-069 / WO-072 / WO-064", "Ledger, invoice-tax and trial-balance projections; finance read routes", "/journal, /invoices, /trial-balance; /api/config, /api/refs, /api/replay, /api/audit"],
];

export default function Forge() {
  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold">Built with Opsera Forge</h1>
        <p className="text-sm text-[var(--muted)]">SF Enterprise Hackathon 2.0 · 23 September 2026 · Legacy Modernization track. What Forge produced, and where each work order landed in this codebase.</p>
      </div>
      <section className="panel p-4">
        <h2 className="font-semibold mb-2">The pipeline, in order</h2>
        <ol className="flex flex-col gap-2">
          {STAGES.map(([t, d], i) => (
            <li key={t} className="flex gap-3 text-sm"><span className="badge badge-neutral" style={{ minWidth: 26, justifyContent: "center" }}>{i + 1}</span><div><span className="font-semibold">{t}.</span> {d}</div></li>
          ))}
        </ol>
        <p className="text-xs text-[var(--muted)] mt-3">Forge artifacts in the repository under <span className="hash">forge/Modernized myERP/</span>: Intent_Profile.md, PRD-Spec.md, Architecture_Options.md, User_Stories.md, Testing.md, Requirements_Traceability.md.</p>
      </section>
      <section className="panel overflow-x-auto">
        <div className="px-4 pt-3 font-semibold">Work orders → code</div>
        <table className="table">
          <thead><tr><th>Forge work order</th><th>Story</th><th>Where it landed</th></tr></thead>
          <tbody>{WO.map(([id, story, where], i) => <tr key={i}><td className="hash">{id}</td><td>{story}</td><td className="text-xs">{where}</td></tr>)}</tbody>
        </table>
      </section>
      <section className="panel p-4 text-sm">
        <h2 className="font-semibold mb-1">Disclosure</h2>
        <p>A hand-built reference of the target design exists in a separate repository (September 2026). This codebase contains none of its code; the context pack reused its requirements and rules. Forge&apos;s stories went further than one day allows (Kubernetes, OIDC, a Python 3.14 runtime); the epics implemented today are Tax Configuration Change Control, Audit Evidence and Governed Agent Controls, the compute_all parity story and the ledger projections.</p>
      </section>
    </div>
  );
}
