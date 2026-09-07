## 2026-09-07T14:29:15Z

You are e2e_test_writer (E2E Test Writer).
Working directory: C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\e2e_test_writer
Project root: C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway

Mandatory input: You MUST read:
1. ORIGINAL_REQUEST.md at C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\ORIGINAL_REQUEST.md
2. PROJECT.md at C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\orchestrator\PROJECT.md
3. Survey Explorer 3 report at C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\survey_explorer_3\handoff.md

Exclusive Write Ownership:
You own `tests/e2e/` (all files inside it), `TEST_INFRA.md`, and `TEST_READY.md` at project root.
DO NOT modify implementation code in `app/`, `components/`, `lib/`, `db/`.

Objective:
Design and implement a comprehensive opaque-box E2E test suite for SakuJalan covering 4 tiers:
- Tier 1: Feature Coverage (>=5 test cases per feature across 5 core navigation tabs, 3-step banner, quick-log chips, safe-to-spend forecasting, mascot badges).
- Tier 2: Boundary & Corner Cases (>=5 test cases per feature: zero/negative limits, edge cases in dates/horizons, extreme expenses, idempotency, rapid transactions, viewport constraints).
- Tier 3: Cross-Feature Interactions (pairwise combinations: Quick-log + What-If simulator, Quick-log + Tab 5 history sync, Levers activation + bill deferral, etc.).
- Tier 4: Real-World Student Workload Scenarios (realistic end-to-end user journeys simulating a monthly allowance cycle with daily lunches, transit, coffee, fixed bills, emergency buffer protections).

Implementation requirements:
- Use TypeScript with native `node:assert/strict` or `tsx` testing endpoints (`/api/state`, `/api/export`) and rendering DOM / component structures.
- Create an executable test runner: e.g. `npx tsx tests/e2e/runner.ts` (or `npx tsx tests/e2e/opaque-e2e.test.ts`).
- Execute your test runner and verify all tests pass.
- Generate `TEST_INFRA.md` and `TEST_READY.md` summarizing methodology, test runner command, and coverage counts per tier.
- Run `npm run lint` to ensure test files pass linting cleanly.
- Write your structured report to `C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\e2e_test_writer\handoff.md`.
- Send a completion message back to the orchestrator.
