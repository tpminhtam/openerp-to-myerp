# OpenERP 7.0 → myERP

A legacy-modernization build for SF Enterprise Hackathon 2.0 (23 September 2026) on Opsera Forge.

**Legacy system:** the accounting module of OpenERP 7.0, the 2013 release of what is now Odoo. Python 2.7, an in-house ORM, XML-RPC, server-rendered XML views, PostgreSQL. Tax rates are floats edited in place on a form, with no effective dates, no history, no review and no way to know what a change does to the invoices already issued. See `legacy/openerp-7.0/addons/account/account.py` (`class account_tax`, `compute_all`).

**Target:** myERP, a tax-first, AI-native finance system where every tax rule change is a pull request against the books: branch, diff, three checks including an impact replay over real invoices, segregation-of-duties reviews that refuse the AI agent and the proposer, a merge that moves a protected `main`, and a permanent ref log. The full product requirements are in `context/PRD_myERP.pdf`; the Forge intent is `context/MODERNIZATION_INTENT.md`; the exact rules are in `context/01_TARGET_SPEC.md`.

**Layout**

| Path | What |
|---|---|
| `legacy/openerp-7.0/` | The legacy code, unmodified (AGPL-3, OpenERP S.A.). Forge's Assessment reads this. Never edited. |
| `context/` | The intent, the PRD and the spec that Forge generates from |
| `app/` | The modernized application, written by Forge's coding agent (and Claude Code through Forge's MCP) during the hackathon |

**Disclosure:** the author built a hand-written reference of the target design in September 2026 (a separate repository). This repository contains none of its code; the context pack reuses its requirements and rules.
