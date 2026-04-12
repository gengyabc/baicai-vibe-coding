# Workflow: Phase Log Memory Review Note

## Input

- review findings for one live step

## Rules

- @.opencode/rules/planning-memory.md
- @.opencode/rules/review-quality.md

## Steps

1. inspect the review findings for phase-level impact
2. decide whether live `phase-log.md` should be updated later
3. identify any older logged direction that should move into `Superseded Decisions`
4. return a concise follow-up note without editing files

## Required note behavior

- report whether the current review changes phase-level understanding enough to justify a later `phase-log.md` update
- identify any older logged direction that should move into `Superseded Decisions`
- keep the note concise and avoid changing files here
