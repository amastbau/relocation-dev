(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RelocationWizard = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const preferenceKeys = ['community', 'space', 'schools', 'transit', 'commute'];
  const labels = {
    community: 'קהילה ישראלית/דוברת עברית',
    space: 'בית מרווח וחצר',
    schools: 'בתי ספר מצוינים',
    transit: 'תחבורה ציבורית',
    commute: 'נסיעה קצרה לבוסטון',
  };

  function estimateMonthlyTotal(town, carCost) {
    return (town.rentMin + town.rentMax) / 2 + town.cars * carCost;
  }

  function calculateRemainingIncome(netIncome, locationCost, fixedFamilyCosts) {
    const afterLocation = netIncome - locationCost;
    return {
      afterLocation,
      afterBaseline: afterLocation - fixedFamilyCosts,
    };
  }

  function meetsFortyTimesRule(grossAnnualIncome, monthlyRent) {
    return grossAnnualIncome >= monthlyRent * 40;
  }

  function scoreTown(town, preferences) {
    const total = estimateMonthlyTotal(town, preferences.carCost);
    const preferenceScore = preferenceKeys.reduce(
      (score, key) => score + town[key] * preferences[key],
      0,
    );
    const budgetPenalty = preferences.budget && total > preferences.budget
      ? (total - preferences.budget) / 100
      : 0;

    return { ...town, total, score: preferenceScore - budgetPenalty };
  }

  function rankTowns(towns, preferences) {
    return towns
      .map((town) => scoreTown(town, preferences))
      .sort((left, right) => right.score - left.score || left.total - right.total);
  }

  function buildResultSummary(towns, preferences) {
    const ranked = rankTowns(towns, preferences).map((town) => ({
      ...town,
      reasons: preferenceKeys
        .filter((key) => preferences[key] > 0 && town[key] >= 2)
        .map((key) => labels[key]),
    }));

    return {
      ranked,
      top: ranked.slice(0, 3),
      budgetWarning: Boolean(preferences.budget) && ranked.every(
        (town) => town.total > preferences.budget,
      ),
    };
  }

  const towns = [
    { id: 'brookline', name: 'ברוקליין', rentMin: 4000, rentMax: 4800, cars: 1, community: 3, space: 1, schools: 3, transit: 3, commute: 3 },
    { id: 'newton', name: 'ניוטון', rentMin: 3300, rentMax: 4000, cars: 1, community: 3, space: 3, schools: 3, transit: 3, commute: 3 },
    { id: 'needham', name: 'נידהם', rentMin: 3600, rentMax: 4200, cars: 2, community: 2, space: 3, schools: 3, transit: 2, commute: 2 },
    { id: 'natick', name: 'נאטיק', rentMin: 3400, rentMax: 3850, cars: 1, community: 3, space: 3, schools: 3, transit: 2, commute: 2 },
    { id: 'lexington', name: 'לקסינגטון', rentMin: 3500, rentMax: 4200, cars: 2, community: 2, space: 3, schools: 3, transit: 1, commute: 2 },
    { id: 'sudbury-wayland', name: 'סדברי / ויילנד', rentMin: 3600, rentMax: 4300, cars: 2, community: 2, space: 3, schools: 3, transit: 1, commute: 1 },
    { id: 'acton', name: 'אקטון', rentMin: 3200, rentMax: 3700, cars: 2, community: 1, space: 3, schools: 3, transit: 2, commute: 1 },
  ];

  function renderWizard() {
    if (typeof document === 'undefined') return;
    const form = document.querySelector('#wizard-form');
    const results = document.querySelector('#top-results');
    const warning = document.querySelector('#budget-warning');
    const body = document.querySelector('tbody');
    if (!form || !results || !warning || !body) return;

    function preferenceValue() {
      const values = {
        netIncome: Number(document.querySelector('#net-income').value) || 0,
        grossAnnualIncome: Number(document.querySelector('#gross-annual-income').value) || 0,
        budget: Number(document.querySelector('#budget').value) || 0,
        carCost: Number(document.querySelector('#car-cost').value) || 0,
      };
      form.querySelectorAll('[data-preference]').forEach((element) => { values[element.dataset.preference] = Number(element.value); });
      return values;
    }

    function update() {
      const preferences = preferenceValue();
      const summary = buildResultSummary(towns, preferences);
      results.innerHTML = summary.top.map((town) => {
        const positives = town.reasons.length ? town.reasons.join(' · ') : 'התאמה מאוזנת לפי הבחירות שלכם';
        const tradeoff = town.cars > 1 ? 'הפשרה: לרוב נדרשים שני רכבים.' : 'יתרון: אפשר להסתדר עם רכב אחד.';
        const remaining = calculateRemainingIncome(preferences.netIncome, town.total, 3445);
        const incomeLines = preferences.netIncome ? `<p>נשאר אחרי שכירות ורכב: $${Math.round(remaining.afterLocation).toLocaleString()}</p><p>להוצאות משתנות או לחיסכון: $${Math.round(remaining.afterBaseline).toLocaleString()}</p>` : '';
        const averageRent = (town.rentMin + town.rentMax) / 2;
        const requiredGross = averageRent * 40;
        const fortyTimes = preferences.grossAnnualIncome
          ? meetsFortyTimesRule(preferences.grossAnnualIncome, averageRent)
            ? 'עומדים בכלל 40×'
            : 'לא עומדים בכלל 40×'
          : `נדרש ברוטו שנתי של כ־$${Math.round(requiredGross).toLocaleString()} לפי כלל 40×`;
        return `<article class="summary-box result-card"><h3>${town.name}</h3><p class="total">שכירות ורכב: $${Math.round(town.total).toLocaleString()}</p>${incomeLines}<p>${fortyTimes}</p><p>מתאים בזכות: ${positives}</p><p>${tradeoff}</p></article>`;
      }).join('');
      warning.hidden = !summary.budgetWarning;
      warning.textContent = summary.budgetWarning ? 'אין התאמה מלאה לתקציב הכולל שבחרתם. אלה האפשרויות הקרובות ביותר; בדקו את הפשרה בין שכר הדירה למספר הרכבים.' : '';
      summary.ranked.forEach((town) => {
        const row = body.querySelector(`[data-town="${town.id}"]`);
        if (row) body.appendChild(row);
      });
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  }

  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', renderWizard);

  return { estimateMonthlyTotal, calculateRemainingIncome, meetsFortyTimesRule, scoreTown, rankTowns, buildResultSummary };
});
