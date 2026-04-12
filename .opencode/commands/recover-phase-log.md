---
description: Rebuild the current live @.planning/phase/phase-log.md from reviewed step folders when the log is missing or inconsistent
agent: build
model: bailian-coding-plan/glm-5
---

This command takes no positional arguments.

## Argument validation

- reject any positional argument

## Flow

- call workflow: @.opencode/workflows/recover-phase-log.md

If @.planning/phase/ has no reviewed step folders:
- STOP
- print: `No live step folders found under @.planning/phase/ to rebuild phase-log.md`

## Final output

- whether `phase-log.md` was created or updated
- phase topic used
- step folders scanned
- active overview captured
- cross-step decisions kept
- superseded decisions recorded
- spike references included or `none`
- follow-ups kept or `none`
- any missing step-local spec files that were noted during recovery
