# Workflow: Implement From Plan

## Input

- one reviewed live step folder resolved from the command step selector

## Rules

- @.opencode/_vendor/baicai-vibe/rules/token-efficient-workflow.md
- @.opencode/rules/tdd.md
- @.opencode/rules/scope.md
- @.opencode/rules/planning-memory.md
- @.opencode/rules/naming-layout.md
- @.opencode/rules/review-artifact.md
- @.opencode/rules/review-flow.md
- @.opencode/rules/step-delta-artifact.md
- @.opencode/rules/test-checklist-artifact.md
- @.opencode/rules/test-layer-mode.md
- @.opencode/rules/subagent-failure-response.md

## Step resolution

- the command owns resolving `$1` to a unique live step folder under @.planning/phase/
- use only the resolved `<step-folder>` for all artifact paths
- if the command cannot resolve exactly one live step folder, stop before entering this workflow

## Step artifact loading

1. read `requirement.md` first
2. read `step.md` second
3. read `delta.md` when present
4. read `requirements-review.md` when present
5. read `decision.md`, `contract.md`, and `feature.feature` when present
6. read front matter from `requirement.md`, `step.md`, `delta.md`, and `requirements-review.md`; compare reviewed `requirement-version` values against the current requirement before making implementation decisions
7. treat all present artifacts as current input, not stale planning history
8. if the current artifacts disagree, prefer the latest contents in the resolved step folder
9. **MANDATORY STOP**: if `requirement-version` in `step.md` differs from `requirement.md`:
   - STOP implementation workflow immediately
   - report: "step.md is stale (version mismatch). Run `/plan-step <step-number>` first"
   - do NOT proceed to implementation
10. if `requirement-version` changed materially from an earlier reviewed revision, refresh `delta.md` before using older implementation or review evidence
11. **MANDATORY STOP**: if `requirements-review.md` exists and its copied `requirement-version` or `step-version` differs from current files:
    - STOP implementation workflow immediately
    - report: "requirements-review.md is stale (version mismatch). Run `/review-requirements <step-number>` first"
    - do NOT use stale review evidence as correctness proof
    - do NOT proceed to Phase 3 (requirements review loop) until versions are aligned
12. if code changes materially alter preserved, removed, or replacement behavior, refresh `delta.md` before finishing so the artifact matches the implementation you actually made

## Artifact boundaries

- requirements review output: @.planning/phase/<step-folder>/requirements-review.md
- quality loop output: @.planning/phase/<step-folder>/quality-review.md
- do not mix these artifacts

## Test design rules

- when `feature.feature` exists, turn scenarios into concrete behavior tests
- when `contract.md` exists, turn invariants and guarantees into concrete boundary tests
- when only `requirement.md` and `step.md` exist, build tests from the explicit step batches, constraints, invariants, and success criteria
- when the chosen mode is `lower-level + e2e`, restrict Playwright to visible user journeys and integration behaviors
- do not duplicate most contract checks in Playwright
- do not turn every `feature.feature` scenario into Playwright when lower-level tests can prove parts of the behavior more directly
- for UI-heavy steps, keep Playwright on the critical path only and push control-state matrices, validation combinations, and implementation-detail assertions down to unit or integration tests

## Quality-loop states

- required findings are P0, P1, and P2
- optional findings are P3 and should use status `optional`
- active required statuses are `open`, `fixed_pending_review`, and `blocked`
- latest appended round in @.planning/phase/<step-folder>/quality-review.md is the only current source of truth


## Execution flow

### Phase 1: Prepare context

1. read `requirement.md`, then `step.md`, then `delta.md` when present, then same-folder specs when present; extract the current requirement scope, semantic deltas, step objective, locked constraints, non-goals, referenced files, referenced symbols, and available spec inputs before making changes
2. derive a behavior matrix from the current live step folder before writing tests or implementation:
   - preserved behaviors
   - removed behaviors
   - replacement behaviors
3. if `delta.md` is present, use it to validate what older behavior must be preserved, removed, or replaced before trusting prior review evidence
4. explicitly separate UI surfaces when the step artifacts do so; do not treat inline, toast, panel, modal, banner, or similar surfaces as interchangeable evidence
5. consult @.opencode/workflows/phase-log-memory/read-context.md only when continuity context is useful
6. derive the step-scoped test checklist and chosen test-layer mode from the extracted step context using @.opencode/rules/test-layer-mode.md
7. save or refresh @.planning/phase/<step-folder>/test-checklist.md using the required test checklist artifact schema so later verification and fix work reuse the same chosen test-layer mode unless the step changes materially

### Phase 2: Implement and verify

8. write or update tests first
9. ensure tests cover both required new behavior and required removal of superseded behavior when the step explicitly replaces an older surface or flow
10. when `delta.md` is present, ensure tests reflect its `Add`, `Update`, and `Remove` expectations rather than stale prior assertions
11. write the minimum implementation needed
12. call @.opencode/workflows/write-step-e2e.md to write or refresh canonical E2E only when the chosen test-layer mode is `lower-level + e2e`
13. run the narrowest relevant verification commands for the chosen test-layer mode
14. perform limited safe refactor only after tests pass

### Phase 3: Requirements review loop

15. invoke `@requirements-review` and persist its result to @.planning/phase/<step-folder>/requirements-review.md
    - if the subagent returns no usable result or reports a session/network error, stop immediately, notify the user, and wait in the same session for `继续`
16. follow @.opencode/rules/review-flow.md for the requirements-review retry loop and exit behavior
17. stop immediately if requirements review remains blocked or major issues cannot be resolved within the current step scope

### Phase 4: Quality review and fix loop

18. invoke `@simplify-code` from @.opencode/_vendor/baicai-vibe/agents/simplify-code.md on the touched code only, preserving behavior and step scope
19. follow @.opencode/rules/review-flow.md for quality-review batch selection, delta verification, stop reasons, and exit behavior
    - if the quality-review subagent returns no usable result or reports a session/network error, stop immediately, notify the user, and wait in the same session for `继续`

### Phase 5: Completion and tracking

20. call @.opencode/workflows/update-step-tracking.md only when requirements review is `correct` and the latest quality round is clean with no unresolved required findings

## Quality-loop guardrails

- allow one `full` quality review and at most 5 `delta` review rounds before escalation
- meaningful progress means at least one of:
  - fewer open required findings
  - the active batch closes
  - a repeated root-cause cluster is cleared
  - a finding becomes `blocked` with a clear `block_reason`
- if the same finding ID or same root-cause cluster remains unresolved without meaningful progress across repeated rounds, stop and escalate
- do not open a new batch while the current batch is still under review

## Completion rule

- do not stop until requirements review and quality review have both reached a terminal state
- do not mark a step implemented when requirements review is not `correct`
- do not mark a step implemented when unresolved required findings remain in the latest quality round
- do not finish with a successful implementation result until step tracking confirms the step key is ensured in @.planning/phase/branch-phase.toml

## Exit rules

- stop after step tracking only when requirements review is `correct` and the latest quality round has no unresolved required findings
- stop earlier with escalation when repeated unresolved churn, blocked required findings, or max quality rounds prevent clean completion
- keep @.planning/phase/<step-folder>/test-checklist.md aligned with the chosen test-layer mode used for verification

## Output

- implementation result: `passed requirements and quality review` | `stopped with unresolved quality findings` | `blocked`
- requirements review status: `correct` | `minor issues` | `major issues`
- quality review assessment: `clean` | `mixed` | `blocked`
- quality rounds used: `<number>`
- stop reason: `none` | `clean` | `max_rounds` | `repeated_unresolved` | `blocked`
- step tracking result: `yes` | `no`
- phase-log result: `updated` | `not-needed` | `none`
