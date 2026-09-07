import assert from 'node:assert/strict';
import {
  StudentTestSession,
  defineTest,
} from './harness';
import { balance, plus, today } from '@/lib/runway';

/* ==========================================================================
   TIER 3: CROSS-FEATURE INTERACTIONS
   Pairwise combinations between core subsystems:
   - Interaction 1: Quick-log chip + What-If simulator baseline
   - Interaction 2: Quick-log chip + Tab 5 Activity Log chronological sync
   - Interaction 3: Lever 1 (GoFood Deals) + Safe Limit improvement
   - Interaction 4: Lever 2 (Deferral Vault) + Commitment Clearance & Safe Boost
   - Interaction 5: Lever 3 (Campus Gig) + Cash Balance & Surplus Expansion
   - Interaction 6: Fixed Bill Payment + Mandatory Clearance & Ledger Sync
   - Interaction 7: Emergency Buffer Tuning + Daily Safe Limit Dynamic Scaling
   - Interaction 8: QRIS Webhook Simulation + Radar Fast-Log Sync
   ========================================================================== */

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-1',
  'Quick-log chip + What-If simulator: logging expense increments spentToday and shifts simulator baseline',
  async () => {
    const session = new StudentTestSession('t3_int1_whatif');
    const initial = await session.getState();
    const initialSpentToday = initial.forecast?.spentToday ?? 0;

    // Log canteen lunch
    const { data } = await session.postCommand({
      type: 'daily',
      amount: 15000,
      title: 'Kantin Lunch',
    });

    assert.ok('forecast' in data);
    const updatedSpentToday = data.forecast?.spentToday ?? 0;
    assert.equal(
      updatedSpentToday,
      initialSpentToday + 15000,
      'What-if simulator baseline must reflect new spentToday amount'
    );
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-2',
  'Quick-log chip + Tab 5 Activity Log: new quick-log chip immediately appears at top of reverse ledger',
  async () => {
    const session = new StudentTestSession('t3_int2_tab5_sync');
    await session.getState();

    // Log transit chip
    const { data } = await session.postCommand({
      type: 'daily',
      amount: 8000,
      title: 'Bikun/KRL Transit',
    });

    assert.ok('state' in data);
    const reversedActivityLog = data.state.ledger.slice(-5).reverse();
    assert.ok(reversedActivityLog.length > 0);
    assert.equal(
      reversedActivityLog[0].note,
      'Bikun/KRL Transit',
      'Latest quick-log transaction must appear at top (index 0) of activity log'
    );
    assert.equal(reversedActivityLog[0].amount, 8000);
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-3',
  'Lever 1 (GoFood Deals) + Safe Limit: picking cheaper alternative reduces bill and unlocks safe runway',
  async () => {
    const session = new StudentTestSession('t3_int3_lever1');
    const initial = await session.getState();
    const wifiPlan = initial.state.plans.find((p) => p.id === 'p-wifi');
    assert.ok(wifiPlan);
    assert.equal(wifiPlan.amount, 75000);

    // Apply cheaper alternative (Rp 45,000 student package deal)
    const { data } = await session.postCommand({
      type: 'save',
      id: wifiPlan.id,
      amount: 45000,
    });

    assert.ok('state' in data);
    const updatedWifi = data.state.plans.find((p) => p.id === 'p-wifi');
    assert.ok(updatedWifi);
    assert.equal(updatedWifi.amount, 45000, 'Plan amount must drop to 45,000');
    assert.equal(updatedWifi.original, 75000, 'Original amount must be preserved for undo');

    // Verify safe limit or mandatory commitment improved
    assert.ok('forecast' in data);
    assert.equal(
      initial.forecast!.mandatory - data.forecast!.mandatory,
      30000,
      'Mandatory obligations must decrease by exact savings amount (Rp 30,000)'
    );
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-4',
  'Lever 2 (Deferral Vault) + Commitment Clearance: deferring optional plan past allowance date unlocks daily cash',
  async () => {
    const session = new StudentTestSession('t3_int4_lever2_defer');
    const initial = await session.getState();
    const hangout = initial.state.plans.find((p) => p.id === 'p-hangout');
    assert.ok(hangout);
    assert.equal(hangout.essential, false, 'Hangout must be optional');

    // Defer hangout past next allowance date
    const nextAllowance = initial.state.budget!.next;
    const newDueDate = plus(nextAllowance, 2);

    const { data } = await session.postCommand({
      type: 'defer',
      id: hangout.id,
      due: newDueDate,
    });

    assert.ok('state' in data);
    assert.ok('forecast' in data);
    const updatedHangout = data.state.plans.find((p) => p.id === 'p-hangout');
    assert.ok(updatedHangout);
    assert.equal(updatedHangout.due, newDueDate);
    assert.equal(updatedHangout.deferredFrom, hangout.due);

    // Because newDueDate >= budget.next, it is no longer in current period active commitments!
    assert.equal(
      data.forecast!.optional,
      0,
      'Optional commitments in active horizon must drop to 0 after deferral'
    );
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-5',
  'Lever 3 (Campus Gig) + Cash Balance: confirming TA honorarium increases cash and expands semester surplus',
  async () => {
    const session = new StudentTestSession('t3_int5_lever3_gig');
    const initial = await session.getState();
    const income = initial.state.incomes.find((i) => i.id === 'inc-asdos');
    assert.ok(income);
    assert.equal(income.status, 'waiting');
    const initialCash = balance(initial.state);

    // Confirm honorarium receipt (+Rp 200,000)
    const { data } = await session.postCommand({
      type: 'receive',
      id: income.id,
      amount: 200000,
    });

    assert.ok('state' in data);
    const updatedIncome = data.state.incomes.find((i) => i.id === 'inc-asdos');
    assert.ok(updatedIncome);
    assert.equal(updatedIncome.status, 'received');

    const updatedCash = balance(data.state);
    assert.equal(updatedCash - initialCash, 200000, 'Cash must increase by Rp 200,000');

    // Pending income count should now be 0
    assert.ok('forecast' in data);
    assert.equal(data.forecast!.pending, 0, 'No pending income remains');
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-6',
  'Fixed Bill Settlement + Mandatory Clearance: paying Kos rent clears mandatory commitment and updates ledger',
  async () => {
    const session = new StudentTestSession('t3_int6_pay_kos');
    const initial = await session.getState();
    const kos = initial.state.plans.find((p) => p.id === 'p-kos');
    assert.ok(kos);
    assert.equal(initial.forecast!.mandatory, 675000); // Kos (600k) + WiFi (75k)

    // Pay Kos rent (Rp 600,000)
    const { data } = await session.postCommand({
      type: 'pay',
      id: kos.id,
      amount: 600000,
    });

    assert.ok('state' in data);
    const paidKos = data.state.plans.find((p) => p.id === 'p-kos');
    assert.ok(paidKos);
    assert.equal(paidKos.paid, true, 'Kos rent must be marked paid');

    // Mandatory commitments remaining must now be only WiFi (75,000)
    assert.ok('forecast' in data);
    assert.equal(data.forecast!.mandatory, 75000, 'Mandatory bills must drop by 600k');

    // Payment must appear in ledger
    const paymentEntry = data.state.ledger.find(
      (e) => e.kind === 'payment' && e.planId === kos.id
    );
    assert.ok(paymentEntry, 'Payment entry must be recorded in ledger');
    assert.equal(paymentEntry.amount, 600000);
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-7',
  'Emergency Buffer Tuning + Safe Limit: reducing buffer from 100k to 50k dynamically unlocks daily allowance',
  async () => {
    const session = new StudentTestSession('t3_int7_buffer_tune');
    const initial = await session.getState();
    assert.equal(initial.state.budget!.buffer, 100000);

    // Reconfigure budget buffer to Rp 50,000
    const b = initial.state.budget!;
    const { data } = await session.postCommand({
      type: 'budget',
      balance: balance(initial.state),
      next: b.next,
      daily: b.daily,
      essentialDaily: b.essentialDaily,
      buffer: 50000,
      complete: true,
      consent: true,
    });

    assert.ok('state' in data);
    assert.equal(data.state.budget!.buffer, 50000);
    assert.ok('forecast' in data);
    assert.ok(data.forecast!.safe >= initial.forecast!.safe, 'Safe limit must increase or stay stable');
  }
);

defineTest(
  'Tier 3',
  'Cross-Feature Interactions',
  'T3-INT-8',
  'QRIS Webhook Simulation + Radar Fast-Log: simulated QRIS payment decrements cash and syncs immediately',
  async () => {
    const session = new StudentTestSession('t3_int8_qris_sim');
    const initial = await session.getState();
    const initialCash = balance(initial.state);

    // Simulate QRIS payment (e.g. Rp 16,000 campus merchant transaction)
    const { data } = await session.postCommand({
      type: 'daily',
      amount: 16000,
      title: 'GoPay QRIS: Kantin Sastra UI',
    });

    assert.ok('state' in data);
    const updatedCash = balance(data.state);
    assert.equal(initialCash - updatedCash, 16000, 'Cash must decrement by Rp 16,000');

    const lastEntry = data.state.ledger.at(-1);
    assert.ok(lastEntry);
    assert.equal(lastEntry.note, 'GoPay QRIS: Kantin Sastra UI');
    assert.equal(lastEntry.amount, 16000);
    assert.equal(lastEntry.date, today());
  }
);
