# Relocation Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Hebrew, browser-only wizard that ranks the existing Metro Boston town comparison around a visitor's relocation preferences.

**Architecture:** Put town records and deterministic scoring in `wizard.js`, which exports pure functions for tests and renders the questionnaire and result cards in the browser. Replace the static table markup in the page with a target container populated from the same records, so the top-three recommendations and full ranking cannot drift apart.

**Tech Stack:** Static HTML, CSS, vanilla browser JavaScript, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-17-relocation-wizard-design.md`

## Global Constraints

- All UI text is Hebrew and the page remains right-to-left.
- No backend, account, analytics, or persisted personal data.
- A budget consists of midpoint rent plus required-car count times editable monthly car cost.
- Importance inputs are very important, somewhat important, or not important.
- Preserve a readable static table when JavaScript is unavailable.

---

### Task 1: Add deterministic town scoring

**Files:**
- Create: `wizard.js`
- Create: `tests/wizard.test.js`

**Interfaces:**
- Produces: `estimateMonthlyTotal(town, carCost)`, `scoreTown(town, preferences)`, and `rankTowns(towns, preferences)`.
- Consumes: a town with `rentMin`, `rentMax`, `cars`, `community`, `space`, `schools`, `transit`, and `commute` values from 1 through 3; preferences with `budget`, `carCost`, and matching priority fields from 0 through 2.

- [ ] **Step 1: Write failing Node tests** for a $3,300–$4,000 town needing one car at $700 (expected total $4,350), a high-community town beating a low-community town when community priority is 2, and over-budget towns ranking after in-budget towns.
- [ ] **Step 2: Run** `node --test tests/wizard.test.js`; expect failure because `wizard.js` does not exist.
- [ ] **Step 3: Implement** the three exported functions. Use `(rentMin + rentMax) / 2 + cars * carCost`; add `attribute * priority` for each preference; subtract the amount over budget divided by 100 when a budget is supplied; return descending score and ascending total for ties.
- [ ] **Step 4: Run** `node --test tests/wizard.test.js`; expect all tests to pass.
- [ ] **Step 5: Commit** the test and scoring module with an `Assisted-by: Codex` trailer.

### Task 2: Add the questionnaire and result renderer

**Files:**
- Modify: `israeli_communities_boston_comparison.html`
- Modify: `wizard.js`

**Interfaces:**
- Consumes: `rankTowns` and the questionnaire form values.
- Produces: `renderResults(preferences)` that updates `#top-results` and `#ranked-table-body`.

- [ ] **Step 1: Write failing DOM-level tests** using the browser-independent formatter exports for: exactly three top results, Hebrew reason text naming matched priorities, and an explicit budget warning where no result is within budget.
- [ ] **Step 2: Run** `node --test tests/wizard.test.js`; expect the new formatter tests to fail.
- [ ] **Step 3: Implement** a labelled Hebrew form containing total monthly budget, monthly cost per car (default $700), and five three-choice priority selectors (community, space, schools, transit, commute). Add update-on-input behavior, top-three result cards with estimated monthly totals and trade-offs, and a reordered full table. Use existing source ranges and qualitative town descriptions; do not make unsupported factual claims.
- [ ] **Step 4: Run** `node --test tests/wizard.test.js`; expect all tests to pass.
- [ ] **Step 5: Open the page locally** and verify RTL layout, input changes, recommendation cards, full-table reorder, and a clear no-match state.
- [ ] **Step 6: Commit** the page and renderer with an `Assisted-by: Codex` trailer.

### Task 3: Publish and verify

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: deployed GitHub Pages URL.
- Produces: brief instructions that the site is a planning aid and that estimates are configurable.

- [ ] **Step 1: Add** one README paragraph linking to the live site and explaining the rent-plus-transport estimate.
- [ ] **Step 2: Run** `node --test tests/wizard.test.js` and `git diff --check`; expect both to pass without output errors.
- [ ] **Step 3: Commit**, push `relocation-wizard`, create a PR with `Generated with Codex` in its body, and merge only after checks are clean.
- [ ] **Step 4: Verify** GitHub Pages reports `built` for the merged commit and the public URL loads the wizard.

## Self-review

- Spec coverage: Task 1 implements calculation and ranking; Task 2 implements every visitor-facing preference, recommendations, rankings, trade-offs, and the no-match state; Task 3 covers static deployment and verification.
- Placeholder scan: no implementation placeholders remain.
- Interface consistency: Task 2 consumes exactly the Task 1 exports and reads the preference fields defined there.
