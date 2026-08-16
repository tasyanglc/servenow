# PRD: ServeNow Workforce OS

**COMPFEST 18 — BIzzIT Business IT Case | Team Tech Gals**

---

## 1. Background & Problem Statement

ServeNow Technologies sells a customer service platform, but internally runs on spreadsheets, WhatsApp, email, and personal notes. The core problems from the case:

- Fragmented information → weak accountability → excessive escalation to directors
- Directors (CEO/CTO/COO) carry operational load that should belong to middle management, because no middle-management layer with clear decision rights exists
- Customer SLA (78% → target 96%) is disconnected from internal execution — nobody can trace *why* a customer SLA breached
- Sales is founder-dependent and unsystematic
- Product innovation has no filter — 16 candidate AI features, no clear prioritization mechanism

**Core proposition:** ServeNow evolves from a customer-service platform into a *customer-to-workforce operating system* — every customer promise (Customer SLA) is decomposed into accountable internal work (Employee SLA), monitored end-to-end, and used as Customer Zero to validate the same product before selling it externally.

---

## 2. Product Structure — 3 Pillars + Executive Layer

| Pillar Goal Primary Objects  |                                                                                          |                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------ |
| **01 Operate**               | Make work visible, owned, and time-bound                                                 | Task, SLA, Owner, Escalation               |
| **02 Manage**                | Predict exceptions before they become breaches; give evidence-based judgment to managers | Risk Score, Root Cause, Recommended Action |
| **03 Scale**                 | Turn internal execution discipline into a sellable commercial engine                     | Sales Pipeline, Customer Zero Proof Points |
| **Executive Overview**       | Single-glance cross-pillar visibility for directors                                      | Aggregated KPIs from all 3 pillars         |

---

## 3. Roles

| Role Who (mapped to case) Scope  |                                                          |                                                                                                                                                 |
| -------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Director**                     | CEO, CTO, COO                                            | Company-wide, all departments, all pillars                                                                                                      |
| **Manager / Team Lead**          | New middle layer (currently missing per case problem #2) | Own department/team only                                                                                                                        |
| **Employee**                     | Support, Implementation, Ops staff                       | Own tasks only                                                                                                                                  |
| **Sales Executive**              | Sales/BD team (currently 3 people)                       | Own leads/deals; team pipeline read-only                                                                                                        |
| **Admin**                        | Ops/IT admin (system configuration)                      | System settings, user & SLA rule management — not shown in main views below, kept separate since it's configuration, not operational monitoring |

**Design principle carried from the notebook:** no role — including Director — has a per-employee "risk ranking" or leaderboard view. The system surfaces **task risk**, not **people risk**, to avoid the tool becoming a surveillance/punishment mechanism (explicit constraint already encoded in the ML model design: `employee_id` is excluded from model features).

---

## 4. Feature List by Pillar

### 01 — OPERATE: Task & SLA Board

| # Feature Description  |                                             |                                                                                                                                                      |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1                    | Task creation & ownership                   | Every task has: owner, expected output, deadline, SLA hours, priority, linked customer (if applicable)                                               |
| 1.2                    | Kanban board (On Track / At Risk / Overdue) | Status auto-computed from SLA countdown, not manually set                                                                                            |
| 1.3                    | SLA countdown timer                         | Real-time remaining-hours display per task                                                                                                           |
| 1.4                    | Role hierarchy view                         | Org chart showing Director → Manager/Team Lead → Employee, with task-routing rules (small tasks stop at Team Lead level)                             |
| 1.5                    | Escalation trail                            | Auto-log of every escalation event: who escalated, when, why, resolution                                                                             |
| 1.6                    | Customer SLA ↔ Employee SLA linkage         | One customer ticket can decompose into N internal tasks across departments, each with its own sub-SLA (the "One Workflow, Two Sides of SLA" concept) |
| 1.7                    | My Work dashboard (employee-level)          | Personal task list with deadline, SLA, status — replaces "what do I do this week?" being answered manually by a manager                              |

### 02 — MANAGE: AI Management Copilot

| # Feature Description Powered by  |                                    |                                                                                                                                |                                                                                      |
| --------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 2.1                               | SLA breach risk score              | Probability (0–1) that an open task will breach its SLA, computed at assignment + re-scored as conditions change               | XGBoost model (notebook)                                                             |
| 2.2                               | Risk banding                       | Low (<0.30) / Medium (0.30–0.60) / High (≥0.60) — routes attention, not automatic action                                       | Threshold from notebook §14                                                          |
| 2.3                               | Root-cause explanation             | Per flagged task, top contributing factors shown in plain language (e.g. "Overload", "Dependency delay", "Queue backlog")      | SHAP values (notebook §15–16)                                                        |
| 2.4                               | Recommended action (not automatic) | Suggests one of: Reassign / Escalate dependency / Balance workload / Manager review — manager must confirm                     | Business rule mapped from dominant SHAP driver                                       |
| 2.5                               | AI Weekly Summary                  | Auto-generated natural-language digest: "This week: N tasks at risk, dominant root cause: X"                                   | Aggregation, not a separate model                                                    |
| 2.6                               | Customer sentiment monitor         | Trend chart from ticket sentiment (positive/neutral/negative) — flagged as **future scope**, not built in the current notebook | Requires separate NLP component (not yet built — be upfront about this in the pitch) |
| 2.7                               | Workload balancing view            | Cross-team view of `current_workload_ratio` per employee/team, used to justify reassignment decisions manually by a manager    | Existing model input feature, exposed as a view                                      |

### 03 — SCALE: Sales Pipeline + Customer Zero

| # Feature Description  |                                   |                                                                                                                                                                                            |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1                    | Sales pipeline board              | Lead → Qualification → Demo → Proposal → Negotiation → Contract, each deal card with owner, value, probability, next action                                                                |
| 3.2                    | Progressive ownership tag         | Each deal tagged with founder-involvement stage: Observe / Contribute / Co-lead / Lead / Own — makes the sales capability-transfer plan (case section 2A) trackable, not just aspirational |
| 3.3                    | Customer Zero proof-point banner  | Pulls real internal metrics (e.g. internal SLA achievement) to use as a sales talking point automatically, instead of manually updating a slide                                            |
| 3.4                    | Deal → account expansion tracking | For existing customers, tracks HQ → branch → region rollout (Land & Expand model from the doc)                                                                                             |

### Executive Overview

| # Feature Description  |                               |                                                                                                                                                                  |
| ---------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E.1                    | Cross-pillar KPI cards        | SLA achievement %, weekly exceptions count, pipeline value — one screen                                                                                          |
| E.2                    | Director-dependency indicator | Tracks % of tasks/decisions that still require director involvement over time — directly measures the case's explicit target ("director dependency: High → Low") |

---

## 5. Role-Based Access — Detailed View Matrix

This is the core of the "role based access" requirement. Each role sees a **scoped subset** of the same underlying data — nobody has a separate app, just a filtered view.

### 5.1 Director

**Can see:**

- Executive Overview (E.1, E.2) — company-wide, unfiltered
- Operate board — all departments, all teams (read-only by default; can drill into any task)
- Manage — AI Weekly Summary at company level; can view root-cause breakdown *aggregated by department*, not by individual employee
- Scale — full sales pipeline (all reps), Customer Zero proof points, expansion map across all branches/regions
- Role hierarchy / org config — can view and edit reporting lines

**Cannot see / explicitly restricted:**

- Individual employee "risk profile" or ranking — does not exist in the system by design
- Cannot manually override an AI risk score without a logged reason (keeps the system auditable, prevents silent bias)

### 5.2 Manager / Team Lead

**Can see:**

- Operate board — **own team/department only**, all statuses (On Track/At Risk/Overdue)
- My Work dashboard — own tasks, same as an employee, plus team roster view
- Manage — AI Weekly Summary **scoped to own team**; flagged interventions list for own team with root-cause + recommended action; can action (Reassign/Escalate/Coach) — this write-action is Manager-only
- Workload balancing view — own team members' `current_workload_ratio`
- Escalation trail — team-level; can escalate upward to Director
- Sales pipeline — **read-only**, only if the Manager oversees a sales team

**Cannot see:**

- Other teams' task boards or flagged interventions (prevents cross-team surveillance)
- Company-wide Executive Overview cards (that's a Director-level aggregation)
- Cannot edit org hierarchy/reporting lines

### 5.3 Employee

**Can see:**

- My Work dashboard only — own tasks, deadlines, SLA, status
- Own task detail: expected output, dependencies, escalation history *for tasks they own*
- Own individual performance record (task completion count, SLA fulfillment rate) — **visible to self**, framed as self-service transparency, not as a manager surveillance tool
- Team-level (not individual) At-Risk/Overdue counts, for situational awareness — no names attached

**Cannot see:**

- Other employees' tasks or performance data
- AI risk scores or root-cause tags for anyone else's tasks
- Sales pipeline, Executive Overview, org configuration

### 5.4 Sales Executive

**Can see:**

- Sales pipeline — own deals fully editable; **team pipeline visible read-only** (for forecasting awareness, matches case's "sales forecasting" gap)
- Customer Zero proof-point data — read-only, used for pitching
- Own progressive-ownership stage tracking (Observe/Contribute/Co-lead/Lead/Own) and which deals are tagged at which stage
- My Work dashboard — sales-related tasks only (e.g. "send proposal by Friday")

**Cannot see:**

- Operate board for non-sales departments (Support, Implementation)
- AI Management Copilot for other teams
- Executive Overview

### 5.5 Admin (system configuration — separate concern from the 4 operational roles above)

**Can see/do:**

- Create/edit SLA rules per task type
- Manage user accounts and role assignments
- Configure escalation thresholds (e.g. what counts as "At Risk")
- View system audit log (who changed what)

*Note: Admin is a system-configuration role, not a monitoring role — kept separate from the operational role matrix above so it doesn't get confused with "who can see whose work."*

---

## 6. Data Model (aligned to the actual ML notebook schema)

The AI Management Copilot (Section 2 features) is built on this existing feature set — reuse it as the PRD's data dictionary rather than inventing a parallel one:

**Task-level fields:** `task_type`, `task_priority`, `task_complexity`, `estimated_task_hours`, `sla_hours`, `remaining_sla_hours`, `task_queue_age_hours`, `dependency_count`, `dependency_delay_hours`, `reassignment_count`, `cross_department_required`, `peak_workload_flag`

**Employee-level fields:** `employee_department`, `employee_experience_years`, `employee_historical_sla_rate`, `employee_avg_completion_hours`, `current_open_tasks`, `current_workload_ratio`

**Customer-level fields:** `customer_tier`, `customer_escalation_history`

**Explicitly excluded from the model (by design):** `employee_id`, `task_id` — identifiers are kept for routing/display purposes only, never passed to the model, so the model cannot learn person-specific risk.

**Important caveat to state honestly in the deck:** these fields are validated on synthetic data. A real deployment needs historical ServeNow task data, and three specific fields (`employee_historical_sla_rate`, `employee_avg_completion_hours`, `similar_task_avg_hours`) must be recomputed strictly "as of" each task's creation time to avoid look-ahead leakage — this is flagged in the notebook itself as the single most important pre-deployment step.

---

## 7. AI Component — Operating Constraints (carry these into the pitch verbatim, they're strong differentiators)

1. **AI recommends, manager decides.** No action is ever taken automatically.
2. **The model must not feed individual performance reviews or penalties.** No output routes into a rating or disciplinary process.
3. **A flagged task is a question, not a verdict** — the correct response is a review of task conditions, not an automatic reassignment.
4. **Risk bands are a communication device; the decision threshold is a separate operational parameter** tied to how much review capacity managers actually have.

---

## 8. Out of Scope (be explicit about this so the team doesn't overpromise in Q&A)

- Payroll, compensation, recruitment, full employee lifecycle (explicitly *not* an HRIS — see case doc's HRIS-vs-Workforce-Layer distinction)
- Customer-facing self-service portal (exists in ServeNow's current product; not rebuilt here)
- Sentiment analysis engine (2.6) — conceptually included in the roadmap, not yet built; state this clearly as Phase 2
- Automatic SLA renegotiation with customers — human-in-the-loop only

---

## 9. Open Questions for the Team (not yet decided — needs discussion before finalizing slides)

- Which risk band thresholds (0.30 / 0.60) do we present as fixed vs. "configurable per department" — case mentions different departments have very different SLA profiles (support vs. implementation), a single global threshold may not be realistic
- Do we show the Manager role as newly created (a structural recommendation) or as already existing but underutilized? This affects how "Priority 1" is pitched to the judges
- Scope of prototype screens for the 10-minute audio: which 2 of the 4 mockup screens get deep narration vs. which are shown briefly