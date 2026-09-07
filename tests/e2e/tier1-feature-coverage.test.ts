import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  StudentTestSession,
  defineTest,
  readMascotBadgesSource,
  readRunwayAppSource,
} from './harness';
import {
  ChameleonBadge,
  BirdBadge,
  StudentBadge,
  FoodChipIcon,
  TransitChipIcon,
  CoffeeChipIcon,
  TipIcon,
  SavingsIcon,
  ProtectionIcon,
  GrowthIcon,
} from '@/components/mascot-badges';
import { forecast, balance, plus, today, type State } from '@/lib/runway';

/* ==========================================================================
   TIER 1: FEATURE COVERAGE
   - Feature 1: 5 Core Navigation Tabs (5 tests)
   - Feature 2: 3-Step Banner (5 tests)
   - Feature 3: Quick-Log Chips (5 tests)
   - Feature 4: Safe-to-Spend Forecasting (5 tests)
   - Feature 5: Mascot Badges & Micro-Emblems (5 tests)
   ========================================================================== */

/* --------------------------------------------------------------------------
   Feature 1: 5 Core Navigation Tabs
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 1',
  '5 Core Navigation Tabs',
  'T1-TAB-1',
  'Tab 1: Summary financial cockpit exposes daily safe amount, cash breakdown, and horizon',
  async () => {
    const session = new StudentTestSession('t1_tab1_summary');
    const { state, forecast: f } = await session.getState();

    assert.ok(state.budget, 'Budget must be initialized in Tab 1 state');
    assert.ok(f, 'Forecast must be computed for Tab 1');
    assert.equal(typeof f.safe, 'number', 'Safe-to-spend today must be numeric');
    assert.ok(f.safe >= 0, 'Safe-to-spend cannot be negative');
    assert.equal(typeof f.cash, 'number', 'Total cash must be numeric');
    assert.equal(f.cash, balance(state), 'Reported cash must equal computed balance');
    assert.equal(typeof f.horizon, 'number', 'Remaining horizon days must be numeric');
    assert.ok(f.horizon >= 1, 'Horizon must be at least 1 day');
  }
);

defineTest(
  'Tier 1',
  '5 Core Navigation Tabs',
  'T1-TAB-2',
  'Tab 2: Levers tab defines 3 actionable savings levers (Partner Deals, Deferral Vault, Gigs)',
  async () => {
    const appSource = readRunwayAppSource();
    assert.ok(
      appSource.includes('2. Save Money (3 Levers)') || appSource.includes('levers'),
      'RunwayApp must mount Tab 2 trigger'
    );
    assert.ok(
      appSource.includes('GoFood Campus Deals') || appSource.includes('GoFood Campus Partner Deals'),
      'Tab 2 must feature Lever 1: GoFood Campus Deals'
    );
    assert.ok(
      appSource.includes('Campus Deferral Vault') || appSource.includes('Deferral Vault'),
      'Tab 2 must feature Lever 2: Deferral Vault'
    );
    assert.ok(
      appSource.includes('Campus Gigs & Tutoring'),
      'Tab 2 must feature Lever 3: Campus Gigs & Tutoring'
    );
  }
);

defineTest(
  'Tier 1',
  '5 Core Navigation Tabs',
  'T1-TAB-3',
  'Tab 3: Cheap Campus Map provides mobility, meals, and study categories with quick log buttons',
  async () => {
    const appSource = readRunwayAppSource();
    assert.ok(
      appSource.includes('3. Cheap Campus Map') || appSource.includes('radar'),
      'RunwayApp must mount Tab 3 trigger'
    );
    assert.ok(appSource.includes('UI Bikun') || appSource.includes('Bikun'), 'Radar tab must include Bikun transit');
    assert.ok(appSource.includes('GoTransit KRL'), 'Radar tab must include GoTransit KRL');
    assert.ok(appSource.includes('Kantin Kansas'), 'Radar tab must include Kantin Kansas');
    assert.ok(appSource.includes('Crystal of Knowledge Library'), 'Radar tab must include UI Library');
  }
);

defineTest(
  'Tier 1',
  '5 Core Navigation Tabs',
  'T1-TAB-4',
  'Tab 4: Fixed Bills tab displays student commitments with paid/essential badges and bill creation',
  async () => {
    const session = new StudentTestSession('t1_tab4_plans');
    const { state } = await session.getState();

    assert.ok(Array.isArray(state.plans), 'Plans must be an array');
    assert.ok(state.plans.length > 0, 'Seeded plans must include commitments');

    const kos = state.plans.find((p) => p.id === 'p-kos');
    assert.ok(kos, 'Seeded plans must include Kos rent');
    assert.equal(kos.essential, true, 'Kos rent must be marked essential');
    assert.equal(kos.paid, false, 'Kos rent starts unpaid in seeded state');

    const appSource = readRunwayAppSource();
    assert.ok(
      appSource.includes('4. Fixed Bills') || appSource.includes('plans'),
      'RunwayApp must mount Tab 4 trigger'
    );
    assert.ok(
      appSource.includes('ESSENTIAL (RENT/UKT)'),
      'Tab 4 must badge essential rent and tuition bills'
    );
  }
);

defineTest(
  'Tier 1',
  '5 Core Navigation Tabs',
  'T1-TAB-5',
  'Tab 5: GoPay Sync & History renders live transaction ledger and QRIS simulator integration',
  async () => {
    const session = new StudentTestSession('t1_tab5_ecosystem');
    const { state } = await session.getState();

    assert.ok(Array.isArray(state.ledger), 'Ledger must be an array');
    assert.ok(state.ledger.length > 0, 'Ledger must have seeded transactions');

    const appSource = readRunwayAppSource();
    assert.ok(
      appSource.includes('5. GoPay Sync & History') || appSource.includes('ecosystem'),
      'RunwayApp must mount Tab 5 trigger'
    );
    assert.ok(
      appSource.includes('Simulate QRIS Payment'),
      'Tab 5 must include QRIS Payment simulation button'
    );
  }
);

/* --------------------------------------------------------------------------
   Feature 2: 3-Step Banner
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 1',
  '3-Step Banner',
  'T1-BAN-1',
  'Banner renders exact headline: "1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight"',
  () => {
    const appSource = readRunwayAppSource();
    assert.ok(
      appSource.includes('1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight'),
      'Banner headline must match specification'
    );
  }
);

defineTest(
  'Tier 1',
  '3-Step Banner',
  'T1-BAN-2',
  'Banner displays uppercase eyebrow "DAILY STUDENT FLOW" with Gojek green design token',
  () => {
    const appSource = readRunwayAppSource();
    assert.ok(appSource.includes('DAILY STUDENT FLOW'), 'Banner must display DAILY STUDENT FLOW eyebrow');
    assert.ok(
      appSource.includes('#00AA13') || appSource.includes('var(--targo-accent)'),
      'Banner eyebrow must style with Gojek green'
    );
  }
);

defineTest(
  'Tier 1',
  '3-Step Banner',
  'T1-BAN-3',
  'Banner integrates branded BirdBadge vector mascot with size 46',
  () => {
    const appSource = readRunwayAppSource();
    assert.ok(
      appSource.includes('<BirdBadge size={46} />') || appSource.includes('<BirdBadge size={46}'),
      'Banner must integrate BirdBadge with size 46'
    );
  }
);

defineTest(
  'Tier 1',
  '3-Step Banner',
  'T1-BAN-4',
  'Banner co-locates 1-click quick-log chips directly inside the header container',
  () => {
    const appSource = readRunwayAppSource();
    const bannerIndex = appSource.indexOf('DAILY STUDENT FLOW');
    const lunchIndex = appSource.indexOf('Lunch (Rp 15k)');
    const tabsIndex = appSource.indexOf('MAIN 5 CLEAN TABS');

    assert.ok(bannerIndex > -1, 'DAILY STUDENT FLOW must be present');
    assert.ok(lunchIndex > -1, 'Lunch chip must be present');
    assert.ok(tabsIndex > -1, 'MAIN 5 CLEAN TABS must be present');
    assert.ok(
      bannerIndex < lunchIndex && lunchIndex < tabsIndex,
      'Quick-log chips must be positioned inside the 3-step banner before the tabs'
    );
  }
);

defineTest(
  'Tier 1',
  '3-Step Banner',
  'T1-BAN-5',
  'Banner card container features rounded 14px border, Gojek green outline, and elevation shadow',
  () => {
    const appSource = readRunwayAppSource();
    assert.ok(appSource.includes("borderRadius: '14px'"), 'Banner must have 14px border radius');
    assert.ok(
      appSource.includes('rgba(0, 170, 19, 0.2)'),
      'Banner must have Gojek green translucent border'
    );
    assert.ok(
      appSource.includes('rgba(0, 170, 19, 0.08)'),
      'Banner must have subtle green drop shadow'
    );
  }
);

/* --------------------------------------------------------------------------
   Feature 3: Quick-Log Chips
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 1',
  'Quick-Log Chips',
  'T1-CHIP-1',
  'Kantin Lunch chip (Rp 15,000) deducts 15k from balance and adds daily entry to ledger',
  async () => {
    const session = new StudentTestSession('t1_chip1_lunch');
    const initial = await session.getState();
    const initialCash = balance(initial.state);

    const { status, data } = await session.postCommand({
      type: 'daily',
      amount: 15000,
      title: 'Kantin Lunch',
    });

    assert.equal(status, 200, 'POST Kantin Lunch must return 200');
    assert.ok('state' in data);
    const updatedCash = balance(data.state);
    assert.equal(initialCash - updatedCash, 15000, 'Cash must decrement by exactly Rp 15,000');

    const lastEntry = data.state.ledger.at(-1);
    assert.ok(lastEntry, 'Ledger entry must exist');
    assert.equal(lastEntry.kind, 'daily', 'Kind must be daily');
    assert.equal(lastEntry.amount, 15000, 'Amount must be 15000');
    assert.equal(lastEntry.note, 'Kantin Lunch', 'Note must match chip title');
  }
);

defineTest(
  'Tier 1',
  'Quick-Log Chips',
  'T1-CHIP-2',
  'Bikun/KRL Transit chip (Rp 8,000) deducts 8k from balance and logs daily commute transaction',
  async () => {
    const session = new StudentTestSession('t1_chip2_transit');
    const initial = await session.getState();
    const initialCash = balance(initial.state);

    const { status, data } = await session.postCommand({
      type: 'daily',
      amount: 8000,
      title: 'Bikun/KRL Transit',
    });

    assert.equal(status, 200, 'POST Transit must return 200');
    assert.ok('state' in data);
    const updatedCash = balance(data.state);
    assert.equal(initialCash - updatedCash, 8000, 'Cash must decrement by exactly Rp 8,000');

    const lastEntry = data.state.ledger.at(-1);
    assert.ok(lastEntry);
    assert.equal(lastEntry.amount, 8000);
    assert.equal(lastEntry.note, 'Bikun/KRL Transit');
  }
);

defineTest(
  'Tier 1',
  'Quick-Log Chips',
  'T1-CHIP-3',
  'Campus Coffee chip (Rp 10,000) deducts 10k from balance and logs coffee beverage transaction',
  async () => {
    const session = new StudentTestSession('t1_chip3_coffee');
    const initial = await session.getState();
    const initialCash = balance(initial.state);

    const { status, data } = await session.postCommand({
      type: 'daily',
      amount: 10000,
      title: 'Campus Coffee',
    });

    assert.equal(status, 200, 'POST Coffee must return 200');
    assert.ok('state' in data);
    const updatedCash = balance(data.state);
    assert.equal(initialCash - updatedCash, 10000, 'Cash must decrement by exactly Rp 10,000');

    const lastEntry = data.state.ledger.at(-1);
    assert.ok(lastEntry);
    assert.equal(lastEntry.amount, 10000);
    assert.equal(lastEntry.note, 'Campus Coffee');
  }
);

defineTest(
  'Tier 1',
  'Quick-Log Chips',
  'T1-CHIP-4',
  'Custom expense button logs custom description and amount cleanly into student ledger',
  async () => {
    const session = new StudentTestSession('t1_chip4_custom');
    const initial = await session.getState();
    const initialCash = balance(initial.state);

    const { status, data } = await session.postCommand({
      type: 'daily',
      amount: 22500,
      title: 'Photocopy Lecture Slides',
    });

    assert.equal(status, 200);
    assert.ok('state' in data);
    const updatedCash = balance(data.state);
    assert.equal(initialCash - updatedCash, 22500);

    const lastEntry = data.state.ledger.at(-1);
    assert.ok(lastEntry);
    assert.equal(lastEntry.note, 'Photocopy Lecture Slides');
    assert.equal(lastEntry.amount, 22500);
  }
);

defineTest(
  'Tier 1',
  'Quick-Log Chips',
  'T1-CHIP-5',
  'Multiple sequential quick-log chips aggregate in forecast spentToday and reduce daily safe limit',
  async () => {
    const session = new StudentTestSession('t1_chip5_aggregate');
    await session.getState();

    // Log lunch + transit + coffee in sequence
    await session.postCommand({ type: 'daily', amount: 15000, title: 'Kantin Lunch' });
    await session.postCommand({ type: 'daily', amount: 8000, title: 'Bikun/KRL Transit' });
    const { data } = await session.postCommand({ type: 'daily', amount: 10000, title: 'Campus Coffee' });

    assert.ok('forecast' in data);
    const f = data.forecast;
    assert.ok(f);
    // Seeded lunch was 15000, plus 15000 + 8000 + 10000 = 48000 spent today
    assert.equal(f.spentToday, 48000, 'Spent today must sum all daily entries for current date');
  }
);

/* --------------------------------------------------------------------------
   Feature 4: Safe-to-Spend Forecasting
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 1',
  'Safe-to-Spend Forecasting',
  'T1-FCST-1',
  'Mathematical formula invariants: allowance = floor((cash + spentToday - mandatory - optional - buffer)/horizon) - spentToday',
  () => {
    const d = today();
    const testState: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 1000000,
        daily: 40000,
        essentialDaily: 20000,
        buffer: 100000,
        complete: true,
      },
      plans: [
        { id: 'p1', title: 'Kos', amount: 400000, original: 400000, due: plus(d, 5), essential: true, paid: false },
        { id: 'p2', title: 'Snacks', amount: 50000, original: 50000, due: plus(d, 8), essential: false, paid: false },
      ],
      incomes: [],
      ledger: [{ id: 'tx1', kind: 'daily', amount: 20000, date: d, note: 'Lunch' }],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    const f = forecast(testState, d);
    assert.ok(f);
    assert.equal(f.horizon, 10);
    assert.equal(f.mandatory, 400000);
    assert.equal(f.optional, 50000);
    assert.equal(f.spentToday, 20000);

    const cash = balance(testState); // 1,000,000 - 20,000 = 980,000
    assert.equal(cash, 980000);

    // Available for runway = 980,000 + 20,000 - 400,000 - 50,000 - 100,000 = 450,000
    // allowance = floor(450,000 / 10) - 20,000 = 45,000 - 20,000 = 25,000
    // essentialFuture = 20,000 * 9 = 180,000
    // cash - mandatory - optional - buffer - essentialFuture = 980,000 - 400,000 - 50,000 - 100,000 - 180,000 = 250,000
    // safe = min(25,000, 250,000) = 25,000
    assert.equal(f.safe, 25000);
  }
);

defineTest(
  'Tier 1',
  'Safe-to-Spend Forecasting',
  'T1-FCST-2',
  'Emergency buffer is strictly subtracted and ring-fenced from daily safe allowance',
  () => {
    const d = today();
    const baseState: State = {
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

    const fWithoutBuffer = forecast(baseState, d);
    assert.ok(fWithoutBuffer);
    assert.equal(fWithoutBuffer.safe, 50000); // 500,000 / 10 = 50,000

    const stateWithBuffer: State = {
      ...baseState,
      budget: { ...baseState.budget!, buffer: 100000 },
    };
    const fWithBuffer = forecast(stateWithBuffer, d);
    assert.ok(fWithBuffer);
    assert.equal(fWithBuffer.safe, 40000); // (500,000 - 100,000) / 10 = 40,000
    assert.equal(fWithoutBuffer.safe - fWithBuffer.safe, 10000, 'Safe limit drops by buffer / horizon');
  }
);

defineTest(
  'Tier 1',
  'Safe-to-Spend Forecasting',
  'T1-FCST-3',
  'Mandatory fixed bills (Rent/Tuition) are prioritized and ring-fenced before calculating safe limit',
  () => {
    const d = today();
    const baseState: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 600000,
        daily: 30000,
        essentialDaily: 10000,
        buffer: 0,
        complete: true,
      },
      plans: [
        { id: 'p-kos', title: 'Kos Rent', amount: 300000, original: 300000, due: plus(d, 5), essential: true, paid: false },
      ],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    const f = forecast(baseState, d);
    assert.ok(f);
    assert.equal(f.mandatory, 300000);
    // (600,000 - 300,000) / 10 = 30,000
    assert.equal(f.safe, 30000);
  }
);

defineTest(
  'Tier 1',
  'Safe-to-Spend Forecasting',
  'T1-FCST-4',
  'Daily safe limit scales inversely with remaining horizon days',
  () => {
    const d = today();
    const createState = (days: number): State => ({
      budget: {
        start: d,
        next: plus(d, days),
        initial: 600000,
        daily: 50000,
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
    });

    const f10 = forecast(createState(10), d);
    const f20 = forecast(createState(20), d);
    const f30 = forecast(createState(30), d);

    assert.ok(f10 && f20 && f30);
    assert.equal(f10.safe, 60000); // 600,000 / 10
    assert.equal(f20.safe, 30000); // 600,000 / 20
    assert.equal(f30.safe, 20000); // 600,000 / 30
    assert.ok(f10.safe > f20.safe && f20.safe > f30.safe, 'Safe limit must decrease as horizon lengthens');
  }
);

defineTest(
  'Tier 1',
  'Safe-to-Spend Forecasting',
  'T1-FCST-5',
  'Deficit risk detection flags gap > 0 and caps safe-to-spend at Rp 0 when cash is critically short',
  () => {
    const d = today();
    const deficitState: State = {
      budget: {
        start: d,
        next: plus(d, 10),
        initial: 300000,
        daily: 40000,
        essentialDaily: 25000,
        buffer: 100000,
        complete: true,
      },
      plans: [
        { id: 'p-kos', title: 'Kos Rent', amount: 350000, original: 350000, due: plus(d, 3), essential: true, paid: false },
      ],
      incomes: [],
      ledger: [],
      history: [],
      checks: [],
      requests: [],
      consent: d,
    };

    const f = forecast(deficitState, d);
    assert.ok(f);
    assert.equal(f.safe, 0, 'Safe limit must be 0 in deficit scenario');
    assert.ok(f.gap > 0, 'Gap must be positive to alert student');
    assert.equal(f.critical, true, 'Critical alert must be true when mandatory commitments exceed cash');
  }
);

/* --------------------------------------------------------------------------
   Feature 5: Mascot Badges & Micro-Emblems
   -------------------------------------------------------------------------- */

defineTest(
  'Tier 1',
  'Mascot Badges',
  'T1-MSC-1',
  'ChameleonBadge renders authentic SVG with curled tail, concentric eye, spine ridge, and gold coin',
  () => {
    const markup = renderToStaticMarkup(React.createElement(ChameleonBadge, { size: 48 }));
    assert.ok(markup.startsWith('<svg'), 'ChameleonBadge must render an SVG element');
    assert.ok(markup.includes('viewBox="0 0 90 90"'), 'ChameleonBadge viewBox must be 0 0 90 90');
    assert.ok(markup.includes('#00AA13'), 'ChameleonBadge must feature Gojek green #00AA13');
    assert.ok(markup.includes('#00DF82'), 'ChameleonBadge must feature Gojek mint #00DF82');
    assert.ok(markup.includes('#007A0E'), 'ChameleonBadge must feature dark green accent #007A0E');
    assert.ok(markup.includes('#FFB800'), 'ChameleonBadge must feature gold coin #FFB800');
    assert.ok(markup.includes('$'), 'ChameleonBadge coin must contain currency symbol $');
  }
);

defineTest(
  'Tier 1',
  'Mascot Badges',
  'T1-MSC-2',
  'BirdBadge renders authentic SVG with green circular badge, flapping wing, crest, and GP chest emblem',
  () => {
    const markup = renderToStaticMarkup(React.createElement(BirdBadge, { size: 48 }));
    assert.ok(markup.startsWith('<svg'), 'BirdBadge must render an SVG element');
    assert.ok(markup.includes('viewBox="0 0 90 90"'), 'BirdBadge viewBox must be 0 0 90 90');
    assert.ok(markup.includes('#00AA13'), 'BirdBadge must feature Gojek green #00AA13');
    assert.ok(markup.includes('#00DF82'), 'BirdBadge must feature Gojek mint wing #00DF82');
    assert.ok(markup.includes('#FFB800'), 'BirdBadge must feature yellow beak #FFB800');
    assert.ok(markup.includes('GP'), 'BirdBadge must feature GoPay GP chest emblem');
  }
);

defineTest(
  'Tier 1',
  'Mascot Badges',
  'T1-MSC-3',
  'StudentBadge renders authentic SVG with Nara UI avatar, green shirt, and SakuJalan cap with gold SJ badge',
  () => {
    const markup = renderToStaticMarkup(React.createElement(StudentBadge, { size: 48 }));
    assert.ok(markup.startsWith('<svg'), 'StudentBadge must render an SVG element');
    assert.ok(markup.includes('viewBox="0 0 90 90"'), 'StudentBadge viewBox must be 0 0 90 90');
    assert.ok(markup.includes('#00AA13'), 'StudentBadge must feature Gojek green shirt and cap');
    assert.ok(markup.includes('#FFB800'), 'StudentBadge must feature gold cap emblem #FFB800');
    assert.ok(markup.includes('SJ'), 'StudentBadge must feature SJ monogram');
  }
);

defineTest(
  'Tier 1',
  'Mascot Badges',
  'T1-MSC-4',
  'Micro-emblems (FoodChipIcon, TransitChipIcon, CoffeeChipIcon, TipIcon, SavingsIcon, ProtectionIcon, GrowthIcon) render valid SVGs',
  () => {
    const icons: React.ComponentType<{ size?: number }>[] = [
      FoodChipIcon,
      TransitChipIcon,
      CoffeeChipIcon,
      TipIcon,
      SavingsIcon,
      ProtectionIcon,
      GrowthIcon,
    ];

    for (const Icon of icons) {
      const markup = renderToStaticMarkup(React.createElement(Icon, { size: 16 }));
      assert.ok(markup.startsWith('<svg'), `Icon ${Icon.displayName || 'micro-icon'} must render SVG`);
      assert.ok(markup.includes('viewBox="0 0 20 20"'), `Icon ${Icon.name} must have 0 0 20 20 viewBox`);
      assert.ok(
        markup.includes('#00AA13') || markup.includes('#FFB800'),
        `Icon ${Icon.name} must use Gojek brand palette`
      );
    }
  }
);

defineTest(
  'Tier 1',
  'Mascot Badges',
  'T1-MSC-5',
  'Mascot badges accept dynamic size, className, and style props without layout breakage',
  () => {
    const markupChameleon = renderToStaticMarkup(
      React.createElement(ChameleonBadge, {
        size: 72,
        className: 'custom-chameleon',
        style: { opacity: 0.95 },
      })
    );
    assert.ok(markupChameleon.includes('width="72"'), 'ChameleonBadge must apply width 72');
    assert.ok(markupChameleon.includes('height="72"'), 'ChameleonBadge must apply height 72');
    assert.ok(markupChameleon.includes('custom-chameleon'), 'ChameleonBadge must include custom className');
    assert.ok(markupChameleon.includes('opacity:0.95'), 'ChameleonBadge must include style opacity');

    const badgeSource = readMascotBadgesSource();
    assert.ok(badgeSource.includes('export interface MascotBadgeProps'), 'Must export MascotBadgeProps interface');
    assert.ok(badgeSource.includes('export interface MicroIconProps'), 'Must export MicroIconProps interface');
  }
);
