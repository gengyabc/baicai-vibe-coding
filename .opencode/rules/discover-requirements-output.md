# Discover Requirements Output Contract

Persist the discovered requirement in `requirement.md`.

Each `requirement.md` is step-local and authoritative only for its own step folder.
When discovery decomposes a large request into multiple future steps, generate one contract-conforming `requirement.md` per step folder.

## Front matter

Include YAML front matter with exactly these keys, in this order:

1. `step-key`
1. `step-number`
1. `step-folder`
1. `phase-topic`
1. `status`
1. `requirement-version`
1. `updated-at`
1. `source`
1. `supersedes`

`status` must be `discovered`.
`requirement-version` must track the discovered requirement revision for the step.
`source` must be `discover-requirements`.

## Body

Return exactly the following sections, in this order.

The body must describe only the single step represented by that file, even when it came from a larger decomposed request.

## Restated Request
A concise restatement of the user's request.

## Real Objective
The likely true goal behind the request.

## Problem Statement
The user-centered problem to solve.

## In Scope
What must be included in planning.

## Out of Scope
What must NOT be included.

## Constraints
Confirmed constraints that affect planning.

## Assumptions
Minimal necessary assumptions (clearly marked).

## Open Questions
Only questions that do NOT block planning.

If something blocks planning, do NOT return this contract.

## Success Criteria
What defines success.

## Suggested Planning Focus
What planning should focus on first.
Do NOT include implementation steps.

## Rules

- Return only final conclusions
- Do not include interview process
- Do not include question history
- Do not include reasoning traces
- Do not include implementation details
- Do not include code
- Return only when ready for planning
- Persist this contract as `@.planning/phase/<step-folder>/requirement.md`
- When decomposing, write one file per approved step folder and keep each file scoped to that step only
- Order decomposed sibling steps by dependency so each remains independently plannable and reviewable
