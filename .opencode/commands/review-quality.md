---
description: Fix reviewed live quality findings using strict TDD and a bounded quality loop
agent: build
model: openai/gpt-5.3-codex
---

Arguments:

- Live step number: `$1`
- Optional batch id: `$2`

## Argument validation

- Use `$1` only as the step number, such as `1`
- Resolve the matching live step folder from @.planning/phase/ by matching a unique folder whose leading step number equals `$1`

If invalid:
- STOP
- print: `Expected a live step number such as 6`

If a batch id is present, it is used to target a specific open quality batch; otherwise the workflow auto-selects the next open batch.

## Required input

- @.planning/phase/<step-folder>/requirement.md
- @.planning/phase/<step-folder>/step.md
- @.planning/phase/<step-folder>/delta.md when present
- @.planning/phase/<step-folder>/quality-review.md
- read front matter from `requirement.md` and `step.md`; prefer `step-key` from requirement front matter and use `step.md` front matter only as fallback

If the target requirement file does not exist:
- STOP
- print: `Requirement file not found: @.planning/phase/<step-folder>/requirement.md`

If the target step file does not exist:
- STOP
- print: `Plan step file not found: @.planning/phase/<step-folder>/step.md`

## Pre-workflow initialization

Before entering the fix workflow, ensure an up-to-date quality review exists:

1. Read `step-version` from step.md frontmatter
2. Read `requirement-version` from requirement.md frontmatter
3. Read quality-review.md if it exists
4. **Version alignment check** (MUST complete before any early exit):
   - If quality-review.md does NOT exist:
     - Invoke `@quality-review` in `full` mode (skill creates review with current versions)
     - Read the resulting quality-review.md
     - Proceed to Flow section
   - If quality-review.md exists, read its frontmatter `step-version` and `requirement-version`:
     - If versions do NOT match current step.md/requirement.md:
       - Invoke `@quality-review` in `full` mode (skill updates versions and appends new round)
       - Read the updated quality-review.md
       - Proceed to Flow section
     - If versions match:
       - Check if any round has `mode: full`
       - If no prior "full" review round exists:
         - Invoke `@quality-review` in `full` mode
         - Read the updated quality-review.md
       - If `open_findings: 0` in the latest round:
         - Output "correct" status
         - Stop (no need to enter fix workflow)
       - If `open_findings > 0`:
         - Proceed to Flow section

## Workflow-owned review basis

- the workflow owns quality-review batch selection and verification state
- if @.planning/phase/<step-folder>/quality-review.md exists, it should follow the quality-review artifact schema
- quality-review fixes must read only the latest round in `quality-review.md`

## Validation

This section is retained for defense-in-depth; the command performs version checking in Pre-workflow initialization above. The workflow performs the same validation as a safety net.

- read `step-version` from step.md frontmatter
- read `requirement-version` from requirement.md frontmatter
- if quality-review.md is missing OR its frontmatter versions don't match current step.md/requirement.md:
  - invoke `@quality-review` in `full` mode to create or refresh the review
  - the skill handles version updates atomically within the review round
- otherwise use the existing review artifact as-is

## Flow

- call workflow: @.opencode/workflows/review-quality.md
- if the delegated subagent returns no usable result or reports a session/network error, the workflow stops, sends a notification, and waits in the same session for `继续`

## Output

- step number used: the `$1` argument
- step folder used: resolved folder path like `01-add-feature/`
- selected batch used: `$2` | `auto-selected` | `none`
- post-fix review status: `correct` | `minor issues` | `major issues`
- review artifact path: `@.planning/phase/<step-folder>/quality-review.md`
- top findings or `no issues found`: from the selected review artifact
- implemented-step tracking: step key added to `implementedStepKeys` in branch-phase.toml: `yes` | `no`
- phase log result: `updated` | `not-needed` | `none`
- next action: `/archive-phase` when review is clean and phase is complete, otherwise `/review-quality $1 [batch-id]`

## Success requirements

- if `post-fix review status` is `correct`, implemented-step tracking must be `yes`
- if `post-fix review status` is `minor issues` or `major issues`, implemented-step tracking must be `no`
