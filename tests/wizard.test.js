const test = require('node:test');
const assert = require('node:assert/strict');

const { estimateMonthlyTotal, rankTowns, buildResultSummary, calculateRemainingIncome, meetsFortyTimesRule } = require('../wizard.js');

const basePreferences = {
  budget: 4500,
  carCost: 700,
  community: 0,
  space: 0,
  schools: 0,
  transit: 0,
  commute: 0,
};

test('estimates monthly rent plus required car cost', () => {
  const town = { rentMin: 3300, rentMax: 4000, cars: 1 };

  assert.equal(estimateMonthlyTotal(town, 700), 4350);
});

test('ranks a stronger Hebrew-speaking community higher when it matters most', () => {
  const towns = [
    { name: 'Quiet', rentMin: 3000, rentMax: 3000, cars: 1, community: 1, space: 2, schools: 2, transit: 2, commute: 2 },
    { name: 'Hebrew', rentMin: 3000, rentMax: 3000, cars: 1, community: 3, space: 2, schools: 2, transit: 2, commute: 2 },
  ];

  const ranked = rankTowns(towns, { ...basePreferences, community: 2 });

  assert.equal(ranked[0].name, 'Hebrew');
});

test('ranks an in-budget town ahead of an otherwise identical over-budget town', () => {
  const towns = [
    { name: 'Over budget', rentMin: 4000, rentMax: 4000, cars: 1, community: 2, space: 2, schools: 2, transit: 2, commute: 2 },
    { name: 'Within budget', rentMin: 3000, rentMax: 3000, cars: 1, community: 2, space: 2, schools: 2, transit: 2, commute: 2 },
  ];

  const ranked = rankTowns(towns, basePreferences);

  assert.equal(ranked[0].name, 'Within budget');
});

test('returns exactly three top recommendations with Hebrew reasons', () => {
  const towns = ['Hebrew', 'Second', 'Third', 'Fourth'].map((name, index) => ({
    name,
    rentMin: 3000,
    rentMax: 3000,
    cars: 1,
    community: 4 - index,
    space: 2,
    schools: 2,
    transit: 2,
    commute: 2,
  }));

  const summary = buildResultSummary(towns, { ...basePreferences, community: 2 });

  assert.equal(summary.top.length, 3);
  assert.match(summary.top[0].reasons.join(' '), /קהילה/);
});

test('warns when no town is within the total monthly budget', () => {
  const towns = [
    { name: 'Too expensive', rentMin: 5000, rentMax: 5000, cars: 1, community: 2, space: 2, schools: 2, transit: 2, commute: 2 },
  ];

  const summary = buildResultSummary(towns, { ...basePreferences, budget: 3000 });

  assert.equal(summary.budgetWarning, true);
});

test('shows remaining income after location cost and full family baseline', () => {
  const remaining = calculateRemainingIncome(10200, 4350, 3445);

  assert.deepEqual(remaining, {
    afterLocation: 5850,
    afterBaseline: 2405,
  });
});

test('checks whether gross annual income meets the 40-times-rent rule', () => {
  assert.equal(meetsFortyTimesRule(144000, 3600), true);
  assert.equal(meetsFortyTimesRule(143999, 3600), false);
});
