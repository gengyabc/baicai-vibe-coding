---
name: write-step-e2e
description: Create or refresh one step-scoped Playwright spec from the current branch's live step folder using the branch phase-topic and durable step key.
---

# Write Step E2E

Write or refresh one canonical Playwright spec for the current reviewed live step.

## Purpose

Use this skill only for browser-level user flows that are visible to the user.

Do not use this skill to duplicate lower-level contract or boundary coverage.

## Support files

- @.opencode/rules/naming-layout.md
- @.opencode/workflows/write-step-e2e.md
- @.opencode/rules/decision-artifact.md

## Inputs

Required:

- @.planning/phase/<step-number>-<step-topic>/requirement.md
- @.planning/phase/<step-number>-<step-topic>/step.md

Optional context:

- @.planning/phase/<step-number>-<step-topic>/decision.md
- @.planning/phase/<step-number>-<step-topic>/feature.feature
- @.planning/phase/branch-phase.toml
- @.planning/phase/phase-log.md only for lightweight handoff context when present, using the phase-log workflows
- matching archived `phase-log.md` or @.planning/archive/<big-topic>/topic-log.md only for continuity context when the flow evolved from earlier archived work

## Output

Canonical output:

- @tests/e2e/<big-topic>/<phase-topic>/<step-key>.spec.ts

Derive the path using @.opencode/rules/naming-layout.md.

`phase-topic` comes from the current branch record in @.planning/phase/branch-phase.toml.
Do not infer it from the step title when the branch phase-topic is already resolved.

Do not treat planning memory as a behavior or path authority. Use @.opencode/workflows/phase-log-memory/read-context.md for read semantics. `requirement.md`, `step.md`, optional `decision.md`, optional `feature.feature`, and `branch-phase.toml` stay authoritative.

Write E2E only when `feature.feature` is present.

If the canonical file exists:
- refresh it in place

If it does not exist:
- create it

Do not create extra sibling files for the same reviewed step unless explicitly requested.

## Scope rules

Write tests only for:

- browser-visible user flows
- host/editor integration behavior
- visible outcomes in the running app

Do not write tests for:

- raw data shape checks
- invariant-heavy contract checks
- internal helper behavior
- speculative future flows
- adjacent reviewed steps
- component state matrices
- exact control implementation choices such as checkbox vs select vs toggle when the user-visible outcome is the real concern
- brittle DOM-shape assertions that depend on descendant structure or incidental test ids

## Scenario rules

Prefer 1 to 3 high-value scenarios.

Treat that as a hard bias, not a suggestion. If more than 3 scenarios seem necessary, push most branch coverage down to lower-level tests and keep only the browser-critical path here.

Each scenario should:

- cover one coherent user journey
- use visible user actions
- assert visible user outcomes
- avoid implementation-detail assertions

Prefer:

- buttons
- visible node rendering
- visible schema help content
- import/export flows

Avoid:

- store internals
- workflow JSON shape assertions unless surfaced in the UI
- duplicate edge-case coverage already proven in lower-level tests
- asserting every validation branch or mode permutation in Playwright for a single component-sized interaction
- selectors that mainly prove implementation structure instead of a visible user outcome

## Refresh rules

When refreshing an existing canonical file:

- preserve still-valid scenarios
- remove stale scenarios no longer supported by the reviewed step
- keep the file focused on the current step only
- preserve the durable `step-key` filename even if step numbering changes later
- preserve the current branch `phase-topic` folder unless the user explicitly changes the phase topic or requests regrouping

## Writing style

- use Playwright Test
- keep selectors resilient and user-facing where practical
- prefer explicit test names in Chinese GWT style
- keep setup minimal
- when an existing Playwright file has drifted into component testing, simplify or delete the wrong-layer assertions during refresh instead of carrying them forward

## Output format

- step file used
- requirement file used
- feature file used or `none`
- decision file used or `none`
- canonical E2E path
- archive context used or `none`
- created or refreshed
- short summary of browser-visible flows covered

## Completion rule

Do not stop until the canonical file is either created or refreshed in place.
