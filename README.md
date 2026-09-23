# OpenERP 7.0 → myERP

**SF Enterprise Hackathon 2.0 · 23 September 2026 · Legacy Modernization on Opsera Forge.** Solo build by Tam Tran.

## The legacy system

The accounting module of **OpenERP 7.0**, the 2013 release of what is now Odoo: Python 2.7, an in-house ORM, XML-RPC, server-rendered XML views. It lives unmodified under [`legacy/openerp-7.0/`](legacy/openerp-7.0/) (AGPL-3, OpenERP S.A.). Its tax model, `account_tax` in [`account.py`](legacy/openerp-7.0/addons/account/account.py), stores a rate as a float that is edited in place on a form: no effective dates, no history, no diff, no review of the change, and no way to ask what a change would have done to the invoices already issued. A tax could even be defined as Python code evaluated at runtime.

## The modern system

**myERP**, under [`app/`](app/): a tax-first, AI-native finance system where **every tax rule change is a pull request against the books.**

| What | How |
|---|---|
| The ledger, preserved | Chart of accounts and journals from the legacy demo data; 120 seeded invoices with tax lines; 110 posted journal entries; a trial balance that nets to zero |
| Tax computation, preserved | [`lib/tax.ts`](app/lib/tax.ts) is a port of the legacy `compute_all` (percent, fixed, price-included, stacked `include_base_amount`, half-up rounding) with unit tests; the seed's tax lines are produced by it, and the replay proves it reproduces every stored amount |
| Version-controlled tax configuration | Content-addressed commits (SHA-256 of canonical JSON, Git's framing), branches, immutable tags, a protected `main`, a permanent ref log |
| Change requests with three checks | Field-level diff; `merge-clean` (structural three-way merge), `config-loads` (validation, no runtime code, every referenced tax present), and **`impact`: every invoice replayed through both configurations, money moved by tax and by invoice, in milliseconds** |
| Segregation of duties in code | SOD-02 refuses the AI agent, SOD-01 refuses the proposer, SOD-03 requires a tax reviewer; every refusal is stored as a blocked review and an audit row |
| Claude as a governed principal | Proposes a change from plain English through the same API a person uses; explains a change request with every figure checked against the impact result; is refused when it tries to merge |
| Evidence | Hash-chained audit log with a verify action; append-only reviews, checks and ref log |

Headline from the seeded data: raising Sale VAT from 15 % to 16 % moves **67 of 120 invoices by EUR 4,471.70**, computed in about 2 ms, before anyone approves it.

## How Opsera Forge was used

Forge's **Modernize Legacy Code** journey ran on this repository: Assessment and ForgeScore of the OpenERP code, then Intent (with [`context/MODERNIZATION_INTENT.md`](context/MODERNIZATION_INTENT.md) and the product requirements [`context/PRD_myERP.pdf`](context/PRD_myERP.pdf) attached), PRD-Spec, Architecture, User Stories and Testing. The generated artifacts are in [`forge/`](forge/): intent profile, PRD-Spec, architecture options, 60+ user stories in eight epics, 56 functional test cases and a requirements traceability matrix.

The hackathon tenant had no coding agent and no API tokens, so the stories were implemented with Claude Code from Forge's artifacts. Commits cite the work-order ids they implement (WO-052, WO-054, WO-057, WO-065, WO-067, WO-069, WO-075, WO-082, WO-090, WO-095). Forge's architecture proposed a larger platform (Kubernetes, OIDC, a Python 3.14 service layer); this build deliberately took the two epics that carry the product's value, change control and governed agents, and left the platform work as roadmap.

**Disclosure:** the author built a hand-written reference of the target design earlier in September 2026 in a separate repository. This repository contains none of its code; the context pack reuses its requirements and rules.

## Run it

```bash
cd app
cp .env.example .env            # DATABASE_URL (PostgreSQL), ANTHROPIC_API_KEY (optional: agent features)
pnpm install
pnpm prisma migrate deploy
pnpm db:seed                    # legacy chart, six taxes, 120 invoices, initial commit on main
pnpm dev                        # http://localhost:3000
pnpm test                       # compute_all parity, replay, merge and validation tests
```

`POST /api/admin/reset` restores the demo state (guarded by `RESET_TOKEN` when set). Every API call carries the acting principal in an `X-Actor` header; the UI sets it with the persona switcher.

## Demo path (three minutes)

1. **Taxes**: the configuration in force, the same six fields the legacy form edited in place.
2. **Propose in plain English**: "raise Sale VAT to 16 % from 1 October 2026". Claude opens the change request as itself.
3. **Change request**: the diff (one field), three checks, the impact panel: *67 of 120 invoices move by EUR 4,471.70*, by tax, top movers.
4. **Explain**: Claude's note, every figure verified.
5. **Ask Claude to merge**: refused by SOD-02, stored. Acting as Tam: refused by SOD-01. Acting as Priya: approved and merged; `main` moves; the ref log says who and why.
6. **History** and **Audit log**: the chain verifies.
