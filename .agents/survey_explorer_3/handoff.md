# Handoff Report: UX & Build Exploration (R3 & Build/Test Infrastructure)

**Agent**: `survey_explorer_3` (UX & Build Explorer)  
**Date**: 2026-09-07T14:27:30Z  
**Scope**: Investigation of R3 (Streamlined Student UX & Quick-Log Interactions) and Build/Lint/Test Infrastructure  
**Status**: Investigation Complete (Read-Only)

---

## 1. Observation

### 1.1 The 5 Core Navigation Tabs
- **Location**: `app/runway-app.tsx` (Lines 646–654, 658, 839, 914, 1014, 1048).
- **Tab Component**: Rendered using `@base-ui/react/tabs` wrapped by shadcn components (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` in `components/ui/tabs.tsx`).
- **Controlled State**:
  ```tsx
  // app/runway-app.tsx:211
  const [tab, setTab] = useState('summary');
  ```
- **Tabs Declaration**:
  ```tsx
  // app/runway-app.tsx:646-654
  {/* MAIN 5 CLEAN TABS */}
  <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
    <TabsList className="main-tabs" aria-label="Application Sections">
      <TabsTrigger value="summary"><LayoutDashboard size={16} />1. Daily Safe-to-Spend</TabsTrigger>
      <TabsTrigger value="levers"><Sliders size={16} />2. Save Money (3 Levers)</TabsTrigger>
      <TabsTrigger value="radar"><Compass size={16} />3. Cheap Campus Map</TabsTrigger>
      <TabsTrigger value="plans"><ListChecks size={16} />4. Fixed Bills ({s?.plans.filter(p => !p.paid).length ?? 0})</TabsTrigger>
      <TabsTrigger value="ecosystem"><Radio size={16} />5. GoPay Sync & History</TabsTrigger>
    </TabsList>
  ```
- **Tab Content & Data Bindings**:
  1. **Tab 1: `summary` ("1. Daily Safe-to-Spend")** (`app/runway-app.tsx:658-836`):
     - Displays 3 big metric cards bound to `f = data.forecast` and `b = data.state.budget`:
       - Card 1: Today's safe limit (`f.safe`), remaining horizon days (`f.horizon`), formula popup modal trigger.
       - Card 2: Wallet overview: Total cash (`f.cash`), ring-fenced for mandatory bills (`- f.mandatory`), untouched emergency buffer (`- b.buffer`), available free cash (`f.cash - f.mandatory - b.buffer`).
       - Card 3: Semester outlook: Deficit risk vs surplus buffer (`f.gap ? Short by f.gap : Surplus of f.remainder`), with direct transition button `<Button onClick={() => setTab('levers')}>`.
     - What-If Simulator (`app/runway-app.tsx:743-833`): Range slider (0 to 150,000) dynamically recalculates `simulatedSafe`, `effectiveCash`, `simulatedSurplus`, and offers instant "Log Expense" commit button.
  2. **Tab 2: `levers` ("2. Save Money (3 Levers)")** (`app/runway-app.tsx:839-911`):
     - Lever 1: GoFood Campus Partner Deals -> `handleActivateLever1()` calls `mutate({ type: 'save' })` or `mutate({ type: 'daily', amount: 15000 })`.
     - Lever 2: Deferral Vault -> `handleActivateLever2()` defers unpaid optional plan past next allowance date (`plus(b.next, 2)`).
     - Lever 3: Campus Gigs & Tutoring -> `handleActivateLever3()` claims waiting income or registers pending gig income (`+Rp 45,000`).
  3. **Tab 3: `radar` ("3. Cheap Campus Map")** (`app/runway-app.tsx:914-1011`):
     - Filter bar: All Options, Transit & Commute (`mobility`), Food & Canteens (`meals`), Free Study Pods (`study`).
     - Real curated Depok/UI campus options (Bikun, KRL, Kantin Kansas, Crystal of Knowledge Library) with actionable quick-log buttons that directly call `handleQuickLog('GoTransit KRL Fare', 3000)` and `handleQuickLog('Kantin Meal', 12000)`.
  4. **Tab 4: `plans` ("4. Fixed Bills")** (`app/runway-app.tsx:1014-1045`):
     - Dynamic grid mapped directly from `s.plans`: displays Kos Rent, WiFi, and commitments.
     - Live badges for `PAID`, `ESSENTIAL (RENT/UKT)`, and `OPTIONAL`.
     - Action buttons: "Mark Paid" (`show('pay', p.id)`), "Postpone" (`show('defer', p.id)`), "Cheaper Alt" (`show('save', p.id)`), plus top action "Add Fixed Bill" (`show('plan')`).
  5. **Tab 5: `ecosystem` ("5. GoPay Sync & History")** (`app/runway-app.tsx:1048-1102`):
     - GoPay QRIS Integration: Simulated webhook listener with "Simulate QRIS Payment (Rp 16k)" button invoking `handleSimulateWebhook()`.
     - Activity Log: Renders `s.ledger.slice(-5).reverse()` directly from the live database ledger.
- **Dummy Data Dependency Audit**:
  - Across all 5 tabs in `runway-app.tsx`, zero mock / dummy arrays are hardcoded in place of live data.
  - All financial metrics flow strictly through `data.state` and `data.forecast` loaded from `/api/state`.
  - In `app/targo-landing.tsx:18-28`, rotating mock strings (`safes`, `days`, `saveds`) exist strictly as decorative landing-page marketing animations prior to entering the cockpit.

---

### 1.2 The 3-Step Banner
- **Location**: `app/runway-app.tsx` (Lines 592–644).
- **Structure & Rendering**:
  ```tsx
  {/* USER JOURNEY STEPS HERO */}
  <div style={{
    background: '#FFFFFF',
    border: '1px solid rgba(0, 170, 19, 0.2)',
    borderRadius: '14px',
    padding: '18px 24px',
    marginBottom: '24px',
    boxShadow: '0 6px 20px rgba(0, 170, 19, 0.08)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <BirdBadge size={46} />
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#00AA13', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            DAILY STUDENT FLOW
          </div>
          <h3 style={{ margin: 0, fontSize: '17px', color: '#16261E' }}>
            1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight
          </h3>
        </div>
      </div>
      ...
  ```
- **Visual Elements**:
  - Container card: `#FFFFFF` background, chamfered/rounded `14px`, Gojek-green border `rgba(0, 170, 19, 0.2)`, soft shadow.
  - Left branding: Branded vector mascot `<BirdBadge size={46} />` (green bird with flapping wing and GoPay chest emblem).
  - Headline: Uppercase kicker `DAILY STUDENT FLOW` + bold journey title: `1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight`.
  - Right container: Seamlessly co-locates the 1-click quick-log chips right inside the banner.

---

### 1.3 1-Click Quick-Log Chips & State Updates
- **Location**: `app/runway-app.tsx:615–642`.
- **Chips Rendered**:
  ```tsx
  <button type="button" className="radar-filter-btn active" onClick={() => handleQuickLog('Kantin Lunch', 15000)}>
    🍲 Lunch (Rp 15k)
  </button>
  <button type="button" className="radar-filter-btn" onClick={() => handleQuickLog('Bikun/KRL Transit', 8000)}>
    🚆 Transit (Rp 8k)
  </button>
  <button type="button" className="radar-filter-btn" onClick={() => handleQuickLog('Campus Coffee', 10000)}>
    ☕ Coffee (Rp 10k)
  </button>
  <Button size="sm" className="primary" onClick={() => show('daily')}>
    <Plus size={14} /> Custom
  </Button>
  ```
- **Click Flow & Update Mechanics**:
  1. User clicks chip -> `handleQuickLog(title, amount)` triggers `mutate({ type: 'daily', title, amount })`.
  2. `mutate()` sends HTTP `POST /api/state` with headers `X-Runway-Request: 1` and a unique `requestId` (`crypto.randomUUID()`).
  3. `app/api/state/route.ts` invokes `apply(state, command)` in `lib/runway.ts:69`:
     - Appends entry `{ id, kind: 'daily', amount, date: today(), note: title }` to `state.ledger`.
     - Appends `{ at: ISOString, action: 'daily' }` to `state.history`.
     - Validates balance invariant `0 <= balance <= 100,000,000`.
     - Increments `version` and writes to Cloudflare D1 database.
  4. Balance Impact:
     - `balance(s)` (`lib/runway.ts:20`) subtracts `daily` kind expenses from `initial + income`. Thus, balance immediately decrements by Rp 15,000 / Rp 8,000 / Rp 10,000.
  5. Daily Budget & Safe Limit Impact:
     - `forecast(s, date)` (`lib/runway.ts:21–37`) calculates `spentToday = sum of daily entries for today`.
     - `allowance = Math.max(0, Math.floor((cash + spentToday - mandatory - optional - b.buffer) / horizon) - spentToday)`.
     - As `spentToday` increases by the chip amount, `safe` (Daily Safe-to-Spend limit) is reduced dollar-for-dollar.
  6. Transaction History Impact:
     - Client state `setData(d)` triggers re-render.
     - Tab 5 ("GoPay Sync & History") displays the newly logged entry at the top of the Activity Log (`s.ledger.slice(-5).reverse()`).
     - User feedback notice triggers: `"Logged Kantin Lunch (Rp 15,000). Safe daily limit updated!"`.

---

### 1.4 Build & Lint Configuration
- **Package Manifest** (`package.json`):
  - Framework: `vinext` (v1.0.0-beta.9), React 19.2.8, `@cloudflare/vite-plugin`, `@openai/sites-vite-plugin`.
  - Node engine: `>= 22.13.0` (active environment: Node v24.19.0).
  - Scripts defined:
    - `"dev": "vinext dev"`
    - `"build": "vinext build"`
    - `"start": "wrangler dev --config dist/server/wrangler.json"`
    - `"lint": "oxlint app lib db tests"`
    - `"format": "oxfmt"`
    - `"db:generate": "drizzle-kit generate"`
  - Note: No `"test"` script is defined in `package.json`.
- **Lint Configuration** (`.oxlintrc.json`):
  - Configures 8 plugins: `eslint`, `typescript`, `unicorn`, `oxc`, `react`, `import`, `jsx-a11y`, `nextjs`.
  - Category `correctness: error`, `typeAware: true`, `typeCheck: true`.
  - Execution test: `npm run lint` executes `oxlint app lib db tests`.
    - Result: `Found 0 warnings and 0 errors. Finished in 858ms on 15 files with 208 rules using 16 threads.`
    - Exactly 15 files checked across `app/`, `lib/`, `db/`, `tests/`.
- **Build Configuration** (`vite.config.ts`, `next.config.ts`):
  - Execution test: `npm run build` executes `vinext build`.
    - Result: Exited with code 0. Transforms client, server, RSC, and SSR environments; generates `dist/client` and `dist/server`.
- **Live HTTP Status**:
  - `GET http://localhost:3000/` tested via `Invoke-WebRequest`: Returns `HTTP 200 OK`.
  - `GET http://localhost:3000/api/state` tested via `Invoke-RestMethod`: Returns `HTTP 200 OK` with JSON state payload.

---

### 1.5 Test Infrastructure & E2E Testing Needs
- **Existing Tests**:
  - Location: `tests/runway.test.ts` (26 lines).
  - Tooling: Native Node `node:assert/strict`.
  - Scope: Verifies 15 core domain rules in `lib/runway.ts` (initial forecast, saving on bills, bill payment, duplicate payment protection, pending income receipt, expense refund caps, transfer balance neutrality, deferrals, daily health checks, and boundary guards).
  - Execution test: Ran `npx tsx tests/runway.test.ts`.
    - Result: Exited with code 0: `"15 aturan inti lolos."`.
- **Gaps Identified for Comprehensive E2E Testing**:
  1. No browser automation runner (e.g. Playwright / Puppeteer) is installed in `devDependencies`.
  2. No E2E integration test currently simulates end-to-end user navigation:
     - Switching between Landing Page and Cockpit (`app/page.tsx`).
     - Clicking the 3-step banner chips and validating that the balance card and safe limit visually update.
     - Switching across all 5 tabs and validating that each tab's content renders without crashing.
     - Testing API routes (`/api/state` GET and POST, `/api/export`).

---

## 2. Logic Chain

1. **UX Architecture (R3)**:
   - *Premise*: User requires a streamlined student journey with a 3-step banner, 1-click quick-log chips, and 5 clean tabs with zero dummy-data dependency.
   - *Evidence*: Observations in Section 1.1–1.3 show that `runway-app.tsx` explicitly mounts the 5 tabs (`summary`, `levers`, `radar`, `plans`, `ecosystem`), the 3-step banner with `<BirdBadge />`, and the 3 quick-log chips (Lunch Rp 15k, Transit Rp 8k, Coffee Rp 10k).
   - *Inference*: The architecture satisfies R3. The quick-log chips are directly hooked to optimistic mutations against `/api/state`, immediately subtracting from `balance(s)` and adjusting `forecast.safe` without relying on mock client state.

2. **Build & Lint Integrity**:
   - *Premise*: Acceptance criteria requires `npm run lint` to pass with 0 warnings and 0 errors across all 15 files, `npm run build` to cleanly generate production assets, and `GET http://localhost:3000/` to serve HTTP 200 OK.
   - *Evidence*: CLI execution of `npm run lint` completed with code 0 on exactly 15 files. CLI execution of `npm run build` completed with code 0 producing `dist/`. HTTP request to `http://localhost:3000/` returned `HTTP 200 OK`.
   - *Inference*: The project build and lint infrastructure is fully stable and compliant with the baseline acceptance criteria.

3. **Test Infrastructure & E2E Strategy**:
   - *Premise*: E2E testing must verify the application as an opaque box from the user's perspective.
   - *Evidence*: Only unit testing exists (`tests/runway.test.ts`). There is no `"test"` script in `package.json` and no browser or HTTP E2E suite.
   - *Inference*: To establish opaque-box E2E testing, the team should either:
     - (A) Introduce a zero-dependency HTTP + DOM E2E runner via `tsx` testing endpoints and responses against the live server.
     - (B) Install Playwright (`@playwright/test`) for full headless browser verification across desktop and mobile viewports.

---

## 3. Caveats

1. **Cloudflare D1 Environment**:
   In local dev (`vinext dev`), Cloudflare D1 state is managed locally in `.wrangler/state/v3/d1`. If Miniflare is not initialized or bindings are missing in other environments, `lib/database.ts` automatically falls back to an in-memory / file-based `LocalD1Database`. Both layers behave identically from the API perspective.
2. **Landing Page vs. Cockpit Scope**:
   The cycling telemetry tags in `targo-landing.tsx` (`safes`, `days`, `saveds`) are decorative marketing visualizers. They do not feed into the financial cockpit.
3. **No Code Modifications Made**:
   In adherence to the explorer role, no source code, config files, or tests were created or modified outside of `.agents/survey_explorer_3/`.

---

## 4. Conclusion

1. **5 Core Tabs**: The app features 5 fully functional tabs (`summary`, `levers`, `radar`, `plans`, `ecosystem`) with zero dummy data dependency in the financial logic. All financial views are dynamically derived from Cloudflare D1 persistence and `lib/runway.ts` math.
2. **3-Step Banner**: Rendered cleanly above the tab list with `<BirdBadge size={46} />`, displaying `1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight` and co-locating the quick-log chips.
3. **1-Click Quick-Log Chips**: Lunch (Rp 15k), Transit (Rp 8k), and Coffee (Rp 10k) chips correctly trigger `handleQuickLog`, appending `daily` entries to `s.ledger`, decreasing balance, recalculating `forecast.safe`, and updating the Activity Log in Tab 5.
4. **Build & Lint**: `npm run lint` passes with 0 warnings and 0 errors across 15 files; `npm run build` succeeds cleanly; `GET http://localhost:3000/` serves HTTP 200.
5. **Testing**: Domain logic is covered by `tests/runway.test.ts` (15 rules passing). E2E opaque-box testing can be added via an E2E test script or Playwright suite.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Lint (0 warnings, 0 errors, 15 files)**:
   ```bash
   npm run lint
   ```
   *Expected*: `Found 0 warnings and 0 errors. Finished in <1s on 15 files with 208 rules...`

2. **Verify Production Build**:
   ```bash
   npm run build
   ```
   *Expected*: Exits with code 0; renders chunks for RSC, SSR, and client.

3. **Verify Existing Domain Unit Tests**:
   ```bash
   npx tsx tests/runway.test.ts
   ```
   *Expected*: Output prints `15 aturan inti lolos.` with exit code 0.

4. **Verify HTTP Server Response**:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/" -Method Head
   ```
   *Expected*: `StatusCode : 200`, `StatusDescription : OK`.

5. **Verify Live State API Payload**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/state" -Method Get
   ```
   *Expected*: Returns JSON with `state.budget`, `state.plans`, `state.ledger`, and `forecast.safe`.
