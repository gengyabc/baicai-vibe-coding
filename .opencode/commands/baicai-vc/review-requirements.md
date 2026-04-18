---
description: Review and fix one live @.planning/phase step implementation against its plan and specs with TDD checks
agent: build
model: bailian-coding-plan/glm-5
---

The first argument is the live step number: `$1`

## Argument validation

- Use `$1` only as the step number, such as `1`
- Resolve the matching live step folder from @.planning/phase/

If invalid:
- STOP
- print: `Expected a live step number such as 6`

## Required input

- @.planning/phase/<step-folder>/requirement.md
- @.planning/phase/<step-folder>/step.md

If the target requirement file does not exist:
- STOP
- print: `Requirement file not found: @.planning/phase/<step-folder>/requirement.md`

If the target plan file does not exist:
- STOP
- print: `Plan step file not found: @.planning/phase/<step-folder>/step.md`

## Flow

- call workflow: @.opencode/workflows/baicai-vc/review-requirements.md
- if the delegated subagent returns no usable result or reports a session/network error, the workflow stops, sends a notification, and waits in the same session for `继续`

## Output

- step number used
- step folder used
- implementation correctness: `correct` | `not correct`
- review status: `correct` | `minor issues` | `major issues`
- review artifact path: `@.planning/phase/<step-folder>/requirements-review.md`
- archive context used or `none`
- planning-memory follow-up note
- whether an older logged direction should be moved into `Superseded Decisions`
- remind: fix or archive -> `/review-quality $1 [batch-id]` or `/archive-phase` when the current live phase is ready
