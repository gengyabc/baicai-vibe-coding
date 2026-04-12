---
description: Plan a specific live step under @.planning/phase/ for the current branch phase topic
agent: build
model: openai/gpt-5.4
---

## Arguments

- `$1` (required): live step number to plan

## Validation

- One arg only → must be a numeric live step number
- No args → STOP
- Trailing text → STOP
- Resolve the matching live step folder from @.planning/phase/

If the folder cannot be resolved uniquely:
- STOP
- print: `Expected a live step number such as 6`

If `@.planning/phase/<step-folder>/requirement.md` does not exist:
- STOP
- print: `Requirement file not found: @.planning/phase/<step-folder>/requirement.md`

If `@.planning/phase/<step-folder>/step.md` does not exist:
- call @.opencode/workflows/plan-step/initial.md
- stop routing

## Routing

1. Read `step-key` and `requirement-version` from `@.planning/phase/<step-folder>/requirement.md` front matter
2. Read `step-key`, `step-version`, and `requirement-version` from `@.planning/phase/<step-folder>/step.md` front matter
3. Read `@.planning/phase/<step-folder>/delta.md` when present; create or refresh it if requirement drift is semantic so later implementation sees preserved, removed, and replacement behavior explicitly
4. Route to `@.opencode/workflows/plan-step/replan-from.md` when the step key is not yet in `implementedStepKeys` or the copied `requirement-version` in `step.md` is stale
5. Otherwise route to `@.opencode/workflows/plan-step/continue-after.md`
6. Refresh `step.md` from `requirement.md` when routing to replan

Rules:

- only plan the resolved step folder
- do not edit any other `step.md` file
- do not invent new step decomposition during planning; if the `requirement.md` is too broad, stop and require refreshed discovery

## Request Source

- Use the current user request

## Output Summary

- Planning mode (`initial`, `replan-from`, or `continue-after`)
- Branch, phase-topic
- requirement file(s) used: `@.planning/phase/<step-folder>/requirement.md`
- delta file used: `@.planning/phase/<step-folder>/delta.md` or `none`
- Created/refreshed step folder and files
- archive context used or `none`
- one-line summary
- Recommended next step number
- remind: spec gate -> `/decide-step-specs <recommended-step-number>`
