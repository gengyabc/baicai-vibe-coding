# Workflow: Phase Log Memory Archive Preflight

## Input

- live phase snapshot inputs
- target archive destination
- existing `topic-log.md` when present

## Rules

- @.opencode/rules/archive-safety.md
- @.opencode/rules/planning-memory.md

## Steps

1. resolve the target `topic-log.md` path
2. read the live phase snapshot inputs that would feed topic-log update
3. read the existing `topic-log.md` when present
4. check whether the canonical `topic-log.md` update can be applied deterministically
5. return `safe to proceed` or `stop for user direction`

## Required checks

- check canonical section conflicts before any archive move
- stop when archived-phase entries would collide ambiguously
- preserve safe manual sections when they do not conflict with canonical updates
- return only `safe to proceed` or `stop for user direction`

## Exit rules

- do not move live phase content here
- do not rewrite `topic-log.md` here
