# Rule: Requirements Review Artifact

## Requirements

- persist review results at @.planning/phase/<step-folder>/requirements-review.md
- keep the artifact deterministic so repeated review and fix loops use the same headings and order
- Required structure:

```md
---
step-key: <step-key>
requirement-version: <requirement-version>
step-version: <step-version>
---

# Review Report

## Plan Reference
- @.planning/phase/<step-number>-<step-topic>/requirement.md
- @.planning/phase/<step-number>-<step-topic>/step.md

## Overall Status
- `correct` | `minor issues` | `major issues`

## Findings

### Plan Alignment Issues
- <finding or `none`>

### Delta Checks
- Preserved behaviors verified: <finding or `none`>
- Removed behaviors verified as absent: <finding or `none`>
- Replacement behaviors verified: <finding or `none`>
- Stale evidence detected: <finding or `none`>

### Spec Violations
- <finding or `none`>

### Contract Issues
- <finding or `none`>

### Test Issues
- <finding or `none`>

## TDD Compliance

### Red
- pass/fail + explanation

### Green
- pass/fail + explanation

### Refactor
- pass/fail + explanation

## Anti-Patterns
- <anti-pattern or `none`>

## Phase Handoff

### Archive Context Used
- <context or `none`>

### Phase-Log Follow-Up
- <concise note>

### Superseded Directions
- <what should move to `Superseded Decisions` or `none`>
```

## Notes

- the requirements review artifact front matter must copy the reviewed `requirement-version` and `step-version` so other workflows can detect stale review state
- the requirements review artifact is the durable input for `/review-requirements`
- **MANDATORY**: If `requirement-version` changed from a prior committed version (check git history or prior review front matter) but `delta.md` is missing:
  - overall status must be `major issues` (not `correct`)
  - report finding: "delta.md missing for requirement version change"
  - do NOT approve the review as `correct`
  - require action: "Run `/plan-step <step-number>` to generate delta.md before proceeding"
- when `delta.md` exists, the review artifact must explicitly record preserved, removed, and replacement behavior checks before a status can be `correct`
- workflows may report the same content to the user, but the saved file should follow this schema exactly
