import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { getRegisteredTests, type TestCaseResult } from './harness';

// Import test suites so tests register themselves
import './tier1-feature-coverage.test';
import './tier2-boundary-cases.test';
import './tier3-interactions.test';
import './tier4-workload-scenarios.test';

async function main(): Promise<void> {
  const startTime = performance.now();
  const tests = getRegisteredTests();
  const results: TestCaseResult[] = [];

  console.log('='.repeat(78));
  console.log(' SAKUJALAN: CAMPUS BUDGET NAVIGATOR — OPAQUE-BOX E2E TEST RUNNER');
  console.log('='.repeat(78));
  console.log(`Total Registered Tests: ${tests.length}`);
  console.log(`Environment: Node ${process.version} | Target: http://localhost:3000\n`);

  let currentTier = '';
  let currentFeature = '';

  for (const t of tests) {
    if (t.tier !== currentTier) {
      currentTier = t.tier;
      console.log(`\n>>> [${currentTier.toUpperCase()}]`);
      currentFeature = '';
    }
    if (t.feature !== currentFeature) {
      currentFeature = t.feature;
      console.log(`  ● Feature / Area: ${currentFeature}`);
    }

    const tStart = performance.now();
    let errorMsg: string | undefined;

    try {
      await t.fn({ assert });
      const tDuration = Math.round((performance.now() - tStart) * 10) / 10;
      console.log(`    ✓ [${t.id}] ${t.title} (${tDuration}ms)`);
      results.push({
        tier: t.tier,
        feature: t.feature,
        id: t.id,
        title: t.title,
        passed: true,
        durationMs: tDuration,
      });
    } catch (err) {
      const tDuration = Math.round((performance.now() - tStart) * 10) / 10;
      errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`    ✗ [${t.id}] ${t.title} (${tDuration}ms)`);
      console.error(`      ERROR: ${errorMsg}`);
      results.push({
        tier: t.tier,
        feature: t.feature,
        id: t.id,
        title: t.title,
        passed: false,
        durationMs: tDuration,
        error: errorMsg,
      });
    }
  }

  const totalDuration = Math.round(performance.now() - startTime);
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log('\n' + '='.repeat(78));
  console.log(' E2E SUITE EXECUTION SUMMARY');
  console.log('='.repeat(78));

  const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];
  for (const tier of tiers) {
    const tierResults = results.filter((r) => r.tier === tier);
    const tierPassed = tierResults.filter((r) => r.passed).length;
    const tierFailed = tierResults.filter((r) => !r.passed).length;
    const status = tierFailed === 0 ? 'PASS' : 'FAIL';
    console.log(
      `  ${tier.padEnd(8)} : ${tierPassed}/${tierResults.length} passed (${status})`
    );
  }

  console.log('-'.repeat(78));
  console.log(`Total Tests Run : ${results.length}`);
  console.log(`Total Passed    : ${passedCount}`);
  console.log(`Total Failed    : ${failedCount}`);
  console.log(`Total Duration  : ${totalDuration}ms`);
  console.log('='.repeat(78));

  if (failedCount > 0) {
    console.error('\nFAILED TESTS BREAKDOWN:');
    for (const r of results.filter((x) => !x.passed)) {
      console.error(`  [${r.id}] ${r.title}`);
      console.error(`    Reason: ${r.error}\n`);
    }
    process.exit(1);
  } else {
    console.log('\n✨ ALL E2E TESTS PASSED SUCCESSFULLY! (100% PASS RATE)\n');
    process.exit(0);
  }
}

void main();
