---
description: Look up relevant archived planning context from @.planning/archive using planning-memory retrieval rules
agent: build
model: bailian-coding-plan/glm-5
---

The first argument is optional: `$1`

## Purpose

Use this command when the user wants explicit historical context from archived planning memory.

## Input handling

If `$1` is provided, treat it as the lookup hint.

If `$1` is absent:
- infer the best lookup target from the current conversation, branch, and live planning context
- if no durable lookup target can be resolved, STOP and print: `Archive lookup needs a hint or a resolvable live/archive target`

## Flow

- call workflow: @.opencode/workflows/lookup-archive-context.md

## Final output

- lookup target used
- matched archive scope
- active direction
- relevant archived phases or `none`
- superseded directions that matter now or `none`
- follow-ups or gotchas that matter now or `none`
- recommended next action
