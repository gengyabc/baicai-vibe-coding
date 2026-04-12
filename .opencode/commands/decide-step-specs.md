---
description: Decide which specs the reviewed live step needs and write them into its @.planning/phase step folder
agent: build
model: bailian-coding-plan/glm-5
---

The first argument is the live step number: `$1`

## Validate argument

- Use `$1` only as the step number, such as `1`
- Resolve the matching live step folder from @.planning/phase/

If the folder cannot be resolved uniquely:
- STOP
- print: `Expected a live step number such as 6`

## Required input

- @.planning/phase/<step-folder>/requirement.md
- @.planning/phase/<step-folder>/step.md

If the requirement file does not exist:
- STOP
- print: `Requirement file not found: @.planning/phase/<step-folder>/requirement.md`

If the step file does not exist:
- STOP
- print: `Plan step file not found: @.planning/phase/<step-folder>/step.md`

## Flow

- call workflow: @.opencode/workflows/decide-step-specs.md

## Final output

- step number used
- step folder used
- decision
- archive context used or `none`
- files written
- files removed
- one-line reason
- remind: implement -> `/implement-from-plan $1`
