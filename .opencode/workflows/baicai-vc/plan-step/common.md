# Common Planning Rules

## Rules

- @.opencode/rules/baicai-vc/scope.md
- @.opencode/rules/baicai-vc/naming-layout.md
- @.opencode/rules/baicai-vc/step-delta-artifact.md
- @.opencode/rules/baicai-vc/planning-memory.md

## Preconditions

- If `branch-phase.toml` has `status = "archive-sync-pending"`, stop and route to @.opencode/workflows/baicai-vc/archive-phase.md first
- Resolve `phase-topic` from `branch-phase.toml`; ask if missing or invalid, or when the user explicitly intends to continue this branch under a different live `phase-topic`
- Persist `branch-phase.toml` in valid `status = "live"` shape once phase-topic is known, preserving existing durable fields like `implementedStepKeys`
- Inspect existing live step folders under @.planning/phase/
- Read `requirement.md` for the resolved target step folder before planning
- Read the front matter in `requirement.md` and `step.md`; use `step-key` and `requirement-version` from front matter, not inline body text
- Read `delta.md` when present, and refresh it when requirement drift changes preserved, removed, or replacement behavior materially
- Consult @.opencode/workflows/baicai-vc/phase-log-memory/read-context.md only when prior planning context is useful

## Input Priority

Current user request over all the others


## Planning Process

- Assess done vs not-done work using current user request, `requirement.md`, step-local artifacts, and current implementation evidence (do NOT treat planning memory as scope authority)
- Trace every planned behavior back to same-folder `requirement.md`; do not silently invent behavior, constraints, or workflows during planning
- Check whether the requirement is still specific enough for deterministic planning; if important behavior, constraints, or outcomes are still ambiguous, stop and require refreshed discovery instead of guessing
- Check lightweight planning risks before finalizing steps: ambiguity risk, scope risk, dependency risk, and testability risk
- Determine the resolved target step folder from the provided step number
- Use only already-discovered step folders under @.planning/phase/; do not create new folders during planning
- Treat `requirement.md` as the scope authority and write `step.md` as the execution plan derived from it
- If an existing `step.md` conflicts with `requirement.md`, or its copied `requirement-version` is stale, refresh it from the current `requirement.md` for the resolved step instead of preserving stale planning text
- **MANDATORY**: If `requirement-version` changed materially after an earlier reviewed revision:
  - Compare current `requirement-version` in `requirement.md` against previous version in existing `step.md` front matter
  - If version differs, create or refresh `delta.md` before writing refreshed `step.md`
  - `delta.md` must explicitly list preserved, removed, and replacement behaviors
  - If semantic drift is unclear, re-read the old `requirement.md` content (from git or existing review artifacts) to identify the drift
  - Never skip `delta.md` creation when requirement version incremented; this is a hard requirement for review correctness

## Step Creation

- Require `@.planning/phase/<step-folder>/requirement.md` before creating or refreshing `step.md`
- Refresh `@.planning/phase/<step-folder>/delta.md` when requirement drift is semantic rather than clerical
- Write `step.md` with this structure:

```md
---
step-key: <durable-kebab-case-key>
step-version: <existing-step-version + 1 when refreshing, otherwise 1>
requirement-version: <requirement-version>
---

# <title>

---

## Objective
...

---

## Locked constraints
...

---

## Scope

### In
...

### Out
...

---

# TDD Batches

## Batch 1: <primary concern>
...

## Batch 2: <next concern>
...

---

## Files
...

## Symbols
...

## Execution constraints
...

## Invariants
...

## Deferred follow-up
...
```
---

## Batches

- 3-5 batches total, one primary concern each
- Tests before implementation per batch
- Do not let later batches absorb earlier missing work
- Ensure the full batch set covers the primary path plus any requirement-defined failure path, warning path, and key boundary behavior

## Planning constraints

- keep scope to one vertical slice
- keep non-goals and deferred items clear
- make file references explicit
- make referenced symbols explicit
- keep the plan deterministic enough for TDD execution
- record preserved existing behavior under `Invariants` whenever the requirement depends on not changing current behavior
- treat live and archived planning memory as optional context only

## Exit rules

- do not create spec files here
- do not create `phase-log.md`
- do not use planning memory as planning authority
- do not modify `requirement.md`
- do not create new requirement files here
- next action is `/decide-step-specs <recommended-step-number>`
