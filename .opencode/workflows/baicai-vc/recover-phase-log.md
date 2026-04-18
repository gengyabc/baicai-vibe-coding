# Workflow: Recover Phase Log

## Input

- reviewed live step folders under @.planning/phase/

## Rules

- @.opencode/rules/baicai-vc/planning-memory.md
- @.opencode/rules/baicai-vibe/entrypoint-compatibility.md

## Steps

1. scan live reviewed step folders under @.planning/phase/
2. stop if no reviewed step folders exist
3. call @.opencode/workflows/baicai-vc/phase-log-memory/recover.md
4. recover the latest active phase-level truth from the live steps
5. create or rewrite @.planning/phase/phase-log.md

## Recovery authority

- use @.opencode/workflows/baicai-vc/phase-log-memory/recover.md as the single authority for detailed recovery and rewrite rules
- create or rewrite @.planning/phase/phase-log.md only through the phase-log-memory recovery flow

## Exit rules

- @.opencode/workflows/baicai-vc/phase-log-memory/recover.md owns all detailed recovery and rewrite rules
