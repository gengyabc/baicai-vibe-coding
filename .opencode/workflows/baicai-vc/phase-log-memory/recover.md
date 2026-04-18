# Workflow: Phase Log Memory Recover

## Input

- reviewed live step folders under @.planning/phase/
- optional existing live `phase-log.md`

## Rules

- @.opencode/rules/baicai-vc/planning-memory.md
- @.opencode/rules/baicai-vibe/entrypoint-compatibility.md

## Steps

1. scan reviewed live step folders
2. stop if no reviewed step folders exist
3. infer the latest active phase-level truth
4. keep only phase-level outcomes worth future handoff
5. rebuild @.planning/phase/phase-log.md in canonical structure

## Required recovery behavior

- rebuild `phase-log.md` in the canonical structure only from reviewed live step outputs worth future handoff
- keep active versus superseded direction separate
- include spike references only when they still have phase-level handoff value
- stop when reviewed live step context is insufficient to rebuild the log safely
