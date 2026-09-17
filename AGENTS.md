# Repository Guidelines

## Project Structure & Module Organization

This is a dependency-free static site for comparing Greater Boston relocation options. `index.html` is the Hebrew, right-to-left entry point and redirects to `israeli_communities_boston_comparison.html`, which contains the comparison page and its styling. Keep interactive ranking and financial logic in `wizard.js`; it exposes a browser global and CommonJS exports so the same functions can be tested in Node. Place unit tests in `tests/`, and keep design notes and implementation plans in `docs/superpowers/`.

## Build, Test, and Development Commands

No build step or package installation is required.

- `node --test` runs the full Node test suite.
- `node --test tests/wizard.test.js` runs the wizard tests only.
- `python3 -m http.server 8000` serves the site locally; open `http://localhost:8000/`.

Use a browser to validate the RTL layout, form updates, and table reordering after UI changes.

## Coding Style & Naming Conventions

Use two-space indentation in HTML and JavaScript. Follow the existing JavaScript style: `const` by default, semicolons, single-quoted strings, trailing commas in multiline literals, and concise pure helper functions. Name JavaScript variables and functions in `camelCase`; use lowercase kebab-case for HTML IDs and data attributes (for example, `#net-income` and `data-preference`). Add town records with stable lowercase kebab-case `id` values. Preserve Hebrew copy and `dir="rtl"` unless a deliberate content change requires otherwise.

## Testing Guidelines

Tests use Node's built-in `node:test` and strict assertions from `node:assert/strict`; no coverage threshold is configured. Name test files `*.test.js` and describe observable behavior in each `test()` title. Add or update tests for every change to scoring, budget, income, or ranking logic. Keep browser-only DOM work behind the existing `typeof document` guard so imports remain testable.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects consistent with history, such as `Add gross income rental rule check` or `Sync 5000 income default from relocation dev`. Keep commits focused. Pull requests should explain the user-facing change, link the relevant issue or design note when available, include `Generated with Codex` when AI-assisted, and attach screenshots for visual or RTL-layout changes. Run `node --test` before opening a PR; never push directly to `main`.

## Content and Data Care

The recommendations are planning aids, not authoritative financial advice. When changing rents, car assumptions, or community ratings, verify the source and update any explanatory text that relies on the changed data.
