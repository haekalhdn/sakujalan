import assert from 'node:assert/strict';
import {
  StudentTestSession,
  defineTest,
  readProjectCss,
} from './harness';
import { apply, balance, day, empty, forecast, plus, today, type State } from '@/lib/runway';

/* ==========================================================================
   TIER 2: BOUNDARY & CORNER CASES
   - Dimension 1: Zero & Negative Limits (5 tests)
   - Dimension 2: Dates & Horizons (5 tests)
   - Dimension 3: Extreme Expenses & Boundary Amounts (5 tests)
   - Dimension 4: Idempotency & Duplicate Prevention (5 tests)
   - Dimension 5: Rapid Transactions & Concurrency (5 tests)
   - Dimension 6: Viewport & Layout Constraints (5 tests)
   ========================================================================== */

/* --------------------------------------------------------------------------
   Dimension 1: Zero & Negative Limits
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 2',
  'Zero & Negative Limits',
  'T2-ZRO-1',
  'Safe limit reaches exact Rp 0 when mandatory expenses consume all available cash minus buffer',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 500000,
        daily: 30000,
        essentialDaily: 15000,
        buffer: 100000,
        complete: true,
      },
      plans: [
        { id: 'p1', title: 'Kos', amount: 400000, original: 400000, due: plus(d, 5), essential: true, paid: false },
      ],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    // Cash (500k) - mandatory (400k) - buffer (100k) = 0 free cash
    const f = forecast(state, d);
    assert.ok(f);
    assert.equal(f.safe, 0, 'Safe limit must be exactly 0 when free cash is 0');
  }
);

defineTest(
  'Tier 2',
  'Zero & Negative Limits',
  'T2-ZRO-2',
  'Zero buffer configuration computes safe limit cleanly without division-by-zero or negative offsets',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 500000,
        daily: 30000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    const f = forecast(state, d);
    assert.ok(f);
    assert.equal(f.safe, 50000, '500,000 / 10 = 50,000');
    assert.equal(f.reserveGap, 0, 'Reserve gap is 0 when buffer is 0');
  }
);

defineTest(
  'Tier 2',
  'Zero & Negative Limits',
  'T2-ZRO-3',
  'Negative balance mutation is strictly prohibited and throws validation error',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 50000,
        daily: 20000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    // Attempt to log expense of 60,000 when balance is 50,000
    assert.throws(
      () => apply(state, { type: 'expense', amount: 60000, title: 'Too expensive' }, d),
      /Resulting balance must be between Rp 0 and Rp 100,000,000/
    );
  }
);

defineTest(
  'Tier 2',
  'Zero & Negative Limits',
  'T2-ZRO-4',
  'Negative initial balance is rejected during budget creation',
  () => {
    const d = today();
    assert.throws(
      () =>
        apply(
          empty(),
          {
            type: 'budget',
            balance: -5000,
            next: plus(d, 15),
            daily: 25000,
            essentialDaily: 10000,
            buffer: 0,
            complete: true,
            consent: true,
          },
          d
        ),
      /Amount must be an integer between 0 and Rp 100,000,000/
    );
  }
);

defineTest(
  'Tier 2',
  'Zero & Negative Limits',
  'T2-ZRO-5',
  'Zero amount expense transaction is rejected by domain input guards',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 100000,
        daily: 20000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    assert.throws(
      () => apply(state, { type: 'daily', amount: 0, title: 'Zero coffee' }, d),
      /Amount must be an integer between 0 and Rp 100,000,000/
    );
  }
);

/* --------------------------------------------------------------------------
   Dimension 2: Dates & Horizons
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 2',
  'Dates & Horizons',
  'T2-DAT-1',
  'Single day remaining horizon (next = plus(today, 1)) calculates safe limit for exactly 1 day',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 1),
        initial: 80000,
        daily: 50000,
        essentialDaily: 20000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    const f = forecast(state, d);
    assert.ok(f);
    assert.equal(f.horizon, 1);
    assert.equal(f.safe, 80000);
    assert.equal(f.expired, false);
  }
);

defineTest(
  'Tier 2',
  'Dates & Horizons',
  'T2-DAT-2',
  'Allowance date reached or past (date >= next) marks budget as expired with safe limit = 0',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: plus(d, -15),
        next: d, // Allowance day is today
        initial: 100000,
        daily: 25000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    const f = forecast(state, d);
    assert.ok(f);
    assert.equal(f.expired, true, 'Forecast must report expired = true');
    assert.equal(f.safe, 0, 'Safe limit must be 0 when allowance day arrives');
  }
);

defineTest(
  'Tier 2',
  'Dates & Horizons',
  'T2-DAT-3',
  'Month boundary transition (e.g. Sept 30 to Oct 01) formats and computes days accurately',
  () => {
    const d1 = '2026-09-30';
    const d2 = plus(d1, 1);
    assert.equal(d2, '2026-10-01', 'plus(2026-09-30, 1) must be 2026-10-01');

    const dEndYear = '2026-12-31';
    const dNewYear = plus(dEndYear, 1);
    assert.equal(dNewYear, '2027-01-01', 'plus(2026-12-31, 1) must be 2027-01-01');

    const diff = day('2026-10-01') - day('2026-09-30');
    assert.equal(diff, 1, 'Day diff across month boundary must be exactly 1');
  }
);

defineTest(
  'Tier 2',
  'Dates & Horizons',
  'T2-DAT-4',
  'Horizon exceeding 90 days is rejected when configuring budget runway',
  () => {
    const d = today();
    assert.throws(
      () =>
        apply(
          empty(),
          {
            type: 'budget',
            balance: 500000,
            next: plus(d, 95), // 95 days exceeds 90-day limit
            daily: 20000,
            essentialDaily: 10000,
            buffer: 0,
            complete: true,
            consent: true,
          },
          d
        ),
      /Select next allowance\/inflow date 1–90 days from today/
    );
  }
);

defineTest(
  'Tier 2',
  'Dates & Horizons',
  'T2-DAT-5',
  'Commitment due date beyond 180 days is rejected by plan validation guard',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 30),
        initial: 500000,
        daily: 20000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    assert.throws(
      () =>
        apply(
          state,
          {
            type: 'plan',
            title: 'Distant tuition',
            amount: 200000,
            due: plus(d, 200), // > 180 days
            essential: true,
          },
          d
        ),
      /Commitment due date must be between today and 180 days ahead/
    );
  }
);

/* --------------------------------------------------------------------------
   Dimension 3: Extreme Expenses & Boundary Amounts
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 2',
  'Extreme Expenses & Boundary Amounts',
  'T2-EXT-1',
  'Expense amount exceeding balance is rejected by server API with HTTP 422 error',
  async () => {
    const session = new StudentTestSession('t2_ext1_overspend');
    const { state, version } = await session.getState();
    const currentCash = balance(state);

    const { status, data } = await session.postCommand(
      {
        type: 'expense',
        amount: currentCash + 50000, // Exceeds balance
        title: 'Overspending purchase',
      },
      version
    );

    assert.equal(status, 422, 'Overspending expense must return 422');
    assert.ok('error' in data);
    assert.match((data as { error: string }).error, /Resulting balance must be between/);
  }
);

defineTest(
  'Tier 2',
  'Extreme Expenses & Boundary Amounts',
  'T2-EXT-2',
  'Expense amount equal to exact balance reduces cash to Rp 0 and maintains state validity',
  async () => {
    const session = new StudentTestSession('t2_ext2_exact_zero');
    const { state, version } = await session.getState();
    const currentCash = balance(state);

    const { status, data } = await session.postCommand(
      {
        type: 'expense',
        amount: currentCash,
        title: 'Empty balance',
      },
      version
    );

    assert.equal(status, 200);
    assert.ok('state' in data);
    assert.equal(balance(data.state), 0, 'Balance must be exactly 0');
  }
);

defineTest(
  'Tier 2',
  'Extreme Expenses & Boundary Amounts',
  'T2-EXT-3',
  'Maximum allowable integer amount (Rp 100,000,000) accepted as boundary upper limit',
  () => {
    const d = today();
    const state = apply(
      empty(),
      {
        type: 'budget',
        balance: 100000000, // Rp 100,000,000 max
        next: plus(d, 30),
        daily: 1000000,
        essentialDaily: 500000,
        buffer: 10000000,
        complete: true,
        consent: true,
      },
      d
    );

    assert.equal(balance(state), 100000000, 'Max allowable balance Rp 100M accepted');
  }
);

defineTest(
  'Tier 2',
  'Extreme Expenses & Boundary Amounts',
  'T2-EXT-4',
  'Amount exceeding Rp 100,000,000 is rejected with bounds error',
  () => {
    const d = today();
    assert.throws(
      () =>
        apply(
          empty(),
          {
            type: 'budget',
            balance: 100000001, // Over 100M
            next: plus(d, 30),
            daily: 100000,
            essentialDaily: 50000,
            buffer: 0,
            complete: true,
            consent: true,
          },
          d
        ),
      /Amount must be an integer between 0 and Rp 100,000,000/
    );
  }
);

defineTest(
  'Tier 2',
  'Extreme Expenses & Boundary Amounts',
  'T2-EXT-5',
  'Floating-point / fractional amounts are rejected by safe integer validator',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 100000,
        daily: 20000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    assert.throws(
      () => apply(state, { type: 'daily', amount: 15000.5, title: 'Fractional lunch' }, d),
      /Amount must be an integer between 0 and Rp 100,000,000/
    );
  }
);

/* --------------------------------------------------------------------------
   Dimension 4: Idempotency & Duplicate Prevention
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 2',
  'Idempotency & Duplicate Prevention',
  'T2-IDP-1',
  'Replaying POST with identical requestId and payload returns cached state without duplicate debit',
  async () => {
    const session = new StudentTestSession('t2_idp1_replay');
    const { version } = await session.getState();
    const fixedRequestId = `req-idempotent-test-${Date.now()}`;

    // First request
    const firstRes = await session.postCommand(
      { type: 'daily', amount: 12000, title: 'KRL Return Fare' },
      version,
      fixedRequestId
    );
    assert.equal(firstRes.status, 200);
    assert.ok('state' in firstRes.data);
    const balanceAfterFirst = balance(firstRes.data.state);

    // Replay identical request with identical requestId
    const secondRes = await session.postCommand(
      { type: 'daily', amount: 12000, title: 'KRL Return Fare' },
      version, // Original version
      fixedRequestId
    );
    assert.equal(secondRes.status, 200);
    assert.ok('state' in secondRes.data);
    const balanceAfterSecond = balance(secondRes.data.state);

    assert.equal(
      balanceAfterSecond,
      balanceAfterFirst,
      'Replayed request must not debit cash a second time'
    );
  }
);

defineTest(
  'Tier 2',
  'Idempotency & Duplicate Prevention',
  'T2-IDP-2',
  'Reusing requestId with a different command payload returns HTTP 409 conflict',
  async () => {
    const session = new StudentTestSession('t2_idp2_conflict');
    const { version } = await session.getState();
    const fixedRequestId = `req-conflict-test-${Date.now()}`;

    // First request
    const res1 = await session.postCommand(
      { type: 'daily', amount: 10000, title: 'First Coffee' },
      version,
      fixedRequestId
    );
    assert.equal(res1.status, 200);

    // Second request with SAME requestId but DIFFERENT amount
    const res2 = await session.postCommand(
      { type: 'daily', amount: 20000, title: 'Second Coffee' },
      res1.data && 'version' in res1.data ? res1.data.version : version,
      fixedRequestId
    );

    assert.equal(res2.status, 409, 'Altered payload with reused requestId must return 409');
    assert.ok('error' in res2.data);
    assert.match((res2.data as { error: string }).error, /Request ID already used with different payload/);
  }
);

defineTest(
  'Tier 2',
  'Idempotency & Duplicate Prevention',
  'T2-IDP-3',
  'Double payment of the same fixed bill is rejected by domain logic',
  async () => {
    const session = new StudentTestSession('t2_idp3_doublepay');
    const { state, version } = await session.getState();
    const plan = state.plans[0];
    assert.ok(plan);

    // First payment
    const res1 = await session.postCommand(
      { type: 'pay', id: plan.id, amount: plan.amount },
      version
    );
    assert.equal(res1.status, 200);
    assert.ok('state' in res1.data);
    const v2 = res1.data.version;

    // Second payment on already paid plan
    const res2 = await session.postCommand(
      { type: 'pay', id: plan.id, amount: plan.amount },
      v2
    );
    assert.equal(res2.status, 422);
    assert.ok('error' in res2.data);
    assert.match((res2.data as { error: string }).error, /already paid/);
  }
);

defineTest(
  'Tier 2',
  'Idempotency & Duplicate Prevention',
  'T2-IDP-4',
  'Double receipt of pending income is rejected by domain logic',
  async () => {
    const session = new StudentTestSession('t2_idp4_doublereceipt');
    const { state, version } = await session.getState();
    const income = state.incomes[0];
    assert.ok(income);

    // First receive
    const res1 = await session.postCommand(
      { type: 'receive', id: income.id, amount: income.amount },
      version
    );
    assert.equal(res1.status, 200);
    assert.ok('state' in res1.data);
    const v2 = res1.data.version;

    // Second receive attempt
    const res2 = await session.postCommand(
      { type: 'receive', id: income.id, amount: income.amount },
      v2
    );
    assert.equal(res2.status, 422);
    assert.ok('error' in res2.data);
    assert.match((res2.data as { error: string }).error, /already been confirmed/);
  }
);

defineTest(
  'Tier 2',
  'Idempotency & Duplicate Prevention',
  'T2-IDP-5',
  'Excessive refund exceeding original transaction amount is rejected',
  async () => {
    const session = new StudentTestSession('t2_idp5_refund');
    const { state, version } = await session.getState();
    // Seeded lunch is Rp 15,000
    const lunch = state.ledger.find((e) => e.kind === 'daily' && e.amount === 15000);
    assert.ok(lunch);

    // Attempt to refund Rp 20,000 for a 15,000 expense
    const res = await session.postCommand(
      { type: 'refund', id: lunch.id, amount: 20000 },
      version
    );
    assert.equal(res.status, 422);
    assert.ok('error' in res.data);
    assert.match((res.data as { error: string }).error, /Refund amount exceeds/);
  }
);

/* --------------------------------------------------------------------------
   Dimension 5: Rapid Transactions & Concurrency
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 2',
  'Rapid Transactions & Concurrency',
  'T2-CON-1',
  'Rapid sequential transactions advance state version monotonically',
  async () => {
    const session = new StudentTestSession('t2_con1_versions');
    let { version } = await session.getState();

    for (let i = 1; i <= 3; i++) {
      const res = await session.postCommand(
        { type: 'daily', amount: 5000 * i, title: `Step ${i}` },
        version
      );
      assert.equal(res.status, 200);
      assert.ok('version' in res.data);
      assert.equal(res.data.version, version + 1, `Version must increment by 1 on step ${i}`);
      version = res.data.version;
    }
  }
);

defineTest(
  'Tier 2',
  'Rapid Transactions & Concurrency',
  'T2-CON-2',
  'Outdated version submission returns HTTP 409 conflict error',
  async () => {
    const session = new StudentTestSession('t2_con2_stale');
    const { version } = await session.getState();

    // Perform valid update to advance version to version + 1
    const validRes = await session.postCommand(
      { type: 'daily', amount: 8000, title: 'Valid tx' },
      version
    );
    assert.equal(validRes.status, 200);

    // Attempt another request with the OLD (stale) version
    const staleRes = await session.postCommand(
      { type: 'daily', amount: 8000, title: 'Stale tx' },
      version // Old version
    );

    assert.equal(staleRes.status, 409, 'Stale version must return 409');
    assert.ok('error' in staleRes.data);
    assert.match((staleRes.data as { error: string }).error, /Concurrent change detected/);
  }
);

defineTest(
  'Tier 2',
  'Rapid Transactions & Concurrency',
  'T2-CON-3',
  'Rapid burst of 5 transactions records all 5 ledger entries without data loss',
  async () => {
    const session = new StudentTestSession('t2_con3_burst');
    const initial = await session.getState();
    const initialLedgerCount = initial.state.ledger.length;
    let v = initial.version;

    for (let i = 0; i < 5; i++) {
      const res = await session.postCommand(
        { type: 'daily', amount: 2000 + i * 500, title: `Burst item ${i}` },
        v
      );
      assert.equal(res.status, 200);
      assert.ok('version' in res.data);
      v = res.data.version;
    }

    const finalState = await session.getState();
    assert.equal(
      finalState.state.ledger.length,
      initialLedgerCount + 5,
      'Ledger must have exactly 5 more entries'
    );
  }
);

defineTest(
  'Tier 2',
  'Rapid Transactions & Concurrency',
  'T2-CON-4',
  'Description length boundary: empty string and string > 100 characters are rejected',
  () => {
    const d = today();
    const state: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 100000,
        daily: 20000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    // Empty title
    assert.throws(
      () => apply(state, { type: 'daily', amount: 5000, title: '   ' }, d),
      /Description must be between 1 and 100 characters/
    );

    // Title > 100 characters
    const longTitle = 'a'.repeat(101);
    assert.throws(
      () => apply(state, { type: 'daily', amount: 5000, title: longTitle }, d),
      /Description must be between 1 and 100 characters/
    );
  }
);

defineTest(
  'Tier 2',
  'Rapid Transactions & Concurrency',
  'T2-CON-5',
  'Capacity limits guard protects database from unbounded growth (ledger cap 5000)',
  () => {
    const d = today();
    const fullLedger = Array.from({ length: 5001 }, (_, i) => ({
      id: `tx-${i}`,
      kind: 'daily',
      amount: 1000,
      date: d,
      note: `item ${i}`,
    }));

    const fullState: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 10000000,
        daily: 50000,
        essentialDaily: 20000,
        buffer: 0,
        complete: true,
      },
      plans: [],
      incomes: [],
      ledger: fullLedger,
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    assert.throws(
      () => apply(fullState, { type: 'daily', amount: 1000, title: 'Item 5002' }, d),
      /Record capacity limit reached/
    );
  }
);

/* --------------------------------------------------------------------------
   Dimension 6: Viewport & Layout Constraints
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 2',
  'Viewport & Layout Constraints',
  'T2-CSS-1',
  'Main shell container enforces max-width 1440px and margin auto in globals.css',
  () => {
    const css = readProjectCss();
    assert.ok(css.includes('.shell'), 'globals.css must define .shell class');
    assert.ok(css.includes('max-width: 1440px'), '.shell must specify max-width: 1440px');
    assert.ok(css.includes('margin: auto') || css.includes('margin-left: auto'), '.shell must center horizontally');
  }
);

defineTest(
  'Tier 2',
  'Viewport & Layout Constraints',
  'T2-CSS-2',
  'Responsive shell padding uses fluid clamp(16px, 3.5vw, 56px) for smooth scaling across laptops',
  () => {
    const css = readProjectCss();
    assert.ok(
      css.includes('clamp(16px, 3.5vw, 56px)') || css.includes('clamp(16px,'),
      '.shell must use fluid clamp for horizontal padding'
    );
  }
);

defineTest(
  'Tier 2',
  'Viewport & Layout Constraints',
  'T2-CSS-3',
  'Mobile breakpoint rules (max-width: 767px) ensure responsive wrapping without cramped text',
  () => {
    const css = readProjectCss();
    assert.ok(
      css.includes('@media (max-width: 767px)') || css.includes('@media (max-width: 768px)'),
      'globals.css must contain mobile breakpoint <= 767px'
    );
  }
);

defineTest(
  'Tier 2',
  'Viewport & Layout Constraints',
  'T2-CSS-4',
  'Tablet & laptop card grids use repeat(auto-fit, minmax(...)) to avoid empty gaps',
  () => {
    const css = readProjectCss();
    assert.ok(
      css.includes('repeat(auto-fit, minmax('),
      'Card grids must use auto-fit minmax for responsive multi-column flow'
    );
  }
);

defineTest(
  'Tier 2',
  'Viewport & Layout Constraints',
  'T2-CSS-5',
  'Zero horizontal overflow contract enforced by box-sizing border-box and containment',
  () => {
    const css = readProjectCss();
    assert.ok(
      css.includes('box-sizing: border-box') || css.includes('overflow-x: clip') || css.includes('overflow-x: hidden'),
      'CSS must enforce zero horizontal overflow'
    );
  }
);
