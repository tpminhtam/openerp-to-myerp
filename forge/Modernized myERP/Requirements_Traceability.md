---

**Changelog** (2026-09-23T20:19:31.551Z): RTM: 7 requirement(s) changed. Coverage summary metrics updated.

- Revised: REQ-001
- Revised: REQ-002
- Revised: REQ-003
- Revised: REQ-004
- Revised: REQ-005
- Revised: REQ-006
- Revised: REQ-007
- Coverage summary (totals / gaps)

# Requirements Traceability Matrix

| Req ID | Feature | PRD Sections | Arch Components | User Stories | Status | Priority |
|---|---|---|---|---|---|---|
| REQ-001 | Central Authentication and Authorization Boundary | Executive Summary, Business Objectives and Success Criteria, User Stories and Acceptance Criteria, Business Process Overview, Business Rules and Policies, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Finance API Gateway, Domain Policy Service, Audit Evidence Service, Legacy Adapter Layer, OIDC-backed identity, server-side RBAC and SoD policy enforcement, Security Architecture, Authentication & Authorization Flow | WO-054, WO-064, WO-071, WO-083, WO-090, WO-092, WO-093, WO-097, WO-105 | draft | P0 |
| REQ-002 | Incremental Migration Path off OpenERP 7.0 and Python 2-era Runtime | Executive Summary, Business Objectives and Success Criteria, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Python 3.14-compatible finance service layer, Legacy Adapter Layer, Parity Harness, Finance API Gateway, Kubernetes, managed PostgreSQL, managed object storage, Forge Shipping Pipeline, rollout feature flags, OSV runtime stable kernel | WO-008, WO-051, WO-052, WO-053, WO-055, WO-056, WO-058, WO-059, WO-060, WO-061, WO-062, WO-063, WO-066, WO-068, WO-077, WO-080, WO-084, WO-099, WO-102, WO-104, WO-105 | draft | P0 |
| REQ-003 | Central Domain Policy Layer for Posting and Reversal Workflows | Executive Summary, Personas and Stakeholders, User Stories and Acceptance Criteria, Business Process Overview, Business Rules and Policies, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Domain Policy Service, Finance API Gateway, Legacy Adapter Layer, Audit Evidence Service, server-side RBAC and SoD policy enforcement, Security Architecture, Authentication & Authorization Flow | WO-054, WO-055, WO-064, WO-070, WO-071, WO-076, WO-078, WO-083, WO-092, WO-093, WO-097, WO-105 | draft | P0 |
| REQ-004 | Projection-oriented Accounting Read APIs | Executive Summary, Business Objectives and Success Criteria, Business Process Overview, Success Metrics and KPIs, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Projection Read Service, Finance API Gateway, Legacy Adapter Layer, Parity Harness, canonical filter object, versioned DTOs, managed PostgreSQL | WO-053, WO-055, WO-065, WO-072, WO-073, WO-074, WO-078, WO-081, WO-087, WO-088, WO-094, WO-098, WO-102 | draft | P0 |
| REQ-005 | ORM Hub Classification, Adapters, and Pure Accounting Domain Modules | Executive Summary, Business Objectives and Success Criteria, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Legacy Adapter Layer, Pure domain modules, OSV runtime stable kernel, Python 3.14-compatible finance service layer, Domain Policy Service, rollout feature flags | WO-051, WO-056, WO-066, WO-079, WO-080, WO-084, WO-086, WO-092, WO-093, WO-099, WO-104, WO-105 | draft | P0 |
| REQ-006 | Canonical Finance Domain Dictionary and Parity Map | Executive Summary, Business Objectives and Success Criteria, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Pure domain modules, dictionary mappings, Parity Harness, Legacy Adapter Layer, Projection Read Service, Domain Policy Service, Audit Evidence Service | WO-051, WO-053, WO-054, WO-055, WO-056, WO-057, WO-065, WO-080 | draft | P0 |
| REQ-007 | Accounting Parity Test Harness | Executive Summary, Business Objectives and Success Criteria, User Stories and Acceptance Criteria, Business Process Overview, Success Metrics and KPIs, Risks Assumptions Dependencies and Constraints, Scope NFRs and Open Questions, Rollout Plan | Parity Harness, Projection Read Service, Legacy Adapter Layer, Forge Shipping Pipeline, Audit Evidence Service, Playwright parity tooling, Python 3.14-compatible finance service layer | WO-053, WO-055, WO-057, WO-062, WO-063, WO-065, WO-069, WO-070, WO-072, WO-073, WO-078, WO-085, WO-095, WO-098, WO-102, WO-105 | draft | P0 |