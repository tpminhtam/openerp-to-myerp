# 01 · Define Target — change control for tax configuration

> Step 2 of the reference architecture: the modern system, described precisely enough to prompt Forge from. `02_PROMPTS.md` cuts this into the order to build it. Working name for the Forge app: **myERP Change Control** (rename if you like; keep "myERP" so the post and the demo connect).

## One paragraph (paste this first)

A web application where a company's tax configuration (jurisdictions and their stacked rate components, effective-dated) is version controlled the way code is, and **every rule change is a pull request against the books**. A person or an AI agent proposes a change on a branch; the app shows a field-level diff; three required checks run, and the important one **replays every real document through both the configuration in force and the proposed one and reports the money it would move, by jurisdiction, with the documents that move most**; a reviewer approves a number, not a setup screen; segregation-of-duties rules decide who may approve (the proposer cannot, an AI agent cannot, tax changes need a tax reviewer) and every refused attempt is kept as evidence; merging moves the protected `main` branch, and a permanent ref log records every move with who and why. A live tax-by-jurisdiction dashboard replaces the month-end batch report. It replaces the legacy process in `00_LEGACY.md`.

## Users

No login. A persona switcher in the header ("Acting as") selects the principal, exactly like the reference app. Seed from `data/principals.csv`:

| id | kind | name | title | roles |
|---|---|---|---|---|
| tam.tran | human | Tam Tran | Tax Technology Engineer | tax_technology, tax_reviewer, tax_analyst |
| priya.raman | human | Priya Raman | Senior Manager | tax_reviewer, tax_analyst |
| daniel.okafor | human | Daniel Okafor | Controller | controller, ap_approver, gl_accountant, treasury |
| maya.chen | human | Maya Chen | Accounts Payable Specialist | ap_clerk |
| sam.lee | human | Sam Lee | Revenue Accountant | ar_clerk, billing_ops, gl_accountant |
| claude | agent | Claude | Finance assistant (AI agent) | agent:assistant |
| system | system | myERP | System | system |

## Data model

Integer minor units everywhere (`_minor`), with a 3-letter currency code. Dates are ISO. The business date is 2026-09-16.

| Table | Fields | Notes |
|---|---|---|
| `jurisdictions` | code (PK), name, regime, country, region | 16 rows from `data/rates.yml` |
| `rate_components` | id, jurisdiction_code, level, name, rate (decimal 6dp), effective_from, effective_to (nullable) | From `data/rates.yml`. Names can repeat across jurisdictions (Texas appears in Austin and Houston) and within one (Seattle, Singapore have dated versions of the same name), so address a component by jurisdiction + name + effective_from |
| `documents` | number (PK), doc_type (customer_invoice / supplier_invoice), entity_id, entity_name, party, currency, document_date, status, taxable_minor, tax_minor, accrued_minor | 70 rows, `data/documents.csv` |
| `tax_lines` | id, document_number, line_ref, regime, jurisdiction_code, treatment, taxable_base_minor, rate, tax_minor, accrual (bool) | 608 rows, `data/tax_lines.csv`; `rate` is the combined rate the line was computed with |
| `registrations` | owner_id (entity), regime, jurisdiction, number, validation_status | 24 rows, `data/registrations.csv` |
| `principals` | id, kind, display_name, title, roles[] | 7 rows |
| `config_commits` | hash (PK), parent_hash (nullable), tree (JSON: the full rate table), author_id, message, committed_at | Content-addressed: hash = SHA-256 of canonical JSON of {tree, parents, message, author}. A commit is a complete configuration, never a patch |
| `refs` | name (PK), kind (branch / tag), commit_hash, protected (bool) | `main` is protected: no direct commits, changes arrive by merge. Tags never move |
| `ref_log` | id, ref_name, from_hash, to_hash, actor_id, reason, at | Append-only; never updated or deleted |
| `change_requests` | number (CR-0001…), title, body, source_ref, target_ref (main), head_hash, base_hash, merge_base_hash, effective_from, status (open / merged / closed), opened_by, opened_at, merged_by, merged_at | |
| `checks` | id, request_number, head_hash, name, conclusion (success / failure), summary, detail (JSON), ran_at | One row per run; the latest row per (head, name) counts |
| `reviews` | id, request_number, head_hash, state (approved / changes_requested / blocked), actor_id, rule_id (nullable), note, at | Append-only; an approval bound to an old head is stale, not deleted |
| `audit_log` | id, at, actor_id, action, object_type, object_id, summary, prev_hash, hash | hash = SHA-256(prev_hash + canonical row). Stretch: verify endpoint |

## Screens

1. **Rates (configuration in force).** Left: jurisdictions grouped by regime. Right: the selected jurisdiction's components with rate, effective dates, and the combined rate on the business date. Button **Propose a change** → asks for a branch name and a title, creates the branch from `main`, opens the editor.
2. **Branch editor.** Same table, editable rate and effective dates; each save is a commit on the branch with a message. Button **Open change request**.
3. **Change requests.** List: number, title, source → target, status, checks (three dots: green / red / grey), proposer, opened. Filter by status.
4. **Change request detail.** Header (title, number, branch, proposer, effective_from, status). Tabs or sections:
   - **Diff**: one row per changed path, `rates.US-NY-NYC.New York City.rate` · before `0.045` · after `0.05`. Three-dot diff: merge base → head.
   - **Checks**: merge-clean, config-loads, impact, each with conclusion and summary; button **Run checks**.
   - **Impact**: headline sentence ("6 of 70 documents move by USD 13,103.51."), a *by jurisdiction* table (before, after, delta, new-obligation flag), a *top movers* table (document, entity, party, before, after, delta), duration in ms, and a red banner if the check failed because of a new obligation in a jurisdiction without a registration.
   - **Reviews**: timeline including blocked attempts ("Claude tried to approve · blocked by SOD-02 · message"). Buttons **Approve**, **Request changes**, **Merge**, shown to everyone and *refused* by the rules (the refusal is the demo).
5. **History.** `main`'s ref log (every move with actor and reason), commit list, tags. Button **Tag** (e.g. `filed-2026-08`).
6. **Tax by jurisdiction** (replaces the batch report). Table + horizontal bars of tax by jurisdiction from `tax_lines`, filter by entity and month, and a toggle "as proposed by CR-…" that shows the same table under an open change request's head.
7. **Audit log.** Newest first; each row shows its hash and the previous hash.

## Business rules (exact)

**Combined rate.** `combined(jurisdiction, date, config) = Σ component.rate where effective_from ≤ date and (effective_to is null or date ≤ effective_to)`.

**Replay (the impact check).** For every document and each of its tax lines:
- if `treatment ∈ {taxable, use_tax_accrual}` (US sales/use lines): `new_minor = round_half_up(taxable_base_minor × combined(line.jurisdiction_code, document.document_date, head))`
- otherwise (`not_taxable`, `reverse_charge`, `country`, `acquisition_vat`, `vendor_charged`, …): `new_minor = 0`
- `old_minor` = the same function under `base` (must equal the stored `tax_minor`; that equality is your first alignment test)
- `accrual = false` → contributes to the document's *tax* delta; `accrual = true` → to its *accrued* delta
- A document *changed* if its tax delta ≠ 0 or its accrued delta ≠ 0.
- Output: `documents_replayed`, `documents_changed`, totals by currency (base, head, delta), by-jurisdiction rows sorted by |delta| with `new_jurisdiction = (base == 0 and head != 0)`, top 25 movers by |delta|, `duration_ms`, and the headline: `"{changed} of {replayed} documents move by {delta by currency}."` or `"No change: {replayed} documents replayed, none moved."`
- The check **fails** when a `new_jurisdiction` has no row in `registrations` for the document's entity; the summary names the jurisdiction. Otherwise it succeeds even when money moves. The reviewer decides about money; the system decides about obligations.

**Checks.** `merge-clean`: three-way merge of base, head and their merge base at the path level; a path both sides changed differently is a conflict → failure. `config-loads`: every rate parses as a decimal in [0, 1), every component's `effective_from ≤ effective_to`, every jurisdiction referenced by a tax line exists → else failure. `impact`: above.

**Mergeability.** All three checks succeeded on the *current* head, at least one `approved` review bound to the current head, and the actor is allowed by the rules below.

**Segregation of duties** (from `data/process_definitions.yml`, evaluated in this order on `approve` and `merge`; the first rule that denies explains the refusal, and a refusal is stored as a `blocked` review with the rule id):
- **SOD-02** deny when `actor.kind == 'agent'` — "{name} is an AI agent. Agents may capture, match, determine tax and run assurance checks; approving and posting belong to a person or to the system after a person approves."
- **SOD-01** deny when `actor.id == change_request.opened_by` — "{name} prepared {number}. Segregation of duties requires a different approver."
- **SOD-03** deny when the change touches tax configuration and `'tax_reviewer' ∉ actor.roles` — "{number} changes tax configuration. Approval needs the tax_reviewer role, which {name} does not have."

Proposing, editing on a branch and running checks are open to every principal, agents included.

**Merge.** Creates a commit on `main` whose tree is the merge result, parents = [main, head]; moves `main`; appends to `ref_log` with reason `merge CR-0001: <title>`; marks the request merged; audit row. A new commit on the branch after an approval leaves the approval `stale` (it stays in the table, bound to the old head) and re-runs are required.

**Money display.** `USD 13,103.51`, `JPY 3,764,480`, `EUR 65,532.98` (currency code, space, thousands separators, 2 decimals except JPY 0).

## Seed data

Everything in `data/`. Business date 2026-09-16. Load order: jurisdictions and components from `rates.yml`; principals; registrations; documents; tax lines; then create the initial commit "Configuration in force when version control was introduced" and point `main` at it (author `system`), with one ref-log row "repository initialised".

## Acceptance tests (Step 4, Refine & Align)

The reference implementation produced these numbers from the same data (`data/answer_key.json`, details in `03_ANSWER_KEY.md`). The Forge build matches when:

| Scenario | Edit | Expected |
|---|---|---|
| A. Replay with no edit | none | `No change: 70 documents replayed, none moved.` and every line's `old_minor` equals its stored `tax_minor` |
| B. New York City rate 0.045 → 0.05 | `US-NY-NYC` · `New York City` · rate | `6 of 70 documents move by USD 13,103.51.` US-NY-NYC USD 232,587.29 → 245,690.80; top mover CINV-US-2026-000016 +USD 2,500.40 |
| C. Texas state rate 0.0625 → 0.065 in Austin and Houston | two components named `Texas` | `7 of 70 documents move by USD 5,731.96.` Houston +4,963.95, Austin +1,065.01; three Stackworks supplier invoices move on *accrued* tax only |
| D. Rename a jurisdiction | `US-NY-NYC.name` | no money moves; config-loads succeeds |
| E. Governance | CR opened by Tam | Claude approve → blocked SOD-02; Tam approve → blocked SOD-01; Maya approve → blocked SOD-03; Priya approve → approved; Priya merge → merged, `main` moved, ref log has the row |
| F. Stale approval | commit again on the branch after Priya approved | approval shows stale; merge refused until re-check and re-approve |

## Out of scope (say it in the demo)

Authentication, real tax content (rates are demonstration configuration), taxability rules and the other configuration scopes, ledger posting, filing. The reference app does more (usage billing, ledger, evidence runs, an agent with 21 tools); the Forge build is the change-control slice.

## Enhancements (Step 5, only after A–F pass)

1. **Agent endpoint.** `POST /api/change-requests` and `POST /api/change-requests/{n}/checks` callable with `X-Actor: claude` so an AI agent can propose and check a change from outside; `POST …/merge` as claude returns 403 with the SOD-02 message and writes the blocked review. This is what makes it "API-enabling" for the judges.
2. **Merge queue.** Replay the books with *two* open change requests applied together and show that each is clean alone and wrong together (the gap the reference implementation admits to).
3. **Evidence pack.** Export a change request (diff, checks, reviews, ref log rows) as one JSON with a hash, as an auditor's re-performable record.
4. **What-if without a branch.** A scratch replay from the Rates screen for a quick estimate, clearly labelled as not a change request.
