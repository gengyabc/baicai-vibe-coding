# Write BDD Feature

Write `feature.feature` for the current reviewed live step folder.

## Purpose

`feature.feature` describes observable behavior for the current step.

It helps implementation, testing, and review by showing:

- what the user or external system does
- what the system visibly does in response

It must not explain internal wiring.

## Source

Read:

- @.planning/phase/<step-number>-<step-topic>/step.md

Write:

- @.planning/phase/<step-number>-<step-topic>/feature.feature

## Scope rules

- cover only the current reviewed step
- do not expand scope
- do not invent requirements
- do not duplicate contract content

## Scenario rules

- prefer 2 to 5 scenarios
- one scenario = one main interaction
- exactly one primary `When`
- keep setup minimal
- keep outcomes observable and testable

Prefer scenarios for:

1. the main success path
2. an important visible variant
3. a visible restriction when explicitly required

## Feature boundary

Keep `feature.feature` at behavior level.

Move content to `contract.md` when it mainly describes:

- invariants
- data shape
- rendering guarantees
- compatibility rules

## Cleanup pass

Before finalizing:

- remove speculative or placeholder scenarios
- remove scenarios for empty states unless the step explicitly requires them
- ensure all scenarios remain single-interaction and behavior-only
