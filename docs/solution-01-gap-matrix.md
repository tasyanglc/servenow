# Solution 01 alignment audit

## Gap matrix

| Deck capability | Existing implementation | Missing | Required change | Priority |
|---|---|---|---|---|
| Workflow standardization & packaging | Task types only | Workflow, stages, gates, templates, packages, blueprints | Domain model, reusable workflow library, project setup consumption | P0 |
| Customer-to-task SLA mapping | Customer SLA sequence on a task detail | Customer/contract/project relationships and traceable drill-down | Customer, project and SLA services with linked task context | P0 |
| Project management | Tasks and dashboard aggregates | First-class project scope, milestones, workflow and outcome | Project list/detail and calculated progress | P0 |
| Workflow & dependency management | Dependency objects on tasks; blocked counter | Successor/impact context and actionable dependency view | Derive blocked/delay/impact and expose dependency chain | P0 |
| Capacity & allocation | Task-owner count on dashboard | Employee profiles, skill match, availability and manager recommendation | Workforce service and non-automatic assignment recommendation | P0 |
| SLA risk & intervention center | `POST /predict`, XGBoost, SHAP display | Risk context tied to decision matrix/intervention life cycle | Preserve endpoint, map model result to operational language | P0 |
| Decision matrix | Backend recommendation by top feature | Configurable multi-factor rule evaluation | Decision matrix service with advisory-only output | P0 |
| Root-cause analysis | SHAP factors and translated labels | Dependency, SLA and capacity context in a shared analysis | Operational root-cause summary | P1 |
| Confirmed interventions | Confirm button writes no durable domain record | Named interventions, confirmation, reason, actor/time audit | Intervention service and task history mutation | P0 |
| Execute & monitor | Manager task dashboard | Project/workflow progress, bottlenecks, intervention monitoring | Cross-domain monitor metrics | P1 |
| Knowledge hub & playbooks | Customer Zero frictions | Knowledge/project learning/playbook/gate links | Knowledge domain, library and contextual references | P0 |
| Customer pilot | None | Pilot tracking and workflow feedback | Pilot entity/service/interface | P1 |
| Sector blueprint | None | Sector-to-package/workflow/SLA/gate/playbook map | Blueprint library and project setup reference | P1 |
| Customer outcome | None | SLA/delivery/resolution outcome linked to project | Outcome entity/service/interface | P1 |
| RBAC hardening | Client-side route allow list | New scoped routes and API enforcement | Role scopes now; backend JWT authorization requirement documented | P1 |

## Target architecture

### Entities

- **Customer**: profile, contract, service package, customer SLAs, projects.
- **Project**: customer, scope, milestones, workflow instances, tasks, SLA, outcome and learnings.
- **Workflow**: template, ordered stages, gates, standard SLA, skills, dependencies, outputs and playbooks.
- **Task**: existing task fields plus project/workflow/stage links, skills, predecessor/successor state, derived risk and interventions.
- **Employee**: department, skills, experience, availability, capacity, workload ratio and active tasks.
- **Knowledge**: source project, workflow/gate/sector links, lesson, pattern and playbook status.
- **Pilot**, **Outcome**, **Intervention** and **DecisionMatrixRule**: separate auditable operational records.

### Routes

New routes: `/customers`, `/customers/[id]`, `/projects`, `/projects/[id]`, `/workflows`, `/knowledge`, `/pilots`, `/outcomes`.

Modified routes: `/tasks/[id]` shows connected operational context and intervention history; `/team-dashboard` gains project/workflow/capacity/bottleneck monitoring. Existing risk routes continue to use the same model endpoint.

### Services and data provenance

`operationalData` is the mock repository for all new domains. `operationsService` derives SLA/dependency/capacity state and records manager-confirmed interventions. `decisionMatrix` yields recommendations only. Existing `apiClient.predictTaskRisk` remains the sole model-generated prediction integration.

All display data is labeled **Mock**, **Derived**, or **Model-generated**. A production API should provide CRUD for each entity, graph traversal for SLA drill-down, authenticated intervention mutations/audit history, and authenticated proxying of `/predict`; the existing Python model stays unchanged.

### RBAC

Directors see company-wide customer/project/workflow/outcome views. Managers receive scoped project, capacity, intervention and knowledge access. Employees see their tasks plus related project/workflow/knowledge context. Sales receives customer/pilot context. Admin receives configuration libraries. Backend authorization remains a required API follow-up; the client allow list is updated in this increment.
