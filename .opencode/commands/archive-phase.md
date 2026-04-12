---
description: Archive the current live @.planning/phase tree into the canonical @.planning/archive layout and refresh the parent topic-log.md
agent: build
model: bailian-coding-plan/glm-5
---

This command takes no positional arguments.

## Argument validation

- reject any positional argument

## Flow

- call workflow: @.opencode/workflows/archive-phase.md

## Final output

- branch phase archived
- `big-topic`
- chosen archive destination
- whether merge happened
- step folders moved
- whether archived `phase-log.md` moved or was preserved
- whether @.planning/archive/<big-topic>/topic-log.md was updated
- whether `spikes/` moved
- renumbering or collision handling
- branch memory cleanup result
