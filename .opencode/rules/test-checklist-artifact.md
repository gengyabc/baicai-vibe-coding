# Rule: Test Checklist Artifact

## Requirements

- persist the checklist at @.planning/phase/<step-folder>/test-checklist.md when a workflow chooses to save it
- keep the artifact deterministic so repeated implement, verify, and fix loops reuse the same headings and order
- include these required sections in this order:
 - `# Test Checklist`
 - `## Plan Reference`
 - `## Chosen Mode`
 - `## Why`
 - `## Lower-Level Coverage`
 - `## Browser E2E Coverage`
 - `## Refresh Triggers`
- `## Chosen Mode` must be exactly one of `lower-level only` or `lower-level + e2e`
- `## Why` must contain at least one short bullet explaining the chosen mode
- `## Lower-Level Coverage` must list the required lower-level checks for the current reviewed step
- `## Browser E2E Coverage` must list browser-visible scenarios when the mode is `lower-level + e2e`, otherwise it must say `- none required`
- `## Refresh Triggers` must describe when the checklist should be refreshed; include material step changes and review findings that show missing or wrong-layer coverage
- when `## Browser E2E Coverage` is not `- none required`, keep it to a small set of high-value browser journeys and explicitly avoid component-level permutations that belong in lower-level coverage

## Plan Reference

- include both `@.planning/phase/<step-folder>/requirement.md` and `@.planning/phase/<step-folder>/step.md`

## Notes

- this artifact is the durable input for delivery verification and repeated `/review-quality` loops
- workflows may summarize the checklist differently to the user, but the saved file should follow this schema exactly
- if a candidate E2E item mainly proves control wiring, selector shape, validation branches, or intra-component state toggles, move it to `## Lower-Level Coverage` instead
