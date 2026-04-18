# Workflow: Phase Log Memory Update

## Input

- current live step result or fix result
- optional existing @.planning/phase/phase-log.md

## Rules

- @.opencode/rules/baicai-vc/planning-memory.md
- @.opencode/rules/baicai-vc/scope.md

## Steps

1. decide whether the current change has phase-level handoff value
2. read existing live `phase-log.md` when present
3. extract only new active outcomes, decisions, superseded directions, spikes, or follow-ups
4. update or create @.planning/phase/phase-log.md in canonical structure only when warranted
5. report any archive-sync follow-up note for later `topic-log.md` refresh

## Required update behavior

- keep the canonical `phase-log.md` structure stable
- record only active phase-level truth in active sections
- move superseded direction into explicit history instead of deleting it silently
- report whether later archive sync should refresh `topic-log.md`
- return only created, updated, or not-needed results
