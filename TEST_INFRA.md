# SakuJalan: Campus Budget Navigator — E2E Test Infrastructure

## Overview

The SakuJalan E2E Test Suite provides an automated, opaque-box integration and end-to-end verification framework. It tests the application from the user's perspective across HTTP API contracts (`/api/state`, `/api/export`), server-rendered HTML (`/`), DOM vector assets (`components/mascot-badges.tsx`), and responsive layout rules (`app/globals.css`).

The suite is written entirely in modern TypeScript using native `node:assert/strict` and executed with `tsx` without heavyweight browser binaries, enabling ultra-fast execution (~3 seconds for 68 comprehensive test cases) and zero CI flakiness.

---

## Architecture & Design Principles

```
tests/e2e/
├── harness.ts                     # Multi-tenant test session, HTTP client, test registry
├── tier1-feature-coverage.test.ts # 25 test cases across 5 core features
├── tier2-boundary-cases.test.ts   # 30 test cases across 6 boundary dimensions
├── tier3-interactions.test.ts     # 8 test cases across pairwise feature integrations
├── tier4-workload-scenarios.test.ts # 5 multi-step real-world student user journeys
└── runner.ts                      # Executable CLI orchestrator, timings, summary reporter
```

### 1. Multi-Tenant Session Isolation
The state backend (`app/api/state/route.ts`) inspects the incoming `x-sakujalan-user` or `x-runway-user` header. In `StudentTestSession` (`tests/e2e/harness.ts`), each test instantiates an isolated student session:
```typescript
export class StudentTestSession {
  readonly userId: string;
  constructor(userId?: string, exact = false) {
    if (exact && userId) {
      this.userId = userId;
    } else {
      const suffix = Math.random().toString(36).slice(2, 8);
      this.userId = userId ? `${userId}_${Date.now()}_${suffix}` : `e2e_student_${Date.now()}_${suffix}`;
    }
  }
}
```
This guarantees that tests execute in complete isolation with zero state pollution or order dependency between runs.

### 2. Opaque-Box Validation Strategy
- **API Surface**: Calls `GET /api/state`, `POST /api/state`, `GET /api/export` over standard HTTP `fetch` against the local live server (`http://localhost:3000`).
- **Mathematical Invariants**: Validates domain logic formulas (`lib/runway.ts`) against HTTP response state (`forecast.safe`, `forecast.mandatory`, `balance()`, `points`).
- **Idempotency & Concurrency**: Tests SHA-256 digest checks, replay prevention, and optimistic versioning conflicts (HTTP 409).
- **DOM & Vector Rendering**: Validates SVG markup, viewBox, color palettes, and responsive props using React server rendering (`react-dom/server`).
- **CSS Layout Contracts**: Reads and verifies responsive styling rules (`app/globals.css`), including max container widths, fluid clamp padding, and auto-fit grid layouts.

---

## Test Runner & Execution

### Execution Command
```bash
npx tsx tests/e2e/runner.ts
```

### Linting Command
```bash
npm run lint
# or
npx oxlint tests
```

### Expected Output
The runner outputs tier-by-tier execution with individual test IDs, execution times, and a summary table:
```
==============================================================================
 SAKUJALAN: CAMPUS BUDGET NAVIGATOR — OPAQUE-BOX E2E TEST RUNNER
==============================================================================
Total Registered Tests: 68
Environment: Node v24.19.0 | Target: http://localhost:3000

>>> [TIER 1]
  ● Feature / Area: 5 Core Navigation Tabs
    ✓ [T1-TAB-1] Tab 1: Summary financial cockpit exposes daily safe amount, cash breakdown, and horizon (58.7ms)
    ...
==============================================================================
 E2E SUITE EXECUTION SUMMARY
==============================================================================
  Tier 1   : 25/25 passed (PASS)
  Tier 2   : 30/30 passed (PASS)
  Tier 3   : 8/8 passed (PASS)
  Tier 4   : 5/5 passed (PASS)
------------------------------------------------------------------------------
Total Tests Run : 68
Total Passed    : 68
Total Failed    : 0
Total Duration  : ~2900ms
==============================================================================
✨ ALL E2E TESTS PASSED SUCCESSFULLY! (100% PASS RATE)
```

---

## 4-Tier Test Coverage Matrix

| Tier | Area | Test Cases | Target Subsystem |
|------|------|------------|------------------|
| **Tier 1** | Feature Coverage | **25 tests** | 5 Core Tabs, 3-Step Banner, Quick-Log Chips, Forecasting, Mascot Badges |
| **Tier 2** | Boundary & Corner Cases | **30 tests** | Zero/Negative Limits, Horizons, Extreme Expenses, Idempotency, Concurrency, Viewports |
| **Tier 3** | Cross-Feature Interactions | **8 tests** | What-If + Quick-Log, Activity Log Sync, Levers 1/2/3, Plan Payment, Buffer Tuning, QRIS |
| **Tier 4** | Real-World Workload Scenarios | **5 tests** | Monthly Onboarding, 7-Day Week, Crunch Recovery, Gig Worker Inflow, Full Data Export |
| **Total** | | **68 tests** | **100% Suite Pass Rate** |
