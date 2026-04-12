---
name: step-spec-gate
description: Decide whether the current reviewed live step needs a feature spec, a contract spec, both, or neither, then write the outputs into the same step folder.
disable-model-invocation: true
---

# Step Spec Gate

Use this skill for one reviewed live planning step.

## Inputs

Primary input:

- @.planning/phase/<step-number>-<step-topic>/requirement.md
- @.planning/phase/<step-number>-<step-topic>/step.md

Output files in the same step folder:

- `decision.md` (always required)
- `feature.feature` (optional)
- `contract.md` (optional)

## References

Read these when needed:
- @references/write-bdd-feature.md
- @references/write-step-contract.md
- @.opencode/workflows/decide-step-specs.md
- @.opencode/rules/decision-artifact.md

## Core rule

Do not generate specs just because this skill runs.

Generate specs only when they materially help implementation of the current reviewed step.
Prefer `none` over weak or redundant spec.

## Scope

Work strictly from the current `requirement.md` and `step.md`, with `requirement.md` as the scope authority.

If live or archived planning memory is consulted, use @.opencode/workflows/phase-log-memory/read-context.md semantics and ignore it for spec decisions unless the user explicitly asks for a handoff-oriented rewrite. Specs must stay grounded in the reviewed step, not in execution-memory notes.

## Refresh guard

If the current `requirement.md` was refreshed, compare it against the other live step-local artifacts in the same folder.

Do not generate specs that quietly preserve behavior the refreshed requirement no longer authorizes.

If a prior locked constraint, invariant, or success criterion is missing from the refreshed requirement, treat that as a scope change that must be explicit.

If the step folder does not already mark the removal as superseded, prefer `none` or call out the mismatch instead of freezing stale behavior into new specs.

Do not:

- re-plan
- expand scope
- write implementation code
- invent requirements not grounded in the requirement and step artifacts

## Decision modes

Choose exactly one:

- `none`
- `feature-only`
- `contract-only`
- `feature-and-contract`

## Decision rules

Choose `feature-only` when the step freezes observable behavior such as:

- user-visible UI behavior
- interaction outcomes
- externally testable results

Choose `contract-only` when the step mainly freezes technical boundaries such as:

- invariants
- data shape guarantees
- rendering restrictions
- compatibility guarantees

Choose `feature-and-contract` when both are important.

Choose `none` when the step is mainly:

- refactor
- styling
- glue code
- internal implementation detail

When unsure, choose `none`.

## Extraction priority

Use only the reviewed step content, especially:

1. locked constraints
2. acceptance checks or equivalent batch expectations
3. non-goals and deferred items
4. objective and scope

If something is unclear or deferred:
- do not freeze it into spec

## `decision.md` format

Use the exact schema in @.opencode/rules/decision-artifact.md.

## File rules

- always create or refresh `decision.md`
- create `feature.feature` only when the decision requires it
- create `contract.md` only when the decision requires it
- remove stale generated spec files that no longer match the latest decision

## Output format

- step folder used
- decision
- archive context used or `none`
- files written
- files removed
- one-line reason

## Completion rule

Do not stop until the step folder contains the correct `decision.md` and matching optional spec files.
