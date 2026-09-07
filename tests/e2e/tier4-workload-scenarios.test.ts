import assert from 'node:assert/strict';
import {
  BASE_URL,
  StudentTestSession,
  defineTest,
  type StatePayload,
} from './harness';
import { balance, plus, today } from '@/lib/runway';

/* ==========================================================================
   TIER 4: REAL-WORLD STUDENT WORKLOAD SCENARIOS
   Realistic end-to-end user journeys simulating monthly allowance cycles:
   - Scenario 1: Monthly Student Allowance Onboarding & Fixed Bill Settlement
   - Scenario 2: Typical 7-Day Campus Week (Lunches, Transit, Coffee)
   - Scenario 3: Mid-Month Financial Crunch & Multi-Lever Recovery
   - Scenario 4: Academic Gig Worker Tutoring Inflow & Savings Buffer Growth
   - Scenario 5: End-of-Period Financial Audit & Full Data Export
   ========================================================================== */

defineTest(
  'Tier 4',
  'Real-World Workload Scenarios',
  'T4-SCN-1',
  'Scenario 1: Monthly Allowance Onboarding & Settlement — student sets budget, settles Kos and WiFi, keeps buffer safe',
  async () => {
    const session = new StudentTestSession('t4_scn1_onboarding');
    const d = today();

    // 1. Initial State Check
    const initial = await session.getState();
    assert.ok(initial.state.budget);

    // 2. Nara establishes a fresh 30-day runway
    const budgetRes = await session.postCommand({
      type: 'budget',
      balance: 900000, // Rp 900,000 initial pocket money
      next: plus(d, 30),
      daily: 25000,
      essentialDaily: 15000,
      buffer: 100000, // Rp 100,000 emergency buffer
      complete: true,
      consent: true,
    });
    assert.equal(budgetRes.status, 200);

    // 3. Settle Kos Rent (Rp 600,000)
    const kos = initial.state.plans.find((p) => p.id === 'p-kos')!;
    const payKosRes = await session.postCommand({
      type: 'pay',
      id: kos.id,
      amount: 600000,
    });
    assert.equal(payKosRes.status, 200);

    // 4. Settle Campus WiFi (Rp 75,000)
    const wifi = initial.state.plans.find((p) => p.id === 'p-wifi')!;
    const payWifiRes = await session.postCommand({
      type: 'pay',
      id: wifi.id,
      amount: 75000,
    });
    assert.equal(payWifiRes.status, 200);

    // 5. Verification
    const finalState = await session.getState();
    assert.equal(finalState.forecast!.mandatory, 0, 'Mandatory bills must be 0 after paying Kos & WiFi');
    assert.equal(finalState.state.budget!.buffer, 100000, 'Emergency buffer remains 100k untouched');

    // Balance calculation: 850,000 initial (preserved) - 15,000 seeded lunch - 600,000 kos - 75,000 wifi = 160,000
    assert.equal(balance(finalState.state), 160000, 'Remaining cash must equal 160,000');
  }
);

defineTest(
  'Tier 4',
  'Real-World Workload Scenarios',
  'T4-SCN-2',
  'Scenario 2: Typical 7-Day Campus Week — daily canteen lunches, Bikun/KRL transit, coffee, and daily health check',
  async () => {
    const session = new StudentTestSession('t4_scn2_week');
    await session.getState();

    // Routine transactions for the week
    const weeklyTransactions = [
      { amount: 15000, title: 'Kantin Lunch - Mon' },
      { amount: 8000, title: 'Bikun/KRL Transit - Mon' },
      { amount: 15000, title: 'Kantin Lunch - Tue' },
      { amount: 10000, title: 'Campus Coffee - Tue' },
      { amount: 8000, title: 'Bikun/KRL Transit - Wed' },
      { amount: 5000, title: 'Photocopy Lecture Handout - Wed' },
      { amount: 15000, title: 'Kantin Lunch - Thu' },
      { amount: 10000, title: 'Campus Coffee - Thu' },
      { amount: 25000, title: 'Friday Org Celebration Meal' },
      { amount: 8000, title: 'Bikun/KRL Transit - Fri' },
      { amount: 12000, title: 'UI Library Snack - Sat' },
    ];

    let totalSpent = 0;
    for (const tx of weeklyTransactions) {
      totalSpent += tx.amount;
      const res = await session.postCommand({
        type: 'daily',
        amount: tx.amount,
        title: tx.title,
      });
      assert.equal(res.status, 200);
    }

    // Sunday daily check
    const checkRes = await session.postCommand({
      type: 'check',
      met: true,
      emergency: false,
    });
    assert.equal(checkRes.status, 200);

    const finalState = await session.getState();
    assert.equal(finalState.state.checks.length, 1);
    assert.equal(finalState.state.checks[0].met, true);

    // Seeded lunch was 15,000, plus totalSpent
    const allDailySpentToday = finalState.state.ledger
      .filter((e) => e.kind === 'daily' && e.date === today())
      .reduce((sum, e) => sum + e.amount, 0);

    assert.equal(allDailySpentToday, 15000 + totalSpent, 'All weekly transactions accounted for');
  }
);

defineTest(
  'Tier 4',
  'Real-World Workload Scenarios',
  'T4-SCN-3',
  'Scenario 3: Mid-Month Financial Crunch & Multi-Lever Recovery — unexpected expense mitigated by Lever 1 and Lever 2',
  async () => {
    const session = new StudentTestSession('t4_scn3_crunch');
    const initial = await session.getState();

    // 1. Sudden emergency expense: replacement lab goggles & textbooks (Rp 50,000)
    const expenseRes = await session.postCommand({
      type: 'expense',
      amount: 50000,
      title: 'Lab Course Textbooks & Materials',
    });
    assert.equal(expenseRes.status, 200);

    // 2. Activate Lever 1: Find cheaper alternative for WiFi plan (save Rp 30,000)
    const wifi = initial.state.plans.find((p) => p.id === 'p-wifi')!;
    const lever1Res = await session.postCommand({
      type: 'save',
      id: wifi.id,
      amount: 45000, // Reduced from 75,000
    });
    assert.equal(lever1Res.status, 200);

    // 3. Activate Lever 2: Defer optional weekend hangout (Rp 55,000) to next month
    const hangout = initial.state.plans.find((p) => p.id === 'p-hangout')!;
    const nextAllowance = initial.state.budget!.next;
    const lever2Res = await session.postCommand({
      type: 'defer',
      id: hangout.id,
      due: plus(nextAllowance, 5),
    });
    assert.equal(lever2Res.status, 200);

    // 4. Verify recovery
    const recovered = await session.getState();
    assert.equal(recovered.forecast!.optional, 0, 'Optional commitments deferred to next period');
    assert.equal(recovered.forecast!.mandatory, 645000, 'Kos (600k) + Discounted WiFi (45k) = 645k');
  }
);

defineTest(
  'Tier 4',
  'Real-World Workload Scenarios',
  'T4-SCN-4',
  'Scenario 4: Academic Gig Worker — student receives TA honorarium, allocates to emergency buffer, strengthens runway',
  async () => {
    const session = new StudentTestSession('t4_scn4_gig');
    const initial = await session.getState();
    const initialCash = balance(initial.state);

    // 1. Confirm receipt of Teaching Assistant Honorarium (Rp 200,000)
    const gig = initial.state.incomes.find((i) => i.id === 'inc-asdos')!;
    const receiveRes = await session.postCommand({
      type: 'receive',
      id: gig.id,
      amount: gig.amount,
    });
    assert.equal(receiveRes.status, 200);

    // Cash increases by Rp 200,000
    const stateAfterGig = await session.getState();
    assert.equal(balance(stateAfterGig.state), initialCash + 200000);

    // 2. Student decides to strengthen resilience: increases emergency buffer from 100k to 180k
    const b = stateAfterGig.state.budget!;
    const bufferRes = await session.postCommand({
      type: 'budget',
      balance: balance(stateAfterGig.state),
      next: b.next,
      daily: b.daily,
      essentialDaily: b.essentialDaily,
      buffer: 180000, // Elevated buffer protection
      complete: true,
      consent: true,
    });
    assert.equal(bufferRes.status, 200);

    const final = await session.getState();
    assert.equal(final.state.budget!.buffer, 180000, 'Buffer increased to 180k');
    assert.equal(final.forecast!.pending, 0, 'No remaining waiting incomes');
  }
);

defineTest(
  'Tier 4',
  'Real-World Workload Scenarios',
  'T4-SCN-5',
  'Scenario 5: End-of-Period Financial Audit & Full Data Export — reviews ledger and exports campus-runway-v1 data package',
  async () => {
    const session = new StudentTestSession('t4_scn5_audit');

    // Perform a realistic sequence of actions
    await session.getState();
    await session.postCommand({ type: 'daily', amount: 15000, title: 'Final Lunch' });
    await session.postCommand({ type: 'daily', amount: 8000, title: 'Final Transit' });

    // Export student records via /api/export
    const exportData = await session.exportData();

    // Verify export metadata and payload structure
    assert.equal(exportData.format, 'campus-runway-v1', 'Export format must be campus-runway-v1');
    assert.ok(exportData.exportedAt, 'Export must include ISO exportedAt timestamp');
    assert.ok(new Date(exportData.exportedAt).getTime() > 0, 'Timestamp must be valid date');

    // Verify data completeness
    assert.ok(exportData.state, 'Export must include complete state');
    assert.ok(exportData.state.budget, 'Export state must include budget');
    assert.ok(Array.isArray(exportData.state.plans), 'Export state must include plans');
    assert.ok(Array.isArray(exportData.state.ledger), 'Export state must include ledger');
    assert.ok(Array.isArray(exportData.state.history), 'Export state must include history');
    assert.ok(exportData.forecast, 'Export must include calculated forecast');

    // Verify fidelity: exported state matches active default student state
    const defaultStateRes = await fetch(`${BASE_URL}/api/state`);
    const defaultState = (await defaultStateRes.json()) as StatePayload;
    assert.equal(
      exportData.state.ledger.length,
      defaultState.state.ledger.length,
      'Exported ledger must match active default student state ledger'
    );
  }
);
