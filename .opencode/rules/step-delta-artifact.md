# Rule: Step Delta Artifact

## Purpose

- use `@.planning/phase/<step-folder>/delta.md` to capture semantic requirement drift when a reviewed live step changes materially
- prefer a structured delta artifact over a free-form changelog

## When Required

- create or refresh `delta.md` when `requirement-version` changes in `requirement.md`
- create or refresh `delta.md` when edit-mode work materially changes preserved, removed, or replacement behavior for the current live step
- skip `delta.md` when the step has no prior requirement revision or the requirement change is purely clerical

## Artifact Path

- canonical path: `@.planning/phase/<step-folder>/delta.md`

## Required Structure

```md
---
step-key: <step-key>
requirement-version: <current-requirement-version>
previous-requirement-version: <prior-requirement-version>
change-kind: semantic-update
---

# Delta Summary

## Why This Changed
- <1-3 bullets>

## Behavior Matrix

### Preserved
- <behavior that must still exist>

### Removed
- <behavior that must no longer exist>

### Replaced
- Old: <old behavior or surface>
- New: <new behavior or surface>
- Migration rule: <what now counts as correct>

## Contract Deltas
- Added: <delta or `none`>
- Removed: <delta or `none`>
- Clarified: <delta or `none`>

## Test Impact
- Add: <required new tests or `none`>
- Update: <tests whose evidence changed or `none`>
- Remove: <tests that prove obsolete behavior or `none`>

## Review Impact
- Invalidated evidence: <what older review evidence can no longer be trusted for or `none`>
- Priority checks: <what reviews must verify now>

## Implementation Notes
- <bounded implementation implications or `none`>
```

## Notes

- `delta.md` is a semantic-drift aid, not the scope authority; `requirement.md` remains the source of truth
- `delta.md` must distinguish preserved, removed, and replacement behaviors explicitly
- when the step artifacts distinguish UI surfaces, `delta.md` must keep those surfaces separate
- requirements and review workflows should treat contradictory surviving old behavior as a real issue, not a note
