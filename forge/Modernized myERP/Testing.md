# Testing

**Selected Categories:** Functional test cases

**Total Test Cases:** 56


---

## Functional test cases (56)

### FUNCTIONAL-001 — Inventory canonical finance terms

- User Story: WO-051
- Objective: Validate functional behavior for "Inventory canonical finance terms" against acceptance criteria.
- Expected: Story "Inventory canonical finance terms" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection verifies context/finance_domain_dictionary.yml exists and contains top-level keys metadata, canonical_terms, legacy_models, legacy_functions, source_files, synonyms, and unmapped_or_target_only_terms referencing context/PRD_myERP.md and legacy/openerp-7.0/addons/account/account.py.
- Check acceptance criterion 2: Running grep -E 'account.invoice|account.invoice.line|account.invoice.tax|account.account|account.tax|account.payment.term' context/finance_domain_dictionary.yml returns entries mapped to legacy/openerp-7.0/addons/account/account_invoice.py and legacy/openerp-7.0/addons/account/account.py.
- Check acceptance criterion 3: Running grep -E 'compute_all|button_reset_taxes|compute_invoice_totals|finalize_invoice_move_lines|account_payment_term.compute|_amount_residual' context/finance_domain_dictionary.yml returns exact method or function references that exist in legacy/openerp-7.0/addons/account/account.py or legacy/openerp-7.0/addons/account/account_invoice.py.

### FUNCTIONAL-002 — Map legacy security policy

- User Story: WO-054
- Objective: Validate functional behavior for "Map legacy security policy" against acceptance criteria.
- Expected: Story "Map legacy security policy" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection verifies context/security_policy_map.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/security/account_security.xml and legacy/openerp-7.0/addons/account/security/ir.model.access.csv.
- Check acceptance criterion 2: Running grep -E 'group_account_invoice|group_account_user|group_account_manager|group_proforma_invoices|group_supplier_inv_check_total' context/security_policy_map.yml returns group mappings extracted from legacy/openerp-7.0/addons/account/security/account_security.xml.
- Check acceptance criterion 3: Running grep -E 'account_move_comp_rule|account_move_line_comp_rule|journal_comp_rule|period_comp_rule|fiscal_year_comp_rule|domain_force|child_of' context/security_policy_map.yml returns multi-company record-rule mappings from legacy/openerp-7.0/addons/account/security/account_security.xml.

### FUNCTIONAL-003 — Map workflow report parity

- User Story: WO-055
- Objective: Validate functional behavior for "Map workflow report parity" against acceptance criteria.
- Expected: Story "Map workflow report parity" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection verifies context/accounting_parity_map.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/account_invoice_workflow.xml and legacy/openerp-7.0/addons/account/report/account_report_view.xml.
- Check acceptance criterion 2: Running grep -E 'draft|proforma2|open|paid|cancel|action_date_assign|invoice_validate|action_move_create|action_number' context/accounting_parity_map.yml returns invoice workflow state or method mappings sourced from legacy/openerp-7.0/addons/account/account_invoice_workflow.xml and legacy/openerp-7.0/addons/account/account_invoice.py.
- Check acceptance criterion 3: Running grep -E 'account.general.ledger|account.partner.ledger|account.balance|trial|ledger|report_name' context/accounting_parity_map.yml returns report or projection parity mappings tied to legacy/openerp-7.0/addons/account/report/account_report_view.xml.

### FUNCTIONAL-004 — Classify OSV kernel hubs

- User Story: WO-056
- Objective: Validate functional behavior for "Classify OSV kernel hubs" against acceptance criteria.
- Expected: Story "Classify OSV kernel hubs" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection verifies context/orm_hub_classification.yml exists and includes source_files entries for legacy/openerp-7.0/openerp/osv/orm.py, legacy/openerp-7.0/openerp/osv/fields.py, legacy/openerp-7.0/openerp/osv/osv.py, and legacy/openerp-7.0/openerp/osv/expression.py.
- Check acceptance criterion 2: Running grep -E 'stable_kernel|adapter_boundary|extraction_candidate|do_not_touch_baseline' context/orm_hub_classification.yml returns classification categories for the OSV hub files under legacy/openerp-7.0/openerp/osv.
- Check acceptance criterion 3: Running grep -E 'execute|search|write|create|browse|except_osv|except_orm|expression|domain|fields' context/orm_hub_classification.yml returns high-fan-in operation entries tied to legacy/openerp-7.0/openerp/osv/orm.py, fields.py, osv.py, and expression.py.

### FUNCTIONAL-005 — Map tax governance baseline

- User Story: WO-057
- Objective: Validate functional behavior for "Map tax governance baseline" against acceptance criteria.
- Expected: Story "Map tax governance baseline" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection verifies context/tax_governance_map.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/account.py, context/PRD_myERP.md, context/MODERNIZATION_INTENT.md, and context/01_TARGET_SPEC.md.
- Check acceptance criterion 2: Running grep -E 'account_tax|compute_all|_unit_compute|_unit_compute_inv|amount|type_tax_use|price_include|include_base_amount|parent_id' context/tax_governance_map.yml returns legacy tax model and computation mappings from legacy/openerp-7.0/addons/account/account.py.
- Check acceptance criterion 3: Running grep -E 'FR-CFG-01|FR-CFG-02|FR-CFG-03|FR-CFG-04|FR-CFG-05|FR-CFG-07|FR-CFG-08|FR-CFG-09|FR-CFG-10|FR-CFG-11' context/tax_governance_map.yml returns PRD tax-governance rule mappings from context/PRD_myERP.md.

### FUNCTIONAL-006 — Document ledger query contract

- User Story: WO-065
- Objective: Validate functional behavior for "Document ledger query contract" against acceptance criteria.
- Expected: Story "Document ledger query contract" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection verifies context/query_get_contract.yml exists and includes source_files entries for legacy/openerp-7.0/addons/account/account_move_line.py, legacy/openerp-7.0/addons/account/account.py, legacy/openerp-7.0/addons/account/report/account_partner_ledger.py, and legacy/openerp-7.0/addons/account/report/account_general_ledger.py.
- Check acceptance criterion 2: Running grep -E 'company_id|fiscalyear|period_from|period_to|date_from|date_to|journal_ids|state|initial_balance|account_id|chart_account_id' context/query_get_contract.yml returns documented _query_get context filters from legacy/openerp-7.0/addons/account/account_move_line.py.
- Check acceptance criterion 3: Running grep -E '_query_get|account_move_line|account_period|account_fiscalyear|account_move|account_account' context/query_get_contract.yml returns the legacy function name and affected table or model references used by reporting filters.

### FUNCTIONAL-007 — Add Python runtime manifest

- User Story: WO-052
- Objective: Validate functional behavior for "Add Python runtime manifest" against acceptance criteria.
- Expected: Story "Add Python runtime manifest" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection confirms `pyproject.toml` exists at the repository root, contains `requires-python = ">=3.14,<3.15"`, and declares dependencies or dependency groups referencing `pytest`, `coverage`, `psycopg`, `lxml`, `Authlib`, and `PyJWT`.
- Check acceptance criterion 2: Running `uv lock --locked` from the repository root exits with status 0 and leaves `uv.lock` unchanged according to `git status --short uv.lock`.
- Check acceptance criterion 3: Unit tests: `uv run pytest tests/test_runtime_contract.py --junitxml=build/test-results/pytest/runtime-contract.xml` exits with status 0 and the XML contains a testcase named `test_python_runtime_declares_314`.

### FUNCTIONAL-008 — Add Python container image

- User Story: WO-058
- Objective: Validate functional behavior for "Add Python container image" against acceptance criteria.
- Expected: Story "Add Python container image" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection confirms `app/Dockerfile` uses a Python 3.14 base image, copies `pyproject.toml` and `uv.lock`, defines a non-root `USER`, and sets a working directory for the modernization layer.
- Check acceptance criterion 2: Running `docker build -f app/Dockerfile -t myerp-finance:local .` exits with status 0 and `docker run --rm myerp-finance:local python -c "import sys; assert sys.version_info[:2] == (3, 14)"` exits with status 0.
- Check acceptance criterion 3: Unit tests: `uv run pytest tests/test_dockerfile_contract.py --junitxml=build/test-results/pytest/dockerfile-contract.xml` exits with status 0 and asserts `app/Dockerfile` contains a non-root `USER` instruction.

### FUNCTIONAL-009 — Add runtime enforcement tests

- User Story: WO-059
- Objective: Validate functional behavior for "Add runtime enforcement tests" against acceptance criteria.
- Expected: Story "Add runtime enforcement tests" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection confirms `tests/test_runtime_contract.py` reads root `pyproject.toml` and asserts `requires-python` is `>=3.14,<3.15` or an equivalent Python 3.14-only range.
- Check acceptance criterion 2: Running `uv run pytest tests/test_runtime_contract.py --junitxml=build/test-results/pytest/runtime-contract.xml` exits with status 0 and writes `build/test-results/pytest/runtime-contract.xml`.
- Check acceptance criterion 3: Unit tests: `tests/test_runtime_contract.py` includes assertions named for Python runtime declaration, required dependency presence, and legacy OpenERP exclusion, and those assertions pass under `uv run pytest`.

### FUNCTIONAL-010 — Add runtime config contract

- User Story: WO-060
- Objective: Validate functional behavior for "Add runtime config contract" against acceptance criteria.
- Expected: Story "Add runtime config contract" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection confirms `app/config.py` defines a settings loader function or class that reads `MYERP_ENV`, `DATABASE_URL`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `SECRET_MANAGER_URI`, `OIDC_ISSUER_URL`, and `OIDC_AUDIENCE` from environment variables.
- Check acceptance criterion 2: Running `uv run pytest tests/test_config_contract.py --junitxml=build/test-results/pytest/config-contract.xml` exits with status 0 and writes the JUnit XML file.
- Check acceptance criterion 3: Unit tests: `tests/test_config_contract.py` asserts that `app.config` redacts `DATABASE_URL`, `OIDC_CLIENT_SECRET`, and any variable containing `SECRET` or `TOKEN` when producing diagnostic output.

### FUNCTIONAL-011 — Add PostgreSQL rehearsal script

- User Story: WO-061
- Objective: Validate functional behavior for "Add PostgreSQL rehearsal script" against acceptance criteria.
- Expected: Story "Add PostgreSQL rehearsal script" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Running `uv run python scripts/postgres_snapshot_rehearsal.py --dry-run --snapshot tests/fixtures/postgres_snapshot/sample.dump --output build/postgres-snapshot-rehearsal/restore-summary.json` exits with status 0 and writes JSON containing `mode`, `snapshot`, `commands_planned`, and `legacy_tables_checked`.
- Check acceptance criterion 2: Running `uv run python scripts/postgres_snapshot_rehearsal.py --snapshot tests/fixtures/postgres_snapshot/sample.dump --output build/postgres-snapshot-rehearsal/restore-summary.json` without `DATABASE_URL` and without `--dry-run` exits non-zero and writes an error message referencing `DATABASE_URL`.
- Check acceptance criterion 3: Unit tests: `uv run pytest tests/test_postgres_snapshot_rehearsal.py --junitxml=build/test-results/pytest/postgres-snapshot-rehearsal.xml` exits with status 0 and mocks subprocess execution for `pg_restore` and `psql` command construction.

### FUNCTIONAL-012 — Add Playwright parity tooling

- User Story: WO-062
- Objective: Validate functional behavior for "Add Playwright parity tooling" against acceptance criteria.
- Expected: Story "Add Playwright parity tooling" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection confirms `package.json` declares a Node.js 24-compatible `engines.node` range and includes `@playwright/test` as a development dependency or package-manager equivalent.
- Check acceptance criterion 2: File inspection confirms `playwright.config.ts` sets `testDir` to a committed Playwright test directory, configures JUnit output at `build/test-results/playwright/junit.xml`, and derives its base URL from `process.env.LEGACY_OPENERP_BASE_URL` rather than a hard-coded production URL.
- Check acceptance criterion 3: Running `npx playwright test --config=playwright.config.ts --reporter=junit` with no `LEGACY_OPENERP_BASE_URL` exits with status 0 and writes `build/test-results/playwright/junit.xml` containing a testcase for fixture-mode legacy account asset validation.

### FUNCTIONAL-013 — Add healthcheck Helm probes

- User Story: WO-068
- Objective: Validate functional behavior for "Add healthcheck Helm probes" against acceptance criteria.
- Expected: Story "Add healthcheck Helm probes" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Running `uv run python -m app.healthcheck` exits with status 0 and writes JSON containing `status`, `runtime.python`, and `checks` keys; `runtime.python` starts with `3.14` when executed under the project runtime.
- Check acceptance criterion 2: Running `MYERP_HEALTHCHECK_REQUIRE_DATABASE=1 DATABASE_URL= uv run python -m app.healthcheck` exits with a non-zero status and the JSON output contains a failed check named `database_url_configured`.
- Check acceptance criterion 3: Unit tests: `uv run pytest tests/test_healthcheck.py --junitxml=build/test-results/pytest/healthcheck.xml` exits with status 0 and asserts success and missing-database failure payloads from `app.healthcheck.main`.

### FUNCTIONAL-014 — Add Forge shipping gates

- User Story: WO-008
- Objective: Validate functional behavior for "Add Forge shipping gates" against acceptance criteria.
- Expected: Story "Add Forge shipping gates" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection confirms `.forge/shipping.yml` defines stages or steps for Python dependency sync from `pyproject.toml`, pytest execution with `--junitxml=build/test-results/pytest/finance.xml`, Docker build from `app/Dockerfile`, image scan, image push, Helm deploy, readiness verification, PostgreSQL snapshot rehearsal, and Playwright test execution from `playwright.config.ts`.
- Check acceptance criterion 2: Running `uv run python scripts/validate_shipping_config.py .forge/shipping.yml` exits with status 0 and reports artifact paths `build/test-results/pytest/finance.xml`, `build/test-results/playwright/junit.xml`, and `build/postgres-snapshot-rehearsal/restore-summary.json`.
- Check acceptance criterion 3: Unit tests: `uv run pytest tests/test_shipping_config.py --junitxml=build/test-results/pytest/shipping-config.xml` exits with status 0 and asserts `.forge/shipping.yml` contains no literal secret values such as database passwords, kubeconfig bodies, registry passwords, or bearer tokens.

### FUNCTIONAL-015 — Inventory legacy parity fixtures

- User Story: WO-053
- Objective: Validate functional behavior for "Inventory legacy parity fixtures" against acceptance criteria.
- Expected: Story "Inventory legacy parity fixtures" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection of context/parity_fixture_inventory.yml shows entries referencing legacy/openerp-7.0/addons/account/account_unit_test.xml with model account.invoice, workflow action invoice_open, function pay_and_reconcile, and final assertion state paid.
- Check acceptance criterion 2: File inspection of context/parity_fixture_inventory.yml shows an entry referencing legacy/openerp-7.0/addons/account/account_assert_test.xml with model account.move and function account_assert_balanced.
- Check acceptance criterion 3: Running python -c "import yaml; data=yaml.safe_load(open('context/parity_fixture_inventory.yml')); assert 'fixtures' in data and len(data['fixtures']) >= 2" exits with status 0 and reads the committed YAML fixture inventory.

### FUNCTIONAL-016 — Create pytest parity harness

- User Story: WO-063
- Objective: Validate functional behavior for "Create pytest parity harness" against acceptance criteria.
- Expected: Story "Create pytest parity harness" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Running pytest tests/parity --collect-only exits with status 0 and imports tests/parity/conftest.py without importing openerp.osv from legacy/openerp-7.0/openerp/osv/osv.py.
- Check acceptance criterion 2: Unit tests: tests/parity/test_parity_harness_inventory.py verifies load_parity_inventory reads context/parity_fixture_inventory.yml and returns at least the legacy/openerp-7.0/addons/account/account_unit_test.xml fixture entry.
- Check acceptance criterion 3: System integration tests: pytest tests/parity/test_parity_harness_inventory.py validates that tests/parity/conftest.py can parse legacy/openerp-7.0/addons/account/account_unit_test.xml and expose an account.invoice fixture identifier.

### FUNCTIONAL-017 — Port tax compute_all parity

- User Story: WO-069
- Objective: Validate functional behavior for "Port tax compute_all parity" against acceptance criteria.
- Expected: Story "Port tax compute_all parity" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: pytest tests/parity/test_compute_all.py exits with status 0 and includes assertions for percent, fixed, price_include, child tax, include_base_amount, and Decimal ROUND_HALF_UP behavior in app/finance/tax/compute_all.py.
- Check acceptance criterion 2: System integration tests: pytest tests/parity/test_compute_all.py::test_compute_all_legacy_invoice_fixture uses fixture metadata derived from legacy/openerp-7.0/addons/account/account_unit_test.xml and asserts a 1850 untaxed invoice-line total before tax application.
- Check acceptance criterion 3: Mock data / fixtures: tests/parity/fixtures/compute_all_cases.yml is committed and contains named cases for percent, fixed, price_included, child_tax, and include_base_amount.

### FUNCTIONAL-018 — Test statement close reconciliation

- User Story: WO-070
- Objective: Validate functional behavior for "Test statement close reconciliation" against acceptance criteria.
- Expected: Story "Test statement close reconciliation" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: pytest tests/parity/test_statement_close_reconcile.py exits with status 0 and asserts fixture coverage for button_confirm_bank, create_move_from_st_line, statement_close, and account_fiscalyear_close.data_save.
- Check acceptance criterion 2: System integration tests: tests/parity/test_statement_close_reconcile.py uses the parity harness inventory and a ledger fixture to assert generated statement move lines balance by move_id and company_id.
- Check acceptance criterion 3: Mock data / fixtures: tests/parity/fixtures/statement_close_reconcile.yml is committed and includes at least one bank statement line, one reconciliation group, and one fiscal close carry-forward scenario.

### FUNCTIONAL-019 — Test balanced ledger invariants

- User Story: WO-072
- Objective: Validate functional behavior for "Test balanced ledger invariants" against acceptance criteria.
- Expected: Story "Test balanced ledger invariants" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: pytest tests/parity/test_ledger_trial_balance.py exits with status 0 and contains assertions named test_balanced_move_lines_net_to_zero and test_trial_balance_totals_net_to_zero.
- Check acceptance criterion 2: System integration tests: tests/parity/test_ledger_trial_balance.py uses the parity harness to read the fixture entry for legacy/openerp-7.0/addons/account/account_assert_test.xml and assert model account.move is covered.
- Check acceptance criterion 3: Mock data / fixtures: tests/parity/fixtures/ledger_trial_balance.yml is committed and contains at least one balanced move and one intentionally imbalanced sample used by a negative assertion.

### FUNCTIONAL-020 — Test ledger report totals

- User Story: WO-073
- Objective: Validate functional behavior for "Test ledger report totals" against acceptance criteria.
- Expected: Story "Test ledger report totals" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: pytest tests/parity/test_ledger_reports.py exits with status 0 and asserts debit, credit, balance, initial_balance, and ending_balance totals from tests/parity/fixtures/ledger_report_totals.yml.
- Check acceptance criterion 2: System integration tests: tests/parity/test_ledger_reports.py validates that report fixture filters map to _query_get context keys from legacy/openerp-7.0/addons/account/account_move_line.py.
- Check acceptance criterion 3: Mock data / fixtures: tests/parity/fixtures/ledger_report_totals.yml is committed and contains separate general_ledger and partner_ledger scenarios with company_id, fiscalyear_id, date_from, date_to, target_move, and initial_balance fields.

### FUNCTIONAL-021 — Test invoice workflow parity

- User Story: WO-078
- Objective: Validate functional behavior for "Test invoice workflow parity" against acceptance criteria.
- Expected: Story "Test invoice workflow parity" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: pytest tests/parity/test_invoice_workflow.py exits with status 0 and asserts that legacy/openerp-7.0/addons/account/account_unit_test.xml contains workflow action invoice_open for model account.invoice.
- Check acceptance criterion 2: System integration tests: tests/parity/test_invoice_workflow.py imports compute_all from app/finance/tax/compute_all.py and uses it in an invoice tax parity case tied to the account.invoice fixture.
- Check acceptance criterion 3: Mock data / fixtures: tests/parity/fixtures/invoice_workflow_cases.yml is committed and includes expected states draft, open, and paid for the test_invoice_1 fixture.

### FUNCTIONAL-022 — Add accounting browser parity spec

- User Story: WO-085
- Objective: Validate functional behavior for "Add accounting browser parity spec" against acceptance criteria.
- Expected: Story "Add accounting browser parity spec" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: N/A — this story adds browser integration coverage in tests/browser/accounting_workflows.spec.ts rather than unit-level TypeScript functions.
- Check acceptance criterion 2: System integration tests: npx playwright test tests/browser/accounting_workflows.spec.ts exits with status 0 against the configured legacy-compatible test shell and includes assertions for invoice workflow and reconciliation UI surfaces.
- Check acceptance criterion 3: Mock data / fixtures: the browser spec references fixture identifiers from context/parity_fixture_inventory.yml or tests/parity/fixtures/invoice_workflow_cases.yml so it does not depend on untracked manual UI setup.

### FUNCTIONAL-023 — Define tax change-control schemas

- User Story: WO-067
- Objective: Validate functional behavior for "Define tax change-control schemas" against acceptance criteria.
- Expected: Story "Define tax change-control schemas" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_schema.py exits with status 0 and asserts app/tax_config/schema.py exposes ConfigCommit, ConfigRef, RefLogEntry, ChangeRequest, CheckRun, Review, and ReviewDecision.
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_schema.py asserts canonical_json in app/tax_config/schema.py produces identical bytes for equivalent dictionaries with different key order and distinct bytes when rates.US-NY-NYC.New York City.rate changes.
- Check acceptance criterion 3: System integration tests: python -m pytest tests/integration/test_tax_config_schema_contract.py exits with status 0 and validates that a ChangeRequest created from schema.py carries number, source_ref, target_ref, head_hash, base_hash, merge_base_hash, effective_from, status, proposer_id, created_at, and updated_at.

### FUNCTIONAL-024 — Implement content-addressed tax repository

- User Story: WO-075
- Objective: Validate functional behavior for "Implement content-addressed tax repository" against acceptance criteria.
- Expected: Story "Implement content-addressed tax repository" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_repository.py exits with status 0 and asserts app/tax_config/repository.py create_commit stores a complete configuration whose hash equals SHA-256 of schema.canonical_json(content).
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_repository.py asserts update_ref in app/tax_config/repository.py refuses direct movement of ref main with a ProtectedRefError or ValueError naming main.
- Check acceptance criterion 3: Unit tests: tests/tax_config/test_repository.py asserts create_tag followed by a second move of the same tag in repository.py raises an immutable tag error and leaves the tag hash unchanged.

### FUNCTIONAL-025 — Add tax branch editor diffs

- User Story: WO-082
- Objective: Validate functional behavior for "Add tax branch editor diffs" against acceptance criteria.
- Expected: Story "Add tax branch editor diffs" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_change_requests.py exits with status 0 and asserts app/tax_config/change_requests.py create_branch_edit addresses a rate by jurisdiction_code, component_name, and effective_from rather than list position.
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_change_requests.py asserts field_level_diff in app/tax_config/change_requests.py emits path rates.US-NY-NYC.New York City.rate with before Decimal 0.045 and after Decimal 0.05 for the fixture edit.
- Check acceptance criterion 3: Unit tests: tests/tax_config/test_change_requests.py asserts open_change_request generates CR-0001 and stores source_ref, target_ref, head_hash, base_hash, merge_base_hash, effective_from, status open, proposer_id, title, and body.

### FUNCTIONAL-026 — Add tax merge and load checks

- User Story: WO-089
- Objective: Validate functional behavior for "Add tax merge and load checks" against acceptance criteria.
- Expected: Story "Add tax merge and load checks" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_checks.py exits with status 0 and asserts app/tax_config/checks.py run_merge_clean returns conclusion success for a branch where only head changed rates.US-NY-NYC.New York City.rate.
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_checks.py asserts run_merge_clean in app/tax_config/checks.py returns conclusion failure and detail path rates.US-NY-NYC.New York City.rate when base target and branch head changed that path to different values.
- Check acceptance criterion 3: Unit tests: tests/tax_config/test_checks.py asserts run_config_loads in app/tax_config/checks.py fails a fixture where a rate is Decimal 1.0 or greater and summary contains the invalid path.

### FUNCTIONAL-027 — Implement SOD tax reviews

- User Story: WO-090
- Objective: Validate functional behavior for "Implement SOD tax reviews" against acceptance criteria.
- Expected: Story "Implement SOD tax reviews" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_reviews.py exits with status 0 and asserts app/tax_config/reviews.py approve_change_request blocks an actor with kind agent using rule_id SOD-02.
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_reviews.py asserts approve_change_request blocks the proposer actor with rule_id SOD-01 and message containing prepared CR-0001.
- Check acceptance criterion 3: Unit tests: tests/tax_config/test_reviews.py asserts approve_change_request blocks an actor missing tax_reviewer role with rule_id SOD-03 and message containing Approval needs the tax_reviewer role.

### FUNCTIONAL-028 — Implement tax impact replay

- User Story: WO-095
- Objective: Validate functional behavior for "Implement tax impact replay" against acceptance criteria.
- Expected: Story "Implement tax impact replay" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_impact.py exits with status 0 and asserts app/tax_config/impact.py replay_impact calls app.finance.tax.compute_all.compute_all or the exported compute_all function from app/finance/tax/compute_all.py.
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_impact.py asserts no-edit replay over data/answer_key.json returns headline No change: 70 documents replayed, none moved. and every result line old_minor equals stored tax_minor.
- Check acceptance criterion 3: Unit tests: tests/tax_config/test_impact.py asserts the US-NY-NYC New York City rate change from 0.045 to 0.05 returns headline 6 of 70 documents move by USD 13,103.51. and top mover CINV-US-2026-000016 has delta_minor 250040.

### FUNCTIONAL-029 — Implement governed tax merge gate

- User Story: WO-100
- Objective: Validate functional behavior for "Implement governed tax merge gate" against acceptance criteria.
- Expected: Story "Implement governed tax merge gate" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/tax_config/test_merge.py exits with status 0 and asserts app/tax_config/merge.py refuses merge when merge-clean CheckRun for the current head_hash is missing.
- Check acceptance criterion 2: Unit tests: tests/tax_config/test_merge.py asserts merge.py refuses merge when config-loads or impact has conclusion failure on the current head_hash and leaves repository.get_ref main unchanged.
- Check acceptance criterion 3: Unit tests: tests/tax_config/test_merge.py asserts merge.py refuses merge when the only approved Review has reviewed_head_hash different from the change request current head_hash.

### FUNCTIONAL-030 — Add hash-chained audit log

- User Story: WO-076
- Objective: Validate functional behavior for "Add hash-chained audit log" against acceptance criteria.
- Expected: Story "Add hash-chained audit log" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests are written and passing with python -m pytest tests/audit/test_log.py, including assertions that app/audit/log.py append_audit_event writes prev_hash, body_hash, row_hash, and sequence fields and that verify_audit_log returns valid=True for tests/fixtures/audit/audit_log_valid.jsonl.
- Check acceptance criterion 2: System integration test is written and passing with python -m pytest tests/integration/test_audit_log_verify_action.py, including a subprocess assertion that python -m app.audit.log verify --path tests/fixtures/audit/audit_log_valid.jsonl exits with status code 0 and prints a machine-readable valid result.
- Check acceptance criterion 3: Mock data and fixtures are generated and committed under tests/fixtures/audit/, including audit_log_valid.jsonl and audit_log_tampered.jsonl where python -m app.audit.log verify --path tests/fixtures/audit/audit_log_tampered.jsonl exits with status code 1 and identifies the failing row number.

### FUNCTIONAL-031 — Add governed Claude proposal tool

- User Story: WO-091
- Objective: Validate functional behavior for "Add governed Claude proposal tool" against acceptance criteria.
- Expected: Story "Add governed Claude proposal tool" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests are written and passing with python -m pytest tests/agents/test_claude_tax_agent.py, including assertions that app/agents/claude_tax_agent.py propose_tax_change returns a missing_api_key status when ANTHROPIC_API_KEY is absent and does not call an external client.
- Check acceptance criterion 2: System integration test is written and passing with python -m pytest tests/integration/test_claude_tax_agent_change_request.py, including a mocked Anthropic response that produces a change request opened_by value of claude through the existing change-request creation path.
- Check acceptance criterion 3: Mock data and fixtures are generated and committed under tests/fixtures/agents/, including a plain-English prompt such as raise Sale VAT to 16% from 1 October and a structured mocked model response containing jurisdiction or tax component, rate, effective_from, title, and body.

### FUNCTIONAL-032 — Test Claude merge refusal evidence

- User Story: WO-096
- Objective: Validate functional behavior for "Test Claude merge refusal evidence" against acceptance criteria.
- Expected: Story "Test Claude merge refusal evidence" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests are written and passing with python -m pytest tests/agents/test_claude_merge_refusal.py, including an assertion that a Claude merge attempt returns rule_id equal to SOD-02 and status equal to blocked or refused.
- Check acceptance criterion 2: System integration coverage is written and passing in tests/agents/test_claude_merge_refusal.py by invoking the agent merge request path in app/agents/claude_tax_agent.py and the review or merge policy path used by the application rather than directly constructing the final refusal object.
- Check acceptance criterion 3: Mock data and fixtures are generated and committed under tests/fixtures/change_requests/ or tests/fixtures/agents/, including a merge-ready change request fixture with green checks and at least one current human approval so the only expected blocker for Claude is SOD-02.

### FUNCTIONAL-033 — Verify Claude impact explanations

- User Story: WO-101
- Objective: Validate functional behavior for "Verify Claude impact explanations" against acceptance criteria.
- Expected: Story "Verify Claude impact explanations" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests are written and passing with python -m pytest tests/evals/test_agent_grounding.py, including an assertion that a candidate explanation containing USD 13,103.51, 6 of 70 documents, and CINV-US-2026-000016 is accepted when those figures exist in tests/fixtures/impact/new_york_city_rate_change.json.
- Check acceptance criterion 2: System integration coverage is written and passing in tests/evals/test_agent_grounding.py by importing the explanation or grounding function from app/agents/claude_tax_agent.py and asserting that unsupported figures are rejected before the explanation result is marked showable.
- Check acceptance criterion 3: Mock data and fixtures are generated and committed under tests/fixtures/impact/, including new_york_city_rate_change.json with documents_replayed, documents_changed, totals_by_currency, by_jurisdiction, top_movers, duration, and headline fields.

### FUNCTIONAL-034 — Export change-request evidence packs

- User Story: WO-103
- Objective: Validate functional behavior for "Export change-request evidence packs" against acceptance criteria.
- Expected: Story "Export change-request evidence packs" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests are written and passing with python -m pytest tests/audit/test_evidence_pack.py, including an assertion that app/audit/evidence_pack.py export_evidence_pack returns a canonical_sha256 equal to hashlib.sha256(canonical_json(pack_body).encode('utf-8')).hexdigest().
- Check acceptance criterion 2: System integration test is written and passing with python -m pytest tests/integration/test_evidence_pack_export.py, including an assertion that exporting tests/fixtures/change_requests/CR-0001.json produces body.change_request.number equal to CR-0001 and includes diff, checks, reviews, ref_log_rows, and audit_rows keys.
- Check acceptance criterion 3: Mock data and fixtures are generated and committed under tests/fixtures/change_requests/ and tests/fixtures/audit/, including a merged CR fixture with at least one successful impact check, one approval review, one ref-log row, and linked audit row hashes.

### FUNCTIONAL-035 — Enforce OIDC finance actor validation

- User Story: WO-064
- Objective: Validate functional behavior for "Enforce OIDC finance actor validation" against acceptance criteria.
- Expected: Story "Enforce OIDC finance actor validation" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: `pytest tests/security/test_oidc.py -q` exits with code 0 and includes assertions that `app/security/oidc.py::authenticate_request` returns `AuthError.status_code == 401` for a missing `Authorization` header and `AuthError.status_code == 403` for a production POST request that only contains `X-Actor`.
- Check acceptance criterion 2: System integration tests: `pytest tests/security/test_oidc_api_boundary.py -q` exits with code 0 and includes a simulated `POST /finance/invoices/INV-001/post` request where `X-Actor: tam` without `Authorization: Bearer <token>` is rejected before any adapter function is invoked.
- Check acceptance criterion 3: Mock data/fixtures: `tests/fixtures/security/oidc_jwks.json` and `tests/fixtures/security/oidc_claims.json` are committed and `pytest tests/security/test_oidc.py::test_valid_token_maps_server_actor -q` asserts the fixture token claims map to a server-side actor id rather than the `X-Actor` header value.

### FUNCTIONAL-036 — Map legacy groups to RBAC

- User Story: WO-071
- Objective: Validate functional behavior for "Map legacy groups to RBAC" against acceptance criteria.
- Expected: Story "Map legacy groups to RBAC" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: `pytest tests/security/test_rbac.py -q` exits with code 0 and asserts `app/security/rbac.py::map_legacy_group_to_role('group_account_manager') == 'financial_manager'`, `group_account_user == 'accountant'`, and `group_account_invoice == 'invoicing_payments'.
- Check acceptance criterion 2: System integration tests: `pytest tests/security/test_rbac_policy_boundary.py -q` exits with code 0 and asserts an authenticated actor with role `financial_manager` and company scope `1` is accepted by `app/security/rbac.py::build_authorization_context` while a token-derived actor with no finance groups has an empty finance role list.
- Check acceptance criterion 3: Mock data/fixtures: `tests/fixtures/security/legacy_account_security_subset.xml` and `tests/fixtures/security/ir_model_access_subset.csv` are committed, and `pytest tests/security/test_rbac.py::test_fixture_group_extraction -q` asserts five group ids are extracted from the XML fixture.

### FUNCTIONAL-037 — Centralize finance policy preconditions

- User Story: WO-083
- Objective: Validate functional behavior for "Centralize finance policy preconditions" against acceptance criteria.
- Expected: Story "Centralize finance policy preconditions" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: `pytest tests/policy/test_finance_policy.py -q` exits with code 0 and asserts `app/policy/finance_policy.py::evaluate_finance_action` denies `post_invoice` when the actor lacks `accountant` or `financial_manager` role and returns `decision.allowed is False` with a non-empty `rule_id`.
- Check acceptance criterion 2: System integration tests: `pytest tests/policy/test_finance_policy_boundary.py -q` exits with code 0 and combines `app/security/oidc.py`, `app/security/rbac.py`, and `app/policy/finance_policy.py` fixtures to assert a valid financial manager can receive an allow decision for `confirm_bank_statement` only when company, period, state, and audit context are present.
- Check acceptance criterion 3: Mock data/fixtures: `tests/fixtures/policy/finance_actions.json` and `tests/fixtures/policy/finance_documents.json` are committed, and `pytest tests/policy/test_finance_policy.py::test_fixture_actions_cover_required_workflows -q` asserts fixtures include `post_invoice`, `post_journal`, `reconcile_move_lines`, `confirm_bank_statement`, `close_fiscal_year`, and `reverse_journal`.

### FUNCTIONAL-038 — Guard invoice posting and reconciliation

- User Story: WO-092
- Objective: Validate functional behavior for "Guard invoice posting and reconciliation" against acceptance criteria.
- Expected: Story "Guard invoice posting and reconciliation" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: `pytest tests/adapters/test_guarded_write_adapter.py -q` exits with code 0 and asserts `app/adapters/guarded_write_adapter.py::post_invoice` does not call the fake legacy executor when `PolicyDecision.allowed is False`.
- Check acceptance criterion 2: System integration tests: `pytest tests/adapters/test_guarded_write_adapter_boundary.py -q` exits with code 0 and asserts simulated `POST /finance/invoices/INV-001/post` and `POST /finance/reconciliations` paths call `evaluate_finance_action` before the injected legacy functions for `account.invoice` and `account.move.line`.
- Check acceptance criterion 3: Mock data/fixtures: `tests/fixtures/adapters/invoice_post_request.json` and `tests/fixtures/adapters/reconcile_request.json` are committed, and `pytest tests/adapters/test_guarded_write_adapter.py::test_adapter_fixtures_are_loadable -q` asserts both fixtures include `company_id`, `period_id`, `document_state`, and `audit_context`.

### FUNCTIONAL-039 — Guard statement and fiscal close

- User Story: WO-093
- Objective: Validate functional behavior for "Guard statement and fiscal close" against acceptance criteria.
- Expected: Story "Guard statement and fiscal close" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: `pytest tests/adapters/test_statement_close_adapter.py -q` exits with code 0 and asserts `app/adapters/statement_close_adapter.py::confirm_bank_statement` and `close_fiscal_year` do not call the fake legacy executor when `PolicyDecision.allowed is False`.
- Check acceptance criterion 2: System integration tests: `pytest tests/adapters/test_statement_close_adapter_boundary.py -q` exits with code 0 and asserts simulated `POST /finance/bank-statements/ST-001/confirm` and `POST /finance/fiscal-years/FY-2026/close` commands evaluate `app/policy/finance_policy.py::evaluate_finance_action` before injected legacy execution.
- Check acceptance criterion 3: Mock data/fixtures: `tests/fixtures/adapters/bank_statement_confirm_request.json` and `tests/fixtures/adapters/fiscal_year_close_request.json` are committed, and `pytest tests/adapters/test_statement_close_adapter.py::test_statement_close_fixtures_are_loadable -q` asserts each fixture includes `company_id`, `period_id`, `document_state`, and `audit_context`.

### FUNCTIONAL-040 — Test finance policy API paths

- User Story: WO-097
- Objective: Validate functional behavior for "Test finance policy API paths" against acceptance criteria.
- Expected: Story "Test finance policy API paths" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: `pytest tests/security/test_finance_policy_api_paths.py -q` exits with code 0 and includes test functions named `test_x_actor_only_invoice_post_is_denied`, `test_wrong_company_reconcile_is_denied`, `test_missing_audit_context_statement_confirm_is_denied`, and `test_financial_manager_fiscal_close_is_allowed`.
- Check acceptance criterion 2: System integration tests: `pytest tests/security/test_finance_policy_api_paths.py::test_all_guarded_api_paths_evaluate_policy_before_executor -q` exits with code 0 and asserts fake executor call counts remain `0` for denied `POST /finance/invoices/{id}/post`, `POST /finance/reconciliations`, `POST /finance/bank-statements/{id}/confirm`, and `POST /finance/fiscal-years/{id}/close` paths.
- Check acceptance criterion 3: Mock data/fixtures: `tests/fixtures/security/finance_policy_api_paths.json` is committed, and `pytest tests/security/test_finance_policy_api_paths.py::test_api_path_fixture_loads_all_required_cases -q` asserts it contains denied and allowed cases for invoice posting, reconciliation, bank statement confirmation, and fiscal close.

### FUNCTIONAL-041 — Wrap OpenERP OSV kernel operations

- User Story: WO-066
- Objective: Validate functional behavior for "Wrap OpenERP OSV kernel operations" against acceptance criteria.
- Expected: Story "Wrap OpenERP OSV kernel operations" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection shows app/adapters/osv_kernel_adapter.py defines OsvKernelAdapter.search, OsvKernelAdapter.create, OsvKernelAdapter.write, and OsvKernelAdapter.execute with parameters for cr, uid, model_name, context, and operation-specific arguments.
- Check acceptance criterion 2: Unit tests — running python -m pytest tests/adapters/test_osv_kernel_adapter.py exits with status 0 and includes assertions that fake_model.search, fake_model.create, fake_model.write, and fake_model.custom_method receive the same cr, uid, ids/domain/values, and context passed into OsvKernelAdapter.
- Check acceptance criterion 3: System integration tests — N/A — app/adapters/osv_kernel_adapter.py introduces an internal adapter only and the repository analysis reports 0 API endpoints to exercise at a service boundary.

### FUNCTIONAL-042 — Extract ledger balance invariants

- User Story: WO-079
- Objective: Validate functional behavior for "Extract ledger balance invariants" against acceptance criteria.
- Expected: Story "Extract ledger balance invariants" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection shows app/domain/ledger.py defines assert_balanced_journal_entry, summarize_debits_credits, validate_currency_balance, and describe_imbalance or equivalent exported functions using Decimal or integer minor-unit arithmetic.
- Check acceptance criterion 2: Unit tests — running python -m pytest tests/domain/test_ledger_domain.py exits with status 0 and includes assertions for a balanced account.move.line-style fixture, an imbalanced fixture with a non-zero delta, and a multi-currency fixture grouped by currency.
- Check acceptance criterion 3: System integration tests — running python -m pytest tests/adapters/test_ledger_adapter_boundary.py exits with status 0 and verifies any legacy extraction hook targets model_name account.move.line through OsvKernelAdapter rather than importing legacy/openerp-7.0/addons/account/account_move_line.py.

### FUNCTIONAL-043 — Add OSV adapter contract tests

- User Story: WO-080
- Objective: Validate functional behavior for "Add OSV adapter contract tests" against acceptance criteria.
- Expected: Story "Add OSV adapter contract tests" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection shows tests/adapters/test_osv_contracts.py exists and imports OsvKernelAdapter from app.adapters.osv_kernel_adapter.
- Check acceptance criterion 2: Unit tests — running python -m pytest tests/adapters/test_osv_contracts.py exits with status 0 and includes assertions for account.account search or name_get-style delegation and account.move.line search or reconcile-style delegation.
- Check acceptance criterion 3: System integration tests — N/A — tests/adapters/test_osv_contracts.py uses fake OpenERP pool/model fixtures and does not exercise a public service boundary or live XML-RPC endpoint.

### FUNCTIONAL-044 — Define migration wave feature flags

- User Story: WO-084
- Objective: Validate functional behavior for "Define migration wave feature flags" against acceptance criteria.
- Expected: Story "Define migration wave feature flags" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection shows context/migration_waves.yml exists and contains top-level keys feature_flags, slices, gates, rollback_triggers, and operational_metrics.
- Check acceptance criterion 2: File inspection shows context/migration_waves.yml defines flag states named shadow, read_canary, read_authoritative, write_pilot, and write_authoritative.
- Check acceptance criterion 3: Unit tests — N/A — context/migration_waves.yml is static rollout metadata with no executable logic in this story.

### FUNCTIONAL-045 — Extract invoice lifecycle domain methods

- User Story: WO-086
- Objective: Validate functional behavior for "Extract invoice lifecycle domain methods" against acceptance criteria.
- Expected: Story "Extract invoice lifecycle domain methods" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection shows app/domain/invoice.py defines business-named methods or functions for recompute_invoice_taxes, validate_invoice_taxes, finalize_posting_move_lines, mark_invoice_paid, and collect_payment_move_lines, each referencing account.invoice intent rather than generic execute/write naming.
- Check acceptance criterion 2: Unit tests — running python -m pytest tests/domain/test_invoice_domain.py exits with status 0 and asserts at least one draft-to-open lifecycle command, one paid-state command, one tax-validation failure, and one payment-move-line collection result from app/domain/invoice.py.
- Check acceptance criterion 3: System integration tests — running python -m pytest tests/adapters/test_invoice_adapter_boundary.py exits with status 0 and verifies app/domain/invoice.py calls OsvKernelAdapter.execute with model_name account.invoice and legacy method names such as button_reset_taxes or confirm_paid when adapter delegation is required.

### FUNCTIONAL-046 — Create canonical projection filters

- User Story: WO-074
- Objective: Validate functional behavior for "Create canonical projection filters" against acceptance criteria.
- Expected: Story "Create canonical projection filters" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/projections/test_filters.py exits with status code 0 and asserts that app/projections/filters.py normalizes company_id, fiscalyear_id, date_from, date_to, period_ids, journal_ids, target_move, and initial_balance from tests/fixtures/projections/filter_cases.yml.
- Check acceptance criterion 2: System integration tests: python -m pytest tests/projections/test_filter_query_contract.py exits with status code 0 and verifies that ProjectionFilter.to_legacy_context output from app/projections/filters.py is accepted by app/projections/query_builder.py for every supported key in context/query_get_contract.yml.
- Check acceptance criterion 3: Mock data/fixtures: tests/fixtures/projections/filter_cases.yml is committed and contains at least posted-only, all-moves, date-range, period-range, journal-filter, company-filter, and initial-balance examples with expected normalized output.

### FUNCTIONAL-047 — Implement ledger projections

- User Story: WO-081
- Objective: Validate functional behavior for "Implement ledger projections" against acceptance criteria.
- Expected: Story "Implement ledger projections" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/projections/test_ledgers.py exits with status code 0 and asserts that app/projections/ledgers.py returns PartnerLedgerRowDTO from project_partner_ledger and GeneralLedgerRowDTO from project_general_ledger.
- Check acceptance criterion 2: System integration tests: python -m pytest tests/projections/test_ledger_filter_integration.py exits with status code 0 and verifies that app/projections/ledgers.py invokes app.projections.query_builder.build_move_line_where_clause for both partner-ledger and general-ledger filters.
- Check acceptance criterion 3: Mock data/fixtures: tests/fixtures/projections/ledger_rows.json is committed and contains move-line rows for at least two accounts, two partners including a null partner case, one initial-balance row, one posted move, and one draft move.

### FUNCTIONAL-048 — Implement invoice tax projections

- User Story: WO-087
- Objective: Validate functional behavior for "Implement invoice tax projections" against acceptance criteria.
- Expected: Story "Implement invoice tax projections" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/projections/test_invoices_tax_lines.py exits with status code 0 and asserts that app/projections/invoices_tax_lines.py returns InvoiceDTO with nested InvoiceLineDTO entries and TaxLineDTO rows.
- Check acceptance criterion 2: System integration tests: python -m pytest tests/projections/test_invoice_tax_lineage_integration.py exits with status code 0 and verifies that project_invoices and project_tax_lines share ProjectionFilter from app/projections/filters.py and preserve legacy_invoice_id across both outputs.
- Check acceptance criterion 3: Mock data/fixtures: tests/fixtures/projections/invoice_tax_lineage_rows.json is committed and contains at least one customer invoice, one supplier invoice or refund, invoice lines, invoice tax rows, ledger tax rows, and journal-entry lineage fields.

### FUNCTIONAL-049 — Implement journal trial projections

- User Story: WO-088
- Objective: Validate functional behavior for "Implement journal trial projections" against acceptance criteria.
- Expected: Story "Implement journal trial projections" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/projections/test_journals_trial_balance.py exits with status code 0 and asserts that app/projections/journals_trial_balance.py returns JournalSearchRowDTO rows from project_journal_search and TrialBalanceRowDTO rows from project_trial_balance.
- Check acceptance criterion 2: System integration tests: python -m pytest tests/projections/test_journal_trial_balance_filter_integration.py exits with status code 0 and verifies that app/projections/journals_trial_balance.py calls app.projections.query_builder.build_move_line_where_clause with a ProjectionFilter from app/projections/filters.py.
- Check acceptance criterion 3: Mock data/fixtures: tests/fixtures/projections/journal_trial_balance_rows.json is committed and contains account_move_line-style rows for at least two accounts, one journal, one period, one company, one posted move, and expected debit_minor and credit_minor totals.

### FUNCTIONAL-050 — Expose finance read routes

- User Story: WO-094
- Objective: Validate functional behavior for "Expose finance read routes" against acceptance criteria.
- Expected: Story "Expose finance read routes" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: python -m pytest tests/api/test_finance_read_routes.py -k validation exits with status code 0 and asserts that app/api/finance_read.py converts query parameters into ProjectionFilter from app/projections/filters.py for every finance read endpoint.
- Check acceptance criterion 2: System integration tests: python -m pytest tests/api/test_finance_read_routes.py exits with status code 0 and calls /api/v1/finance/journals, /api/v1/finance/trial-balance, /api/v1/finance/invoices, /api/v1/finance/tax-lines, /api/v1/finance/partner-ledger, and /api/v1/finance/general-ledger through the existing API test client with status code 200 for valid fixture filters.
- Check acceptance criterion 3: Mock data/fixtures: tests/fixtures/api/finance_read_requests.json is committed and contains valid request examples plus unsupported-filter examples for all six /api/v1/finance routes.

### FUNCTIONAL-051 — Add read API parity tests

- User Story: WO-098
- Objective: Validate functional behavior for "Add read API parity tests" against acceptance criteria.
- Expected: Story "Add read API parity tests" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Unit tests: N/A — tests/projections/test_read_api_parity.py is an API-boundary parity suite rather than unit coverage; projection unit tests remain in tests/projections/test_journals_trial_balance.py, tests/projections/test_invoices_tax_lines.py, and tests/projections/test_ledgers.py.
- Check acceptance criterion 2: System integration tests: python -m pytest tests/projections/test_read_api_parity.py exits with status code 0 and calls /api/v1/finance/journals, /api/v1/finance/trial-balance, /api/v1/finance/invoices, /api/v1/finance/tax-lines, /api/v1/finance/partner-ledger, and /api/v1/finance/general-ledger through the existing API test client.
- Check acceptance criterion 3: Mock data/fixtures: tests/fixtures/projections/read_api_parity_golden.json is committed and contains expected row counts, amount totals, metadata.projection_name values, and lineage keys for all six finance read endpoints.

### FUNCTIONAL-052 — Define warm standby DR values

- User Story: WO-077
- Objective: Validate functional behavior for "Define warm standby DR values" against acceptance criteria.
- Expected: Story "Define warm standby DR values" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection of helm/myerp-finance/values-dr.yaml shows warmStandby.enabled: true, warmStandby.rpoMinutes: 60, and warmStandby.rtoMinutes: 120.
- Check acceptance criterion 2: File inspection of helm/myerp-finance/values-dr.yaml shows managedPostgres.backups, managedPostgres.restoreValidation, objectStorage.replication, and runbook.annotations keys with placeholder values such as ${PRIMARY_REGION} or <managed-secret-ref> and no literal password, token, or API key values.
- Check acceptance criterion 3: Running python - <<'PY'
from pathlib import Path
p=Path('helm/myerp-finance/values-dr.yaml')
text=p.read_text()
for token in ['warmStandby:', 'rpoMinutes: 60', 'rtoMinutes: 120', 'managedPostgres:', 'objectStorage:']:
    assert token in text
PY verifies the required DR sections without needing Helm installed; unit tests are N/A — this story adds declarative YAML configuration only.

### FUNCTIONAL-053 — Add finance rollout feature flags

- User Story: WO-099
- Objective: Validate functional behavior for "Add finance rollout feature flags" against acceptance criteria.
- Expected: Story "Add finance rollout feature flags" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection of app/rollout/feature_flags.py shows a RolloutState enum or equivalent constants containing exactly shadow, read-canary, read-authoritative, write-pilot, and write-authoritative as supported state values.
- Check acceptance criterion 2: Running python -m pytest tests/rollout/test_feature_flags.py verifies parse_rollout_state, can_serve_read_authoritatively, can_serve_write_authoritatively, and assert_transition_allowed for all five states; unit tests are written and passing for app/rollout/feature_flags.py.
- Check acceptance criterion 3: Running python -m pytest tests/operability/test_feature_flag_boundaries.py validates the service boundary behavior that write-authoritative is refused unless supplied parity_pass=True, security_gate_pass=True, rollback_rehearsed=True, and finance_signoff=True; system integration tests validate the rollout decision boundary without external services.

### FUNCTIONAL-054 — Add finance SLO metrics module

- User Story: WO-102
- Objective: Validate functional behavior for "Add finance SLO metrics module" against acceptance criteria.
- Expected: Story "Add finance SLO metrics module" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: File inspection of app/observability/slo.py shows exported metric constants or names for finance.parity.pass_rate, finance.parity.p0_variance_count, finance.policy.denial_count, and finance.replay.duration_ms.
- Check acceptance criterion 2: Running python -m pytest tests/observability/test_slo.py verifies compute_parity_pass_rate, count_p0_variances, count_policy_denials, evaluate_replay_duration_ms, and evaluate_release_slo using committed fixtures; unit tests are written and passing for app/observability/slo.py.
- Check acceptance criterion 3: Running python -m pytest tests/operability/test_slo_release_boundary.py validates the integration boundary where a fixture with p0_variance_count greater than 0 makes evaluate_release_slo return allowed=False and reason_code=P0_VARIANCE_PRESENT; system integration tests validate service boundary behavior using JSON fixture inputs.

### FUNCTIONAL-055 — Automate cutover rehearsal checklist

- User Story: WO-104
- Objective: Validate functional behavior for "Automate cutover rehearsal checklist" against acceptance criteria.
- Expected: Story "Automate cutover rehearsal checklist" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Running python scripts/cutover_rehearsal.py --fixture tests/fixtures/operability/cutover_rehearsal_pass.json --dr-values helm/myerp-finance/values-dr.yaml --output /tmp/cutover-report.json exits with status code 0 and writes /tmp/cutover-report.json containing overall_allowed true.
- Check acceptance criterion 2: Running python scripts/cutover_rehearsal.py --fixture tests/fixtures/operability/cutover_rehearsal_p0_variance.json --dr-values helm/myerp-finance/values-dr.yaml exits with non-zero status and prints or writes a reason_code containing P0_VARIANCE_PRESENT.
- Check acceptance criterion 3: Running python -m pytest tests/operability/test_cutover_rehearsal.py verifies load_rehearsal_fixture, build_rollback_checklist, evaluate_cutover_rehearsal, and main argument handling; unit tests are written and passing for scripts/cutover_rehearsal.py.

### FUNCTIONAL-056 — Test release gate enforcement

- User Story: WO-105
- Objective: Validate functional behavior for "Test release gate enforcement" against acceptance criteria.
- Expected: Story "Test release gate enforcement" satisfies expected functional validation outcomes without critical issues.

**Steps**
- Check acceptance criterion 1: Running python -m pytest tests/operability/test_release_gates.py executes tests that import app/rollout/feature_flags.py and app/observability/slo.py and assert write-authoritative promotion is denied when parity_pass is false.
- Check acceptance criterion 2: tests/operability/test_release_gates.py contains a test assertion that a release fixture with p0_variance_count greater than 0 returns or reports reason_code P0_VARIANCE_PRESENT from evaluate_release_slo or scripts/cutover_rehearsal.py.
- Check acceptance criterion 3: tests/operability/test_release_gates.py contains a test assertion that missing policy denial evidence blocks promotion with a reason_code containing POLICY_EVIDENCE_MISSING or equivalent deterministic policy evidence code.