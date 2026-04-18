---
description: Write or refresh the canonical Playwright E2E spec for one reviewed live @.planning/phase step
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
- optional @.planning/phase/<step-folder>/feature.feature
- optional @.planning/phase/<step-folder>/decision.md

If the requirement file does not exist:
- STOP
- print: `Requirement file not found: @.planning/phase/<step-folder>/requirement.md`

If the plan file does not exist:
- STOP
- print: `Plan step file not found: @.planning/phase/<step-folder>/step.md`

If `feature.feature` does not exist and `decision.md` does not exist:
- STOP
- print: `Decision file required when feature spec is missing: @.planning/phase/<step-folder>/decision.md`

## Flow

- call workflow: @.opencode/workflows/baicai-vc/write-step-e2e.md

## Final output

- step number used
- step folder used
- requirement file used
- step file used
- feature file used or `none`
- decision file used or `none`
- canonical E2E path
- archive context used or `none`
- created or refreshed
- short summary of browser-visible flows covered
- remind: review or archive -> `/review-requirements $1` or `/archive-phase` when the current live phase is ready
