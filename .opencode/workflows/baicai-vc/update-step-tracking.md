# Workflow: Update Step Tracking

Save review artifact, update step tracking in branch-phase.toml, and optionally update phase-log.

## Input

- step folder: @.planning/phase/<step-folder>/
- review result from the `review` subagent

## Rules

- @.opencode/rules/baicai-vc/review-artifact.md
- @.opencode/rules/baicai-vc/naming-layout.md

## Steps

1. read `step-key`, `step-number`, `step-folder`, `phase-topic`, and `requirement-version` from @.planning/phase/<step-folder>/requirement.md front matter
2. read `step-version` from @.planning/phase/<step-folder>/step.md front matter
3. save or refresh @.planning/phase/<step-folder>/requirements-review.md using the required review artifact schema, including the reviewed `requirement-version` and `step-version` in front matter
4. check the review status from the saved artifact
5. if review status is `correct` (clean):
    - read `implementedStepKeys` from @.planning/phase/branch-phase.toml
    - persist the step key into `implementedStepKeys` in @.planning/phase/branch-phase.toml without duplicating existing keys and while preserving valid TOML shape
    - confirm the step key is present in `implementedStepKeys` before returning success from this workflow
    - consult the review artifact for phase-level handoff value
    - call @.opencode/workflows/baicai-vc/phase-log-memory/update.md only when the work has phase-level handoff value
6. determine next action:
    - if review is clean and phase is complete: `/archive-phase`
     - if review has issues: `/review-requirements <step-number>`

## Output

- review status: `correct` | `minor issues` | `major issues`
- step key added to branch-phase.toml: yes | no
- phase-log updated: yes | no | not-needed
- review versions recorded in requirements-review.md front matter: yes | no
- next action: `/archive-phase` or `/review-requirements <step-number>`

## Exit rules

- do not update branch-phase.toml when review finds issues
- do not call phase-log-memory/update.md when review finds issues
- do not return `yes` unless the step key is present in `implementedStepKeys` after this workflow completes
- return clear next action to the calling workflow
