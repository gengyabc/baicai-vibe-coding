# Rule: TDD

## Requirements

- write or update tests before implementation for new or changed behavior
- follow `Red -> Green -> Refactor`
- keep implementation work in this order:
  1. Red: write or update tests first
  2. Green: write the minimum implementation needed
  3. Refactor: perform limited safe cleanup only after tests pass
  4. Verify: confirm the work matches the step, specs, and chosen test-layer mode
- keep implementation minimal in the Green phase
- refactor only after tests pass
- prefer lower-level tests by default and add browser E2E only when lower-level coverage cannot prove the browser-visible flow confidently
- when choosing browser E2E, target the thinnest set of high-value journeys; do not build exhaustive UI state matrices in Playwright
- do not stop until tests are written or updated before production code changes
- do not stop until feature behavior is respected when present
- do not stop until contract boundaries are respected when present

## Violations

- production code before failing tests
- weak tests that cannot fail without the implementation
- broad refactor before the scoped behavior is passing
- defaulting to browser E2E when lower-level tests are sufficient for the reviewed step
- adding Playwright cases for implementation details that would be more stable and cheaper to prove in unit or integration tests
