# Workflow: Write Step E2E

Write or refresh one canonical Playwright E2E spec for a reviewed live step.

## Input

- @.planning/phase/<step-folder>/requirement.md (required)
- @.planning/phase/<step-folder>/step.md (required)
- optional @.planning/phase/<step-folder>/feature.feature
- optional @.planning/phase/<step-folder>/decision.md
- @.planning/phase/branch-phase.toml for phase-topic resolution

## Rules

- @.opencode/_vendor/baicai-vibe/rules/token-efficient-workflow.md
- @.opencode/rules/test-layer-mode.md
- @.opencode/rules/scope.md
- @.opencode/rules/planning-memory.md
- @.opencode/rules/naming-layout.md
- @.opencode/rules/decision-artifact.md

## Steps

1. read `requirement.md`, `step.md`, and `feature.feature` when present
2. determine if E2E should be written using @.opencode/rules/test-layer-mode.md
3. if E2E is not needed, exit early with "no feature.feature present"
4. consult @.opencode/workflows/phase-log-memory/read-context.md only when continuity context is useful
5. resolve the canonical E2E path from @.opencode/rules/naming-layout.md
6. invoke @.opencode/skills/write-step-e2e/SKILL.md to create or refresh the Playwright spec
7. keep only scenarios that are valid for the current reviewed step
8. trim or reject scenarios that mainly prove component internals, control permutations, or DOM structure better handled by lower-level tests

## Output

- canonical E2E path or "none"
- whether file was created or refreshed

## Exit rules

- do not duplicate lower-level contract coverage
- do not create extra sibling E2E files by default
- do not write E2E when test-layer-mode is `lower-level only`
- do not treat planning memory as stronger than the current reviewed step and optional feature spec
- do not preserve brittle Playwright assertions just because they already exist; refresh them down to user-visible outcomes or remove them when they belong in lower-level tests
- next manual action is usually `/review-requirements <step-number>` only when `/write-step-e2e` is run standalone after the normal delivery flow
