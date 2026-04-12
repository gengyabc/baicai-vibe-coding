# Workflow: Phase Log Memory Topic Sync

## Input

- archived phase destination
- archived phase snapshot inputs
- existing `topic-log.md` when present

## Rules

- @.opencode/rules/archive-safety.md
- @.opencode/rules/planning-memory.md

## Steps

1. read the archived phase snapshot
2. read the existing `topic-log.md` when present
3. merge or append the archived-phase entry deterministically
4. refresh current direction, cross-phase decisions, superseded directions, and follow-ups only when changed
5. preserve safe manual content outside canonical sections when non-conflicting

## Required sync behavior

- keep the canonical `topic-log.md` structure stable
- merge or append archived-phase entries deterministically
- refresh current direction and cross-phase decisions only when changed
- move outdated direction into superseded history instead of dropping it silently
- preserve safe manual sections and stop when canonical updates would rewrite conflicting manual content
