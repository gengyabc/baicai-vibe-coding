# Workflow: Review Quality

## Objective

Fix one reviewed live step quality finding batch using strict TDD, then refresh the quality review artifact and step-tracking state.

## Input

- resolved live step folder from the caller
- @.planning/phase/<step-folder>/requirement.md
- @.planning/phase/<step-folder>/step.md
- @.planning/phase/<step-folder>/quality-review.md

## Validation

The command performs version alignment before entering this workflow. This validation is retained as defense-in-depth.

- if the step folder cannot be resolved uniquely, stop
- if the requirement file is missing, stop
- if the step file is missing, stop
- read `step-version` from `step.md` frontmatter
- read `requirement-version` from `requirement.md` frontmatter
- if `quality-review.md` is missing:
  - invoke `@quality-review` in `full` mode to create the initial review
  - the skill atomically writes `step-version` and `requirement-version` in the new round
- if `quality-review.md` exists:
  - read `step-version` and `requirement-version` from its frontmatter
  - if versions do not match current `step.md` or `requirement.md`:
    - invoke `@quality-review` in `full` mode to refresh the review for the new versions
    - the skill atomically updates `step-version` and `requirement-version` in the new round
  - otherwise: use the existing review artifact as-is
- use `quality-review.md` as the durable source of truth for quality-review fixes

## Rules

- @.opencode/rules/baicai-vibe/token-efficient-workflow.md
- @.opencode/rules/baicai-vc/tdd.md
- @.opencode/rules/baicai-vc/scope.md
- @.opencode/rules/baicai-vc/planning-memory.md
- @.opencode/rules/baicai-vc/review-flow.md
- @.opencode/rules/baicai-vc/test-checklist-artifact.md
- @.opencode/rules/baicai-vc/test-layer-mode.md
- @.opencode/rules/baicai-vc/subagent-failure-response.md

## Steps

1. reread `requirement.md`, `step.md`, and same-folder specs to reload the current scope, constraints, and available spec inputs before fixing code
2. if `delta.md` exists, read it before trusting the review artifact and treat removed behaviors as mandatory fix candidates
3. consult @.opencode/workflows/baicai-vc/phase-log-memory/read-context.md only when the review artifact points to missing continuity context
4. if @.planning/phase/<step-folder>/test-checklist.md is missing, derive the step-scoped test checklist and chosen test-layer mode from the step context using @.opencode/rules/baicai-vc/test-layer-mode.md, then save or refresh the artifact before verification
5. if @.planning/phase/<step-folder>/test-checklist.md exists but the findings indicate missing coverage, the wrong test layer, or missing E2E confidence, rerun the same checklist derivation using the same `decision.md` gate and refresh the file in the same schema before verification
6. perform version alignment check and review refresh (see Validation section above) before proceeding
7. read only the latest round in `quality-review.md`, confirm the selected batch exists or auto-select the next open batch, and follow the batch-fix protocol below before making changes
8. parse review findings into concrete fix items scoped to requirement, spec, contract, delta, and TDD alignment
9. update or add tests first so the targeted issue is exposed
10. implement the minimum fix
11. perform limited safe refactor only if needed
12. verify the fix against the step, specs, `delta.md`, and `test-checklist.md`, confirming the fix stays within step scope and does not introduce out-of-scope behavior
13. invoke `@quality-review` in `delta` mode, then follow @.opencode/rules/baicai-vc/review-flow.md for verification, stop reasons, and next batch selection
    - if the subagent returns no usable result or reports a session/network error, stop immediately, notify the user, and wait in the same session for `继续`
14. call @.opencode/workflows/baicai-vc/update-step-tracking.md only when the caller has a clean terminal review state

## Batch Fix Protocol

Use this protocol for the currently selected quality-review batch.

### Inputs

- current execution context
- latest round in `@.planning/phase/<step-folder>/quality-review.md`
- current step folder files

### Rules

- Fix only the findings in the selected batch.
- Do not opportunistically fix unrelated findings.
- Do not mix batches.
- Do not reopen closed findings unless the selected batch explicitly depends on them.
- If required findings remain open, do not switch to optional findings.

### Steps

1. Read the selected batch from the latest review round.
2. Extract batch id, finding ids, priorities, affected files, and root cause cluster.
3. Confirm the selected batch is the only target and still needs fixing.
4. Inspect only the code paths needed to resolve the batch safely.
5. Update or add tests so the failure is exposed.
6. Implement the smallest bounded fix.
7. Run the narrowest useful verification.
8. Treat the result as `fixed_pending_review`, `blocked`, `not_fixed`, or `needs_review_attention`.
9. Do not mark findings closed yourself.

## Input priority

Use inputs in this order:

1. `requirement.md`
2. `step.md`
3. same-folder `decision.md`, `feature.feature`, and `contract.md`
4. current quality review artifact
5. existing tests
6. codebase
7. live and archived planning memory as optional context only

If no spec files exist, derive behavior from `requirement.md` and `step.md` only.

## Scope rules

Respect the reviewed step's:

- objective
- locked constraints
- scope
- files section
- symbols section
- non-goals and deferred items

Do not:

- re-plan
- expand scope beyond the current step folder
- introduce new architecture unless required to fix a scoped contract violation
- make broad cleanup changes unrelated to the selected fix targets

## Verification checklist

- all targeted findings are addressed by the current fix pass
- tests pass for the current fix loop
- behavior still matches `requirement.md`, `step.md`, and `feature.feature` when present
- invariants and guarantees from `contract.md` remain true when present
- no out-of-scope work was introduced
- live `phase-log.md` is updated only when the fix has phase-level handoff value

## Completion rule

- do not stop until the current fix loop follows real TDD ordering
- do not stop until the step folder has current review findings and matching verification artifacts for the quality fix loop

## Exit rules

- do not proceed without the correct review artifact
- do not verify the fix until @.planning/phase/<step-folder>/test-checklist.md exists for the current fix loop
- keep @.planning/phase/<step-folder>/test-checklist.md aligned with the chosen test-layer mode used for verification, especially after coverage-related findings
