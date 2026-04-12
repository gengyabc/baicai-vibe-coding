---
description: Clarify a feature request and produce a plan-ready requirement brief
agent: build
model: openai/gpt-5.4
---

The first argument is the feature, problem, or goal to clarify: `$ARGUMENTS`

Run @.opencode/workflows/discover-requirements.md

## Goal

- use the shared discovery core from `baicai-vibe` for repo-agnostic analysis
- resolve that neutral output into one or more local live step folders under @.planning/phase/
- create or refresh one or more `requirement.md` files in the chosen step folders only after explicit user approval
- use @.opencode/rules/discover-requirements-output.md as the local requirement artifact contract
- do not generate implementation steps or code

## Output

- chosen step folder or ordered step-folder sequence
- whether each step folder would be newly created or reused
- whether each `@.planning/phase/<step-folder>/requirement.md` was written or is awaiting approval
- one-line summary of the discovered requirement focus and decomposition decision

## Rules

- create a new step by default
- split the request during discovery when it is too large for one step, so each future step folder gets its own `requirement.md`
- reuse an existing live step only when the request is clearly refining that step and the user explicitly permits reuse
- if the requirement is not ready for planning, continue discovery instead of writing any partial artifact set
- even when discovery is complete, do not create or update any `requirement.md` until the user explicitly approves writing the full proposed set

## Explicit Approval

User must explicitly approve in one of these forms:
- "yes", "approve", "write it", or direct confirmation
- Silence, continued discussion, or implied agreement is NOT approval

## Failure Handling

If the workflow fails, returns unexpected output, or times out:
- return the error state with the workflow failure reason
- do not attempt to write any requirement.md files
