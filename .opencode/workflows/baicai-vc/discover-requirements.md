## Objective

Use the shared discovery core from `baicai-vibe` to produce neutral proposed units, then map those units into this project's live step folders and local `requirement.md` artifacts only after explicit user approval.

## Inputs

- user request
- optional current discussion context
- current live step folders under @.planning/phase/

## Shared dependency

- call @.opencode/workflows/baicai-vibe/discover-requirements-core.md first
- treat its output as the only source for decomposition, durable keys, assumptions, open questions, and success criteria

## Local ownership

- inspect @.planning/phase/ to decide reuse versus new step creation
- assign next step numbers for new steps
- map approved units to @.planning/phase/<step-number>-<step-key>/
- write `requirement.md` using @.opencode/rules/baicai-vc/discover-requirements-output.md

## Step 1 - Run shared discovery core

Call the shared core and wait for one of these outputs:

- `status: ready`
- `status: needs-more-discovery`
- `status: blocked`

If the shared core is not `ready`, stop without writing anything.

## Step 2 - Resolve local steps

For each proposed unit from the shared core:

- default to creating a new step folder
- reuse an existing live step only when the request is clearly refining that exact step and the user explicitly permits reuse
- derive a durable lowercase ASCII kebab-case `step-key`
- when creating new steps, scan @.planning/phase/ for numbered live step folders and use the next available contiguous numbers
- map each unit to `@.planning/phase/<step-number>-<step-key>/`

## Step 3 - Present local write plan

Before any write:

- present the chosen step folder or ordered step-folder sequence
- state whether each folder will be created or reused
- restate one-line focus per step
- include main assumptions and remaining non-blocking open questions from the shared core
- ask whether to create or refresh the full local `requirement.md` set

Silence, continued discussion, or implied agreement is not approval.

## Step 4 - Write local artifacts

Only after explicit approval:

- create any missing step folders
- write exactly one `requirement.md` per approved step folder
- write each file exactly per @.opencode/rules/baicai-vc/discover-requirements-output.md
- when refreshing an existing requirement, refresh the whole file so front matter and body stay aligned
- if updating an existing `requirement.md` with incremented `requirement-version`, warn that `delta.md` will need generation during `/plan-step` and the step will require re-review

## Step 5 - Return

Summarize:

- chosen step folder or ordered step-folder sequence
- whether each folder was created or reused
- durable `step-key` or ordered `step-key` set
- remaining open questions, if any
- whether each `requirement.md` was written or is still awaiting approval
