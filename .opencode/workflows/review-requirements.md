# Workflow: Review Requirements

## Input

- one reviewed live step folder

## Rules

- @.opencode/rules/review-flow.md
- @.opencode/rules/review-artifact.md
- @.opencode/rules/step-delta-artifact.md
- @.opencode/rules/planning-memory.md
- @.opencode/rules/tdd.md
- @.opencode/rules/scope.md
- @.opencode/rules/subagent-failure-response.md

## Steps

1. read the live step folder as the source of truth, with `requirement.md` before `step.md`, and `delta.md` when present
2. derive a behavior matrix from the current live step folder before reviewing code:
   - preserved behaviors
   - removed behaviors
   - replacement behaviors
   - when `delta.md` exists, use it to decide which old evidence must be considered stale
3. inspect the current git diff, including staged and unstaged changes, for surviving removed behavior before trusting any review summary
4. consult @.opencode/workflows/phase-log-memory/read-context.md only when continuity context is useful
5. run the `requirements-review` subagent
   - if the subagent returns no usable result or reports a session/network error, stop immediately, notify the user, and wait in the same session for `继续`
6. save or refresh @.planning/phase/<step-folder>/requirements-review.md using the required review artifact schema for later fix work, including the reviewed `requirement-version` and `step-version` in front matter
7. if the review status is not `correct`, parse the findings into concrete fix items and update tests first
8. implement the minimum fix for the current live step, staying within scope
9. rerun `@requirements-review` and refresh @.planning/phase/<step-folder>/requirements-review.md until status is `correct` or the work becomes blocked
10. follow @.opencode/rules/review-flow.md for the requirements-review retry loop and exit behavior
11. if any removed behavior remains in code or tests, do not report the review as clean even if the summary text is optimistic
12. report the final result, including the review subagent's phase-log follow-up note

## Input priority

Follow the source-priority rules in @.opencode/rules/planning-memory.md.

Treat the live step folder as the source of truth.
Do not let planning memory override the current reviewed step, tests, or code.

## Review dimensions

Review all of these dimensions:

1. requirement and plan to code alignment
2. spec to code alignment
3. contract validation
4. test quality
5. TDD compliance

The review must also verify that any behavior marked as removed or replaced by the live step folder is actually gone. A review is not clean if old behavior still exists alongside the new behavior.

## TDD validation

Check whether:

- tests were written for new behavior or boundary changes
- tests were written for removed or replaced behavior when the step explicitly requires old behavior to disappear
- those tests would fail without the implementation
- implementation stays minimal for the current step
- refactor work is safe and scoped

Call out these anti-patterns when present:

- fake TDD
- overly weak tests
- over-implementation
- scope drift

## Completion rule

- do not stop until the review clearly states whether the implementation matches the current live step folder
- do not stop until the review clearly states whether true TDD was followed

## Exit rules

- if clean, next action is `/review-quality <step-number> [batch-id]` when the current phase still needs quality review, otherwise `/archive-phase`
- if issues exist, continue the automatic requirements-review fix loop instead of returning control early

## Output

- implementation correctness: `correct` when review status is `correct`, otherwise `not correct`
- review status: `correct` | `minor issues` | `major issues`
- review artifact path: @.planning/phase/<step-folder>/requirements-review.md
- archive context used or `none`: from the saved review artifact
- planning-memory follow-up note: from the saved review artifact
- whether an older logged direction should be moved into `Superseded Decisions`: from the saved review artifact
