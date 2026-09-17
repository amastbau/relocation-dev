# Relocation preference wizard

## Purpose

Help a visitor rank the existing Metro Boston towns against personal relocation priorities, without sending any data off the GitHub Pages site.

## Experience

The Hebrew page gains a short wizard before the comparison table. It asks for a total monthly housing-and-transport budget, an editable monthly per-car estimate, and the importance of: a Hebrew-speaking/Israeli community, home space and yard, schools, public transport, and a short Boston commute. Each preference is `very important`, `somewhat important`, or `not important`.

The result shows the best three matches with a concise explanation and trade-off, followed by the complete town table reordered from best to worst match. Users can change answers and results update immediately.

## Data and scoring

Town attributes remain in the page as structured data derived from the existing comparison. Each town has rent range, expected one-or-two-car need, community strength, home-space fit, school rating, transit fit, and commute fit. The estimated monthly total is the midpoint rent plus required-car count times the visitor's per-car estimate. A town scores more highly when it fits the selected budget and the priorities marked most important. The UI explains which factors helped and hurt each result; it does not claim precision beyond the source ranges.

## Constraints and failures

Everything runs in the browser: no account, backend, analytics, or stored personal data. If no town fits the budget, show the closest options and explain the budget mismatch. Missing answers use neutral weighting.

## Verification

Test the scoring with fixed preference scenarios, validate budget and car-cost input handling, and manually verify that the static page works with JavaScript enabled and has a readable fallback table when JavaScript is unavailable.
