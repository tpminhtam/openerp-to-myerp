# Intent profile

**Status:** complete

**Artifact:** `c4c66617-d982-498a-a9c8-8e829b6479d0`

## Vision

Modernize the legacy OpenERP 7.0 accounting subsystem into a secure, parity-tested, Python 3.14-compatible finance platform by isolating accounting domain seams, replacing caller-controlled actor identity with enforceable authorization, and creating stable APIs and tests before migrating runtime behavior.

## Target personas

- Accountant / Finance Operator: role=day-to-day accounting user; goals=post invoices, journal entries, bank statements, reconciliations, and period/fiscal closing accurately; pain_points=legacy workflows rely on distributed XML/UI behavior, security intent is hard to verify, and modernization must not change financial results.
- Finance Administrator / Controller: role=owner of company, period, role, posting, and audit controls; goals=enforce company/period/state-based policies, maintain auditable financial state transitions, and control privileged posting/reversal workflows; pain_points=caller-controlled X-Actor identity is not trustworthy, ACLs and workflow rules are scattered, and write-capable finance actions lack a single discoverable policy layer.
- Auditor / Compliance Reviewer: role=reviewer of accounting correctness and authorization history; goals=verify balanced entries, tax calculations, report totals, access controls, and tamper-evident audit behavior; pain_points=limited visible automated coverage, semantic drift between PRD/myERP terms and legacy OpenERP model names, and difficult traceability from reports/workflows to exact code paths.
- Modernization Engineer / Maintainer: role=developer migrating OpenERP 7/Python 2-era code to a supported architecture; goals=classify kernel versus extraction candidates, wrap accounting operations behind narrow adapters, migrate capability slices safely, and use parity tests to preserve behavior; pain_points=high-fan-in ORM hubs, circular dependencies, generic create/write/search/execute operations hiding business intent, and sparse test coverage across 46,516 LOC.
- API Consumer / Future myERP Integration: role=consumer of future read/write finance APIs; goals=use stable projection-oriented read APIs and secure write workflows; pain_points=current browse/context-heavy OpenERP patterns move rich dynamic objects through generic APIs, and production APIs cannot safely rely on an X-Actor header.

## Core features

- **Central Authentication and Authorization Boundary** (priority 1)
  - Description: Replace persona/header-based identity with centrally enforced authentication, authorization, and server-side policy checks before exposing production APIs for write-capable finance workflows. The current modernization context indicates no login and every API call carries a selected principal in an `X-Actor` header, while legacy access intent exists in `legacy/openerp-7.0/addons/account/security/account_security.xml` and `security/ir.model.access.csv`.
  - Acceptance: Caller-controlled `X-Actor` identity is no longer accepted as the durable trust boundary for production write-capable finance APIs.
  - Acceptance: Authentication is centrally enforced before access to accounting records, invoice posting, journal posting, reconciliation, or other write-capable finance workflows.
  - Acceptance: Authorization is enforced server-side rather than relying on client persona selection, UI visibility, menus, or headers.
  - Acceptance: Legacy access-control intent from `legacy/openerp-7.0/addons/account/security/account_security.xml` is reviewed and mapped into executable authorization rules.
  - Acceptance: Legacy model access intent from `security/ir.model.access.csv` is reviewed and mapped into executable authorization rules.
  - Acceptance: Unauthorized callers cannot perform accounting record mutation, invoice posting, journal posting, or reconciliation through API calls.
  - Acceptance: Authentication and authorization decisions are testable through API/RPC-style access paths, not only through web UI behavior.
- **Incremental Migration Path off OpenERP 7.0 and Python 2-era Runtime** (priority 2)
  - Description: Create an incremental migration path from the OpenERP 7.0/Python 2-era runtime toward a supported Python 3.14-compatible service layer or a selected modern ERP/application framework. The migration should start with parity-tested accounting domain seams rather than a risky direct rewrite.
  - Acceptance: The modernization plan explicitly recognizes the current code root under `legacy/openerp-7.0` as legacy OpenERP 7.0 runtime code.
  - Acceptance: The plan accounts for `osv.osv` model inheritance and Python 2-era syntax visible in files such as `osv.py`, `fields.py`, and `account_bank.py`.
  - Acceptance: The target runtime direction is Python 3.14-compatible, using Python 3.14 as the current stable production-oriented target as of September 2026.
  - Acceptance: The plan avoids a big-bang rewrite by defining incremental accounting capability slices.
  - Acceptance: Each migrated capability slice is protected by parity tests before runtime behavior is replaced.
  - Acceptance: Stable accounting invariants are isolated before replacing OpenERP OSV ORM behavior.
  - Acceptance: The migration path identifies whether the target is a custom Python 3.14-compatible service layer or a selected modern ERP/application framework before implementation proceeds.
  - Acceptance: Python 2.7 EOL risk is treated as critical because Python 2.7 has been unsupported since January 1, 2020.
- **Central Domain Policy Layer for Posting and Reversal Workflows** (priority 3)
  - Description: Introduce a centralized domain policy layer for journal entry, invoice, bank statement, fiscal closing, and reversal workflows. The layer must enforce explicit role, company, period, state, and audit preconditions server-side instead of relying on distributed XML workflow/UI state or ad hoc checks.
  - Acceptance: Invoice workflow transitions modeled in `legacy/openerp-7.0/addons/account/account_invoice_workflow.xml` are mapped to explicit server-side policy checks.
  - Acceptance: `account_bank_statement.py:button_confirm_bank` and related statement posting flows are covered by centralized policy checks.
  - Acceptance: Privileged UI/config actions such as those evidenced by `account_validate_move_view.xml` are not treated as sufficient security controls by themselves.
  - Acceptance: Posting workflows enforce role preconditions server-side.
  - Acceptance: Posting workflows enforce company preconditions server-side.
  - Acceptance: Posting workflows enforce accounting period preconditions server-side.
  - Acceptance: Posting workflows enforce document/state preconditions server-side.
  - Acceptance: Posting and reversal workflows enforce audit preconditions server-side.
  - Acceptance: The policy module is reusable by both legacy adapters and future APIs.
  - Acceptance: Policy behavior is discoverable and testable from one centralized domain layer.
- **Projection-oriented Accounting Read APIs** (priority 4)
  - Description: Add projection-oriented read APIs for journal search, trial balance, invoices, tax lines, partner ledger, and general ledger. These APIs should replace broad browse/context object movement with narrow DTO-style outputs backed by parity tests.
  - Acceptance: A journal search read API is defined with narrow DTO-style outputs.
  - Acceptance: A trial balance read API is defined with narrow DTO-style outputs.
  - Acceptance: An invoices read API is defined with narrow DTO-style outputs.
  - Acceptance: A tax lines read API is defined with narrow DTO-style outputs.
  - Acceptance: A partner ledger read API is defined with narrow DTO-style outputs.
  - Acceptance: A general ledger read API is defined with narrow DTO-style outputs.
  - Acceptance: `account_move_line.py:_query_get` behavior is analyzed because it currently builds context-sensitive SQL conditions used by reporting and ledger selection.
  - Acceptance: Projection APIs preserve reporting semantics for company, fiscal year, date range, period range, move state, and initial-balance style filters where applicable.
  - Acceptance: Projection APIs are backed by parity tests comparing legacy outputs to the new DTO outputs.
  - Acceptance: The implementation reduces coupling to OpenERP browse/context patterns and rich dynamic object movement.
  - Acceptance: Raw SQL or query-generation behavior is reviewed for safe parameterization where raw SQL remains unavoidable.
- **ORM Hub Classification, Adapters, and Pure Accounting Domain Modules** (priority 5)
  - Description: Classify OpenERP framework hubs as stable kernel versus extraction candidates, then wrap accounting-specific operations behind narrow adapters and pure domain modules. This targets the high system gravity around `legacy/openerp-7.0/openerp/osv/` and generic ORM verbs such as `execute`, `search`, `write`, and `create`.
  - Acceptance: Framework hubs under `legacy/openerp-7.0/openerp/osv/` are classified as stable kernel or extraction candidates.
  - Acceptance: High-fan-in operations are explicitly reviewed, including `execute` with reported fan-in 109.
  - Acceptance: High-fan-in operations are explicitly reviewed, including `search` with reported fan-in 86.
  - Acceptance: High-fan-in operations are explicitly reviewed, including `except_osv` with reported fan-in 49.
  - Acceptance: High-fan-in operations are explicitly reviewed, including `write` with reported fan-in 35.
  - Acceptance: High-fan-in operations are explicitly reviewed, including `create` with reported fan-in 35.
  - Acceptance: Circular dependency and dependency-balance concerns are considered when defining extraction boundaries.
  - Acceptance: Accounting-specific operations are wrapped behind narrow adapters rather than exposing generic ORM operations directly.
  - Acceptance: Pure accounting domain modules are introduced where behavior can be separated from the OpenERP kernel.
  - Acceptance: Adapters allow individual accounting capabilities to modernize without requiring changes across the entire OpenERP kernel.
  - Acceptance: Business intent is made explicit in adapter/domain method names rather than hidden behind generic ORM verbs.
- **Canonical Finance Domain Dictionary and Parity Map** (priority 6)
  - Description: Create a canonical finance domain dictionary and parity map that links PRD/myERP terms to legacy OpenERP models, XML security rules, workflows, reports, and exact functions. This reduces semantic drift between planning documents under `context/`, legacy model names under `legacy/openerp-7.0/addons/account/`, and future myERP terminology.
  - Acceptance: A canonical domain dictionary is created for key finance concepts used in PRD/myERP and legacy OpenERP code.
  - Acceptance: Each canonical term is mapped to relevant legacy OpenERP model names.
  - Acceptance: Each canonical term is mapped to relevant XML security rules where applicable.
  - Acceptance: Each canonical term is mapped to relevant XML workflows where applicable.
  - Acceptance: Each canonical term is mapped to relevant reports where applicable.
  - Acceptance: Each canonical term is mapped to exact functions or methods where applicable.
  - Acceptance: The map explicitly addresses overlapping OpenERP 7 names, future myERP names, generic ORM verbs, demo data terminology, and planned modernization terminology.
  - Acceptance: The parity map can be used as a testable contract for future migration slices.
  - Acceptance: The dictionary improves onboarding by reducing rediscovery of accounting semantics across code and planning documents.
- **Accounting Parity Test Harness** (priority 7)
  - Description: Build a parity-test harness for critical accounting invariants, XML workflows, reports, and JavaScript widgets before migration. Existing visible coverage is sparse relative to scope: 21 tests across about 46,516 LOC, mostly YAML scenarios under `legacy/openerp-7.0/addons/account/test/` plus a few Python tests under `addons/account/tests/`.
  - Acceptance: Parity tests verify balanced accounting entries.
  - Acceptance: Parity tests verify tax calculation behavior.
  - Acceptance: Parity tests verify invoice posting behavior.
  - Acceptance: Parity tests verify bank/cash statement posting behavior.
  - Acceptance: Parity tests verify reconciliation behavior.
  - Acceptance: Parity tests verify fiscal-year close behavior.
  - Acceptance: Parity tests verify accounting report totals.
  - Acceptance: Parity tests cover key wizard flows.
  - Acceptance: Parity tests include XML workflow/view interaction coverage where those interactions affect accounting behavior.
  - Acceptance: Parity tests include report-rendering coverage for critical accounting reports.
  - Acceptance: Parity tests include JavaScript widget behavior where widgets affect accounting workflows or reporting.
  - Acceptance: Existing YAML scenarios under `legacy/openerp-7.0/addons/account/test/` are inventoried and either retained, translated, or used as behavioral references.
  - Acceptance: Existing Python tests under `addons/account/tests/` are inventoried and either retained, translated, or used as behavioral references.
  - Acceptance: The harness runs before migration of ORM, workflow, or reporting layers so behavior preservation is measurable.

## In Scope

- Replace caller-controlled `X-Actor` identity with centrally enforced authentication, authorization, and server-side policy checks for write-capable finance workflows.
- Create an incremental migration path off OpenERP 7.0/Python 2-era runtime toward a Python 3.14-compatible service layer or selected modern ERP/application framework.
- Introduce a centralized domain policy layer for posting and reversal workflows covering role, company, period, state, and audit preconditions.
- Add projection-oriented read APIs for journal search, trial balance, invoices, tax lines, partner ledger, and general ledger.
- Classify OpenERP ORM/framework hubs as stable kernel versus extraction candidates and wrap accounting-specific operations behind narrow adapters and pure domain modules.
- Create a canonical finance domain dictionary and parity map linking PRD terms to legacy models, XML security rules, workflows, reports, and exact functions.
- Build a parity-test harness for balanced entries, tax calculation, invoice posting, statement posting, reconciliation, fiscal-year close, report totals, XML workflows, reports, JavaScript widgets, and key wizard flows.

## Out of Scope

- Modernization work outside the seven selected assessment recommendations remains unchanged unless explicitly added later.
- A full big-bang rewrite of the entire OpenERP 7.0 system is out of scope for this intent.
- New accounting product capabilities beyond the selected security, migration, policy, projection, adapter, mapping, and parity-test work are out of scope.
- Broad replacement of all reports, wizards, EDI, dashboards, analytic accounting, budgets, or installer logic is out of scope unless needed to satisfy the selected parity, projection, policy, or adapter seams.
- Infrastructure modernization such as containerization, CI/CD implementation, observability rollout, cache introduction, or message queue adoption is out of scope unless separately selected.
- Frontend redesign or mobile application development is out of scope.
- Unselected assessment recommendations or unrelated code-quality improvements must not be promoted into implementation scope.

## Technical constraints

- Authoritative scope is limited to the seven user-selected modernization recommendations; unchecked assessment themes must not be promoted into core features or scope-in work.
- Current codebase is a legacy OpenERP 7.0 accounting subsystem rooted under `legacy/openerp-7.0`.
- Current backend uses Python 2-era OpenERP APIs, including `osv.osv`, `osv.osv_memory`, `openerp.osv.fields`, `pool.get()`, and `cr, uid, ids, context` method signatures.
- Python 2.7 has been EOL since January 1, 2020 and must be treated as unsupported.
- Target Python runtime should be Python 3.14-compatible because Python 3.14 is the current stable release line as of September 2026.
- If server-side JavaScript tooling is introduced for legacy JavaScript assets or build/test workflows, Node.js 24 LTS is the recommended production target as of September 2026; Node.js 22 is only a short-term fallback.
- The existing persistence layer is PostgreSQL accessed through OpenERP ORM behavior and `psycopg2`.
- The existing application style is a monolithic OpenERP addon/runtime with XML-defined UI, security, workflows, RML reports, YAML scenarios, and small legacy JavaScript assets.
- Modernization must preserve accounting behavior through parity tests before replacing ORM, workflow, reporting, or posting behavior.
- Production write-capable finance APIs must not rely on caller-controlled `X-Actor` headers as an authentication or authorization boundary.
- Server-side authorization must cover accounting records, invoice posting, journal posting, statement posting, fiscal closing, reconciliation, and reversal workflows.
- The migration approach must avoid a direct big-bang rewrite and instead proceed through parity-tested accounting domain seams.
- The existing repository provides no clear evidence of modern CI/CD, containerization, explicit deployment entry point, observability stack, cache, or message queue; modernization assumptions in those areas should be confirmed before implementation planning.

## Confidence

Overall: **89%**

> The input contains rich automated codebase analysis and an explicit selected modernization scope, making the intent extraction highly complete.

| Section | Score | Why | How to Improve |
| --- | --- | --- | --- |
| Vision | 90% | The modernization objective is clearly evidenced by the confirmed goal, selected recommendations, legacy OpenERP/Python 2 context, and future myERP direction. | Add 2-3 measurable modernization outcomes, such as target cutover criteria, acceptable parity tolerance for reports, or required security certification goals. |
| Target personas | 78% | Personas are strongly inferable from accounting workflows, security roles, reports, and modernization responsibilities, though exact organization-specific titles were not supplied. | Confirm the actual production roles and permission groups, especially who may post invoices, post journals, reconcile, close fiscal years, and administer access. |
| Core features | 96% | The user-selected assessment recommendations provide an authoritative and detailed scope with concrete files, risks, and expected modernization actions. | Rank the seven selected modernization items by delivery phase or milestone and identify which accounting slice should be migrated first. |
| Technical constraints | 92% | The technology profile, codebase analysis, and research context provide strong evidence for runtime, architecture, database, migration, and EOL constraints. | Provide target hosting, CI/CD, observability, database version, preferred modern ERP/application framework, and any regulatory or audit requirements. |

---

# Modernization Analysis

> Review the proposals below and select the modernization areas you want to pursue. You can reply in the chat to confirm your choices or ask follow-up questions.

## Tech Stack

*Language, framework, and tooling modernization*

| # | Area | Current | Proposed | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Backend language runtime | OpenERP 7.0 codebase using Python 2-era syntax and APIs under `legacy/openerp-7.0`; Python 2 has been EOL since 2020. | Move accounting modernization slices to a Python 3.14-compatible runtime, preserving legacy behavior through adapters and parity tests during transition. | Python 3.14 is the current stable Python line in 2026 and provides a supported security and tooling baseline. Incremental migration avoids the risk of a direct rewrite of accounting behavior. |
| 2 | ERP framework and ORM model layer | Legacy OpenERP OSV models using `osv.osv`, `_columns`, `self.pool`, `cr, uid, ids, context`, and generic ORM operations such as `search`, `write`, and `create`. | Introduce narrow accounting adapters around the OSV kernel and migrate selected domain slices toward either modern Odoo-style `models.Model` APIs or a Python 3.14 service layer with explicit domain modules. | The current ORM hubs have high fan-in and hide business intent behind generic verbs. Adapter boundaries let the team modernize posting, reporting, and ledger access without destabilizing the whole OpenERP kernel at once. |
| 3 | Authentication and actor trust boundary | No deterministic login boundary is evidenced; modernization notes describe API calls carrying a caller-selected principal through an `X-Actor` header. | Replace caller-controlled actor selection with centralized authentication using OIDC/OAuth2-compatible identity, server-issued tokens or sessions, and server-side authorization checks. | A request header is not a trustworthy identity boundary for accounting workflows. Central identity enforcement is required before exposing write-capable finance APIs. |
| 4 | Authorization for finance state transitions | Access control exists in XML and CSV files such as `account_security.xml` and `ir.model.access.csv`, while workflow transitions are distributed across XML workflows, views, and model methods. | Create a centralized domain policy layer for journal posting, invoice posting, bank statement confirmation, reversals, reconciliation, and fiscal close. | Posting workflows mutate system-of-record financial state and need explicit role, company, period, state, and audit preconditions. Central policies make enforcement testable and reusable across legacy and modern entry points. |
| 5 | Accounting read model and reporting access | `account_move_line.py:_query_get` builds context-sensitive SQL fragments for reports, while OpenERP browse objects carry rich dynamic state through generic APIs. | Add projection-oriented read APIs returning DTO-style outputs for journal search, trial balance, invoices, tax lines, partner ledger, and general ledger. | Stable projections reduce coupling to OpenERP browse/context behavior and create safer contracts for API exposure, report parity, and performance tuning. |
| 6 | Canonical finance domain model | The repository mixes OpenERP 7 names, future myERP PRD names, XML workflow terms, reports, demo data, and generic ORM terminology. | Create a canonical domain dictionary and parity map linking PRD tables and terms to legacy models, XML security rules, workflows, reports, and exact functions. | Accounting modernization is vulnerable to semantic drift. A canonical map turns rediscovery work into explicit migration contracts. |
| 7 | Testing strategy | Visible automated coverage is sparse for the scope: 21 tests across roughly 46,516 LOC, mostly YAML scenarios with limited evidence for report rendering, XML workflow, and JavaScript widget coverage. | Build a parity-test harness using Python 3-compatible test tooling for balanced entries, taxes, invoice posting, statement posting, reconciliation, fiscal-year close, report totals, and key wizard/widget flows. | Financial behavior must be preserved before replacing runtime, ORM, or reporting layers. Parity tests give measurable evidence that modernization has not changed accounting results. |
| 8 | JavaScript widget validation | The account addon includes small legacy OpenERP JavaScript/QWeb assets, with little evidence of automated widget or browser interaction tests. | Use Node.js 24 LTS and browser automation tests for the selected accounting widgets and workflow screens that participate in parity-critical flows. | Node.js 24 is the recommended production LTS line in 2026. Testing the limited legacy widget surface reduces regression risk without expanding scope into a full UI rewrite. |

## Packages & Dependencies

*Dependency upgrades and vulnerability remediation*

| # | Area | Current | Proposed | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Python interpreter | Python 2-era OpenERP runtime; exact interpreter pin is not visible, but the code uses Python 2 syntax and OpenERP 7 APIs. | Python 3.14.x for all new service-layer, adapter, test, and migration code. | Python 2.7 has been EOL since January 2020. Python 3.14 provides the current stable support window and unlocks modern packaging, security updates, typing, and test tooling. |
| 2 | OpenERP framework package | Bundled OpenERP 7.0 framework under `legacy/openerp-7.0`, including `openerp.osv.orm`, `openerp.osv.fields`, XML workflows, and legacy addon metadata. | Move incrementally to a supported Python 3-compatible ERP/application framework layer; if adopting Odoo, migrate through supported version steps using OCA OpenUpgrade rather than a direct jump. | OpenERP 7 accounting models and workflows differ substantially from modern Odoo accounting models. Versioned migration tooling and domain adapters reduce schema, workflow, and business-rule loss. |
| 3 | PostgreSQL driver | `psycopg2` is imported by the legacy ORM; no patched version pin is visible. | Use `psycopg` 3.x for new Python 3.14 data-access and projection code, while isolating legacy `psycopg2` behind the OpenERP compatibility boundary until retired. | Modern PostgreSQL access should be separated from the legacy ORM so projections can use explicit parameters, typed rows, and current driver support without destabilizing OpenERP internals. |
| 4 | Authentication libraries | No modern authentication middleware or token validation package is evidenced; identity is represented by a caller-provided actor header in modernization notes. | Adopt maintained OIDC/OAuth2 libraries such as `Authlib` 1.6.x and `PyJWT` 2.10.x, integrated with the selected identity provider. | Finance APIs need standards-based token validation, issuer/audience checks, key rotation support, and auditable identity claims. This replaces persona headers with verifiable server-side identity. |
| 5 | XML parsing and workflow/security migration | Legacy code imports `lxml.etree` and uses XML extensively for views, security rules, workflows, and reports; no dependency pin is visible. | Pin a supported `lxml` 6.x line for Python 3.14 migration tooling that extracts and validates XML security, workflow, and report mappings. | XML remains central to the selected modernization scope because security rules and workflows are defined there. A pinned modern parser reduces supply-chain and compatibility risk while building the parity map. |
| 6 | JSON serialization | Legacy ORM imports `simplejson`; no version pin is visible. | Prefer Python 3.14 standard-library `json` for ordinary DTO projections, adding a maintained serializer only if parity tests expose a concrete need. | Projection APIs should keep dependencies small and predictable. Standard JSON support is sufficient for narrow read DTOs unless legacy numeric/date behavior requires a pinned compatibility package. |
| 7 | Python test framework | Mostly legacy YAML scenarios and a small number of Python tests under the accounting addon. | Use `pytest` 8.x, `pytest-cov` 5.x or newer, and `coverage.py` 7.x for the parity-test harness. | Modern Python test tooling enables parametrized parity cases, fixture-driven accounting datasets, coverage gates, and CI integration while still allowing legacy behavior to be invoked through adapters. |
| 8 | Browser and JavaScript test tooling | Legacy OpenERP JavaScript/QWeb assets are present, but automated JavaScript or browser interaction coverage is not evidenced. | Use Node.js 24 LTS with Playwright 1.x for accounting workflow and widget parity tests. | The selected scope includes JavaScript widget and XML/view interaction coverage. Playwright provides repeatable browser checks without requiring a full frontend framework migration. |
| 9 | Python packaging and dependency locking | No modern package manifest or lockfile is evidenced for the modernization/runtime boundary. | Introduce `pyproject.toml` with locked Python 3.14 dependencies using a reproducible resolver such as `uv` 0.8.x or a comparable enterprise-approved lockfile workflow. | A pinned dependency graph is necessary for repeatable parity tests, controlled security updates, and staged migration from legacy OpenERP packages. |

## Infrastructure

*Hosting, orchestration, and platform modernization*

| # | Area | Current | Proposed | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Runtime deployment boundary | The source material shows a legacy OpenERP monolith but no explicit container, deployment entry point, or modern production runtime configuration. | Package modernization slices and parity-test environments as OCI containers running Python 3.14, keeping the legacy OpenERP runtime isolated as a compatibility service during transition. | Container boundaries make the legacy and modern runtimes reproducible side by side. This supports incremental extraction without requiring an immediate full production cutover. |
| 2 | Identity infrastructure | No centralized login or identity provider integration is evidenced; actor identity is selected per request through `X-Actor`. | Integrate with an OIDC-compatible identity provider and store signing keys, client secrets, and service credentials in a managed secrets store. | Authentication must be enforced outside caller-controlled headers. Managed identity and secrets handling reduce the risk of unauthorized accounting state changes. |
| 3 | CI/CD and parity gates | No CI/CD pipeline is evidenced, and the current test base is too small for safe accounting modernization. | Add a CI pipeline that runs legacy parity fixtures, Python 3.14 tests, XML/workflow extraction checks, report-total comparisons, browser/widget tests, and container image builds. | Migration should be blocked when accounting invariants or authorization checks regress. CI parity gates make preservation of financial behavior an enforceable release criterion. |
| 4 | Database staging and migration rehearsal | PostgreSQL persistence is implied by the OpenERP ORM, but no managed database, staging clone, backup, or migration rehearsal process is evidenced. | Use managed PostgreSQL staging environments with sanitized production-like snapshots, repeatable backup/restore, and rehearsal runs for projection and framework migration changes. | Accounting correctness cannot be proven with schema migration alone. Staging snapshots allow report, ledger, and reconciliation parity to be verified before production change. |
| 5 | Authorization and audit observability | Legacy XML/CSV access rules exist, but there is no visible centralized logging of policy decisions for posting, reversal, reconciliation, or fiscal close. | Emit structured audit events for authentication, authorization decisions, posting attempts, reversals, reconciliation, and fiscal close actions. | Finance workflows need traceable server-side decisions. Structured audit output supports investigation, compliance review, and parity validation during modernization. |
| 6 | Migration documentation and domain inventory | Planning documents exist under `context/`, but selected modernization mappings between PRD concepts and legacy implementation points are not yet codified as release artifacts. | Maintain the canonical domain dictionary and parity map as versioned repository artifacts generated or validated in CI. | Treating the domain map as infrastructure prevents migration knowledge from living only in analyst notes. It also gives reviewers a stable inventory of which workflows, reports, and policies are covered. |

## Technical Capabilities

*New capabilities unlocked by modernization*

| # | Area | Current | Proposed | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Trustworthy finance API access | Write-capable workflows would rely on caller-supplied actor identity if exposed directly. | Authenticated and authorized finance APIs with verified principals, roles, company scope, and server-side policy checks. | This enables safe exposure of accounting capabilities without trusting request metadata controlled by the caller. |
| 2 | Centralized posting and reversal control | Posting behavior is spread across XML workflows, UI actions, and Python methods such as bank statement confirmation and invoice workflow transitions. | A single policy layer governing journal posting, invoice posting, statement confirmation, reversal, reconciliation, and fiscal close preconditions. | Central control makes critical state transitions easier to test, audit, and reuse across legacy adapters and future APIs. |
| 3 | Incremental runtime replacement | Accounting behavior is tightly coupled to the OpenERP 7 OSV runtime and generic ORM hubs. | Capability-by-capability migration using adapters, pure domain modules, and Python 3.14-compatible services. | The team can retire high-risk legacy areas gradually while preserving verified accounting behavior. |
| 4 | Stable accounting read projections | Reports depend on OpenERP browse/context behavior and dynamic SQL construction such as `_query_get`. | Explicit read projections for journal search, trial balance, invoices, tax lines, partner ledger, and general ledger. | Stable DTO outputs make reporting behavior measurable, easier to cache or optimize later, and less dependent on legacy object graphs. |
| 5 | Accounting parity verification | Coverage is sparse relative to the size and criticality of accounting workflows. | Automated parity checks for balanced entries, tax calculation, invoice posting, bank statement posting, reconciliation, fiscal close, reports, and selected wizard/widget flows. | Parity automation makes financial regression visible before production cutover. |
| 6 | Domain traceability | PRD terms, OpenERP model names, XML workflow identifiers, report names, and future myERP terminology are not yet unified. | A canonical traceability map from business concepts to legacy models, functions, XML security rules, workflows, reports, and test cases. | Traceability reduces onboarding time and gives modernization teams a shared contract for what each migration slice must preserve. |
| 7 | Auditable authorization outcomes | Legacy ACL files define permissions, but policy outcomes for sensitive posting workflows are not centralized or consistently observable. | Structured audit records for every denied and successful privileged finance transition, including actor, role, company, period, object, and policy result. | Auditable outcomes improve operational confidence and support compliance-oriented review of accounting state changes. |

## Risk Register

*Top risks for this modernization effort*

| # | Area | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- | --- |
| 1 | Accounting parity | Modernized posting, tax, reconciliation, or fiscal close logic may produce different accounting results from OpenERP 7. | high | high | Build parity tests before migration for balanced entries, taxes, invoice posting, bank statement posting, reconciliation, fiscal close, and report totals using representative legacy datasets. |
| 2 | Authentication and authorization | Replacing `X-Actor` with centralized identity may leave gaps where legacy methods still trust caller-supplied context or bypass server-side policy checks. | medium | high | Inventory all write-capable accounting entry points, require policy-layer enforcement for each, and test authorization through API/RPC paths rather than only through UI restrictions. |
| 3 | ORM and framework extraction | Changes around high-fan-in OpenERP OSV hubs such as `search`, `write`, `create`, and `execute` may cause broad regressions across reports, wizards, workflows, and accounting models. | high | high | Classify the OpenERP runtime as a stable compatibility kernel first, then extract accounting capabilities behind narrow adapters with contract tests. |
| 4 | Reporting and projection APIs | New DTO projections may not exactly match `_query_get` context semantics for fiscal years, periods, companies, move states, dates, and initial-balance handling. | high | high | Create report-by-report golden outputs for general ledger, partner ledger, trial balance, invoice, and tax-line scenarios before replacing read paths. |
| 5 | Domain terminology and migration mapping | Semantic drift between myERP PRD terms and legacy OpenERP model/workflow names may cause missing rules, duplicated concepts, or incorrect data mapping. | medium | high | Maintain a versioned canonical domain dictionary that links PRD terms to legacy models, XML security rules, workflows, reports, functions, and parity tests. |
| 6 | Test coverage and release confidence | The current low test volume may allow regressions in XML workflows, report rendering, wizard behavior, or JavaScript widgets to reach production. | high | medium | Add CI gates for parity scenarios, XML/workflow checks, report total comparisons, and Playwright-based browser tests for selected accounting UI flows. |
| 7 | Database migration and staging | Schema or data-access changes may corrupt balances, lose audit relationships, or misrepresent historical accounting records. | medium | high | Run all migration and projection changes against restorable managed PostgreSQL staging snapshots, then reconcile account balances and report totals before cutover. |
