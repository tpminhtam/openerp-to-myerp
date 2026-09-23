---

**Changelog** (2026-09-23T20:18:47.124Z): Tasks: 106 change(s).

- Epic/feature structure changed
- Removed: WO-001
- Removed: WO-002
- Removed: WO-003
- Removed: WO-004
- Removed: WO-005
- Removed: WO-006
- Removed: WO-007
- Removed: WO-009
- Removed: WO-010
- Removed: WO-011
- Removed: WO-012
- Removed: WO-013
- Removed: WO-018
- Removed: WO-019
- Removed: WO-020
- Removed: WO-021
- Removed: WO-022
- Removed: WO-014
- Removed: WO-024
- Removed: WO-025
- Removed: WO-026
- Removed: WO-027
- Removed: WO-029
- Removed: WO-015
- Removed: WO-016
- Removed: WO-028
- Removed: WO-034
- Removed: WO-038
- Removed: WO-039
- Removed: WO-040
- Removed: WO-023
- Removed: WO-030
- Removed: WO-031
- Removed: WO-035
- Removed: WO-041
- Removed: WO-044
- Removed: WO-045
- Removed: WO-017
- Removed: WO-032
- Removed: WO-033
- Removed: WO-036
- Removed: WO-037
- Removed: WO-042
- Removed: WO-043
- Removed: WO-046
- Removed: WO-047
- Removed: WO-048
- Removed: WO-049
- Removed: WO-050
- Added: WO-051
- Added: WO-054
- Added: WO-055
- Added: WO-056
- Added: WO-057
- Added: WO-065
- Added: WO-052
- Added: WO-058
- Added: WO-059
- Added: WO-060
- Added: WO-061
- Added: WO-062
- Added: WO-068
- Added: WO-053
- Added: WO-063
- Added: WO-069
- Added: WO-070
- Added: WO-072
- Added: WO-073
- Added: WO-078
- Added: WO-085
- Added: WO-067
- Added: WO-075
- Added: WO-082
- Added: WO-089
- Added: WO-090
- Added: WO-095
- Added: WO-100
- Added: WO-076
- Added: WO-091
- Added: WO-096
- Added: WO-101
- Added: WO-103
- Added: WO-064
- Added: WO-071
- Added: WO-083
- Added: WO-092
- Added: WO-093
- Added: WO-097
- Added: WO-066
- Added: WO-079
- Added: WO-080
- Added: WO-084
- Added: WO-086
- Added: WO-074
- Added: WO-081
- Added: WO-087
- Added: WO-088
- Added: WO-094
- Added: WO-098
- Added: WO-077
- Added: WO-099
- Added: WO-102
- Added: WO-104
- Added: WO-105
- Revised: WO-008

## Canonical Finance Traceability and Legacy Baseline Inventory

### [P0] Inventory canonical finance terms

Create context/finance_domain_dictionary.yml so finance stakeholders and migration engineers can trace myERP business terms to exact legacy OpenERP accounting artifacts before any runtime migration changes behavior. The source module is the legacy account addon under legacy/openerp-7.0/addons/account, especially legacy/openerp-7.0/addons/account/account.py and legacy/openerp-7.0/addons/account/account_invoice.py. Today the same concepts are named differently across context/PRD_myERP.md, context/MODERNIZATION_INTENT.md, OpenERP model names, XML records, report names, and generic ORM methods, which increases semantic drift when agents create adapters or parity tests. The target state is a committed YAML dictionary with canonical terms for invoice, invoice line, invoice tax, journal entry, journal item, chart of accounts, account type, fiscal year, accounting period, payment term, tax, trial balance, partner ledger, general ledger, reconciliation, and fiscal close mapped to legacy model names, methods, source files, and stakeholder terminology. When complete, a developer can inspect one artifact and identify that account.invoice is owned by legacy/openerp-7.0/addons/account/account_invoice.py while account.tax and account.account are owned by legacy/openerp-7.0/addons/account/account.py. This story does not implement a new finance API, modify legacy accounting behavior, add authentication, or migrate any OpenERP model to Python 3.14. It also does not create executable parity tests or runtime adapters; it only provides the traceability baseline those capabilities depend on. It depends on repository-local planning context and legacy source availability, and it supports downstream security, workflow parity, query filter, ORM classification, and tax governance maps. The YAML should be deterministic enough for code review and future CI validation, with stable keys and explicit evidence notes for unmapped or target-only terms.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P0 |
| Labels | epic:EPIC-001, modernization, traceability, finance-domain, baseline-inventory, complexity:medium |

**Acceptance Criteria**
- File inspection verifies context/finance_domain_dictionary.yml exists and contains top-level keys metadata, canonical_terms, legacy_models, legacy_functions, source_files, synonyms, and unmapped_or_target_only_terms referencing context/PRD_myERP.md and legacy/openerp-7.0/addons/account/account.py.
- Running grep -E 'account.invoice|account.invoice.line|account.invoice.tax|account.account|account.tax|account.payment.term' context/finance_domain_dictionary.yml returns entries mapped to legacy/openerp-7.0/addons/account/account_invoice.py and legacy/openerp-7.0/addons/account/account.py.
- Running grep -E 'compute_all|button_reset_taxes|compute_invoice_totals|finalize_invoice_move_lines|account_payment_term.compute|_amount_residual' context/finance_domain_dictionary.yml returns exact method or function references that exist in legacy/openerp-7.0/addons/account/account.py or legacy/openerp-7.0/addons/account/account_invoice.py.
- Running grep -E 'planned_target_only|unmapped|myERP|PRD_myERP.md|MODERNIZATION_INTENT.md' context/finance_domain_dictionary.yml returns entries for target concepts from context/PRD_myERP.md that do not have direct legacy implementations.
- Unit tests: N/A — context/finance_domain_dictionary.yml is a static traceability artifact and no executable application logic is introduced in legacy/openerp-7.0/addons/account/account.py, legacy/openerp-7.0/addons/account/account_invoice.py, or app code.
- System integration tests: N/A — this story creates context/finance_domain_dictionary.yml only and does not expose an endpoint, RPC method, OpenERP model method, or service boundary.
- Mock data/fixtures: N/A — context/finance_domain_dictionary.yml is itself the committed baseline inventory derived from repository files, and no synthetic runtime fixture is required.

### [P0] Map legacy security policy

Create context/security_policy_map.yml so the modernization program can convert legacy OpenERP accounting access intent into future server-side authorization policy inputs. The source module is the legacy account security configuration in legacy/openerp-7.0/addons/account/security/account_security.xml and legacy/openerp-7.0/addons/account/security/ir.model.access.csv. Today access intent is scattered across groups, implied group hierarchy, global multi-company record rules, model ACL rows, and UI visibility, while future production write-capable finance APIs must not trust caller-selected actors or hidden buttons. Controllers, auditors, and platform security owners need this map because invoice posting, journal posting, reconciliation, statement confirmation, and fiscal close must eventually enforce role, company, period, state, and audit preconditions server-side. The target artifact must extract accounting groups, implied group relationships, record-rule domains, model access rows, CRUD permissions, affected models, and modernization policy notes into one YAML file. When complete, a developer can inspect the file and see how Invoicing and Payments, Accountant, Financial Manager, Pro-forma Invoices, and Check Total on supplier invoices relate to future finance policy capabilities. This story does not implement OIDC, OAuth2, token validation, RBAC middleware, audit evidence logging, or denial responses. It also does not change access rights in the legacy OpenERP module or add a production security boundary. It depends on the canonical finance terminology capability so model names and finance actions are normalized before later policy implementation consumes the map. The resulting YAML should preserve original OpenERP identifiers exactly enough that a reviewer can compare it back to the XML and CSV without interpretation loss.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | epic:EPIC-001, security, authorization, policy-map, modernization, baseline-inventory, complexity:medium |

**Acceptance Criteria**
- File inspection verifies context/security_policy_map.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/security/account_security.xml and legacy/openerp-7.0/addons/account/security/ir.model.access.csv.
- Running grep -E 'group_account_invoice|group_account_user|group_account_manager|group_proforma_invoices|group_supplier_inv_check_total' context/security_policy_map.yml returns group mappings extracted from legacy/openerp-7.0/addons/account/security/account_security.xml.
- Running grep -E 'account_move_comp_rule|account_move_line_comp_rule|journal_comp_rule|period_comp_rule|fiscal_year_comp_rule|domain_force|child_of' context/security_policy_map.yml returns multi-company record-rule mappings from legacy/openerp-7.0/addons/account/security/account_security.xml.
- Running grep -E 'perm_read|perm_write|perm_create|perm_unlink|model_account_invoice|model_account_move|model_account_move_line' context/security_policy_map.yml returns model access entries derived from legacy/openerp-7.0/addons/account/security/ir.model.access.csv.
- Running git diff -- legacy/openerp-7.0/addons/account/security/account_security.xml legacy/openerp-7.0/addons/account/security/ir.model.access.csv shows no changes to legacy security source files.
- Unit tests: N/A — context/security_policy_map.yml is a static authorization inventory and no executable authorization code is added to legacy/openerp-7.0/addons/account/security/account_security.xml or application services.
- System integration tests: N/A — no API, RPC boundary, OIDC token validation, or server-side policy evaluator is implemented in this story.
- Mock data/fixtures: N/A — context/security_policy_map.yml is the committed security baseline inventory; policy decision fixtures belong to the later central authorization capability.

**Depends on:** WO-051

### [P0] Map workflow report parity

Create context/accounting_parity_map.yml so migration engineers can preserve invoice workflow and report behavior before replacing OpenERP runtime paths. The primary legacy sources are legacy/openerp-7.0/addons/account/account_invoice_workflow.xml and legacy/openerp-7.0/addons/account/report/account_report_view.xml in the account addon. Today accounting parity knowledge is split between XML workflow transitions, report action definitions, Python model methods such as action_date_assign and button_reset_taxes, and planning text in context/PRD_myERP.md. Stakeholders will recognize the impact because invoice posting, paid-state transitions, report totals, and ledger read projections cannot move to myERP safely unless their legacy transition and report contracts are visible. The target file must map workflow states, transition signals, model methods invoked by the workflow, report records, report names, filters, and expected parity anchors to canonical finance terms. When the story is complete, a developer can inspect one YAML file and see which invoice lifecycle transitions and account report views must be protected by parity tests before cutover. This story does not implement the parity test harness, render reports, add projection APIs, or change invoice posting behavior in legacy/openerp-7.0/addons/account/account_invoice.py. It depends on the canonical finance terminology capability so the parity map uses consistent names for invoice, journal entry, tax line, trial balance, partner ledger, and general ledger concepts. It also provides source material for later policy and projection work by identifying observable workflow and reporting contracts without changing production behavior. The file should help platform teams operate shadow mode safely by making cutover-blocking parity anchors explicit before any read-authoritative or write-authoritative migration wave.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P0 |
| Labels | epic:EPIC-001, modernization, parity, workflow, reports, baseline-inventory, complexity:medium |

**Acceptance Criteria**
- File inspection verifies context/accounting_parity_map.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/account_invoice_workflow.xml and legacy/openerp-7.0/addons/account/report/account_report_view.xml.
- Running grep -E 'draft|proforma2|open|paid|cancel|action_date_assign|invoice_validate|action_move_create|action_number' context/accounting_parity_map.yml returns invoice workflow state or method mappings sourced from legacy/openerp-7.0/addons/account/account_invoice_workflow.xml and legacy/openerp-7.0/addons/account/account_invoice.py.
- Running grep -E 'account.general.ledger|account.partner.ledger|account.balance|trial|ledger|report_name' context/accounting_parity_map.yml returns report or projection parity mappings tied to legacy/openerp-7.0/addons/account/report/account_report_view.xml.
- Running grep -E 'parity_anchor|expected_observation|legacy_state|transition_signal|report_contract' context/accounting_parity_map.yml returns contract fields that identify verifiable workflow or report behavior for future tests.
- Unit tests: N/A — context/accounting_parity_map.yml is a static inventory contract and no executable logic is introduced in legacy/openerp-7.0/addons/account/account_invoice.py or report parser modules.
- System integration tests: N/A — this story does not add a modern API boundary or invoke OpenERP report services; it only maps workflow and report contracts in context/accounting_parity_map.yml.
- Mock data/fixtures: N/A — context/accounting_parity_map.yml records the baseline parity inventory, while executable report or workflow fixtures will be created by the later parity harness capability.

**Depends on:** WO-051

### [P0] Classify OSV kernel hubs

Create context/orm_hub_classification.yml so platform engineers can isolate the OpenERP OSV kernel before extracting accounting behavior into Python 3.14-compatible adapters. The source module is the legacy OSV runtime under legacy/openerp-7.0/openerp/osv, specifically legacy/openerp-7.0/openerp/osv/orm.py, legacy/openerp-7.0/openerp/osv/fields.py, legacy/openerp-7.0/openerp/osv/osv.py, and legacy/openerp-7.0/openerp/osv/expression.py. The current state places persistence, field metadata, object service execution, exception normalization, UI modifier compilation, and domain-expression-to-SQL behavior in high-gravity framework files that accounting models call through generic verbs such as search, browse, create, write, and execute. The business impact is migration blast radius: changing a hub file without classification can regress invoices, reports, reconciliation, statement posting, and wizard behavior across the monolith. The target artifact must classify each hub as stable kernel, adapter boundary, extraction candidate, or do-not-touch baseline, with reasoning tied to concrete functions, exported symbols, dependency risk, and accounting modernization implications. When complete, a developer can inspect one YAML file and determine whether a future story should wrap a generic ORM operation, leave it untouched, or extract accounting-specific behavior behind a narrow adapter. This story does not port the OSV runtime, remove circular dependencies, change OpenERP object service behavior, or introduce a new ORM. It depends on the canonical domain terminology capability so accounting-specific adapter candidates use business names rather than repeating generic ORM verbs. It supports operational reliability by making high-fan-in framework risk explicit before any agent changes core runtime files. The artifact should steer future work toward small reversible adapter slices rather than broad edits with uncontrolled blast radius.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | epic:EPIC-001, architecture, orm, migration, risk-control, baseline-inventory, complexity:medium |

**Acceptance Criteria**
- File inspection verifies context/orm_hub_classification.yml exists and includes source_files entries for legacy/openerp-7.0/openerp/osv/orm.py, legacy/openerp-7.0/openerp/osv/fields.py, legacy/openerp-7.0/openerp/osv/osv.py, and legacy/openerp-7.0/openerp/osv/expression.py.
- Running grep -E 'stable_kernel|adapter_boundary|extraction_candidate|do_not_touch_baseline' context/orm_hub_classification.yml returns classification categories for the OSV hub files under legacy/openerp-7.0/openerp/osv.
- Running grep -E 'execute|search|write|create|browse|except_osv|except_orm|expression|domain|fields' context/orm_hub_classification.yml returns high-fan-in operation entries tied to legacy/openerp-7.0/openerp/osv/orm.py, fields.py, osv.py, and expression.py.
- Running grep -E 'account.move.line|account.invoice|account.account|adapter|pure_domain' context/orm_hub_classification.yml returns accounting modernization notes that connect generic ORM hubs to future business-named adapters.
- Running git diff -- legacy/openerp-7.0/openerp/osv/orm.py legacy/openerp-7.0/openerp/osv/fields.py legacy/openerp-7.0/openerp/osv/osv.py legacy/openerp-7.0/openerp/osv/expression.py shows no changes to OSV runtime source files.
- Unit tests: N/A — context/orm_hub_classification.yml is a static architecture inventory and no executable code is changed in legacy/openerp-7.0/openerp/osv/orm.py, fields.py, osv.py, or expression.py.
- System integration tests: N/A — no new service boundary, runtime adapter, or OpenERP object-service behavior is implemented in this story.
- Mock data/fixtures: N/A — this story commits classification metadata only; adapter contract fixtures belong to later extraction and parity-test capabilities.

**Depends on:** WO-051

### [P0] Map tax governance baseline

Create context/tax_governance_map.yml so tax reviewers, controllers, and migration engineers can trace legacy OpenERP tax computation to myERP tax change-control requirements before implementing governed tax configuration. The source module is legacy/openerp-7.0/addons/account/account.py, especially the account_tax model and compute_all, _unit_compute, and _unit_compute_inv tax calculation behavior, with PRD rules from context/PRD_myERP.md for configuration commits, refs, change requests, checks, impact replay, reviews, merge gates, and append-only evidence. Today legacy tax rates are edited in place as account.tax records and the planning documents define branch, diff, check, review, and merge semantics, but there is no single map connecting those target governance rules to the exact legacy tax behavior that parity must preserve. Stakeholders will recognize the impact because a wrong tax rule change can move invoice totals and ledger entries, while auditors need evidence for what changed, who reviewed it, and what the impact replay showed. The target YAML must map legacy tax fields such as amount, type, type_tax_use, price_include, include_base_amount, parent_id, child taxes, and tax code links to myERP governance concepts and PRD FR-CFG rules. It must also identify compute_all parity anchors for percent taxes, fixed taxes, price-included taxes, child taxes, include_base_amount behavior, rounding expectations, and unsupported Python-code tax risks. When complete, a developer can inspect one file and understand which legacy tax semantics must be frozen as parity inputs before version-controlled tax configuration becomes authoritative. This story does not implement tax configuration storage, change requests, merge logic, impact replay, audit logs, or a ported compute_all function. It depends on the canonical finance terminology capability so account.tax and tax-line terms are aligned with the dictionary. The map should provide an operational checklist for later shadow-mode tax replay by separating baseline computation semantics from new governance controls.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | epic:EPIC-001, tax, governance, change-control, parity, baseline-inventory, complexity:medium |

**Acceptance Criteria**
- File inspection verifies context/tax_governance_map.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/account.py, context/PRD_myERP.md, context/MODERNIZATION_INTENT.md, and context/01_TARGET_SPEC.md.
- Running grep -E 'account_tax|compute_all|_unit_compute|_unit_compute_inv|amount|type_tax_use|price_include|include_base_amount|parent_id' context/tax_governance_map.yml returns legacy tax model and computation mappings from legacy/openerp-7.0/addons/account/account.py.
- Running grep -E 'FR-CFG-01|FR-CFG-02|FR-CFG-03|FR-CFG-04|FR-CFG-05|FR-CFG-07|FR-CFG-08|FR-CFG-09|FR-CFG-10|FR-CFG-11' context/tax_governance_map.yml returns PRD tax-governance rule mappings from context/PRD_myERP.md.
- Running grep -E 'percent|fixed|price-included|child taxes|include_base_amount|half-up|rounding|Python code' context/tax_governance_map.yml returns compute_all parity anchors and unsupported-risk notes tied to legacy tax behavior.
- Running grep -E 'No change: 70 documents replayed|USD 13,103.51|SOD-02|SOD-01|SOD-03|ref log|impact' context/tax_governance_map.yml returns Release 1 governance and replay anchors from context/01_TARGET_SPEC.md and context/PRD_myERP.md.
- Unit tests: N/A — context/tax_governance_map.yml is a static traceability and governance inventory and no executable tax calculation or governance logic is added in this story.
- System integration tests: N/A — no tax change-request API, impact replay service, merge gate, or audit-log boundary is implemented in this story.
- Mock data/fixtures: N/A — this story maps fixture requirements and answer-key anchors, while executable tax replay fixtures belong to the later parity harness and tax governance implementation capabilities.

**Depends on:** WO-051

### [P0] Document ledger query contract

Create context/query_get_contract.yml so projection read APIs can preserve legacy ledger and report selection semantics from account_move_line._query_get. The source module is legacy/openerp-7.0/addons/account/account_move_line.py, with downstream consumers in files such as legacy/openerp-7.0/addons/account/account.py and report modules including legacy/openerp-7.0/addons/account/report/account_partner_ledger.py and legacy/openerp-7.0/addons/account/report/account_general_ledger.py. Today _query_get builds context-sensitive SQL fragments from company, fiscal year, period, date, journal, account, move-state, and initial-balance inputs, but those context keys are not captured as a stable contract. Finance stakeholders will recognize the impact because trial balance, general ledger, partner ledger, and account balance projections can drift if filters are reimplemented from table columns without preserving OpenERP context behavior. The target YAML must document each recognized context key, its legacy effect, dependent model or table, observable report impact, parameterization or SQL risk notes, and parity scenarios that later tests must cover. When complete, a developer can inspect one file and understand which filters a modern DTO projection must accept, reject, compare against legacy output, or fail closed. This story does not implement the projection APIs, refactor SQL, introduce psycopg 3 data access, or alter _query_get in the legacy runtime. It depends on canonical finance terminology and workflow/report parity inventory so filter terms and report names remain consistent. It also becomes an operational runbook input for canary read projections because it identifies unsupported filter combinations and P0 comparison requirements before read-authoritative cutover. The map should explicitly call out initial-balance behavior because that is a high-risk ledger-report seam.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | epic:EPIC-001, data-contract, projection, ledger, modernization, baseline-inventory, complexity:medium |

**Acceptance Criteria**
- File inspection verifies context/query_get_contract.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/account_move_line.py, legacy/openerp-7.0/addons/account/account.py, legacy/openerp-7.0/addons/account/report/account_partner_ledger.py, and legacy/openerp-7.0/addons/account/report/account_general_ledger.py.
- Running grep -E 'company_id|fiscalyear|period_from|period_to|date_from|date_to|journal_ids|state|initial_balance|account_id|chart_account_id' context/query_get_contract.yml returns documented _query_get context filters from legacy/openerp-7.0/addons/account/account_move_line.py.
- Running grep -E '_query_get|account_move_line|account_period|account_fiscalyear|account_move|account_account' context/query_get_contract.yml returns the legacy function name and affected table or model references used by reporting filters.
- Running grep -E 'general ledger|partner ledger|trial balance|account balance|initial balance' context/query_get_contract.yml returns report-impact entries tied to ledger projection parity.
- Running grep -E 'unsupported_filter|fail_closed|sql_safety_notes|unresolved_filter_semantics' context/query_get_contract.yml returns operational notes for future projection API boundary behavior.
- Unit tests: N/A — this story creates context/query_get_contract.yml only and does not change executable query logic in legacy/openerp-7.0/addons/account/account_move_line.py.
- System integration tests: N/A — no read projection endpoint or database adapter is implemented, so there is no service boundary to test in this story.
- Mock data/fixtures: N/A — the YAML contract lists required future parity scenarios, while executable ledger fixtures belong to the later parity harness capability.

**Depends on:** WO-051, WO-055

---

## Python 3.14 Runtime and Delivery Foundation

### [P0] Add Python runtime manifest

Add a root `pyproject.toml` and `uv.lock` so the myERP modernization layer has a reproducible Python 3.14 runtime foundation for finance parity, delivery automation, and dependency scanning. The change belongs at the repository root beside `README.md`, while the existing legacy boundary remains documented by `legacy/openerp-7.0/addons/account/__openerp__.py`. The current repository is an OpenERP 7.0 and Python 2-era accounting subsystem, so platform stakeholders cannot yet enforce a supported interpreter, dependency versions, or consistent pytest behavior for new modernization code. The target state is a locked Python 3.14 project contract that can be consumed by local developers, Docker builds, Kubernetes probes, snapshot rehearsal scripts, and Forge Shipping gates. When complete, a developer can synchronize dependencies, verify the lockfile, and run a runtime contract test without importing Python 2-era OpenERP modules. This story does not port `legacy/openerp-7.0/addons/account/account.py`, rewrite OSV models, add finance APIs, configure Kubernetes, or provision PostgreSQL. It should include only maintained dependencies needed by the modernization foundation, including pytest and coverage for tests, `psycopg` 3.x for future managed PostgreSQL interactions, `lxml` for XML mapping tools, and OIDC/JWT libraries for later authentication boundaries. The implementation depends only on the repository’s existing documentation and legacy source layout, and later container, healthcheck, Playwright, PostgreSQL rehearsal, and shipping-gate work depends on this runtime contract. Observable completion includes committed package metadata, committed lock metadata, fixture-backed tests, and runbook commands in `README.md` that produce deterministic test evidence.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P0 |
| Labels | epic:python-3.14-runtime-delivery, platform, packaging, runtime, complexity:medium |

**Acceptance Criteria**
- File inspection confirms `pyproject.toml` exists at the repository root, contains `requires-python = ">=3.14,<3.15"`, and declares dependencies or dependency groups referencing `pytest`, `coverage`, `psycopg`, `lxml`, `Authlib`, and `PyJWT`.
- Running `uv lock --locked` from the repository root exits with status 0 and leaves `uv.lock` unchanged according to `git status --short uv.lock`.
- Unit tests: `uv run pytest tests/test_runtime_contract.py --junitxml=build/test-results/pytest/runtime-contract.xml` exits with status 0 and the XML contains a testcase named `test_python_runtime_declares_314`.
- System integration tests: N/A — this story creates package and runtime metadata only, with no service process, API endpoint, PostgreSQL connection, or OpenERP adapter boundary to exercise.
- Mock data/fixtures: `tests/fixtures/runtime_contract/pyproject_expected_dependencies.json` is committed and `tests/test_runtime_contract.py` reads it to validate dependency names in `pyproject.toml`.
- File inspection confirms `legacy/openerp-7.0/addons/account/__openerp__.py` and `legacy/openerp-7.0/openerp/osv/orm.py` are unchanged by this story.
- File inspection confirms `README.md` documents dependency synchronization, lock verification, and pytest XML generation commands that reference `pyproject.toml`, `uv.lock`, and `build/test-results/pytest/runtime-contract.xml`.

### [P1] Add Python container image

Add `app/Dockerfile` so the Python 3.14 modernization layer can be built as an immutable OCI image for Kubernetes deployment, scanning, canary rollout, and rollback. The change belongs under the modern app boundary at `app/Dockerfile`, with repository-level build context documented in `README.md` and the legacy accounting source still isolated under `legacy/openerp-7.0/addons/account`. The current repository has no container boundary, which prevents platform teams from producing repeatable image evidence or attaching security scans to a specific deployable artifact. The target state is a non-root Python 3.14 image that installs dependencies from `pyproject.toml` and `uv.lock`, can run pytest inside the container, and can later run `app.healthcheck` when that capability exists. When complete, a developer can run a local Docker build, inspect OCI labels, verify Python 3.14 inside the image, and execute the runtime contract test inside the container. This story does not start OpenERP 7.0, implement finance APIs, connect to PostgreSQL, configure Helm, or add observability exporters. It should keep the build context deterministic and avoid copying local virtual environments, Git metadata, build output, or secrets. It depends on the Python 3.14 package and lockfile capability being present so dependency installation is reproducible inside the image rather than resolved differently on developer machines. Observable completion includes `app/Dockerfile`, `.dockerignore`, Dockerfile contract tests, committed label fixtures, and README commands for build and image-level verification.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:python-3.14-runtime-delivery, container, kubernetes-foundation, supply-chain, complexity:medium |

**Acceptance Criteria**
- File inspection confirms `app/Dockerfile` uses a Python 3.14 base image, copies `pyproject.toml` and `uv.lock`, defines a non-root `USER`, and sets a working directory for the modernization layer.
- Running `docker build -f app/Dockerfile -t myerp-finance:local .` exits with status 0 and `docker run --rm myerp-finance:local python -c "import sys; assert sys.version_info[:2] == (3, 14)"` exits with status 0.
- Unit tests: `uv run pytest tests/test_dockerfile_contract.py --junitxml=build/test-results/pytest/dockerfile-contract.xml` exits with status 0 and asserts `app/Dockerfile` contains a non-root `USER` instruction.
- System integration tests: `docker run --rm myerp-finance:local python -m pytest tests/test_runtime_contract.py --junitxml=/tmp/runtime-contract.xml` exits with status 0 inside the built image.
- Mock data/fixtures: `tests/fixtures/dockerfile/expected_labels.json` is committed and `tests/test_dockerfile_contract.py` reads it to verify required OCI label keys in `app/Dockerfile`.
- File inspection confirms `.dockerignore` excludes `.git`, `.venv`, `build/`, `__pycache__/`, and local test-output directories while not excluding `tests/`.
- File inspection confirms `app/Dockerfile` does not contain literal `DATABASE_URL`, OIDC client secrets, registry passwords, Anthropic keys, kubeconfig content, or cloud access tokens.

**Depends on:** WO-052

### [P0] Add runtime enforcement tests

Add `tests/test_runtime_contract.py` so the repository actively enforces the Python 3.14 and dependency contract instead of relying on package metadata review alone. The test belongs in `tests/test_runtime_contract.py` and should validate the root `pyproject.toml` created for the modernization layer while treating `legacy/openerp-7.0/openerp/osv/orm.py` as a non-imported Python 2-era compatibility boundary. Finance and platform stakeholders need this because unsupported runtime drift would undermine parity testing, container builds, and security scanning before accounting migration work begins. The target state is a fixture-backed pytest contract that fails when `requires-python` stops targeting Python 3.14, when required modernization dependencies are removed, or when legacy OpenERP files are accidentally treated as Python 3.14 application code. When complete, a developer can run one pytest command and produce a JUnit XML artifact suitable for Forge Shipping. This story does not add application logic, finance APIs, Docker images, Helm probes, or live PostgreSQL checks. It is scoped to test enforcement for packaging and dependency guarantees already introduced by the runtime manifest capability. It depends on the root package manifest and lockfile being present, because the test reads those files as the source of truth. Observable completion includes the test module, committed fixture data, deterministic JUnit output, and README documentation for the runtime contract gate.

| Field | Value |
|---|---|
| Story Points | 2 |
| Hours | 20h |
| Priority | P0 |
| Labels | epic:python-3.14-runtime-delivery, testing, runtime-contract, quality-gate, complexity:low |

**Acceptance Criteria**
- File inspection confirms `tests/test_runtime_contract.py` reads root `pyproject.toml` and asserts `requires-python` is `>=3.14,<3.15` or an equivalent Python 3.14-only range.
- Running `uv run pytest tests/test_runtime_contract.py --junitxml=build/test-results/pytest/runtime-contract.xml` exits with status 0 and writes `build/test-results/pytest/runtime-contract.xml`.
- Unit tests: `tests/test_runtime_contract.py` includes assertions named for Python runtime declaration, required dependency presence, and legacy OpenERP exclusion, and those assertions pass under `uv run pytest`.
- System integration tests: N/A — this story validates static runtime metadata and does not start a service, connect to PostgreSQL, or cross an API boundary.
- Mock data/fixtures: `tests/fixtures/runtime_contract/pyproject_expected_dependencies.json` is committed and contains dependency names including `pytest`, `coverage`, `psycopg`, `lxml`, `Authlib`, and `PyJWT`.
- File inspection confirms `tests/test_runtime_contract.py` does not import `legacy/openerp-7.0/openerp/osv/orm.py`, `legacy/openerp-7.0/addons/account/account.py`, or any `openerp.osv` module.
- File inspection confirms `README.md` documents the runtime contract command and the JUnit XML path `build/test-results/pytest/runtime-contract.xml`.

**Depends on:** WO-052

### [P1] Add runtime config contract

Add `app/config.py` so the modernization runtime has a typed environment contract for OpenTelemetry, secrets management, OIDC, database URLs, and operational mode before finance services are implemented. The implementation belongs in `app/config.py`, with documentation in `README.md`, while legacy finance semantics remain in `legacy/openerp-7.0/addons/account/account.py` and `legacy/openerp-7.0/addons/account/account_invoice.py`. The current repository has no central configuration module, which means later code could read environment variables ad hoc and leak secrets or behave inconsistently across local, staging, and production deployments. The target state is a small Python 3.14 configuration module that parses required and optional environment variables, redacts sensitive values from diagnostics, and exposes predictable settings for health checks, containers, and shipping gates. When complete, a developer can instantiate settings from a controlled environment fixture, inspect redacted JSON diagnostics, and verify missing required variables fail with business-readable messages. This story does not integrate a real identity provider, connect to a cloud secret manager, initialize OpenTelemetry SDK exporters, or open a PostgreSQL connection. It defines the environment contract that later authentication, observability, and deployment stories consume. It depends on the Python 3.14 manifest so the module and tests run under the same modern package boundary as the rest of the platform foundation. Observable completion includes `app/config.py`, unit tests, committed environment fixtures, and README entries naming every supported variable without committing secret values.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:python-3.14-runtime-delivery, configuration, observability, secrets, complexity:medium |

**Acceptance Criteria**
- File inspection confirms `app/config.py` defines a settings loader function or class that reads `MYERP_ENV`, `DATABASE_URL`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `SECRET_MANAGER_URI`, `OIDC_ISSUER_URL`, and `OIDC_AUDIENCE` from environment variables.
- Running `uv run pytest tests/test_config_contract.py --junitxml=build/test-results/pytest/config-contract.xml` exits with status 0 and writes the JUnit XML file.
- Unit tests: `tests/test_config_contract.py` asserts that `app.config` redacts `DATABASE_URL`, `OIDC_CLIENT_SECRET`, and any variable containing `SECRET` or `TOKEN` when producing diagnostic output.
- System integration tests: N/A — this story defines a local environment contract only and does not call an IdP, secret manager, OpenTelemetry collector, or PostgreSQL endpoint.
- Mock data/fixtures: `tests/fixtures/config/env_contract_required.json` is committed and loaded by `tests/test_config_contract.py` to validate supported variable names and redaction behavior.
- Running a test invocation of the settings loader with `MYERP_ENV=production` and an empty `SECRET_MANAGER_URI` returns or raises a configuration error that references `SECRET_MANAGER_URI` without printing secret values.
- File inspection confirms `README.md` documents the environment variables with placeholders such as `${DATABASE_URL}` and does not contain real database passwords, OIDC secrets, or cloud credentials.

**Depends on:** WO-052

### [P1] Add PostgreSQL rehearsal script

Add `scripts/postgres_snapshot_rehearsal.py` so platform engineers can rehearse sanitized legacy PostgreSQL restores and generate evidence before projection, parity, or rollback work depends on database snapshots. The script belongs under `scripts/postgres_snapshot_rehearsal.py`, with legacy table context derived from `legacy/openerp-7.0/addons/account/account_move_line.py`, `legacy/openerp-7.0/addons/account/account_bank_statement.py`, and the account addon manifest. The current repository contains SQL-heavy accounting behavior but no source-controlled process for proving that a staging snapshot can be restored and smoke-checked. The target state is a safe-by-default CLI that supports dry-run planning, guarded restore execution through environment-provided connection details, smoke-query planning for central accounting tables, and a JSON summary artifact. When complete, SREs can produce `build/postgres-snapshot-rehearsal/restore-summary.json` for a release gate without committing production data or credentials. This story does not provision managed PostgreSQL, access production backups, perform schema migrations, start OpenERP, or validate full accounting parity. It should use subprocess argument arrays rather than shell-concatenated strings and must require both `DATABASE_URL` and an explicit confirmation flag before any restore execution. It depends on the Python 3.14 runtime foundation so the script and mocked tests run under the modern package toolchain. Observable completion includes the script, dry-run fixture metadata, mocked subprocess tests, stable JSON output, and README runbook commands for dry-run and staging use.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:python-3.14-runtime-delivery, postgresql, restore-rehearsal, rollback, complexity:medium |

**Acceptance Criteria**
- Running `uv run python scripts/postgres_snapshot_rehearsal.py --dry-run --snapshot tests/fixtures/postgres_snapshot/sample.dump --output build/postgres-snapshot-rehearsal/restore-summary.json` exits with status 0 and writes JSON containing `mode`, `snapshot`, `commands_planned`, and `legacy_tables_checked`.
- Running `uv run python scripts/postgres_snapshot_rehearsal.py --snapshot tests/fixtures/postgres_snapshot/sample.dump --output build/postgres-snapshot-rehearsal/restore-summary.json` without `DATABASE_URL` and without `--dry-run` exits non-zero and writes an error message referencing `DATABASE_URL`.
- Unit tests: `uv run pytest tests/test_postgres_snapshot_rehearsal.py --junitxml=build/test-results/pytest/postgres-snapshot-rehearsal.xml` exits with status 0 and mocks subprocess execution for `pg_restore` and `psql` command construction.
- System integration tests: N/A — no managed PostgreSQL staging instance or sanitized production-like snapshot is available in the repository; this story provides a mocked rehearsal harness and dry-run contract only.
- Mock data/fixtures: `tests/fixtures/postgres_snapshot/sample.dump` or `tests/fixtures/postgres_snapshot/sample.dump.metadata.json` is committed, and tests use it to verify summary generation without external backup access.
- File inspection confirms `scripts/postgres_snapshot_rehearsal.py` includes smoke-query references to `account_move_line`, `account_move`, `account_account`, `account_period`, and `account_fiscalyear` table names.
- File inspection confirms `scripts/postgres_snapshot_rehearsal.py` constructs subprocess commands as argument arrays and does not use `shell=True` for `pg_restore` or `psql` execution.

**Depends on:** WO-052

### [P1] Add Playwright parity tooling

Add `package.json` and `playwright.config.ts` so selected legacy accounting UI assets and workflow screens can be validated with Node.js 24 browser parity tests before UI-adjacent modernization work proceeds. The configuration belongs at the repository root in `package.json` and `playwright.config.ts`, using `legacy/openerp-7.0/addons/account/__openerp__.py` and `legacy/openerp-7.0/addons/account/account_invoice_view.xml` as source references for fixture-backed accounting screen coverage. The current repository contains OpenERP XML views and small JavaScript assets, but no Node.js manifest, browser test runner, or JUnit output for release gates. The target state is a deterministic Playwright harness that runs in fixture mode by default and can optionally target a live legacy OpenERP URL through `LEGACY_OPENERP_BASE_URL`. When complete, QA and SRE teams can run Playwright locally or in Forge Shipping and archive `build/test-results/playwright/junit.xml` as release evidence. This story does not redesign the frontend, rewrite legacy JavaScript, start an OpenERP 7.0 server, test every wizard, or validate ledger posting in a browser. It should commit fixture data derived from legacy account assets so CI remains deterministic without production credentials or browser storage state. It depends on the Python runtime foundation for shared repository conventions and on the selected accounting widget or browser parity scope from the broader parity-test capability. Observable completion includes a Node.js 24 engine declaration, Playwright configuration, fixture-backed specs, committed fixtures, and README commands for fixture-mode and live-URL execution.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:python-3.14-runtime-delivery, nodejs, playwright, javascript-parity, complexity:medium |

**Acceptance Criteria**
- File inspection confirms `package.json` declares a Node.js 24-compatible `engines.node` range and includes `@playwright/test` as a development dependency or package-manager equivalent.
- File inspection confirms `playwright.config.ts` sets `testDir` to a committed Playwright test directory, configures JUnit output at `build/test-results/playwright/junit.xml`, and derives its base URL from `process.env.LEGACY_OPENERP_BASE_URL` rather than a hard-coded production URL.
- Running `npx playwright test --config=playwright.config.ts --reporter=junit` with no `LEGACY_OPENERP_BASE_URL` exits with status 0 and writes `build/test-results/playwright/junit.xml` containing a testcase for fixture-mode legacy account asset validation.
- Unit tests: N/A — this story adds Node.js and Playwright browser-test configuration rather than Python application logic; verification is performed by Playwright execution and configuration inspection.
- System integration tests: the Playwright spec references `legacy/openerp-7.0/addons/account/account_invoice_view.xml` or account addon asset inventory and conditionally exercises `LEGACY_OPENERP_BASE_URL` when provided, while default CI uses fixture mode without network access.
- Mock data/fixtures: `tests/playwright/fixtures/legacy_account_assets.json` is committed and loaded by a Playwright spec to verify expected legacy account JavaScript or XML asset references without starting OpenERP.
- File inspection confirms no committed browser storage state, session cookie, user credential, or live OpenERP URL appears under `tests/playwright`, `playwright.config.ts`, or `package.json`.

**Depends on:** WO-052, WO-053

### [P1] Add healthcheck Helm probes

Add `app/healthcheck.py` and `helm/myerp-finance` Kubernetes probes so the modernization container has an operable readiness boundary before any finance traffic or parity jobs rely on it. The implementation belongs in `app/healthcheck.py` and Helm chart files under `helm/myerp-finance`, while the finance-critical legacy context remains in `legacy/openerp-7.0/addons/account/account_move_line.py` and `legacy/openerp-7.0/addons/account/account_invoice.py`. The current repository has no explicit service entrypoint, liveness command, readiness command, or Helm chart, which leaves SREs without a deterministic deployment health signal. The target state is a command-based health module that emits sanitized JSON, returns exit code 0 for healthy runtime checks, and returns non-zero for configured dependency failures such as a required missing database URL. When complete, platform engineers can run `python -m app.healthcheck`, render the Helm chart, and inspect the rendered Deployment for liveness and readiness probes that call the health command. This story does not implement finance APIs, OIDC token validation, live database migrations, OpenERP adapters, or production dashboards. It should keep checks local and deterministic by default so pull-request validation does not contact production PostgreSQL or managed services. It depends on the Python 3.14 package and OCI image capability so the health command can run locally and inside the same image that Kubernetes deploys. Observable completion includes the health module, Helm chart, Helm fixtures, unit tests, chart contract tests, and README runbook commands that explain healthy, degraded, and failed modes.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:python-3.14-runtime-delivery, kubernetes, healthcheck, operability, complexity:medium |

**Acceptance Criteria**
- Running `uv run python -m app.healthcheck` exits with status 0 and writes JSON containing `status`, `runtime.python`, and `checks` keys; `runtime.python` starts with `3.14` when executed under the project runtime.
- Running `MYERP_HEALTHCHECK_REQUIRE_DATABASE=1 DATABASE_URL= uv run python -m app.healthcheck` exits with a non-zero status and the JSON output contains a failed check named `database_url_configured`.
- Unit tests: `uv run pytest tests/test_healthcheck.py --junitxml=build/test-results/pytest/healthcheck.xml` exits with status 0 and asserts success and missing-database failure payloads from `app.healthcheck.main`.
- System integration tests: `helm template myerp-finance helm/myerp-finance --set image.repository=myerp-finance --set image.tag=local` exits with status 0 and rendered YAML contains `readinessProbe`, `livenessProbe`, and command reference `python -m app.healthcheck`.
- Mock data/fixtures: `tests/fixtures/healthcheck/expected_success.json` and `tests/fixtures/helm/values-minimal.yaml` are committed and read by healthcheck or Helm contract tests.
- File inspection confirms `helm/myerp-finance/values.yaml` contains configurable `image.repository`, `image.tag`, `resources`, `env`, `readinessProbe`, and `livenessProbe` sections without literal secret values.
- File inspection confirms `app/healthcheck.py` reports sanitized error class names and does not print `DATABASE_URL` values or environment variable contents.

**Depends on:** WO-058

### [P1] Add Forge shipping gates

Add `.forge/shipping.yml` so each modernization change is built, tested, scanned, deployed, and gated with auditable evidence before it can influence finance runtime delivery. The pipeline definition belongs under `.forge/shipping.yml`, with command references to `pyproject.toml`, `app/Dockerfile`, `app/healthcheck.py`, `helm/myerp-finance`, `playwright.config.ts`, and `scripts/postgres_snapshot_rehearsal.py`. The current repository has no CI/CD contract, so SREs and finance control owners cannot prove that runtime tests, image scans, restore rehearsal, browser parity, Helm rendering, and readiness checks ran before promotion. The target state is a source-controlled Forge Shipping contract with explicit build, unit-test, integration-test, scan, push, deploy, post-deploy, rollback, and manual approval gates. When complete, a developer can run a local validator and pytest tests that inspect the shipping file without requiring live Forge, Kubernetes, registry, or PostgreSQL credentials. This story does not provision Forge accounts, Kubernetes clusters, container registries, managed PostgreSQL, IdP tenants, cloud secret-manager entries, or production approvals. It should treat missing evidence artifacts as release blockers and use variable placeholders such as `${DATABASE_URL}`, `${REGISTRY_IMAGE}`, and `${KUBE_CONTEXT}` rather than literal secrets. It depends on runtime contract tests, health probes, Playwright parity configuration, PostgreSQL rehearsal, and the Docker image capability so the pipeline references real repository commands. Observable completion includes `.forge/shipping.yml`, a local validator script, shipping fixtures, pytest coverage, README runbook commands, and an explicit manual finance control-owner gate before production promotion.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:python-3.14-runtime-delivery, ci-cd, forge-shipping, release-gates, complexity:medium |

**Acceptance Criteria**
- File inspection confirms `.forge/shipping.yml` defines stages or steps for Python dependency sync from `pyproject.toml`, pytest execution with `--junitxml=build/test-results/pytest/finance.xml`, Docker build from `app/Dockerfile`, image scan, image push, Helm deploy, readiness verification, PostgreSQL snapshot rehearsal, and Playwright test execution from `playwright.config.ts`.
- Running `uv run python scripts/validate_shipping_config.py .forge/shipping.yml` exits with status 0 and reports artifact paths `build/test-results/pytest/finance.xml`, `build/test-results/playwright/junit.xml`, and `build/postgres-snapshot-rehearsal/restore-summary.json`.
- Unit tests: `uv run pytest tests/test_shipping_config.py --junitxml=build/test-results/pytest/shipping-config.xml` exits with status 0 and asserts `.forge/shipping.yml` contains no literal secret values such as database passwords, kubeconfig bodies, registry passwords, or bearer tokens.
- System integration tests: `.forge/shipping.yml` contains a post-deploy or integration gate that invokes `python -m app.healthcheck` and a Helm readiness check against `helm/myerp-finance`, and `scripts/validate_shipping_config.py` asserts both command references are present.
- Mock data/fixtures: `tests/fixtures/shipping/required_steps.json` is committed and `tests/test_shipping_config.py` loads it to compare required Forge Shipping stage names, command substrings, and artifact paths.
- File inspection confirms production deployment in `.forge/shipping.yml` is gated by a manual approval step named for finance or control-owner approval before any production Helm promotion.
- File inspection confirms `.forge/shipping.yml` references `app/Dockerfile`, `helm/myerp-finance`, `app.healthcheck`, `scripts/postgres_snapshot_rehearsal.py`, and `playwright.config.ts` exactly as committed paths.

**Depends on:** WO-059, WO-068, WO-062, WO-061

---

## Accounting Parity Test Harness

### [P0] Inventory legacy parity fixtures

Create a versioned parity fixture inventory so modernization engineers can trace every legacy accounting scenario before replacing tax, invoice, ledger, reporting, or workflow behavior. The work belongs in the legacy accounting baseline area around legacy/openerp-7.0/addons/account/account_unit_test.xml, legacy/openerp-7.0/addons/account/account_assert_test.xml, and a new context/parity_fixture_inventory.yml artifact. Today the existing OpenERP test evidence is scattered across XML assertions, YAML scenarios under the account addon, and planning notes, so reviewers cannot tell which fixtures protect which accounting invariant. The target state is a committed YAML inventory that names each legacy fixture, its source file, covered models, workflow actions, expected assertions, and modernization parity category. When this is finished, a developer can open context/parity_fixture_inventory.yml and find entries for invoice posting, paid-state reconciliation, balanced move assertions, bank or cash statement scenarios, fiscal close scenarios, and report-total references where source files exist. This improves release safety because parity tests can fail from a missing baseline rather than silently skipping critical finance behavior. This story does not translate the fixtures into executable pytest tests, port compute_all, or implement browser automation. It depends on the legacy account addon remaining readable in place and on the modernization context documents being treated as planning references rather than executable truth. The inventory should be operationally useful for CI later by using deterministic identifiers and relative file paths only.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P0 |
| Labels | parity, fixture-inventory, modernization, accounting, complexity:medium |

**Acceptance Criteria**
- File inspection of context/parity_fixture_inventory.yml shows entries referencing legacy/openerp-7.0/addons/account/account_unit_test.xml with model account.invoice, workflow action invoice_open, function pay_and_reconcile, and final assertion state paid.
- File inspection of context/parity_fixture_inventory.yml shows an entry referencing legacy/openerp-7.0/addons/account/account_assert_test.xml with model account.move and function account_assert_balanced.
- Running python -c "import yaml; data=yaml.safe_load(open('context/parity_fixture_inventory.yml')); assert 'fixtures' in data and len(data['fixtures']) >= 2" exits with status 0 and reads the committed YAML fixture inventory.
- Unit tests: N/A — this story creates a static inventory artifact and can be verified by YAML parsing and file inspection of context/parity_fixture_inventory.yml.
- System integration tests: N/A — no executable harness or service boundary is introduced in this story.
- Mock data / fixtures: context/parity_fixture_inventory.yml is committed and contains fixture metadata for legacy/openerp-7.0/addons/account/account_unit_test.xml and legacy/openerp-7.0/addons/account/account_assert_test.xml.

### [P0] Create pytest parity harness

Add a pytest parity harness so accounting modernization tests can load legacy OpenERP fixture references deterministically and run without a live OpenERP server. The work belongs in a new tests/parity/conftest.py file that consumes context/parity_fixture_inventory.yml and references legacy/openerp-7.0/addons/account/account_unit_test.xml as a baseline source. Today developers can read XML and YAML scenarios manually, but there is no Python 3-compatible harness that exposes them as reusable pytest fixtures. The target state is a conftest module with fixture-loading helpers, XML parsing helpers, stable fixture identifiers, and explicit skip or failure behavior for missing legacy assets. When complete, running pytest tests/parity --collect-only should discover parity tests without requiring PostgreSQL, psycopg2, or the OpenERP 7 runtime. This matters operationally because CI parity gates need deterministic fixture discovery before any runtime replacement can be promoted from shadow mode. This story does not implement compute_all parity, invoice workflow assertions, ledger reports, or browser tests. It depends on a committed fixture inventory and on a Python test scaffold being available from the broader modernization foundation. The harness should be small, observable, and debuggable, with assertion messages that include the legacy source file path and fixture identifier.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | pytest, parity-harness, automation, modernization, complexity:medium |

**Acceptance Criteria**
- Running pytest tests/parity --collect-only exits with status 0 and imports tests/parity/conftest.py without importing openerp.osv from legacy/openerp-7.0/openerp/osv/osv.py.
- Unit tests: tests/parity/test_parity_harness_inventory.py verifies load_parity_inventory reads context/parity_fixture_inventory.yml and returns at least the legacy/openerp-7.0/addons/account/account_unit_test.xml fixture entry.
- System integration tests: pytest tests/parity/test_parity_harness_inventory.py validates that tests/parity/conftest.py can parse legacy/openerp-7.0/addons/account/account_unit_test.xml and expose an account.invoice fixture identifier.
- Mock data / fixtures: context/parity_fixture_inventory.yml remains committed and tests/parity/test_parity_harness_inventory.py uses it instead of requiring a PostgreSQL database or OpenERP demo database.
- File inspection of tests/parity/conftest.py shows helper functions named load_parity_inventory and parse_legacy_xml_fixture.

**Depends on:** WO-052, WO-053

### [P0] Port tax compute_all parity

Port the legacy account.tax compute_all behavior into a Python 3.14-compatible module so invoice tax calculations can be tested before the OpenERP runtime is replaced. The work belongs in a new app/finance/tax/compute_all.py file using legacy/openerp-7.0/addons/account/account.py as the reference for account_tax.compute_all, _unit_compute, and _unit_compute_inv semantics. Today the authoritative tax computation lives inside a Python 2-era OSV model with browse records, floats, and OpenERP currency rounding. The target state is a pure Python function that accepts explicit tax definitions, price, quantity, product or partner placeholders where needed, and currency precision, then returns base, total_excluded, total_included, and tax-line details with deterministic Decimal rounding. When complete, pytest parity tests demonstrate percent taxes, fixed taxes, price-included taxes, child taxes, include_base_amount behavior, and half-up two-decimal rounding. This protects controllers and tax reviewers from silent invoice total drift during migration. This story does not implement tax configuration version control, impact replay, invoice posting, or authorization policy. It depends on the parity pytest harness and on the modern application scaffold for Python 3.14-compatible domain modules. The module should be operationally safe for CI by being deterministic, dependency-light, and free of database calls.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | tax, compute-all, parity, python314, complexity:high |

**Acceptance Criteria**
- Unit tests: pytest tests/parity/test_compute_all.py exits with status 0 and includes assertions for percent, fixed, price_include, child tax, include_base_amount, and Decimal ROUND_HALF_UP behavior in app/finance/tax/compute_all.py.
- System integration tests: pytest tests/parity/test_compute_all.py::test_compute_all_legacy_invoice_fixture uses fixture metadata derived from legacy/openerp-7.0/addons/account/account_unit_test.xml and asserts a 1850 untaxed invoice-line total before tax application.
- Mock data / fixtures: tests/parity/fixtures/compute_all_cases.yml is committed and contains named cases for percent, fixed, price_included, child_tax, and include_base_amount.
- File inspection of app/finance/tax/compute_all.py shows a public function named compute_all and no import from openerp.osv, legacy.openerp, or psycopg2.
- Running python -m pytest tests/parity/test_compute_all.py -q exits with status 0 and reports the app/finance/tax/compute_all.py module path in any assertion traceback.

**Depends on:** WO-057, WO-063

### [P1] Test statement close reconciliation

Add parity tests for bank statement confirmation, statement closing, reconciliation, and fiscal-year close references so side-effectful ledger flows have guardrails before migration. The work belongs in a new tests/parity/test_statement_close_reconcile.py file that references legacy/openerp-7.0/addons/account/account_bank_statement.py and legacy/openerp-7.0/addons/account/wizard/account_fiscalyear_close.py. Today these flows create and mutate account.move, account.move.line, account.move.reconcile, account.period, and account.fiscalyear records through OpenERP model methods and direct SQL. The target state is a deterministic pytest contract that validates fixture metadata, expected method names, required preconditions, and representative balanced output lines without executing the destructive legacy operations. When complete, CI can detect missing coverage for button_confirm_bank, create_move_from_st_line, statement_close, reconcile, and fiscal close carry-forward expectations. This matters to controllers because statement posting and fiscal close are privileged workflows that can materially change ledger state. This story does not implement policy enforcement, production reconciliation APIs, or a live database replay of fiscal close SQL. It depends on the parity harness and on modern invoice or ledger fixture seams being available for representative move-line assertions. The tests should be explicit that legacy remains authoritative and that any future adapter must satisfy these parity expectations before cutover.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | bank-statement, reconciliation, fiscal-close, parity, complexity:medium |

**Acceptance Criteria**
- Unit tests: pytest tests/parity/test_statement_close_reconcile.py exits with status 0 and asserts fixture coverage for button_confirm_bank, create_move_from_st_line, statement_close, and account_fiscalyear_close.data_save.
- System integration tests: tests/parity/test_statement_close_reconcile.py uses the parity harness inventory and a ledger fixture to assert generated statement move lines balance by move_id and company_id.
- Mock data / fixtures: tests/parity/fixtures/statement_close_reconcile.yml is committed and includes at least one bank statement line, one reconciliation group, and one fiscal close carry-forward scenario.
- File inspection of tests/parity/test_statement_close_reconcile.py shows references to legacy/openerp-7.0/addons/account/account_bank_statement.py and legacy/openerp-7.0/addons/account/wizard/account_fiscalyear_close.py.
- Running python -m pytest tests/parity/test_statement_close_reconcile.py -q exits with status 0 without executing cr.execute statements from account_fiscalyear_close.py.

**Depends on:** WO-055, WO-063

### [P0] Test balanced ledger invariants

Add parity tests for balanced journal and trial-balance invariants so ledger modernization cannot proceed when journal lines fail to net to zero. The work belongs in a new tests/parity/test_ledger_trial_balance.py file that references legacy/openerp-7.0/addons/account/account_move_line.py and legacy/openerp-7.0/addons/account/account_assert_test.xml. Today the legacy module has account.move.line behavior and an XML account_assert_balanced call, but no Python 3 parity test that can run as an early CI gate. The target state is a deterministic pytest module that builds representative journal-line fixtures, groups them by move, company, currency, and account, and asserts debit minus credit equals zero for balanced moves and trial balance totals. When complete, the tests provide a machine-checkable control for the stakeholder success metric of zero non-zero imbalance across tested entries. This story does not implement projection read APIs, modify _query_get, or connect to a live OpenERP database. It depends on the parity harness and on the ledger data-access seam being available for modernization tests. The tests should produce operationally useful failure output that identifies the move id, company id, currency, debit total, credit total, and imbalance. This creates a low-blast-radius guardrail before report and projection work consumes ledger data.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | ledger, trial-balance, parity, accounting-controls, complexity:medium |

**Acceptance Criteria**
- Unit tests: pytest tests/parity/test_ledger_trial_balance.py exits with status 0 and contains assertions named test_balanced_move_lines_net_to_zero and test_trial_balance_totals_net_to_zero.
- System integration tests: tests/parity/test_ledger_trial_balance.py uses the parity harness to read the fixture entry for legacy/openerp-7.0/addons/account/account_assert_test.xml and assert model account.move is covered.
- Mock data / fixtures: tests/parity/fixtures/ledger_trial_balance.yml is committed and contains at least one balanced move and one intentionally imbalanced sample used by a negative assertion.
- File inspection of tests/parity/test_ledger_trial_balance.py shows references to account_move_line.py semantics including debit, credit, move_id, company_id, and currency_id fields.
- Running python -m pytest tests/parity/test_ledger_trial_balance.py -q exits with status 0 without importing psycopg2 or connecting to PostgreSQL.

**Depends on:** WO-065, WO-063

### [P1] Test ledger report totals

Add parity tests for general ledger and partner ledger totals so projection APIs cannot drift from legacy report semantics. The work belongs in a new tests/parity/test_ledger_reports.py file that references legacy/openerp-7.0/addons/account/report/account_general_ledger.py, legacy/openerp-7.0/addons/account/report/account_partner_ledger.py, and legacy/openerp-7.0/addons/account/account_move_line.py. Today legacy report totals are built through report parsers and SQL fragments that depend on account_move_line._query_get context semantics. The target state is a pytest contract that validates report filter fixtures for company, fiscal year, date range, period range, move state, partner, journal, and initial-balance behavior. When complete, representative report-total fixtures can be compared against modern DTO projections before any read-authoritative cutover. This matters operationally because ledger reports are controller-facing evidence, and mismatched totals would block finance sign-off. This story does not implement the projection read API, replace RML rendering, or benchmark report performance. It depends on the parity harness and ledger adapter or deterministic report-total fixtures. The tests should fail with filter names and source report paths so SRE and engineering teams can triage parity regressions from CI output quickly.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | ledger-reports, general-ledger, partner-ledger, parity, complexity:medium |

**Acceptance Criteria**
- Unit tests: pytest tests/parity/test_ledger_reports.py exits with status 0 and asserts debit, credit, balance, initial_balance, and ending_balance totals from tests/parity/fixtures/ledger_report_totals.yml.
- System integration tests: tests/parity/test_ledger_reports.py validates that report fixture filters map to _query_get context keys from legacy/openerp-7.0/addons/account/account_move_line.py.
- Mock data / fixtures: tests/parity/fixtures/ledger_report_totals.yml is committed and contains separate general_ledger and partner_ledger scenarios with company_id, fiscalyear_id, date_from, date_to, target_move, and initial_balance fields.
- File inspection of tests/parity/test_ledger_reports.py shows references to legacy/openerp-7.0/addons/account/report/account_general_ledger.py and legacy/openerp-7.0/addons/account/report/account_partner_ledger.py.
- Running python -m pytest tests/parity/test_ledger_reports.py -q exits with status 0 without rendering any .rml report template.

**Depends on:** WO-065, WO-063

### [P0] Test invoice workflow parity

Add invoice workflow parity tests so draft-to-open-to-paid behavior remains measurable while invoice and tax logic are migrated. The work belongs in a new tests/parity/test_invoice_workflow.py file that references legacy/openerp-7.0/addons/account/account_invoice.py, legacy/openerp-7.0/addons/account/account_invoice_workflow.xml, and legacy/openerp-7.0/addons/account/account_unit_test.xml. Today invoice behavior is split between Python model methods such as button_reset_taxes, compute_invoice_totals, and confirm_paid and XML workflow signals such as invoice_open. The target state is a pytest module that parses the legacy XML fixture, verifies expected workflow signal names, computes invoice-line untaxed totals, applies the modern compute_all module where tax cases require it, and asserts expected state milestones from draft to open to paid. When complete, a developer can run one pytest command and see whether the legacy invoice fixture still maps to the modernization invoice workflow contract. This protects finance operators because invoice posting and paid-state changes are high-risk daily workflows. This story does not implement a production invoice API, write to account_move_line, or replace the OpenERP workflow engine. It depends on the parity harness, the ported tax calculation seam, and any modern invoice domain fixtures supplied by earlier adapter work. Failure output should include the fixture id, workflow action, expected state, and source XML path to reduce mean time to triage.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | invoice, workflow, parity, tax, complexity:high |

**Acceptance Criteria**
- Unit tests: pytest tests/parity/test_invoice_workflow.py exits with status 0 and asserts that legacy/openerp-7.0/addons/account/account_unit_test.xml contains workflow action invoice_open for model account.invoice.
- System integration tests: tests/parity/test_invoice_workflow.py imports compute_all from app/finance/tax/compute_all.py and uses it in an invoice tax parity case tied to the account.invoice fixture.
- Mock data / fixtures: tests/parity/fixtures/invoice_workflow_cases.yml is committed and includes expected states draft, open, and paid for the test_invoice_1 fixture.
- File inspection of tests/parity/test_invoice_workflow.py shows assertions for sum([l.price_subtotal for l in invoice_line]) == 1850 derived from legacy/openerp-7.0/addons/account/account_unit_test.xml.
- Running python -m pytest tests/parity/test_invoice_workflow.py -q exits with status 0 without invoking netsvc.LocalService or a live OpenERP workflow service.

**Depends on:** WO-055, WO-063, WO-069

### [P2] Add accounting browser parity spec

Add Playwright browser parity coverage for accounting workflow screens so XML view and reconciliation interactions that affect finance behavior are not lost during modernization. The work belongs in a new tests/browser/accounting_workflows.spec.ts file that references legacy/openerp-7.0/addons/account/account_invoice_view.xml and legacy/openerp-7.0/addons/account/account_move_reconciliation.xml. Today accounting UI behavior is defined through OpenERP XML views, buttons, groups, domains, and workflow actions, while the repository has little evidence of automated browser coverage for these interactions. The target state is a browser spec that opens the legacy-compatible test shell supplied by the browser scaffold, verifies invoice workflow controls and reconciliation screen affordances, and records selectors or test hooks used for parity-critical paths. When complete, the browser suite can detect when invoice posting or reconciliation UI surfaces disappear even if lower-level parity tests still pass. This matters because accountants operate these workflows through screens, and UI drift can block safe shadow-mode validation. This story does not redesign the frontend, implement authentication, assert full posting parity in the browser, or replace OpenERP XML views. It depends on a browser automation scaffold and invoice workflow parity tests so selected browser flows map to already-defined accounting behavior. The spec should be reliable in CI by using deterministic fixture state, explicit waits, and business-readable failure messages.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P2 |
| Labels | browser, playwright, invoice-ui, reconciliation-ui, complexity:medium |

**Acceptance Criteria**
- Unit tests: N/A — this story adds browser integration coverage in tests/browser/accounting_workflows.spec.ts rather than unit-level TypeScript functions.
- System integration tests: npx playwright test tests/browser/accounting_workflows.spec.ts exits with status 0 against the configured legacy-compatible test shell and includes assertions for invoice workflow and reconciliation UI surfaces.
- Mock data / fixtures: the browser spec references fixture identifiers from context/parity_fixture_inventory.yml or tests/parity/fixtures/invoice_workflow_cases.yml so it does not depend on untracked manual UI setup.
- File inspection of tests/browser/accounting_workflows.spec.ts shows references to legacy/openerp-7.0/addons/account/account_invoice_view.xml and legacy/openerp-7.0/addons/account/account_move_reconciliation.xml in test metadata or comments.
- The Playwright assertion output includes locator names for invoice action controls and reconciliation controls when npx playwright test tests/browser/accounting_workflows.spec.ts --reporter=line is run.

**Depends on:** WO-062, WO-078

---

## Tax Configuration Change Control

### [P0] Define tax change-control schemas

Create the tax configuration schema models so governed tax changes have typed commits, refs, change requests, checks, reviews, and ref-log evidence instead of ad hoc dictionaries. The implementation belongs in the new Tax Configuration module at app/tax_config/schema.py, with the business rules traced to context/01_TARGET_SPEC.md and the legacy tax baseline traced to legacy/openerp-7.0/addons/account/account.py. Today the legacy account_tax model stores mutable tax configuration in place, which leaves tax reviewers and auditors without a durable representation of what changed, who proposed it, or which commit was reviewed. The target state is a Python 3.14-compatible schema layer that represents a complete rate-table commit, mutable branch refs, immutable tags, append-only ref-log rows, numbered change requests, check runs, and reviews bound to a head hash. When this story is complete, a developer can import app.tax_config.schema and instantiate deterministic model objects whose canonical JSON can be hashed and compared in repository tests. The schema must make status values explicit for open, merged, closed, queued checks, success or failure checks, approved, changes requested, and blocked reviews so downstream gates do not rely on string guessing. This story does not implement persistence, branch editing, impact replay, review policy enforcement, merge behavior, UI screens, or API endpoints. It depends on the seed data and modern application scaffold being present, and it provides the typed contract that repository, change-request, check, review, impact, and merge components will consume.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | tax-change-control, schema, modernization, auditability, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_schema.py exits with status 0 and asserts app/tax_config/schema.py exposes ConfigCommit, ConfigRef, RefLogEntry, ChangeRequest, CheckRun, Review, and ReviewDecision.
- Unit tests: tests/tax_config/test_schema.py asserts canonical_json in app/tax_config/schema.py produces identical bytes for equivalent dictionaries with different key order and distinct bytes when rates.US-NY-NYC.New York City.rate changes.
- System integration tests: python -m pytest tests/integration/test_tax_config_schema_contract.py exits with status 0 and validates that a ChangeRequest created from schema.py carries number, source_ref, target_ref, head_hash, base_hash, merge_base_hash, effective_from, status, proposer_id, created_at, and updated_at.
- Mock data and fixtures: tests/fixtures/tax_config/minimal_rates.yml and tests/fixtures/tax_config/minimal_change_request.json are committed and loaded by tests/tax_config/test_schema.py without network calls or a database.
- File inspection: app/tax_config/schema.py defines an explicit immutable tag representation on ConfigRef or RefKind and includes docstrings or type annotations for protected main refs and append-only RefLogEntry fields.
- File inspection: app/tax_config/schema.py contains no imports from legacy/openerp-7.0 and does not modify legacy/openerp-7.0/addons/account/account.py.

**Depends on:** WO-052, WO-057

### [P0] Implement content-addressed tax repository

Implement the tax configuration repository so rate tables are stored as SHA-256 content-addressed commits with protected main refs, movable branches, immutable tags, and append-only ref-log evidence. The implementation belongs in the Tax Configuration module at app/tax_config/repository.py and must consume the schema contracts from app/tax_config/schema.py. The legacy account.tax records in legacy/openerp-7.0/addons/account/account.py are edited in place, so controllers cannot reproduce the exact configuration in force for a prior review or prove which ref movement introduced a rate. The target repository must treat every commit as a complete configuration snapshot, not a patch, because impact replay and audit re-performance need to load any commit independently. When complete, a developer can initialize a repository from rates.yml, read main, create a branch, commit a changed full configuration, move the branch, create a tag, and inspect ref-log rows without mutating historical commits. Direct movement of main must be refused unless the caller uses a merge-only pathway reserved for the later merge gate. Tags must refuse movement after creation, and every permitted ref movement must append a row with from_hash, to_hash, actor, reason, and timestamp. This story does not implement field-level editing, change request numbering, checks, impact replay, SOD reviews, audit hash chains, or UI screens. It depends on the schema layer providing deterministic commit, ref, and ref-log models.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | tax-change-control, repository, immutability, auditability, complexity:high |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_repository.py exits with status 0 and asserts app/tax_config/repository.py create_commit stores a complete configuration whose hash equals SHA-256 of schema.canonical_json(content).
- Unit tests: tests/tax_config/test_repository.py asserts update_ref in app/tax_config/repository.py refuses direct movement of ref main with a ProtectedRefError or ValueError naming main.
- Unit tests: tests/tax_config/test_repository.py asserts create_tag followed by a second move of the same tag in repository.py raises an immutable tag error and leaves the tag hash unchanged.
- System integration tests: python -m pytest tests/integration/test_tax_config_repository_flow.py exits with status 0 and verifies initialize_from_rates, create_branch, commit_to_branch, create_tag, and list_ref_log across app/tax_config/repository.py.
- Mock data and fixtures: tests/fixtures/tax_config/repository_rates.yml is committed and used by tests/integration/test_tax_config_repository_flow.py to initialize main with reason repository initialised.
- File inspection: app/tax_config/repository.py contains no imports from legacy/openerp-7.0 and no code path that updates or deletes an existing ConfigCommit or RefLogEntry object.

**Depends on:** WO-067

### [P0] Add tax branch editor diffs

Implement branch editing and change-request creation so tax engineers can propose rate changes by natural key and reviewers can see deterministic field-level diff paths before checks and approval. The implementation belongs in the Tax Configuration module at app/tax_config/change_requests.py and must use app/tax_config/repository.py for branch, commit, and ref operations. Today the legacy tax setup in legacy/openerp-7.0/addons/account/account.py stores rate changes as direct mutations, so reviewers have no branch, no head hash, and no field path such as rates.US-NY-NYC.New York City.rate to inspect. The target behavior creates a branch from main, applies edits to records addressed by jurisdiction code, component name, and effective-from date, commits the full configuration with a message, and opens a numbered change request. The change request must store source and target refs, head and base hashes, merge-base hash, effective-from date, status, proposer, title, body, and timestamps. The diff must compare merge base to head at field level and output one row per changed path with before and after values so auditors can re-perform the review. When complete, a developer can run tests that open CR-0001 from a branch edit and assert the exact changed path for a New York City rate edit. This story does not implement merge-clean, config-loads, impact replay, SOD review decisions, merge gates, dashboard rendering, or agent proposal parsing. It depends on the schema and repository capabilities for commits, refs, canonical hashes, and protected main behavior.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | tax-change-control, change-request, diff, governance, complexity:high |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_change_requests.py exits with status 0 and asserts app/tax_config/change_requests.py create_branch_edit addresses a rate by jurisdiction_code, component_name, and effective_from rather than list position.
- Unit tests: tests/tax_config/test_change_requests.py asserts field_level_diff in app/tax_config/change_requests.py emits path rates.US-NY-NYC.New York City.rate with before Decimal 0.045 and after Decimal 0.05 for the fixture edit.
- Unit tests: tests/tax_config/test_change_requests.py asserts open_change_request generates CR-0001 and stores source_ref, target_ref, head_hash, base_hash, merge_base_hash, effective_from, status open, proposer_id, title, and body.
- System integration tests: python -m pytest tests/integration/test_tax_config_change_request_flow.py exits with status 0 and validates repository initialization, branch creation, branch commit, change request opening, and diff retrieval across repository.py and change_requests.py.
- Mock data and fixtures: tests/fixtures/tax_config/change_request_rates.yml and tests/fixtures/tax_config/nyc_rate_edit.json are committed and loaded by tests/tax_config/test_change_requests.py.
- File inspection: app/tax_config/change_requests.py does not import legacy/openerp-7.0/addons/account/account.py and does not modify main directly when creating or editing a branch.

**Depends on:** WO-075

### [P0] Add tax merge and load checks

Implement the merge-clean and config-loads checks so every tax change request can be evaluated before impact replay, approval, or merge. The implementation belongs in the Tax Configuration module at app/tax_config/checks.py and must consume change-request state from app/tax_config/change_requests.py plus commit contents from app/tax_config/repository.py. In the legacy system, account.tax changes in legacy/openerp-7.0/addons/account/account.py are editable without structural merge checks or validation that all rates parse, dates are ordered, and referenced jurisdictions exist. The target behavior runs merge-clean as a three-way structural merge at path level and records conflicts when both target and source changed the same path differently since merge base. The config-loads check must parse rates.yml-shaped configuration, verify rate values are in the half-open interval from 0 inclusive to 1 exclusive, verify effective dates are ordered for each jurisdiction component, and verify every jurisdiction referenced by seeded tax lines exists. Each check run must store its conclusion, summary, detail, head hash, check name, and timestamp so the merge gate can later require green checks on the current head. When complete, a developer can run tests that generate passing check records for a clean New York rate edit and failing records for path conflicts, invalid rates, unordered effective dates, and missing jurisdictions. This story does not implement the impact check, SOD reviews, merge commit creation, audit logging, UI panels, or external service calls. It depends on branch editing and change request creation already producing head, base, and merge-base hashes.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | tax-change-control, checks, validation, merge-safety, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_checks.py exits with status 0 and asserts app/tax_config/checks.py run_merge_clean returns conclusion success for a branch where only head changed rates.US-NY-NYC.New York City.rate.
- Unit tests: tests/tax_config/test_checks.py asserts run_merge_clean in app/tax_config/checks.py returns conclusion failure and detail path rates.US-NY-NYC.New York City.rate when base target and branch head changed that path to different values.
- Unit tests: tests/tax_config/test_checks.py asserts run_config_loads in app/tax_config/checks.py fails a fixture where a rate is Decimal 1.0 or greater and summary contains the invalid path.
- Unit tests: tests/tax_config/test_checks.py asserts run_config_loads fails unordered effective_from entries for the same jurisdiction component and fails a tax-line fixture referencing an unknown jurisdiction code.
- System integration tests: python -m pytest tests/integration/test_tax_config_checks_flow.py exits with status 0 and validates change_requests.py plus checks.py record merge-clean and config-loads CheckRun objects bound to the current head_hash.
- Mock data and fixtures: tests/fixtures/tax_config/checks_valid_rates.yml, tests/fixtures/tax_config/checks_conflict_rates.yml, and tests/fixtures/tax_config/checks_tax_lines.json are committed and used by tests/tax_config/test_checks.py.

**Depends on:** WO-082

### [P0] Implement SOD tax reviews

Implement tax change-review rules so approval attempts are evaluated in the required segregation-of-duties order and blocked attempts become evidence rather than hidden UI state. The implementation belongs in the Tax Configuration module at app/tax_config/reviews.py and must operate on change requests from app/tax_config/change_requests.py. The legacy security model in legacy/openerp-7.0/addons/account/security/account_security.xml defines groups and record rules, but it does not encode Release 1 tax approval rules for agents, proposers, and tax reviewers. The target behavior evaluates SOD-02 first for agent actors, SOD-01 second for the change-request proposer, and SOD-03 third for human actors without the tax_reviewer role when the change touches tax configuration. A blocked attempt must append a review record with decision blocked, rule id, message, actor, change request number, and reviewed head hash so auditors can see the control operated. An eligible tax reviewer must be able to append an approved review bound to the current head hash, and a new commit on the branch must leave earlier approvals present but stale. When complete, tests can reproduce the governance scenario where Claude is blocked by SOD-02, Tam is blocked by SOD-01, Maya is blocked by SOD-03, and Priya approves the same current head. This story does not implement authentication, user-interface button visibility, check execution, merge gating, audit hash-chain persistence, or agent natural-language proposal generation. It depends on an actor/principal representation with kind and roles, plus change-request objects that expose proposer and current head hash.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | tax-change-control, segregation-of-duties, reviews, auditability, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_reviews.py exits with status 0 and asserts app/tax_config/reviews.py approve_change_request blocks an actor with kind agent using rule_id SOD-02.
- Unit tests: tests/tax_config/test_reviews.py asserts approve_change_request blocks the proposer actor with rule_id SOD-01 and message containing prepared CR-0001.
- Unit tests: tests/tax_config/test_reviews.py asserts approve_change_request blocks an actor missing tax_reviewer role with rule_id SOD-03 and message containing Approval needs the tax_reviewer role.
- Unit tests: tests/tax_config/test_reviews.py asserts an actor with kind human, not proposer, and role tax_reviewer appends a Review with decision approved and reviewed_head_hash equal to the change request current head_hash.
- Unit tests: tests/tax_config/test_reviews.py asserts mark_stale_reviews or equivalent stale detection marks prior approved reviews stale after change_requests.py commits a new head on the source branch.
- System integration tests: python -m pytest tests/integration/test_tax_config_review_flow.py exits with status 0 and validates the Claude, Tam, Maya, and Priya governance sequence against one change request.
- Mock data and fixtures: tests/fixtures/tax_config/principals.json and tests/fixtures/tax_config/review_change_request.json are committed and include claude, tam, maya, and priya actors with kind and roles.
- File inspection: app/tax_config/reviews.py contains the rule evaluation order SOD-02 before SOD-01 before SOD-03.

**Depends on:** WO-054, WO-082

### [P0] Implement tax impact replay

Implement the tax impact replay check so reviewers can see exactly how a proposed tax configuration changes replayed invoice tax lines before approval or merge. The implementation belongs in the Tax Configuration module at app/tax_config/impact.py and must call the modern tax compute implementation in app/finance/tax/compute_all.py rather than reintroducing legacy OpenERP account.tax execution. The legacy tax behavior is documented in legacy/openerp-7.0/addons/account/account.py and preserved by compute_all parity work, but the legacy system cannot answer what an already issued invoice would have done under a proposed configuration. The target behavior replays the 70-document and 608-line seed scenarios from data/answer_key.json against the configuration in force and the proposed head configuration. The impact result must report documents replayed, documents changed, totals by currency, a by-jurisdiction table with before, after, delta, and new-obligation flag, top movers, duration, and a one-sentence headline. The check must fail only when a new obligation appears in a jurisdiction where the document entity has no registration, while no-money-change edits such as a jurisdiction rename must remain a successful impact result. When complete, no-edit replay returns the exact answer-key headline and every replayed line old_minor equals stored tax_minor, and the New York City edit returns the documented USD 13,103.51 movement. This story does not implement merge-clean or config-loads, review approval, merge movement of main, UI rendering, or agent explanations. It depends on the ported compute_all capability and prior check infrastructure so impact can be stored as the third required check on the current head.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | tax-change-control, impact-replay, parity, performance, complexity:high |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_impact.py exits with status 0 and asserts app/tax_config/impact.py replay_impact calls app.finance.tax.compute_all.compute_all or the exported compute_all function from app/finance/tax/compute_all.py.
- Unit tests: tests/tax_config/test_impact.py asserts no-edit replay over data/answer_key.json returns headline No change: 70 documents replayed, none moved. and every result line old_minor equals stored tax_minor.
- Unit tests: tests/tax_config/test_impact.py asserts the US-NY-NYC New York City rate change from 0.045 to 0.05 returns headline 6 of 70 documents move by USD 13,103.51. and top mover CINV-US-2026-000016 has delta_minor 250040.
- Unit tests: tests/tax_config/test_impact.py asserts the by_jurisdiction result for US-NY-NYC reports before USD 232,587.29, after USD 245,690.80, and delta USD 13,103.51 using integer minor units or Decimal formatting.
- System integration tests: python -m pytest tests/integration/test_tax_config_impact_check_flow.py exits with status 0 and validates checks.py can store an impact CheckRun for the current change request head_hash.
- Mock data and fixtures: data/answer_key.json plus tests/fixtures/tax_config/impact_nyc_edit.json are committed and loaded by tests/tax_config/test_impact.py without external services.
- Performance verification: tests/tax_config/test_impact.py includes an assertion that replay_impact over the 70-document seed completes with duration_ms less than 1000 on the test runner path used by the project.
- File inspection: app/tax_config/impact.py contains no float-based money accumulation and no imports from legacy/openerp-7.0/addons/account/account.py.

**Depends on:** WO-069, WO-089

### [P0] Implement governed tax merge gate

Implement the governed tax merge gate so a change request can move protected main only after current green checks, a current valid approval, and append-only evidence are present. The implementation belongs in the Tax Configuration module at app/tax_config/merge.py and must coordinate repository.py, checks.py, impact.py, reviews.py, and the audit/ref-log capability provided by the completed evidence component. In the legacy system, tax changes in legacy/openerp-7.0/addons/account/account.py can become effective through in-place edits, so there is no merge commit with two parents, no enforced current-head approval, and no ref-log row proving main moved. The target behavior must require merge-clean, config-loads, and impact checks to have conclusion success on the change request current head hash. It must also require at least one non-stale approved review bound to that same head hash and must evaluate merge actor eligibility through the same SOD review rules so agents and blocked actors cannot merge. When all gates pass, merge.py must create a merge commit on main with two parents, move protected main through the repository's merge-only path, append a ref-log row with actor and reason, mark the change request merged, and write an audit row. When any gate fails, the function must fail closed, leave main unchanged, and return a business-readable refusal naming the first missing or failed precondition. This story does not implement branch editing, check algorithms, impact replay calculations, review policy internals, UI screens, or external deployment automation. It depends on green-check records, SOD review records, and append-only audit/ref-log writing already being available.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | tax-change-control, merge-gate, auditability, control-plane, complexity:high |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/tax_config/test_merge.py exits with status 0 and asserts app/tax_config/merge.py refuses merge when merge-clean CheckRun for the current head_hash is missing.
- Unit tests: tests/tax_config/test_merge.py asserts merge.py refuses merge when config-loads or impact has conclusion failure on the current head_hash and leaves repository.get_ref main unchanged.
- Unit tests: tests/tax_config/test_merge.py asserts merge.py refuses merge when the only approved Review has reviewed_head_hash different from the change request current head_hash.
- Unit tests: tests/tax_config/test_merge.py asserts merge.py refuses merge for an actor with kind agent and records or returns rule_id SOD-02.
- Unit tests: tests/tax_config/test_merge.py asserts a successful merge creates a ConfigCommit with exactly two parents, marks the ChangeRequest status merged, and moves ref main from the old hash to the merge commit hash.
- System integration tests: python -m pytest tests/integration/test_tax_config_merge_flow.py exits with status 0 and validates branch edit, checks, impact, Priya approval, merge, main ref movement, ref-log append, and audit row write across app/tax_config modules.
- Mock data and fixtures: tests/fixtures/tax_config/merge_ready_change_request.json and tests/fixtures/tax_config/merge_ready_checks.json are committed and used by tests/tax_config/test_merge.py.
- File inspection: app/tax_config/merge.py calls repository.py through a merge-specific protected-main movement function and does not call ordinary update_ref for ref main.

**Depends on:** WO-095, WO-090, WO-076

---

## Audit Evidence and Governed Agent Controls

### [P0] Add hash-chained audit log

Add a hash-chained append-only audit log with a verification action so controllers and auditors can prove tax governance actions were recorded without tampering. The new implementation belongs in the modern audit module at app/audit/log.py, while the legacy accounting baseline remains anchored in legacy/openerp-7.0/addons/account/account.py and must not be edited. Today the OpenERP 7.0 accounting code records important tax, invoice, and ledger behavior but does not provide a deterministic audit chain for the new myERP tax change-control workflow. The target behavior is an append-only JSONL event stream where each row contains a canonical body hash, the previous row hash, and a row hash that can be recomputed by a developer or CI job. When the story is complete, a developer can append sample audit events, run the verify action, and see a successful result for an intact file and a deterministic failure for a tampered or truncated file. This gives the finance platform an operationally simple control surface: evidence write failures can fail closed, and SREs can diagnose chain breaks from row numbers and hashes without a live database. The story is limited to the audit-log library, verification action, tests, and deterministic fixtures, and it does not add a UI, object-storage retention policy, Kubernetes deployment, or formal compliance certification claim. It depends on the existing tax configuration repository and governed action capabilities being able to supply event names, actors, subjects, reasons, and timestamps, but it should keep persistence local and deterministic for seed-scale testing. The implementation should favor Python standard-library components such as json, hashlib, datetime, pathlib, argparse, and dataclasses so the audit verifier can run in CI without external services.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | auditability, governance, modernization, reliability, complexity:medium |

**Acceptance Criteria**
- Unit tests are written and passing with python -m pytest tests/audit/test_log.py, including assertions that app/audit/log.py append_audit_event writes prev_hash, body_hash, row_hash, and sequence fields and that verify_audit_log returns valid=True for tests/fixtures/audit/audit_log_valid.jsonl.
- System integration test is written and passing with python -m pytest tests/integration/test_audit_log_verify_action.py, including a subprocess assertion that python -m app.audit.log verify --path tests/fixtures/audit/audit_log_valid.jsonl exits with status code 0 and prints a machine-readable valid result.
- Mock data and fixtures are generated and committed under tests/fixtures/audit/, including audit_log_valid.jsonl and audit_log_tampered.jsonl where python -m app.audit.log verify --path tests/fixtures/audit/audit_log_tampered.jsonl exits with status code 1 and identifies the failing row number.
- File inspection of app/audit/log.py shows a canonical_json function or equivalent deterministic canonicalization path that uses json.dumps with sort_keys=True and fixed separators before SHA-256 hashing.
- File inspection of app/audit/log.py shows no imports from legacy/openerp-7.0 and no direct mutation of legacy/openerp-7.0/addons/account/account.py or any file under legacy/openerp-7.0/.
- Running python -m app.audit.log append --path tests/tmp/audit_log.jsonl --event test.event --actor system --subject CR-TEST --reason fixture creates a JSONL row containing event, actor, subject, reason, occurred_at, prev_hash, body_hash, and row_hash fields.

**Depends on:** WO-067

### [P1] Add governed Claude proposal tool

Add a typed Claude tax proposal tool so the governed agent principal can turn plain-English tax change requests into validated change requests without gaining approval or merge authority. The new implementation belongs in app/agents/claude_tax_agent.py and must operate alongside the legacy tax reference in legacy/openerp-7.0/addons/account/account.py without importing or modifying that legacy file. Today the modernization context describes persona claude as an agent, but the repository has no typed proposal module, no deterministic no-key behavior, and no shared boundary that prevents the agent from using raw SQL or bypassing change-request controls. The target behavior is a Python 3.14-compatible module exposing typed request and response structures for proposing tax changes, explaining missing configuration, and delegating actual change-request creation to the same change-control capability a person uses. When the story is complete, a developer can run agent tests with no Anthropic API key and see a clear missing-key response, then run mocked SDK tests that open a change request as Claude and append audit evidence. This supports safe operational rollout because staging and CI can validate the governed-agent boundary without calling an external model provider. The story is not allowed to implement approval, posting, merge bypasses, raw database tools, new accounting product capabilities, or prompt-only enforcement of segregation of duties. It depends on the principal or persona capability that defines Claude as kind agent, the change-request API that creates branches and requests, and the audit log that records typed tool calls. Use the official Anthropic SDK only behind an injectable client boundary so unit tests are deterministic and production secrets stay in the environment.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P1 |
| Labels | agent-control, tax-change-control, segregation-of-duties, auditability, complexity:high |

**Acceptance Criteria**
- Unit tests are written and passing with python -m pytest tests/agents/test_claude_tax_agent.py, including assertions that app/agents/claude_tax_agent.py propose_tax_change returns a missing_api_key status when ANTHROPIC_API_KEY is absent and does not call an external client.
- System integration test is written and passing with python -m pytest tests/integration/test_claude_tax_agent_change_request.py, including a mocked Anthropic response that produces a change request opened_by value of claude through the existing change-request creation path.
- Mock data and fixtures are generated and committed under tests/fixtures/agents/, including a plain-English prompt such as raise Sale VAT to 16% from 1 October and a structured mocked model response containing jurisdiction or tax component, rate, effective_from, title, and body.
- File inspection of app/agents/claude_tax_agent.py shows typed input and output structures named ProposalRequest and ProposalResult or equivalent dataclasses, and no function named approve, merge, post, or execute_sql is exposed by the agent module.
- The test tests/agents/test_claude_tax_agent.py asserts that the agent response includes actor_id equal to claude and actor_kind equal to agent for successful mocked proposal creation.
- The integration test tests/integration/test_claude_tax_agent_change_request.py asserts that app/audit/log.py append_audit_event is called or that a committed audit fixture row is written for the agent proposal tool call.

**Depends on:** WO-082, WO-076

### [P1] Test Claude merge refusal evidence

Add agent tests proving that Claude cannot merge a tax change request and that the SOD-02 refusal is stored as review and audit evidence. The new test file belongs at tests/agents/test_claude_merge_refusal.py and should exercise app/agents/claude_tax_agent.py together with the review policy and app/audit/log.py evidence chain. Today context/PRD_myERP.md requires agent merge attempts to be refused and recorded, but there is no automated test that demonstrates the control operating through the same boundary a demo or integration would use. The target behavior is a deterministic pytest scenario where a fixture change request is ready for merge, Claude asks to merge, the policy denies with rule id SOD-02, a blocked review is stored, and an audit row records the refusal. When complete, a developer can run one test file and inspect fixture or tmp_path output to see the exact denial message and audit row hash. This improves operational readiness because refusals are treated as positive control evidence rather than invisible UI restrictions or prompt-only behavior. The story does not implement new SOD rules, does not allow Claude to approve or merge, does not add a UI button, and does not call the Anthropic API. It depends on the review and merge policy capability already enforcing segregation-of-duties order and on the governed agent module exposing a merge-request path that delegates to policy rather than bypassing it. The test should be written so a regression that lets an agent merge, skips blocked-review persistence, or fails to audit the attempt produces a clear CI failure.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | agent-control, segregation-of-duties, auditability, tax-change-control, complexity:medium |

**Acceptance Criteria**
- Unit tests are written and passing with python -m pytest tests/agents/test_claude_merge_refusal.py, including an assertion that a Claude merge attempt returns rule_id equal to SOD-02 and status equal to blocked or refused.
- System integration coverage is written and passing in tests/agents/test_claude_merge_refusal.py by invoking the agent merge request path in app/agents/claude_tax_agent.py and the review or merge policy path used by the application rather than directly constructing the final refusal object.
- Mock data and fixtures are generated and committed under tests/fixtures/change_requests/ or tests/fixtures/agents/, including a merge-ready change request fixture with green checks and at least one current human approval so the only expected blocker for Claude is SOD-02.
- The test tests/agents/test_claude_merge_refusal.py asserts that the blocked review message contains the exact text fragment is an AI agent and approving and posting belong to a person or to the system after a person approves.
- The test tests/agents/test_claude_merge_refusal.py asserts that an audit evidence row is appended through app/audit/log.py with event equal to change_request.merge_blocked or an equivalent refusal event and actor equal to claude.
- The test tests/agents/test_claude_merge_refusal.py asserts that the change request status remains open and that the main ref hash is unchanged after Claude's refused merge attempt.

**Depends on:** WO-090, WO-091

### [P1] Verify Claude impact explanations

Add deterministic grounding eval tests for Claude impact explanations so every displayed figure can be traced to the impact result before finance users or auditors see it. The new tests belong in tests/evals/test_agent_grounding.py and exercise the agent explanation behavior implemented in app/agents/claude_tax_agent.py, while the legacy impact baseline remains documented by context/01_TARGET_SPEC.md. Today the PRD guardrail says numbers must be verified before shown, but there is no executable eval proving that an agent explanation cannot invent document counts, currency movement, jurisdiction totals, or top movers. The target behavior is a repeatable pytest eval that feeds known impact results and candidate explanations into the grounding checker and asserts acceptance for exact supported figures and rejection for unsupported, rounded incorrectly, or hallucinated figures. When complete, a developer can run one pytest file and see clear failures when the agent note includes a number not present in the impact result or derivable from it. This protects operational reliability because model wording can change while the accounting evidence boundary remains deterministic and testable in CI. The story does not call the Anthropic API, does not update tax impact calculation rules, does not add a UI, and does not broaden the tax engine beyond the Release 1 seed scenarios. It depends on the governed agent module exposing an explanation or grounding hook and on the impact check capability producing structured documents replayed, totals by currency, jurisdiction deltas, top movers, duration, and headline fields. The tests should use committed fixtures for the New York scenario so SREs can reproduce failures without external services.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | agent-control, evals, impact-replay, auditability, complexity:medium |

**Acceptance Criteria**
- Unit tests are written and passing with python -m pytest tests/evals/test_agent_grounding.py, including an assertion that a candidate explanation containing USD 13,103.51, 6 of 70 documents, and CINV-US-2026-000016 is accepted when those figures exist in tests/fixtures/impact/new_york_city_rate_change.json.
- System integration coverage is written and passing in tests/evals/test_agent_grounding.py by importing the explanation or grounding function from app/agents/claude_tax_agent.py and asserting that unsupported figures are rejected before the explanation result is marked showable.
- Mock data and fixtures are generated and committed under tests/fixtures/impact/, including new_york_city_rate_change.json with documents_replayed, documents_changed, totals_by_currency, by_jurisdiction, top_movers, duration, and headline fields.
- The test tests/evals/test_agent_grounding.py asserts that an explanation mentioning USD 13,103.52 is rejected when the fixture contains USD 13,103.51, proving precision-sensitive verification.
- The test tests/evals/test_agent_grounding.py asserts that an explanation mentioning a nonexistent invoice identifier is rejected even if all currency totals are otherwise valid.
- N/A — no HTTP endpoint or database integration is required because this story is an eval test suite for deterministic agent grounding behavior.

**Depends on:** WO-095, WO-091

### [P1] Export change-request evidence packs

Add change-request evidence pack export with a canonical SHA-256 digest so auditors can re-perform what changed, which checks ran, who reviewed it, and what immutable evidence was written. The new implementation belongs in app/audit/evidence_pack.py and should consume the modern change-request, check, review, ref-log, and audit-log capabilities while keeping legacy accounting files such as legacy/openerp-7.0/addons/account/account_invoice.py read-only. Today the PRD requires evidence packs, but the repository does not have an export module that assembles a complete canonical body for a single change request. The target behavior is a deterministic JSON-compatible export containing the request metadata, diff rows, check runs, impact headline and tables, reviews including blocked reviews, related ref-log rows, and audit-log row hashes. When the story is complete, a developer can run the export against committed fixture data and recompute the SHA-256 digest from the canonical body with no network or database dependency. This reduces audit and support recovery time because an operator can hand one reproducible evidence body and digest to a reviewer instead of screenshots or ad hoc database extracts. The story does not implement object-storage upload, retention lifecycle rules, a public download endpoint, UI screens, or formal compliance certification wording. It depends on the completed audit hash chain and the completed tax change-request workflow being able to expose diffs, checks, reviews, merge status, and ref-log rows through deterministic functions or repository fixtures. The implementation should fail closed when required evidence components are missing, because a partial pack could create false confidence for finance sign-off.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | auditability, evidence, tax-change-control, reliability, complexity:medium |

**Acceptance Criteria**
- Unit tests are written and passing with python -m pytest tests/audit/test_evidence_pack.py, including an assertion that app/audit/evidence_pack.py export_evidence_pack returns a canonical_sha256 equal to hashlib.sha256(canonical_json(pack_body).encode('utf-8')).hexdigest().
- System integration test is written and passing with python -m pytest tests/integration/test_evidence_pack_export.py, including an assertion that exporting tests/fixtures/change_requests/CR-0001.json produces body.change_request.number equal to CR-0001 and includes diff, checks, reviews, ref_log_rows, and audit_rows keys.
- Mock data and fixtures are generated and committed under tests/fixtures/change_requests/ and tests/fixtures/audit/, including a merged CR fixture with at least one successful impact check, one approval review, one ref-log row, and linked audit row hashes.
- File inspection of app/audit/evidence_pack.py shows canonical_sha256 is computed from the canonical pack body and not from a pretty-printed or filesystem-dependent representation.
- The test tests/audit/test_evidence_pack.py asserts that export_evidence_pack raises or returns an invalid result when a requested change request fixture is missing check results or audit row hashes.
- N/A — no new HTTP endpoint is required in this story because app/audit/evidence_pack.py is a library and command-line export boundary only.

**Depends on:** WO-076, WO-100

---

## Central Authentication and Domain Policy Boundary

### [P0] Enforce OIDC finance actor validation

Add a centralized OIDC token validation module that rejects caller-controlled actor identity for write-capable finance requests so accountants and controllers cannot mutate ledger state through spoofed `X-Actor` headers. The change belongs in a new `app/security/oidc.py` module, with the legacy security intent still traceable to `legacy/openerp-7.0/addons/account/security/account_security.xml` and the modernization warning documented in `context/MODERNIZATION_INTENT.md`. Today the repository has legacy XML groups and modernization notes about `X-Actor`, but no deterministic token validation boundary that can fail closed before invoice posting, journal posting, reconciliation, or close actions. The completed behavior is an importable security module that validates bearer tokens with Authlib, returns a server-derived actor object, and refuses production write requests when the only identity evidence is an `X-Actor` header. Finance stakeholders should see this as the first hard control that prevents persona switching from becoming a production trust boundary. The module must expose deterministic behavior for missing authorization, invalid tokens, expired tokens, insufficient token claims, and demo/shadow-only actor headers. This story does not introduce a full login UI, provision an identity provider, implement Kubernetes secrets, or change legacy OpenERP XML/RPC behavior directly. It depends on the modern application scaffold and the existing persona header plumbing so that the new module can replace header trust without breaking shadow-mode demonstrations. It also depends on the audit/event capability being available later for downstream policy stories, but this story only returns security decisions and refusal details rather than persisting full audit evidence.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | security, authentication, finance-write-boundary, modernization, complexity:medium |

**Acceptance Criteria**
- Unit tests: `pytest tests/security/test_oidc.py -q` exits with code 0 and includes assertions that `app/security/oidc.py::authenticate_request` returns `AuthError.status_code == 401` for a missing `Authorization` header and `AuthError.status_code == 403` for a production POST request that only contains `X-Actor`.
- System integration tests: `pytest tests/security/test_oidc_api_boundary.py -q` exits with code 0 and includes a simulated `POST /finance/invoices/INV-001/post` request where `X-Actor: tam` without `Authorization: Bearer <token>` is rejected before any adapter function is invoked.
- Mock data/fixtures: `tests/fixtures/security/oidc_jwks.json` and `tests/fixtures/security/oidc_claims.json` are committed and `pytest tests/security/test_oidc.py::test_valid_token_maps_server_actor -q` asserts the fixture token claims map to a server-side actor id rather than the `X-Actor` header value.
- File inspection: `app/security/oidc.py` imports Authlib token/JWK functionality and contains named functions `authenticate_request`, `validate_bearer_token`, and `reject_x_actor_for_write`.
- File inspection: `app/security/oidc.py` contains a write-method guard for `POST`, `PUT`, `PATCH`, and `DELETE`, and `grep -R "X-Actor" app/security/oidc.py tests/security/test_oidc.py` shows explicit denied-path coverage for write-capable requests.
- N/A — database schema changes are not required because `app/security/oidc.py` validates request identity and returns an in-memory actor context without creating tables.

**Depends on:** WO-052, WO-054

### [P0] Map legacy groups to RBAC

Add a finance RBAC module that converts legacy accounting groups and multi-company scope intent into executable roles so authorization decisions are enforced server-side rather than inferred from menus or persona selection. The change belongs in a new `app/security/rbac.py` module and must read the access intent represented by `legacy/openerp-7.0/addons/account/security/account_security.xml` plus `legacy/openerp-7.0/addons/account/security/ir.model.access.csv`. The current OpenERP security files define groups such as Invoicing and Payments, Accountant, and Financial Manager, but those definitions are not available to a Python 3.14-compatible policy module. When complete, a developer can call the RBAC module with an authenticated actor and receive normalized role names and company scopes that downstream finance policy code can evaluate for invoice posting, reconciliation, statement confirmation, and close actions. This reduces operational blast radius by replacing scattered XML/menu assumptions with a single, testable authorization mapping layer. The module must preserve multi-company intent from record rules such as `child_of user.company_id.id` without pretending to be a full OpenERP rule engine. This story does not implement posting policy decisions, OIDC validation, audit persistence, or modifications to legacy model access files. It depends on the central authenticated actor capability so the role mapper receives server-derived principals instead of trusting `X-Actor` input. It also depends on the legacy security XML and CSV inventory being available in the repository so tests can validate mappings without a live OpenERP database.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | security, authorization, rbac, multi-company, complexity:medium |

**Acceptance Criteria**
- Unit tests: `pytest tests/security/test_rbac.py -q` exits with code 0 and asserts `app/security/rbac.py::map_legacy_group_to_role('group_account_manager') == 'financial_manager'`, `group_account_user == 'accountant'`, and `group_account_invoice == 'invoicing_payments'.
- System integration tests: `pytest tests/security/test_rbac_policy_boundary.py -q` exits with code 0 and asserts an authenticated actor with role `financial_manager` and company scope `1` is accepted by `app/security/rbac.py::build_authorization_context` while a token-derived actor with no finance groups has an empty finance role list.
- Mock data/fixtures: `tests/fixtures/security/legacy_account_security_subset.xml` and `tests/fixtures/security/ir_model_access_subset.csv` are committed, and `pytest tests/security/test_rbac.py::test_fixture_group_extraction -q` asserts five group ids are extracted from the XML fixture.
- File inspection: `app/security/rbac.py` contains named functions `load_legacy_account_groups`, `load_model_access_rows`, `map_legacy_group_to_role`, and `build_authorization_context`.
- File inspection: `app/security/rbac.py` includes constants or mappings for `group_account_invoice`, `group_account_user`, `group_account_manager`, `group_proforma_invoices`, and `group_supplier_inv_check_total` from `legacy/openerp-7.0/addons/account/security/account_security.xml`.
- N/A — database schema changes are not required because role and company-scope mapping is computed from token claims and committed XML/CSV metadata.

**Depends on:** WO-054, WO-064

### [P0] Centralize finance policy preconditions

Add a centralized finance policy evaluator that checks role, company, accounting period, document state, and audit preconditions before any privileged posting or reversal workflow is allowed. The change belongs in a new `app/policy/finance_policy.py` module and must explicitly model legacy-sensitive workflows referenced by `legacy/openerp-7.0/addons/account/account_invoice_workflow.xml`, `legacy/openerp-7.0/addons/account/account_bank_statement.py`, `legacy/openerp-7.0/addons/account/account_move_line.py`, and `legacy/openerp-7.0/addons/account/wizard/account_fiscalyear_close.py`. Today those workflows are distributed across XML states, UI actions, OSV model methods, wizard validations, and direct SQL, so a controller cannot inspect one policy surface to understand why a finance mutation is allowed. When complete, adapters and future APIs can call one function and receive an allow or deny decision with a rule id, business-readable message, and audit-required flag. The business impact is safer migration: finance writes remain blocked unless a server-authenticated and RBAC-mapped actor meets the same role and company expectations that were previously scattered across OpenERP security files. The evaluator must fail closed when audit evidence context is missing for sensitive actions because auditability is an explicit internal-control requirement. This story does not call legacy posting methods, implement token validation, parse all OpenERP workflows, or create persistent audit tables. It depends on the central authenticated actor capability, executable RBAC mapping, and an existing audit decision/evidence capability so policy can reason about whether sensitive actions have an evidence target. It is intentionally reusable by both legacy adapters and future Python 3.14 service APIs so operational controls do not fork during migration.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | finance-policy, authorization, auditability, posting-controls, complexity:high |

**Acceptance Criteria**
- Unit tests: `pytest tests/policy/test_finance_policy.py -q` exits with code 0 and asserts `app/policy/finance_policy.py::evaluate_finance_action` denies `post_invoice` when the actor lacks `accountant` or `financial_manager` role and returns `decision.allowed is False` with a non-empty `rule_id`.
- System integration tests: `pytest tests/policy/test_finance_policy_boundary.py -q` exits with code 0 and combines `app/security/oidc.py`, `app/security/rbac.py`, and `app/policy/finance_policy.py` fixtures to assert a valid financial manager can receive an allow decision for `confirm_bank_statement` only when company, period, state, and audit context are present.
- Mock data/fixtures: `tests/fixtures/policy/finance_actions.json` and `tests/fixtures/policy/finance_documents.json` are committed, and `pytest tests/policy/test_finance_policy.py::test_fixture_actions_cover_required_workflows -q` asserts fixtures include `post_invoice`, `post_journal`, `reconcile_move_lines`, `confirm_bank_statement`, `close_fiscal_year`, and `reverse_journal`.
- File inspection: `app/policy/finance_policy.py` defines `FinanceAction`, `FinancePolicyInput`, `PolicyDecision`, and `evaluate_finance_action` with explicit fields for `roles`, `company_id`, `period_state`, `document_state`, and `audit_context`.
- File inspection: `app/policy/finance_policy.py` contains rule ids for role, company, period, state, and audit preconditions, and `grep -R "audit" app/policy/finance_policy.py tests/policy/test_finance_policy.py` shows fail-closed test coverage for missing audit context.
- N/A — database schema changes are not required in this story because policy evaluation returns decisions and expects an external audit/evidence writer from prior capabilities.

**Depends on:** WO-055, WO-076, WO-071

### [P0] Guard invoice posting and reconciliation

Add a guarded write adapter for invoice posting and move-line reconciliation so high-risk finance mutations cannot bypass the central policy layer when modern APIs begin wrapping legacy OpenERP behavior. The change belongs in a new `app/adapters/guarded_write_adapter.py` module and must map specifically to `legacy/openerp-7.0/addons/account/account_invoice.py` for invoice posting and `legacy/openerp-7.0/addons/account/account_move_line.py` for `reconcile` and `reconcile_partial`. Today these legacy model methods are available as OpenERP OSV operations, while the target modernization layer needs business-named commands that always evaluate policy before mutation. When complete, calling the adapter with denied policy input returns a refusal result and never invokes the injected legacy executor, while allowed policy input invokes only the named legacy action wrapper and returns lineage about the attempted object ids. This gives platform and finance teams a smaller blast radius than exposing generic `write`, `execute`, or OpenERP browse objects to future API consumers. The adapter must be designed for shadow/pilot operation with dependency-injected executors so tests can verify behavior without a live OpenERP database. This story does not rewrite `account_invoice.py`, change reconciliation algorithms, implement DTO read projections, or make write-authoritative cutover decisions. It depends on the centralized finance policy evaluator and on previously defined adapter conventions for isolating legacy model calls. It must preserve operational debuggability by returning policy decision ids, action names, and legacy model/function names in every result.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P0 |
| Labels | legacy-adapter, finance-writes, invoice-posting, reconciliation, complexity:high |

**Acceptance Criteria**
- Unit tests: `pytest tests/adapters/test_guarded_write_adapter.py -q` exits with code 0 and asserts `app/adapters/guarded_write_adapter.py::post_invoice` does not call the fake legacy executor when `PolicyDecision.allowed is False`.
- System integration tests: `pytest tests/adapters/test_guarded_write_adapter_boundary.py -q` exits with code 0 and asserts simulated `POST /finance/invoices/INV-001/post` and `POST /finance/reconciliations` paths call `evaluate_finance_action` before the injected legacy functions for `account.invoice` and `account.move.line`.
- Mock data/fixtures: `tests/fixtures/adapters/invoice_post_request.json` and `tests/fixtures/adapters/reconcile_request.json` are committed, and `pytest tests/adapters/test_guarded_write_adapter.py::test_adapter_fixtures_are_loadable -q` asserts both fixtures include `company_id`, `period_id`, `document_state`, and `audit_context`.
- File inspection: `app/adapters/guarded_write_adapter.py` defines `post_invoice`, `reconcile_move_lines`, and `reconcile_move_lines_partial`, and each function imports or receives `evaluate_finance_action` from `app/policy/finance_policy.py`.
- File inspection: `app/adapters/guarded_write_adapter.py` contains explicit legacy mapping strings for `legacy/openerp-7.0/addons/account/account_invoice.py`, `account.invoice`, `legacy/openerp-7.0/addons/account/account_move_line.py`, `reconcile`, and `reconcile_partial`.
- N/A — database schema changes are not required because the adapter delegates allowed mutations to injected legacy executors and stores no state in this story.

**Depends on:** WO-078, WO-083

### [P1] Guard statement and fiscal close

Add a statement and fiscal close adapter so bank statement confirmation and fiscal-year close operations cannot execute without central policy approval and auditable command context. The change belongs in a new `app/adapters/statement_close_adapter.py` module and must map specifically to `legacy/openerp-7.0/addons/account/account_bank_statement.py:button_confirm_bank`, `legacy/openerp-7.0/addons/account/account_bank_statement.py:statement_close`, and `legacy/openerp-7.0/addons/account/wizard/account_fiscalyear_close.py:data_save`. These legacy operations are high-risk because bank confirmation creates accounting moves and fiscal close performs direct SQL mutations over move lines, reconciliations, periods, and fiscal years. When complete, denied policy decisions suppress all injected legacy execution, while allowed decisions invoke only the mapped statement or close executor with action lineage returned to the caller. Finance controllers gain a single enforcement seam for statement posting and fiscal close, rather than relying on wizard visibility, XML actions, or OpenERP ACL assumptions alone. The adapter must support tests using fake executors because the repository does not provide a live OpenERP deployment entry point. This story does not rewrite bank-statement posting logic, cash statement behavior, fiscal close SQL, or period-generation behavior. It depends on the centralized finance policy evaluator and legacy adapter conventions so it can reuse the same fail-closed pattern as invoice posting and reconciliation. It also depends on the audit precondition capability because close operations must not proceed when evidence writing is unavailable.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | legacy-adapter, statement-posting, fiscal-close, finance-controls, complexity:medium |

**Acceptance Criteria**
- Unit tests: `pytest tests/adapters/test_statement_close_adapter.py -q` exits with code 0 and asserts `app/adapters/statement_close_adapter.py::confirm_bank_statement` and `close_fiscal_year` do not call the fake legacy executor when `PolicyDecision.allowed is False`.
- System integration tests: `pytest tests/adapters/test_statement_close_adapter_boundary.py -q` exits with code 0 and asserts simulated `POST /finance/bank-statements/ST-001/confirm` and `POST /finance/fiscal-years/FY-2026/close` commands evaluate `app/policy/finance_policy.py::evaluate_finance_action` before injected legacy execution.
- Mock data/fixtures: `tests/fixtures/adapters/bank_statement_confirm_request.json` and `tests/fixtures/adapters/fiscal_year_close_request.json` are committed, and `pytest tests/adapters/test_statement_close_adapter.py::test_statement_close_fixtures_are_loadable -q` asserts each fixture includes `company_id`, `period_id`, `document_state`, and `audit_context`.
- File inspection: `app/adapters/statement_close_adapter.py` defines `confirm_bank_statement`, `close_bank_statement`, and `close_fiscal_year` with explicit legacy mapping strings for `button_confirm_bank`, `statement_close`, and `data_save`.
- File inspection: `app/adapters/statement_close_adapter.py` references `legacy/openerp-7.0/addons/account/account_bank_statement.py` and `legacy/openerp-7.0/addons/account/wizard/account_fiscalyear_close.py` in mapping constants or result lineage.
- N/A — database schema changes are not required because the adapter delegates allowed mutations to injected legacy executors and does not persist command state in this story.

**Depends on:** WO-070, WO-083

### [P0] Test finance policy API paths

Add an end-to-end security test file that verifies denied and allowed finance mutations across the OIDC, RBAC, policy, and guarded adapter boundary so unauthorized callers cannot post, reconcile, confirm statements, or close fiscal years through API-style paths. The change belongs in `tests/security/test_finance_policy_api_paths.py` and should exercise modules created under `app/security/oidc.py`, `app/security/rbac.py`, `app/policy/finance_policy.py`, `app/adapters/guarded_write_adapter.py`, and `app/adapters/statement_close_adapter.py`. Today the legacy OpenERP code exposes sensitive behavior through model methods such as `account_invoice.py` invoice workflows, `account_move_line.py:reconcile`, `account_bank_statement.py:button_confirm_bank`, and `account_fiscalyear_close.py:data_save`, but the modernization layer needs a single regression suite proving those paths are guarded. When complete, a developer can run one pytest command and see header-only actors denied, wrong-company actors denied, missing-audit contexts denied, and valid financial-manager actors allowed through fake executors. This protects release gates because a future adapter change that skips policy evaluation will fail a deterministic test before reaching staging or production. The tests must use committed fixtures and fake executors rather than a live identity provider, Kubernetes ingress, or OpenERP database. This story does not implement new policy rules, new adapters, new HTTP routing, or a production CI/CD pipeline. It depends on the OIDC boundary, RBAC mapping, finance policy evaluator, invoice/reconciliation adapter, and statement/close adapter being available. It should also document the command developers and SREs can use in a runbook when investigating an authorization bypass report.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | tests, security-regression, finance-policy, api-boundary, complexity:medium |

**Acceptance Criteria**
- Unit tests: `pytest tests/security/test_finance_policy_api_paths.py -q` exits with code 0 and includes test functions named `test_x_actor_only_invoice_post_is_denied`, `test_wrong_company_reconcile_is_denied`, `test_missing_audit_context_statement_confirm_is_denied`, and `test_financial_manager_fiscal_close_is_allowed`.
- System integration tests: `pytest tests/security/test_finance_policy_api_paths.py::test_all_guarded_api_paths_evaluate_policy_before_executor -q` exits with code 0 and asserts fake executor call counts remain `0` for denied `POST /finance/invoices/{id}/post`, `POST /finance/reconciliations`, `POST /finance/bank-statements/{id}/confirm`, and `POST /finance/fiscal-years/{id}/close` paths.
- Mock data/fixtures: `tests/fixtures/security/finance_policy_api_paths.json` is committed, and `pytest tests/security/test_finance_policy_api_paths.py::test_api_path_fixture_loads_all_required_cases -q` asserts it contains denied and allowed cases for invoice posting, reconciliation, bank statement confirmation, and fiscal close.
- File inspection: `tests/security/test_finance_policy_api_paths.py` imports `app/security/oidc.py`, `app/security/rbac.py`, `app/policy/finance_policy.py`, `app/adapters/guarded_write_adapter.py`, and `app/adapters/statement_close_adapter.py` or their exported functions.
- File inspection: `tests/security/test_finance_policy_api_paths.py` contains assertions for status codes 401 or 403 on denied simulated requests and status code 200 or allowed adapter result on the valid financial-manager fixture.
- N/A — database schema changes are not required because these tests use fake executors and committed JSON fixtures rather than live OpenERP tables.

**Depends on:** WO-092, WO-093

---

## ORM Hub Classification, Adapters, and Pure Accounting Domain Modules

### [P1] Wrap OpenERP OSV kernel operations

Add a narrow OSV kernel adapter so modernization code can call legacy search, create, write, and execute behavior through one controlled boundary instead of spreading generic ORM verbs across finance modules. The new module is app.adapters.osv_kernel_adapter in app/adapters/osv_kernel_adapter.py, and it must treat legacy/openerp-7.0/openerp/osv/osv.py as the compatibility-kernel reference for object service dispatch and exception normalization. Stakeholders need this seam because high-fan-in ORM operations are the largest blast-radius risk when migrating accounting slices off OpenERP 7.0. Today callers would reach directly into pool.get, cr, uid, ids, context, and generic method names; after this story they can use a small Python 3-compatible adapter object whose method names and return values are explicit and testable. When complete, a developer can inspect app/adapters/osv_kernel_adapter.py and find wrapper methods for search, create, write, and execute that preserve model name, actor uid, context, arguments, and legacy exception behavior without importing modern domain policy. The observable behavior is that tests can inject a fake pool/model and prove the adapter dispatches to the same legacy method names with the same cr, uid, ids, values, and context shape expected by OpenERP OSV. This story does not change legacy/openerp-7.0/openerp/osv/osv.py, does not create public API endpoints, does not implement authentication or authorization, and does not migrate any invoice or ledger business behavior. It depends on the modern application scaffold and baseline legacy classification capability already existing so the adapter can live outside the legacy tree. It also depends on the project convention that legacy OpenERP remains authoritative during shadow mode and that generic ORM verbs are not exposed directly to future consumers. The adapter must be operationally debuggable by returning or logging enough structured call metadata in tests to isolate contract drift before a migration wave reaches write-pilot mode.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:orm-hub, adapter, modernization, legacy-kernel, reliability, complexity:medium |

**Acceptance Criteria**
- File inspection shows app/adapters/osv_kernel_adapter.py defines OsvKernelAdapter.search, OsvKernelAdapter.create, OsvKernelAdapter.write, and OsvKernelAdapter.execute with parameters for cr, uid, model_name, context, and operation-specific arguments.
- Unit tests — running python -m pytest tests/adapters/test_osv_kernel_adapter.py exits with status 0 and includes assertions that fake_model.search, fake_model.create, fake_model.write, and fake_model.custom_method receive the same cr, uid, ids/domain/values, and context passed into OsvKernelAdapter.
- System integration tests — N/A — app/adapters/osv_kernel_adapter.py introduces an internal adapter only and the repository analysis reports 0 API endpoints to exercise at a service boundary.
- Mock data / fixtures — tests/fixtures/osv_kernel_fake.py or an equivalent committed test fixture provides fake pool and fake model objects for account.account and account.move.line calls without requiring a live PostgreSQL or OpenERP server.
- File inspection confirms legacy/openerp-7.0/openerp/osv/osv.py is not modified and app/adapters/osv_kernel_adapter.py imports no modules from app/domain/invoice.py or app/domain/ledger.py.
- Running python -m pytest tests/adapters/test_osv_kernel_adapter.py -k exception exits with status 0 and verifies that a raised legacy-style exception from a fake model is propagated or wrapped in the documented adapter exception type.

**Depends on:** WO-052, WO-056

### [P1] Extract ledger balance invariants

Add a pure ledger domain module that checks balanced journal invariants before ledger behavior is migrated away from account.move.line. The new module is app.domain.ledger in app/domain/ledger.py, and it must use legacy/openerp-7.0/addons/account/account_move_line.py as the reference for journal item, reconciliation, and query-gravity behavior. Controllers and finance operators need this because every migration wave must prove journal entries net to zero per company and currency before any modern slice can become authoritative. Today the balancing and reconciliation behavior is coupled to account.move.line methods, SQL constraints, and context-sensitive filtering such as _query_get; the target is a pure Python 3-compatible module that can validate journal-line batches without OpenERP browse records. When complete, app/domain/ledger.py exposes functions such as assert_balanced_journal_entry, summarize_debits_credits, validate_currency_balance, and describe_imbalance using deterministic Decimal or minor-unit arithmetic. Observable behavior is that tests can load committed ledger fixtures, run the pure module, and get pass results for balanced entries and structured failure results for non-zero imbalances. This story does not replace account_move_line._query_get, does not implement reconciliation, does not post journal entries, and does not create a trial balance projection API. It depends on the OSV adapter capability for future legacy extraction and on the parity baseline capability that defines fixture conventions for account.move.line-style records. It also depends on the project rule that legacy OpenERP remains the comparison baseline while domain invariants are extracted. From an operational perspective, the module should produce failure messages that name company, currency, journal entry, debit total, credit total, and delta so SREs and finance engineers can triage parity-gate failures quickly.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:orm-hub, domain, ledger, parity, reliability, complexity:medium |

**Acceptance Criteria**
- File inspection shows app/domain/ledger.py defines assert_balanced_journal_entry, summarize_debits_credits, validate_currency_balance, and describe_imbalance or equivalent exported functions using Decimal or integer minor-unit arithmetic.
- Unit tests — running python -m pytest tests/domain/test_ledger_domain.py exits with status 0 and includes assertions for a balanced account.move.line-style fixture, an imbalanced fixture with a non-zero delta, and a multi-currency fixture grouped by currency.
- System integration tests — running python -m pytest tests/adapters/test_ledger_adapter_boundary.py exits with status 0 and verifies any legacy extraction hook targets model_name account.move.line through OsvKernelAdapter rather than importing legacy/openerp-7.0/addons/account/account_move_line.py.
- Mock data / fixtures — tests/fixtures/ledger_balance_cases.yml or an equivalent committed fixture contains account_move_line-style rows with move_id, company_id, account_id, debit, credit, currency_id, and amount_currency fields.
- File inspection confirms app/domain/ledger.py does not modify or import legacy/openerp-7.0/addons/account/account_move_line.py and does not implement a replacement for _query_get.
- Running python -m pytest tests/domain/test_ledger_domain.py -k describe_imbalance exits with status 0 and asserts the failure message contains move_id, company_id, currency_id, debit_total, credit_total, and delta.

**Depends on:** WO-072, WO-066

### [P1] Add OSV adapter contract tests

Add adapter contract tests for account.py and account_move_line.py so the new OSV boundary preserves legacy accounting call shapes before domain extraction proceeds. The tests belong in tests/adapters/test_osv_contracts.py and must reference legacy/openerp-7.0/addons/account/account.py and legacy/openerp-7.0/addons/account/account_move_line.py as the source contract for account.account and account.move.line behavior. Finance and platform stakeholders need these tests because generic ORM verbs have high fan-in and a small adapter drift can cascade into invoice, ledger, report, and reconciliation regressions. Today there may be unit coverage for adapter mechanics, but there is not a focused contract suite that ties the adapter to accounting-specific legacy models and methods. The target state is a pytest file with deterministic fake models that proves search, create, write, and execute calls retain OpenERP cr, uid, ids, domain, values, and context semantics for account.account and account.move.line use cases. Observable behavior is that running the contract test file produces passing assertions for account.account name_get or search-style behavior and account.move.line search or reconcile-style delegation without a live OpenERP server. This story does not start PostgreSQL, does not execute real legacy SQL, does not modify legacy account.py or account_move_line.py, and does not add projection or reconciliation features. It depends on the OSV kernel adapter being present and ledger fixture conventions being available so tests can share deterministic account.move.line-style data. It also depends on the legacy accounting files remaining read-only so the tests detect contract drift rather than silently changing the baseline. Operationally, these tests become a low-cost preflight check for migration waves because they validate the adapter boundary before canary reads or write pilots depend on it.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:orm-hub, tests, adapter-contract, ledger, reliability, complexity:medium |

**Acceptance Criteria**
- File inspection shows tests/adapters/test_osv_contracts.py exists and imports OsvKernelAdapter from app.adapters.osv_kernel_adapter.
- Unit tests — running python -m pytest tests/adapters/test_osv_contracts.py exits with status 0 and includes assertions for account.account search or name_get-style delegation and account.move.line search or reconcile-style delegation.
- System integration tests — N/A — tests/adapters/test_osv_contracts.py uses fake OpenERP pool/model fixtures and does not exercise a public service boundary or live XML-RPC endpoint.
- Mock data / fixtures — tests/fixtures/osv_account_contracts.yml or an equivalent committed fixture contains account.account and account.move.line contract cases with model_name, method_name, domain or ids, values, and context.
- File inspection confirms tests/adapters/test_osv_contracts.py references legacy/openerp-7.0/addons/account/account.py and legacy/openerp-7.0/addons/account/account_move_line.py in comments or fixture metadata as contract sources, while not importing those Python 2-era files.
- Running python -m pytest tests/adapters/test_osv_contracts.py -k context exits with status 0 and asserts company_id, fiscalyear, period_from, period_to, state, or initial_bal context keys are preserved for account.move.line contract calls.

**Depends on:** WO-072, WO-066

### [P1] Define migration wave feature flags

Create a migration wave configuration file so finance modernization slices can move through shadow read, canary read, and write-pilot gates with documented rollback triggers. The file belongs under the existing context module as context/migration_waves.yml, alongside context/PRD_myERP.md, context/MODERNIZATION_INTENT.md, and context/01_TARGET_SPEC.md. Stakeholders need this because no invoice, ledger, projection, or adapter slice should become authoritative without parity evidence, authorization checks, rollback criteria, and finance sign-off. Today the rollout plan is described in prose across context documents; the target is a machine-readable YAML artifact that can be inspected by engineers and later validated in CI. When complete, the YAML defines feature-flag states such as shadow, read_canary, read_authoritative, write_pilot, and write_authoritative, plus slice names for invoice lifecycle, ledger invariants, projection reads, and guarded finance writes. Observable behavior is that a developer can open context/migration_waves.yml and find each slice mapped to entry gates, exit gates, rollback triggers, owner roles, parity checks, and legacy fallback behavior. This story does not implement a feature-flag service, does not deploy Kubernetes resources, does not create CI/CD pipelines, and does not cut over any production traffic. It depends on migration planning, baseline context structure, and feature-flag naming conventions already being established. It also depends on parity and policy components existing conceptually so the file can reference capabilities by name rather than low-level OpenERP methods. From an operational standpoint, the YAML should read like a runbook seed: if a P0 variance, adapter error spike, authorization bypass, or evidence-write failure appears, the affected slice returns to shadow-only and legacy remains authoritative.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:orm-hub, migration, feature-flags, runbook, reliability, complexity:medium |

**Acceptance Criteria**
- File inspection shows context/migration_waves.yml exists and contains top-level keys feature_flags, slices, gates, rollback_triggers, and operational_metrics.
- File inspection shows context/migration_waves.yml defines flag states named shadow, read_canary, read_authoritative, write_pilot, and write_authoritative.
- Unit tests — N/A — context/migration_waves.yml is static rollout metadata with no executable logic in this story.
- System integration tests — N/A — no feature-flag runtime, deployment pipeline, or API endpoint is introduced by context/migration_waves.yml.
- Mock data / fixtures — context/migration_waves.yml itself is the committed configuration fixture and includes at least invoice_lifecycle, ledger_invariants, projection_reads, and guarded_finance_writes slices.
- Running python - <<'PY'
import yaml
from pathlib import Path
data=yaml.safe_load(Path('context/migration_waves.yml').read_text())
assert {'feature_flags','slices','gates','rollback_triggers','operational_metrics'} <= set(data)
PY exits with status 0 when PyYAML is available in the local test environment.
- File inspection shows context/migration_waves.yml rollback_triggers includes p0_parity_variance, authorization_bypass, adapter_contract_failure, evidence_write_failure, and legacy_fallback_unavailable.

**Depends on:** WO-055, WO-056, WO-008

### [P1] Extract invoice lifecycle domain methods

Add business-named invoice lifecycle methods so modernization code can reason about invoices without directly invoking legacy account.invoice methods or generic ORM verbs. The new module is app.domain.invoice in app/domain/invoice.py, and its source behavior is legacy/openerp-7.0/addons/account/account_invoice.py, especially button_compute, button_reset_taxes, check_tax_lines, confirm_paid, finalize_invoice_move_lines, and payment-line helper methods. Finance stakeholders need this because invoice state, totals, taxes, residuals, and posted journal links are core parity surfaces for Release 1 and cannot remain hidden behind OpenERP browse objects. The current state mixes workflow transitions, computed amounts, reconciliation lookups, and journal-entry linkage inside the legacy model; the target state is a Python 3-compatible domain module with explicit names such as recompute_invoice_taxes, validate_invoice_taxes, finalize_posting_move_lines, mark_invoice_paid, and collect_payment_move_lines. When complete, a developer can inspect app/domain/invoice.py and see dataclasses or typed functions that describe invoice lifecycle inputs and outputs without requiring a live OpenERP server. Observable behavior is demonstrated by unit tests that feed deterministic invoice dictionaries or dataclasses into the domain methods and assert returned lifecycle results, adapter commands, or validation errors. This story does not port the full OpenERP invoice posting engine, does not replace account_invoice_workflow.xml, does not add public invoice APIs, and does not perform write-authoritative cutover. It depends on the OSV kernel adapter capability for any legacy call delegation and on the existing parity-test foundation so invoice behavior can be compared before migration. It also depends on the project decision that legacy remains authoritative until shadow outputs match P0 invoice invariants. Operationally, the module should make invoice actions easier to trace in logs and rollback runbooks because future guarded commands will call named lifecycle operations rather than raw execute or write.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:orm-hub, domain, invoice, parity, modernization, complexity:medium |

**Acceptance Criteria**
- File inspection shows app/domain/invoice.py defines business-named methods or functions for recompute_invoice_taxes, validate_invoice_taxes, finalize_posting_move_lines, mark_invoice_paid, and collect_payment_move_lines, each referencing account.invoice intent rather than generic execute/write naming.
- Unit tests — running python -m pytest tests/domain/test_invoice_domain.py exits with status 0 and asserts at least one draft-to-open lifecycle command, one paid-state command, one tax-validation failure, and one payment-move-line collection result from app/domain/invoice.py.
- System integration tests — running python -m pytest tests/adapters/test_invoice_adapter_boundary.py exits with status 0 and verifies app/domain/invoice.py calls OsvKernelAdapter.execute with model_name account.invoice and legacy method names such as button_reset_taxes or confirm_paid when adapter delegation is required.
- Mock data / fixtures — tests/fixtures/invoice_lifecycle_cases.yml or an equivalent committed fixture contains draft, open, paid, and tax-mismatch invoice cases with fields matching account.invoice concepts from legacy/openerp-7.0/addons/account/account_invoice.py.
- File inspection confirms app/domain/invoice.py does not import legacy/openerp-7.0/addons/account/account_invoice.py directly and does not import openerp.osv.osv.
- Running python -m pytest tests/domain/test_invoice_domain.py -k residual exits with status 0 and validates that invoice residual or payment-line results use Decimal or integer minor-unit values rather than binary float arithmetic.

**Depends on:** WO-078, WO-066

---

## Projection-oriented Accounting Read APIs

### [P0] Create canonical projection filters

Add a canonical projection filter object so accounting read projections use one validated representation of company, fiscal year, date, period, journal, move-state, and initial-balance filters instead of passing unbounded legacy context dictionaries. The new module is app.projections.filters in app/projections/filters.py, with its accepted fields and unsupported combinations driven by context/query_get_contract.yml and legacy semantics from legacy/openerp-7.0/addons/account/account_move_line.py. Today the legacy account.move.line query behavior is embedded in _query_get and callers can implicitly alter report outputs through stringly typed context keys, which is difficult to operate safely during shadow parity. This change gives projection modules an explicit filter boundary that can be logged, hashed, serialized, and refused before any repository or SQL builder is invoked. When complete, a developer can construct a ProjectionFilter from dictionary input, receive normalized dates and ID lists, inspect the legacy_context equivalent, and see deterministic ValueError messages for unsupported filters. Stakeholders will recognize the value because read canaries can be rolled back by a visible filter hash rather than by guessing which OpenERP context keys were used. This story does not implement journal search, trial balance, invoices, ledgers, HTTP routes, live PostgreSQL access, or parity comparison. It depends on the modern application package boundary and the documented move-line query contract capability being present. The implementation should also commit small fixture examples so failed canary filters can be reproduced locally without connecting to a legacy database.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P0 |
| Labels | epic:projection-read-apis, type:implementation, priority:p0, runtime:python-3.14, operability:filter-contract, slo:projection-correctness, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/projections/test_filters.py exits with status code 0 and asserts that app/projections/filters.py normalizes company_id, fiscalyear_id, date_from, date_to, period_ids, journal_ids, target_move, and initial_balance from tests/fixtures/projections/filter_cases.yml.
- System integration tests: python -m pytest tests/projections/test_filter_query_contract.py exits with status code 0 and verifies that ProjectionFilter.to_legacy_context output from app/projections/filters.py is accepted by app/projections/query_builder.py for every supported key in context/query_get_contract.yml.
- Mock data/fixtures: tests/fixtures/projections/filter_cases.yml is committed and contains at least posted-only, all-moves, date-range, period-range, journal-filter, company-filter, and initial-balance examples with expected normalized output.
- File inspection: app/projections/filters.py defines ProjectionFilter, UnsupportedProjectionFilterError, normalize_projection_filter, and filter_hash or equivalent deterministic hash behavior, visible through grep or Python ast inspection.
- Unsupported-filter verification: python -m pytest tests/projections/test_filters.py -k unsupported exits with status code 0 and asserts that app/projections/filters.py raises UnsupportedProjectionFilterError for contradictory date and period inputs when context/query_get_contract.yml marks the combination unsupported.

**Depends on:** WO-052, WO-065

### [P1] Implement ledger projections

Add partner-ledger and general-ledger projection logic so ledger review can use stable DTO rows while preserving _query_get-compatible filtering and initial-balance behavior. The new module is app.projections.ledgers in app/projections/ledgers.py, with semantics sourced from legacy/openerp-7.0/addons/account/report/account_partner_ledger.py, legacy/openerp-7.0/addons/account/report/account_general_ledger.py, and legacy/openerp-7.0/addons/account/account_move_line.py. Today these ledgers are generated by legacy report parsers and context-sensitive SQL fragments, so read canaries cannot easily isolate drift by filter, partner, account, company, or currency. The target state is a Python 3.14-compatible module with project_partner_ledger and project_general_ledger functions that accept ProjectionFilter, delegate filtering through the shared query builder, and return PartnerLedgerRowDTO and GeneralLedgerRowDTO payloads. When complete, ledger rows expose move line, move, account, partner, journal, period, date, debit, credit, balance, running balance, initial-balance flag, reconcile lineage, company, currency, and source table metadata. The running balance must be deterministic and partitioned correctly so one partner, account, company, or currency cannot hide another partition's imbalance. This supports operational rollback because a parity variance can name the exact ledger projection, filter hash, and legacy move-line lineage that drifted. This story does not implement journal search, trial balance, invoice/tax projections, RML rendering, HTTP routing, UI screens, or production feature flags. It depends on a move-line repository or adapter capability and the canonical projection filter object. The implementation should include null-partner, draft-move, posted-only, initial-balance, and multi-account fixtures so canary failures are reproducible before finance sign-off.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:projection-read-apis, type:implementation, runtime:python-3.14, operability:ledger-canary, slo:ledger-running-balance, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/projections/test_ledgers.py exits with status code 0 and asserts that app/projections/ledgers.py returns PartnerLedgerRowDTO from project_partner_ledger and GeneralLedgerRowDTO from project_general_ledger.
- System integration tests: python -m pytest tests/projections/test_ledger_filter_integration.py exits with status code 0 and verifies that app/projections/ledgers.py invokes app.projections.query_builder.build_move_line_where_clause for both partner-ledger and general-ledger filters.
- Mock data/fixtures: tests/fixtures/projections/ledger_rows.json is committed and contains move-line rows for at least two accounts, two partners including a null partner case, one initial-balance row, one posted move, and one draft move.
- Running-balance verification: tests/projections/test_ledgers.py asserts that GeneralLedgerRowDTO.running_balance_minor is partitioned by legacy_account_id, legacy_company_id, and currency_code, while PartnerLedgerRowDTO.running_balance_minor is partitioned by legacy_partner_id, legacy_company_id, and currency_code.
- Initial-balance verification: python -m pytest tests/projections/test_ledgers.py -k initial_balance exits with status code 0 and asserts that initial balance rows from app/projections/ledgers.py have is_initial_balance true and sort before normal activity rows in the same partition.

**Depends on:** WO-073, WO-074

### [P1] Implement invoice tax projections

Add invoice and tax-line projections so invoice list, invoice detail, tax-line review, and parity jobs can read stable DTOs with explicit lineage to the legacy invoice model. The new module is app.projections.invoices_tax_lines in app/projections/invoices_tax_lines.py, with field lineage sourced from legacy/openerp-7.0/addons/account/account_invoice.py and related tax behavior from legacy/openerp-7.0/addons/account/edi/invoice.py. Today invoice totals, residuals, payment status, tax lines, and journal-entry links live inside dynamic OpenERP records and report helpers, which prevents modern consumers from using a narrow and auditable read contract. The target state is a Python 3.14-compatible projection module that maps repository rows into InvoiceDTO, InvoiceLineDTO, and TaxLineDTO while preserving source identifiers for account_invoice, account_invoice_line, account_invoice_tax, account_move, account_move_line, res_partner, account_journal, and account_tax. When complete, a fixture-backed invoice detail output includes header fields, nested invoice lines, tax lines, untaxed amount, tax amount, total amount, residual amount, state, type, partner, company, journal, currency, and posted move lineage. The tax-line output must distinguish invoice tax rows from ledger tax-code rows when source data provides both, because parity comparisons need to know which legacy table produced the number. This gives controllers and accountants a safe read surface for shadow mode without changing posting or recomputing tax. This story does not implement tax configuration change control, compute_all replay, journal search, trial balance, ledger projections, HTTP routes, or production read-authoritative cutover. It depends on the DTO contract capability, invoice lineage mapping capability, and the canonical projection filter object. The implementation should include deterministic fixtures so production incidents around invoice-tax mismatches can be reproduced with a single pytest command.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:projection-read-apis, type:implementation, runtime:python-3.14, operability:lineage-first, slo:invoice-tax-parity, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/projections/test_invoices_tax_lines.py exits with status code 0 and asserts that app/projections/invoices_tax_lines.py returns InvoiceDTO with nested InvoiceLineDTO entries and TaxLineDTO rows.
- System integration tests: python -m pytest tests/projections/test_invoice_tax_lineage_integration.py exits with status code 0 and verifies that project_invoices and project_tax_lines share ProjectionFilter from app/projections/filters.py and preserve legacy_invoice_id across both outputs.
- Mock data/fixtures: tests/fixtures/projections/invoice_tax_lineage_rows.json is committed and contains at least one customer invoice, one supplier invoice or refund, invoice lines, invoice tax rows, ledger tax rows, and journal-entry lineage fields.
- Tax-total verification: tests/projections/test_invoice_tax_lineage_integration.py asserts that each InvoiceDTO.amount_tax_minor equals the sum of related TaxLineDTO.amount_minor values for the same legacy_invoice_id in tests/fixtures/projections/invoice_tax_lineage_rows.json.
- Lineage verification: tests/projections/test_invoices_tax_lines.py asserts that every InvoiceDTO includes legacy_invoice_id, legacy_partner_id, legacy_company_id, legacy_journal_id, and nullable legacy_move_id fields mapped from invoice rows.

**Depends on:** WO-069, WO-078, WO-074

### [P1] Implement journal trial projections

Add combined journal-search and trial-balance projection logic so finance users can inspect move-line activity and account totals through narrow DTOs with a shared filter contract. The new module is app.projections.journals_trial_balance in app/projections/journals_trial_balance.py, using DTOs from app/projections/schemas.py and legacy behavior from legacy/openerp-7.0/addons/account/account_move_line.py, legacy/openerp-7.0/addons/account/report/account_balance.py, and legacy/openerp-7.0/addons/account/report/account_journal.py. Today these outputs are split across legacy report code, OpenERP browse records, and _query_get-driven context filtering, which makes canary operation and rollback hard to automate. The target state is a Python 3.14-compatible module that accepts ProjectionFilter, invokes the move-line query builder through an injected repository boundary, and returns JournalSearchRowDTO and TrialBalanceRowDTO collections with deterministic metadata. When complete, journal search rows expose move line, account, journal, partner, period, company, currency, debit, credit, balance, and source lineage, while trial-balance rows group totals by account, company, and currency. This improves operational confidence because trial-balance net-zero checks can run automatically before any read projection is promoted beyond shadow mode. This story does not implement invoice projections, tax-line projections, partner ledger, general ledger, HTTP routes, authentication, or production traffic switching. It depends on completed DTO contracts, an account move-line repository or adapter capability, and the canonical projection filter object. The implementation should include fixtures with balanced and intentionally malformed examples so SREs can distinguish projection bugs from source-data defects.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:projection-read-apis, type:implementation, runtime:python-3.14, operability:canary-ready, slo:trial-balance-zero-net, complexity:medium |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/projections/test_journals_trial_balance.py exits with status code 0 and asserts that app/projections/journals_trial_balance.py returns JournalSearchRowDTO rows from project_journal_search and TrialBalanceRowDTO rows from project_trial_balance.
- System integration tests: python -m pytest tests/projections/test_journal_trial_balance_filter_integration.py exits with status code 0 and verifies that app/projections/journals_trial_balance.py calls app.projections.query_builder.build_move_line_where_clause with a ProjectionFilter from app/projections/filters.py.
- Mock data/fixtures: tests/fixtures/projections/journal_trial_balance_rows.json is committed and contains account_move_line-style rows for at least two accounts, one journal, one period, one company, one posted move, and expected debit_minor and credit_minor totals.
- Balance verification: tests/projections/test_journals_trial_balance.py asserts that TrialBalanceRowDTO totals from app/projections/journals_trial_balance.py net to zero by legacy_company_id and currency_code for the balanced fixture case.
- Malformed-row verification: python -m pytest tests/projections/test_journals_trial_balance.py -k malformed exits with status code 0 and asserts that a row missing legacy_move_line_id raises a ValueError naming account_move_line and app/projections/journals_trial_balance.py.

**Depends on:** WO-072, WO-079, WO-074

### [P1] Expose finance read routes

Add versioned finance read API routes so modern consumers can request journal search, trial balance, invoices, tax lines, partner ledger, and general ledger projections without receiving OpenERP browse records. The new API module is app.api.finance_read in app/api/finance_read.py, calling projection modules under app/projections and preserving legacy read semantics from legacy/openerp-7.0/addons/account/account_move_line.py and legacy/openerp-7.0/addons/account/account_invoice.py. Today the repository has no modern accounting HTTP API surface, while legacy access happens through OpenERP UI actions, XML-RPC-style object services, report parsers, and context-heavy browse objects. The target behavior is a versioned route group that validates query parameters through ProjectionFilter, invokes the corresponding projection function, and returns deterministic DTO payloads with metadata, rows, lineage, and unsupported-filter errors. When complete, API integration tests can call endpoints such as /api/v1/finance/journals, /api/v1/finance/trial-balance, /api/v1/finance/invoices, /api/v1/finance/tax-lines, /api/v1/finance/partner-ledger, and /api/v1/finance/general-ledger and receive status code 200 for valid fixture-backed requests. Unsupported filters must fail closed with status code 400 and a body that identifies the invalid filter key, because broad ledger reads are an operability and finance-control risk. This story does not implement write-capable finance actions, authentication policy changes, production traffic routing, frontend screens, database migrations, or live OpenERP extraction beyond the repository boundary already established by projection modules. It depends on the completed API scaffold, journal/trial projections, invoice/tax projections, and ledger projections. The implementation should use the existing app/api routing pattern from the completed scaffold rather than introducing a second web framework or route registration mechanism. It should also document a rollback posture: if a projection reports a P0 parity variance, the affected endpoint remains canary or disabled while legacy reports remain authoritative.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P1 |
| Labels | epic:projection-read-apis, type:implementation, runtime:python-3.14, operability:api-canary, slo:read-projection-latency, complexity:high |

**Acceptance Criteria**
- Unit tests: python -m pytest tests/api/test_finance_read_routes.py -k validation exits with status code 0 and asserts that app/api/finance_read.py converts query parameters into ProjectionFilter from app/projections/filters.py for every finance read endpoint.
- System integration tests: python -m pytest tests/api/test_finance_read_routes.py exits with status code 0 and calls /api/v1/finance/journals, /api/v1/finance/trial-balance, /api/v1/finance/invoices, /api/v1/finance/tax-lines, /api/v1/finance/partner-ledger, and /api/v1/finance/general-ledger through the existing API test client with status code 200 for valid fixture filters.
- Mock data/fixtures: tests/fixtures/api/finance_read_requests.json is committed and contains valid request examples plus unsupported-filter examples for all six /api/v1/finance routes.
- Unsupported-filter verification: tests/api/test_finance_read_routes.py asserts that /api/v1/finance/general-ledger with an unsupported filter returns status code 400 and a response body containing error_code unsupported_projection_filter and the invalid filter name.
- Route registration inspection: app/api/finance_read.py defines route handlers for get_journal_search, get_trial_balance, get_invoices, get_tax_lines, get_partner_ledger, and get_general_ledger or equivalent named functions, and app/api/__init__.py registers the finance read module with the existing API application.

**Depends on:** WO-064, WO-088, WO-087, WO-081

### [P1] Add read API parity tests

Add shadow parity and unsupported-filter tests for the finance read API so canary promotion has automated evidence across journal, trial-balance, invoice, tax-line, partner-ledger, and general-ledger endpoints. The new test module is tests/projections/test_read_api_parity.py, exercising app/api/finance_read.py and comparing its serialized outputs to committed golden fixtures derived from legacy semantics in legacy/openerp-7.0/addons/account/report/account_balance.py, legacy/openerp-7.0/addons/account/report/account_partner_ledger.py, and legacy/openerp-7.0/addons/account/account_invoice.py. Today projection modules have fixture tests, but there is no single API-boundary parity test that proves the versioned routes preserve DTO metadata, totals, row lineage, and unsupported-filter behavior in one command. The target behavior is a hermetic pytest suite that calls every /api/v1/finance route through the existing API test client, compares response payloads to golden expectations, and reports projection-specific variance details. When complete, a developer can run python -m pytest tests/projections/test_read_api_parity.py and see failures that name endpoint, projection_name, filter_hash, source table, expected value, actual value, and legacy lineage. Unsupported filters must be tested at the API boundary because they are the fail-closed control preventing accidental broad account_move_line reads. This story does not change projection algorithms, add new endpoints, implement deployment gates, claim finance sign-off, or connect to a live legacy database. It depends on the versioned finance read routes and all projection modules being present. The tests should act like a rollout runbook check: any P0 variance keeps the affected endpoint in shadow or disables the read canary while legacy reports remain authoritative.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:projection-read-apis, type:test, runtime:python-3.14, operability:rollback-gate, slo:shadow-parity, complexity:medium |

**Acceptance Criteria**
- Unit tests: N/A — tests/projections/test_read_api_parity.py is an API-boundary parity suite rather than unit coverage; projection unit tests remain in tests/projections/test_journals_trial_balance.py, tests/projections/test_invoices_tax_lines.py, and tests/projections/test_ledgers.py.
- System integration tests: python -m pytest tests/projections/test_read_api_parity.py exits with status code 0 and calls /api/v1/finance/journals, /api/v1/finance/trial-balance, /api/v1/finance/invoices, /api/v1/finance/tax-lines, /api/v1/finance/partner-ledger, and /api/v1/finance/general-ledger through the existing API test client.
- Mock data/fixtures: tests/fixtures/projections/read_api_parity_golden.json is committed and contains expected row counts, amount totals, metadata.projection_name values, and lineage keys for all six finance read endpoints.
- Variance assertion verification: tests/projections/test_read_api_parity.py includes assertion helpers that compare response metadata.filter_hash, row counts, debit_minor, credit_minor, amount_tax_minor, running_balance_minor, and legacy_move_line_id or legacy_invoice_id values against tests/fixtures/projections/read_api_parity_golden.json.
- Unsupported-filter verification: tests/projections/test_read_api_parity.py asserts that an unsupported filter request to /api/v1/finance/partner-ledger and /api/v1/finance/general-ledger returns status code 400 with error_code unsupported_projection_filter.

**Depends on:** WO-094

---

## Shadow Rollout and Production Readiness

### [P1] Define warm standby DR values

Add Helm disaster recovery values for the myERP finance deployment so platform engineers have versioned warm-standby RPO and RTO configuration before any finance slice is promoted beyond shadow mode. The change belongs in a new file at helm/myerp-finance/values-dr.yaml, with README.md updated because the repository currently has no Helm or deployment entry point despite the architecture selecting Kubernetes and warm standby. This matters to finance stakeholders because no authoritative cutover should occur unless the platform has a documented recovery target and repeatable configuration for managed PostgreSQL, object storage, and service restoration. The current state is that the legacy OpenERP code under legacy/openerp-7.0 is deployable only through legacy assumptions, and the modern app area has no operational deployment configuration. When complete, file inspection shows a warmStandby section with enabled state, target region or zone placeholder, rpoMinutes set to 60, rtoMinutes set to 120, PostgreSQL backup settings, object storage replication settings, and validation metadata. The values file must use placeholders for provider-specific identifiers and secret references rather than embedding real credentials or account IDs. This story does not provision cloud infrastructure, create Terraform resources, build a Helm chart, or migrate databases. It depends on the selected Kubernetes deployment direction and the managed PostgreSQL/object storage platform assumptions already established by architecture decisions. The file should be safe to commit publicly and usable later by chart templates or GitOps without reinterpretation. It should also include operational notes that make rollback and recovery expectations visible to SRE reviewers.

| Field | Value |
|---|---|
| Story Points | 3 |
| Hours | 30h |
| Priority | P1 |
| Labels | epic:shadow-rollout, disaster-recovery, helm, kubernetes, complexity:medium |

**Acceptance Criteria**
- File inspection of helm/myerp-finance/values-dr.yaml shows warmStandby.enabled: true, warmStandby.rpoMinutes: 60, and warmStandby.rtoMinutes: 120.
- File inspection of helm/myerp-finance/values-dr.yaml shows managedPostgres.backups, managedPostgres.restoreValidation, objectStorage.replication, and runbook.annotations keys with placeholder values such as ${PRIMARY_REGION} or <managed-secret-ref> and no literal password, token, or API key values.
- Running python - <<'PY'
from pathlib import Path
p=Path('helm/myerp-finance/values-dr.yaml')
text=p.read_text()
for token in ['warmStandby:', 'rpoMinutes: 60', 'rtoMinutes: 120', 'managedPostgres:', 'objectStorage:']:
    assert token in text
PY verifies the required DR sections without needing Helm installed; unit tests are N/A — this story adds declarative YAML configuration only.
- System integration tests are N/A — no Helm chart templates or Kubernetes cluster exist in the repository for helm/myerp-finance/values-dr.yaml to render against in this story.
- Mock data and fixtures are N/A — disaster recovery values are environment configuration and do not require finance test records or seed data.
- README.md contains the command or inspection steps for validating helm/myerp-finance/values-dr.yaml and states the warm standby target as RPO up to 1 hour and RTO up to 2 hours.

**Depends on:** WO-068, WO-061

### [P1] Add finance rollout feature flags

Add a Python rollout feature flag module that represents shadow, read-canary, read-authoritative, write-pilot, and write-authoritative states so finance slices can progress without making legacy OpenERP writes authoritative before parity and control evidence exist. The change belongs in a new module at app/rollout/feature_flags.py, with README.md updated to document the state meanings because the repository currently only describes app/ as the future modernized application area. Stakeholders need this because controllers and SREs must be able to verify that legacy remains authoritative until parity, security, rollback, and finance sign-off gates are satisfied. The current state is that rollout modes are described in planning prose, while no executable state machine prevents an accidental jump from shadow operation to production writes. When complete, a developer can import the module, parse configured state names, ask whether reads or writes may be served authoritatively, and receive deterministic denial reasons for disallowed transitions. The module should treat unknown states and unsupported transitions as fail-closed conditions, not as permissive defaults. This story does not implement API routing, identity verification, Helm deployment, parity comparison, or cutover execution. It depends on the prior capabilities that define finance slice names and release gate evidence so the state machine can be aligned to actual modernization slices rather than arbitrary environment toggles. The implementation should be small, dependency-light, and suitable for both application runtime checks and operability tests. It must not edit legacy OpenERP files under legacy/openerp-7.0 because those files remain the baseline compatibility kernel during shadow rollout.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:shadow-rollout, rollout, feature-flags, finance-controls, complexity:medium |

**Acceptance Criteria**
- File inspection of app/rollout/feature_flags.py shows a RolloutState enum or equivalent constants containing exactly shadow, read-canary, read-authoritative, write-pilot, and write-authoritative as supported state values.
- Running python -m pytest tests/rollout/test_feature_flags.py verifies parse_rollout_state, can_serve_read_authoritatively, can_serve_write_authoritatively, and assert_transition_allowed for all five states; unit tests are written and passing for app/rollout/feature_flags.py.
- Running python -m pytest tests/operability/test_feature_flag_boundaries.py validates the service boundary behavior that write-authoritative is refused unless supplied parity_pass=True, security_gate_pass=True, rollback_rehearsed=True, and finance_signoff=True; system integration tests validate the rollout decision boundary without external services.
- File inspection of tests/fixtures/rollout/finance_slices.json confirms committed mock data for at least ledger_projection, invoice_projection, and tax_change_control slices with configured rollout states; mock fixtures are generated and committed.
- Running python -m pytest tests/rollout/test_feature_flags.py::test_unknown_state_fails_closed verifies app/rollout/feature_flags.py rejects an unknown state with a deterministic ValueError message containing unknown rollout state.
- README.md contains a section that names app/rollout/feature_flags.py and documents which of shadow, read-canary, read-authoritative, write-pilot, and write-authoritative allow authoritative reads or writes.

**Depends on:** WO-084, WO-094

### [P1] Add finance SLO metrics module

Add a finance SLO metrics module that computes parity pass rate, P0 variance count, policy denial count, and replay duration so release gates can evaluate shadow rollout health with deterministic evidence. The change belongs in a new file at app/observability/slo.py, with README.md updated because the current repository has no observability module even though Release 1 requires parity, denial, evidence, and replay-duration gates. Finance and platform stakeholders need this because a slice must not become authoritative when P0 parity variances exist, policy denials are not evidenced, or replay duration exceeds the agreed threshold for the seed dataset. The current state is that legacy tests such as legacy/openerp-7.0/addons/account/account_assert_test.xml assert accounting correctness, but there is no modern SLI/SLO evaluator for rollout decisions. When complete, a developer can import app.observability.slo, pass in parity and replay summary records, and receive named metric values plus release gate pass or fail decisions. The module should expose metric names that can later be mapped to OpenTelemetry, but it should not require a collector or production monitoring backend in this story. This story does not build dashboards, alerts, log shipping, Kubernetes monitors, or tracing instrumentation. It depends on parity result generation, policy denial evidence, tax replay outputs, and audit evidence capabilities being available as upstream data sources. The implementation should use committed JSON fixtures to model those upstream outputs so SREs can run tests locally without a database, legacy OpenERP server, or cloud account. It must keep monetary and duration comparisons deterministic and avoid floats for money-related thresholds.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:shadow-rollout, observability, slo, release-gates, complexity:medium |

**Acceptance Criteria**
- File inspection of app/observability/slo.py shows exported metric constants or names for finance.parity.pass_rate, finance.parity.p0_variance_count, finance.policy.denial_count, and finance.replay.duration_ms.
- Running python -m pytest tests/observability/test_slo.py verifies compute_parity_pass_rate, count_p0_variances, count_policy_denials, evaluate_replay_duration_ms, and evaluate_release_slo using committed fixtures; unit tests are written and passing for app/observability/slo.py.
- Running python -m pytest tests/operability/test_slo_release_boundary.py validates the integration boundary where a fixture with p0_variance_count greater than 0 makes evaluate_release_slo return allowed=False and reason_code=P0_VARIANCE_PRESENT; system integration tests validate service boundary behavior using JSON fixture inputs.
- File inspection of tests/fixtures/observability/slo_samples.json confirms committed mock data for a passing no-change replay, a P0 variance replay, at least one policy denial evidence record, and replay durations in milliseconds; mock fixtures are generated and committed.
- Running python -m pytest tests/observability/test_slo.py::test_replay_duration_threshold_uses_integer_milliseconds verifies app/observability/slo.py compares replay duration with integer milliseconds and does not require floating-point money values.
- README.md contains a section naming app/observability/slo.py and documenting the four finance SLO metrics and the command python -m pytest tests/observability/test_slo.py.

**Depends on:** WO-060, WO-063, WO-095, WO-083

### [P1] Automate cutover rehearsal checklist

Add an automated cutover rehearsal script that evaluates finance slice feature flags, SLO metrics, disaster recovery readiness, and rollback steps so platform and finance teams can rehearse before any slice becomes write-authoritative. The change belongs in a new file at scripts/cutover_rehearsal.py, with README.md updated because the repository currently has no scriptable production readiness entry point. This matters because controllers, SREs, and release managers need a repeatable command that proves rollback to shadow mode is documented and executable before live finance mutations are enabled. The current state is that rollback strategy exists in architecture prose, while feature flags and SLO gates are not yet orchestrated into a single rehearsal workflow. When complete, running the script against committed fixtures produces a JSON report containing slice name, current rollout state, gate results, rollback checklist items, and an overall allowed flag. The script must fail closed for missing fixture files, missing warm standby values, P0 variance records, unproven policy denial evidence, or absent rollback steps. This story does not perform a real production cutover, mutate Kubernetes resources, restore databases, or call OpenERP XML-RPC methods. It depends on the completed feature flag state machine, warm standby DR values, SLO metric evaluator, parity evidence, and policy denial evidence capabilities. The implementation should be automation-first and safe to run in CI, staging, or a developer laptop using only repository-local fixtures. It must clearly distinguish rehearsal output from actual approval so finance sign-off remains an explicit gate outside the script.

| Field | Value |
|---|---|
| Story Points | 8 |
| Hours | 80h |
| Priority | P1 |
| Labels | epic:shadow-rollout, cutover, rollback, runbook-automation, complexity:high |

**Acceptance Criteria**
- Running python scripts/cutover_rehearsal.py --fixture tests/fixtures/operability/cutover_rehearsal_pass.json --dr-values helm/myerp-finance/values-dr.yaml --output /tmp/cutover-report.json exits with status code 0 and writes /tmp/cutover-report.json containing overall_allowed true.
- Running python scripts/cutover_rehearsal.py --fixture tests/fixtures/operability/cutover_rehearsal_p0_variance.json --dr-values helm/myerp-finance/values-dr.yaml exits with non-zero status and prints or writes a reason_code containing P0_VARIANCE_PRESENT.
- Running python -m pytest tests/operability/test_cutover_rehearsal.py verifies load_rehearsal_fixture, build_rollback_checklist, evaluate_cutover_rehearsal, and main argument handling; unit tests are written and passing for scripts/cutover_rehearsal.py.
- Running python -m pytest tests/operability/test_cutover_rehearsal_integration.py validates the integration boundary across app/rollout/feature_flags.py, app/observability/slo.py, and helm/myerp-finance/values-dr.yaml; system integration tests validate service and configuration boundaries with local files.
- File inspection of tests/fixtures/operability/cutover_rehearsal_pass.json and tests/fixtures/operability/cutover_rehearsal_p0_variance.json confirms committed mock data for finance slice flags, parity summary, policy denial evidence, replay duration, rollback owner, and rollback steps; mock fixtures are generated and committed.
- README.md contains a cutover rehearsal runbook section naming scripts/cutover_rehearsal.py, the required --fixture and --dr-values arguments, the rollback-to-shadow expectation, and the non-zero exit behavior for blocked gates.

**Depends on:** WO-097, WO-098, WO-099, WO-077, WO-102

### [P1] Test release gate enforcement

Add operability release gate tests that verify parity, security evidence, rollback readiness, and cutover rehearsal gates block unsafe finance slice promotion. The change belongs in a new file at tests/operability/test_release_gates.py, with README.md updated because the repository currently has no consolidated release-gate test suite for shadow rollout readiness. This matters because finance stakeholders need objective, repeatable evidence that a P0 variance, missing policy denial evidence, absent rollback plan, or failed cutover rehearsal prevents write-authoritative operation. The current state includes legacy accounting tests such as legacy/openerp-7.0/addons/account/account_unit_test.xml and account_assert_test.xml, but those tests validate legacy accounting behavior rather than modern production readiness gates. When complete, running the operability test file validates the composed boundary across feature flags, SLO metrics, DR values, and the cutover rehearsal script. The tests should use committed fixtures and subprocess or direct function calls so they exercise the same command path an SRE would run during a release review. This story does not add new rollout states, change SLO metric definitions, alter Helm DR values, or implement actual infrastructure provisioning. It depends on the feature flag module, warm standby values file, SLO module, cutover rehearsal script, parity evidence, security evidence, and rollback checklist capabilities being implemented. The test suite should produce deterministic failures with reason codes that release managers can map to go or no-go decisions. It must be safe to run in CI without OpenERP, PostgreSQL, Kubernetes, cloud credentials, or a monitoring backend.

| Field | Value |
|---|---|
| Story Points | 5 |
| Hours | 50h |
| Priority | P1 |
| Labels | epic:shadow-rollout, operability-tests, release-gates, rollback, complexity:medium |

**Acceptance Criteria**
- Running python -m pytest tests/operability/test_release_gates.py executes tests that import app/rollout/feature_flags.py and app/observability/slo.py and assert write-authoritative promotion is denied when parity_pass is false.
- tests/operability/test_release_gates.py contains a test assertion that a release fixture with p0_variance_count greater than 0 returns or reports reason_code P0_VARIANCE_PRESENT from evaluate_release_slo or scripts/cutover_rehearsal.py.
- tests/operability/test_release_gates.py contains a test assertion that missing policy denial evidence blocks promotion with a reason_code containing POLICY_EVIDENCE_MISSING or equivalent deterministic policy evidence code.
- tests/operability/test_release_gates.py contains a test assertion that missing rollback checklist entries in tests/fixtures/operability/release_gate_missing_rollback.json block cutover rehearsal; system integration tests validate the release gate boundary across script, feature flag, SLO, and DR configuration files.
- File inspection of tests/fixtures/operability/release_gate_pass.json, tests/fixtures/operability/release_gate_p0_variance.json, tests/fixtures/operability/release_gate_missing_policy_evidence.json, and tests/fixtures/operability/release_gate_missing_rollback.json confirms committed mock data for release gate pass and fail cases; mock fixtures are generated and committed.
- Unit test coverage is provided through python -m pytest tests/operability/test_release_gates.py for release gate composition helpers or imported pure functions, and README.md documents this command as the production readiness regression test.

**Depends on:** WO-008, WO-097, WO-098, WO-104