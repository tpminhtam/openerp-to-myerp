# Modernization intent — OpenERP 7.0 accounting → myERP

Modernize the accounting module of OpenERP 7.0 (the 2013 release of Odoo; Python 2.7, AGPL-3, in `legacy/openerp-7.0/`) into **myERP**, a tax-first, AI-native finance system where every tax rule change is a pull request against the books. Preserve the legacy behaviour that matters (tax computation, invoice posting, the chart of accounts and trial balance) and add the capabilities the legacy system was never able to have: version-controlled tax configuration with an impact replay, an AI agent as a governed participant, and tamper-evident evidence.

## What the legacy system does today (current state)

- **Taxes** (`account.tax` in `addons/account/account.py`): one record per tax with `name`, `amount` (a float, 0–1 for percentages), `type` (percent, fixed, none, balance, or **Python code evaluated at runtime**), `type_tax_use` (sale, purchase, all), `price_include`, `include_base_amount`, child taxes via `parent_id`, and links to tax codes for the declaration. A rate is edited in place on a form. There is no effective date, no history, no diff, no review of the change, and no way to ask what the change would have done to the invoices already issued.
- **Tax computation** (`compute_all`, `_unit_compute`, `_unit_compute_inv` in `account.py`): per invoice line, applies the line's taxes in sequence, handles price-included taxes, child taxes and `include_base_amount`, and rounds to the currency precision. This is the behaviour to preserve.
- **Invoices** (`account.invoice`, `account.invoice.line`, `account.invoice.tax` in `account_invoice.py`): draft → open → paid; validating an invoice posts a journal entry (`account.move` / `account.move.line`) against the chart of accounts; `button_reset_taxes` recomputes tax lines.
- **Ledger**: `account.account` (chart, 54 accounts in the demo data), `account.journal` (10), fiscal years and periods, `account.move.line` as the journal, a trial balance report.
- **Platform**: Python 2.7, an in-house ORM (`osv.osv`), XML-RPC, server-rendered XML views, PostgreSQL. No API a modern tool can call safely, no audit chain, no notion of an AI agent.

Pain points, in the users' words: "the setup screen is production", "what changed last quarter" means diffing two database dumps, a wrong rate is discovered at the VAT return, evidence for auditors is screenshots, and nobody would let an AI touch it.

## Target state

A single deployable web application, **myERP**, with:

1. **The ledger, preserved and readable.** Chart of accounts, journals, journal entries and a trial balance by company and period that nets to zero, seeded from the legacy demo chart and journals. Any journal line opens its lineage to the invoice and the tax line that produced it.
2. **Invoices, preserved.** Invoice list and detail with lines, tax lines and the posted journal entry; tax computed by a **ported `compute_all`** (percent, fixed, price-included, child taxes with `include_base_amount`, half-up rounding to 2 decimals) with unit tests that encode the legacy semantics.
3. **Tax configuration under version control (new).** The tax table is stored as content-addressed commits (SHA-256 of canonical JSON); branches move, tags never move, `main` is protected and changes only by merge; every ref move is appended to a permanent ref log with actor and reason.
4. **Change requests with three checks (new).** Field-level diff from merge base to head (`taxes.Sale VAT 15%.amount · 0.15 → 0.16`); `merge-clean` (structural three-way merge), `config-loads` (every percent amount in [0, 1), every tax referenced by an invoice still exists and is active, no tax of type "Python code"), and **`impact`: replay every invoice's lines through the configuration in force and the proposed one and report invoices changed, money moved by company and by tax, the top movers, and a headline such as "37 of 120 invoices move by EUR 4,812.40."** The impact check fails only when the change deactivates or removes a tax that open invoices still reference.
5. **Segregation of duties on approve and merge (new)**, evaluated in order, first denial stored as a blocked review: SOD-02 agents cannot approve ("{name} is an AI agent. Agents may capture, match, determine tax and run assurance checks; approving and posting belong to a person or to the system after a person approves."); SOD-01 the proposer cannot approve ("{name} prepared {number}. Segregation of duties requires a different approver."); SOD-03 tax changes need the `tax_reviewer` role. Approvals are bound to the commit reviewed; a new commit marks them stale. Merge requires three green checks and one current approval.
6. **An AI agent as a governed principal (new).** Persona `claude` (kind `agent`). It can turn a plain-English request ("raise Sale VAT to 16% from 1 October") into a validated change request opened *as Claude* through the same API a person uses; it can explain a change request from the diff and the impact result, with every number in its note checked against the impact result before it is shown; and when asked to merge it is refused by SOD-02 and the refusal is stored. Model: Claude through the official Anthropic SDK (`claude-opus-5`), structured outputs for the proposal, API key from the environment; without a key the agent actions explain what is missing and everything else works.
7. **Evidence (new).** A hash-chained audit log of every action with a verify action; an evidence pack export per change request (diff, checks, reviews, ref-log rows) with a SHA-256 over the canonical body.
8. **Live views (new).** Tax collected by tax and by month, with a toggle to view the totals under an open change request's proposed configuration; no batch reports.

## Users

No login. A persona switcher ("Acting as") selects the principal and every API call carries it in an `X-Actor` header: Tam Tran (tax_technology, tax_reviewer), Priya Raman (tax_reviewer), Daniel Okafor (controller), Maya Chen (ap_clerk), Sam Lee (ar_clerk), Claude (agent), system.

## Modernization priorities

**Parallel**: preserve behaviour and add capabilities in the same build. The preserved behaviour is proven by parity tests against the ported `compute_all`; the new capabilities are proven by the acceptance tests below.

## Technical direction

Next.js (App Router) with TypeScript, Prisma with PostgreSQL (Neon), Tailwind CSS, API route handlers under `/api`, deployed on Vercel. One deployable, no microservices, no authentication in this release. Money is integer minor units with a currency code; display as `EUR 4,812.40`. Rates are decimal strings, never floats. The replay and the tax computation live in pure modules (`lib/tax.ts`, `lib/replay.ts`) with unit tests. `ref_log`, `reviews`, `checks` and `audit_log` are append-only: no update or delete code paths. All new code lives under `app/`; `legacy/` is never modified.

## Seed data (deterministic, generated by `prisma/seed.ts`)

- Chart of accounts and journals: from `legacy/openerp-7.0/addons/account/demo/account_minimal.xml` and `account_demo.xml` (54 accounts, 10 journals), one company, currency EUR, fiscal year 2026 with monthly periods.
- Taxes, modelled on `account.tax`: Sale VAT 15%, Sale VAT 6% (reduced), Sale exempt 0%, Purchase VAT 15% (recoverable), Purchase VAT 6%, and one price-included Sale VAT 15% — each with type, `type_tax_use`, `price_include`, `include_base_amount`.
- 120 invoices across 12 months (80 customer, 40 supplier), 1–5 lines each, deterministic from a fixed random seed, taxes assigned per line, tax lines computed by the ported `compute_all`, and a posted journal entry per validated invoice; 10 left in draft.
- Principals as above; the initial commit "Configuration in force when version control was introduced" with `main` pointing at it.

## Scope for this build (ordered; each story leaves the app demoable)

1. Prisma schema, migrations, seed, ported `compute_all` with parity unit tests
2. Persona switcher and `X-Actor` plumbing
3. Chart of accounts, journal search, trial balance (nets to zero per company and currency)
4. Invoices list and detail with tax lines and journal entry; line lineage
5. Taxes screen (configuration in force), branch editor, commits
6. Change requests: list, detail, diff, checks, impact panel
7. Reviews with SOD, stale approvals; merge, ref log, tags, history screen
8. Agent panel: propose in plain English, explain with grounding, ask Claude to merge
9. Tax dashboard with "as proposed by CR" toggle; audit log with hash chain and verify
10. Enhancements: evidence pack export; merge queue (replay two open change requests together); agent API for external agents

Out of scope: every other OpenERP module (sales, purchase, stock, HR, CRM), multi-currency revaluation, bank statements, payment terms, analytic accounting, the declaration (tax code) reports, authentication.

## Acceptance

- **Parity**: unit tests for `compute_all` covering percent, fixed, price-included, child taxes with and without `include_base_amount`, sequence ordering, and rounding, with expected values derived by hand from the legacy function; the seed's tax lines are produced by the same function.
- **Ledger**: every journal entry balances; the trial balance nets to zero; 120 invoices, 110 posted, 10 draft.
- **Replay A**: an unchanged configuration reports `No change: 120 invoices replayed, none moved.` and every line's recomputed tax equals its stored tax.
- **Replay B**: Sale VAT 15% → 16% reports the number of invoices that use that tax and a delta equal to 1% of their taxable base (sum of per-line half-up roundings), by company and by tax.
- **Replay C**: deactivating a tax referenced by open invoices fails the impact check with the tax named.
- **Governance**: on a change request opened by Tam: Claude → blocked SOD-02; Tam → blocked SOD-01; Maya → blocked SOD-03; Priya → approved, merged, `main` moved, ref-log row written; a new commit after approval marks it stale and blocks the merge.
- **Agent**: "raise Sale VAT to 16% from 1 October 2026" opens a change request as `claude` whose diff equals Replay B's edit; the explanation's numbers all appear in the impact result.
- **Audit**: the verify action returns ok; editing a row in the database makes it fail.
- **Hosted**: Replay B, Governance and Agent pass at the public URL from a phone.
