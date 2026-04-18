---
description: Implement one reviewed live @.planning/phase step with strict TDD, requirements review, simplify-code, and a bounded quality review/fix loop
model: openai/gpt-5.3-codex
agent: build
---

The first argument is the live step number: `$1`
The second argument is optional mode override text: `$2...`

## Validate argument

- Use `$1` only as the live step selector, such as `1`
- Resolve the matching live step folder from @.planning/phase/ by matching a unique folder whose leading step number equals `$1`
- Treat `$2...` as an optional mode override when present.
- Normalize fuzzy mode text to one of two canonical modes:
  - `new`: `new`, `create`, `fresh`, `start`, `init`
  - `edit`: `edit`, `update`, `revise`, `refresh`, `modify`, `change`, `patch`
- If `$2...` is missing, derive the default mode from `implementedStepKeys` in @.planning/phase/branch-phase.toml:
  - if the step key is present, default to `edit`
  - otherwise default to `new`
- If the mode text is ambiguous, ask the user to choose between `new` and `edit` before proceeding.

If the folder cannot be resolved uniquely:
- STOP
- print: `Expected a unique live step number such as 6`

## Required input

- @.planning/phase/<step-folder>/requirement.md
- @.planning/phase/<step-folder>/step.md
- optional @.planning/phase/<step-folder>/delta.md
- optional @.planning/phase/<step-folder>/requirements-review.md
- optional @.planning/phase/<step-folder>/decision.md
- optional @.planning/phase/<step-folder>/contract.md
- optional @.planning/phase/<step-folder>/feature.feature
- read front matter from `requirement.md`, `step.md`, and `requirements-review.md`; treat copied `requirement-version` in `step.md` as stale whenever it differs from `requirement.md`, and keep the reviewed `requirement-version` and `step-version` in `requirements-review.md` aligned with the current files
- if present, read front matter from `delta.md`; treat its copied `requirement-version` as stale whenever it differs from `requirement.md`
- if present, treat `requirements-review.md` as stale whenever its copied `requirement-version` or `step-version` differs from the current `requirement.md` or `step.md`

## Mandatory Version Alignment Check

Before proceeding to implementation workflow:

1. Read `requirement-version` from `requirement.md` front matter (call it `req-v-current`)
2. Read `requirement-version` from `step.md` front matter (call it `req-v-step`)
3. If `req-v-step` != `req-v-current`:
   - STOP
   - print: `step.md is stale (requirement-version mismatch: ${req-v-step} vs ${req-v-current}). Run /plan-step $1 first`
4. If `requirements-review.md` exists:
   - Read its copied `requirement-version` (call it `req-v-review`)
   - Read its copied `step-version` (call it `step-v-review`)
   - Read `step-version` from current `step.md` (call it `step-v-current`)
   - If `req-v-review` != `req-v-current`:
     - STOP
     - print: `requirements-review.md is stale (requirement-version mismatch: ${req-v-review} vs ${req-v-current}). Run /review-requirements $1 first`
   - If `step-v-review` != `step-v-current`:
     - STOP
     - print: `requirements-review.md is stale (step-version mismatch: ${step-v-review} vs ${step-v-current}). Run /review-requirements $1 first`

If version check fails:
- do NOT call the implementation workflow
- do NOT proceed to implementation
- return the error state immediately

If the requirement file does not exist:
- STOP
- print: `Requirement file not found: @.planning/phase/<step-folder>/requirement.md`

If the step file does not exist:
- STOP
- print: `Plan step file not found: @.planning/phase/<step-folder>/step.md`

## Artifact boundaries

- requirements review artifact: @.planning/phase/<step-folder>/requirements-review.md
- quality loop artifact: @.planning/phase/<step-folder>/quality-review.md
- edit mode reuses the existing live step folder and refreshes implementation artifacts only; it does not rewrite planning artifacts unless the workflow explicitly requires it

## Flow

- call workflow: @.opencode/workflows/baicai-vc/implement-from-plan.md
- if a delegated subagent returns no usable result or reports a session/network error, the workflow stops, sends a notification, and waits in the same session for `继续`
- always re-read the current `requirement.md` and `step.md` before making implementation decisions
- if `requirement-version` changed materially from an earlier reviewed version, refresh `delta.md` before using older implementation or review evidence
- when `delta.md` is present, re-read it before making implementation decisions and use it to understand preserved, removed, and replacement behaviors
- if code changes materially alter preserved, removed, or replacement behavior, refresh `delta.md` again before finalizing implementation evidence or review requests
- keep `delta.md` aligned with the code you actually changed so later implementation and review have a reliable behavior delta
- if `requirements-review.md` is stale, refresh it from the current `requirement.md` and `step.md` before using it as implementation evidence
- if `step.md` is stale, refresh it from the current `requirement.md` before using it as implementation guidance
- when present, also re-read `decision.md`, `contract.md`, and `feature.feature` so the implementation scope reflects the latest step artifacts
- use the current artifact contents to derive tests and implementation scope even in `new` mode

## Final output

- step number used: the `$1` argument
- mode used: `new` | `edit`
- step folder used: resolved folder path like `01-add-feature/`
- requirement file used: `@.planning/phase/<step-folder>/requirement.md`
- plan file used: `@.planning/phase/<step-folder>/step.md`
- delta file used: `@.planning/phase/<step-folder>/delta.md` | `none`
- spec files used: `feature.feature`, `contract.md`, and/or `decision.md` present in step folder, or `none`
- requirements review status: `correct` | `minor issues` | `major issues`
- requirements review freshness: `fresh` | `stale` | `missing`
- quality review assessment: `clean` | `mixed` | `blocked`
- quality rounds used: `<number>`
- stop reason: `none` | `clean` | `max_rounds` | `repeated_unresolved` | `blocked`
- manual intervention required: `yes` | `no`
- requirements artifact path: `@.planning/phase/<step-folder>/requirements-review.md`
- quality artifact path: `@.planning/phase/<step-folder>/quality-review.md`
- unresolved required findings or `none`: from the latest quality round
- repeated unresolved findings or `none`: from the latest quality round
- repeated root-cause clusters or `none`: from the latest quality round
- implementation result: `passed requirements and quality review` | `stopped with unresolved quality findings` | `blocked`
- canonical E2E path: full path to `.spec.ts` file or `none`
- E2E run result: `passed` | `failed` | `not run` (when feature.feature exists)
- implemented-step tracking: step key added to `implementedStepKeys` in branch-phase.toml: `yes` | `no`
- phase log result: `updated` | `not-needed` | `none`
- blocked or deferred items: from step.md non-goals section or `none`
- next action:
  - `/discover-requirements <new-requirements>` for new step(s)
  - `/implement-from-plan <next-step>` if the plan is already done
  - `/review-requirements $1` when requirements review still has issues
  - `/review-quality $1` when quality review still has issues
  - `/archive-phase` when requirements review and quality review are clean and the phase is complete

## Success requirements

- **Version alignment must pass before implementation starts**:
  - if version check fails with `stale_step_plan`, do NOT proceed to implementation
  - if version check fails with `stale_requirement_review` or `stale_step_review`, do NOT proceed to implementation
  - implementation workflow can only start after all versions are aligned
- if `implementation result` is `passed requirements and quality review`, requirements review status must be `correct`
- if `requirements review freshness` is `stale`, requirements review status must not be treated as current evidence
- if `implementation result` is `passed requirements and quality review`, quality review assessment must be `clean`
- if quality review assessment is `clean`, implemented-step tracking must be `yes`
- if requirements review status is not `correct` or quality review assessment is not `clean`, implemented-step tracking must be `no`
