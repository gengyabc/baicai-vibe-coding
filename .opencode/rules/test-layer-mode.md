# Rule: Test Layer Mode

## Decision

- `lower-level + e2e`: when `feature.feature` exists in the step folder
- `lower-level only`: when no `feature.feature` exists

## When to use

This rule determines whether to write Playwright E2E tests for a reviewed live step.

- If `feature.feature` is present in `@.planning/phase/<step-folder>/`, the step has user-facing behavior that warrants browser-level verification
- If only `requirement.md`, `step.md`, and optionally `contract.md` exist, the step is implementation-focused and lower-level tests are sufficient

## Notes

- E2E tests should cover browser-visible user journeys, not duplicate lower-level contract checks
- The chosen mode is persisted in `@.planning/phase/<step-folder>/test-checklist.md` for later verification and fix work
- Prefer lower-level tests whenever the behavior can be proven without launching the browser
- Do not use Playwright for component state matrices, control-shape variants, validation permutations, or DOM structure details that are already well-covered by unit or integration tests
- If a planned E2E assertion would need selectors like internal test ids, descendant structure, or exact control types (`checkbox` vs `select`) to prove correctness, that is a strong signal the check belongs in a lower-level test instead
- A good E2E scenario usually spans a real user journey across boundaries: shell/editor interaction, persistence lifecycle, visible navigation, or other browser-visible integration outcomes
