---
name: quality-review
description: Loop-aware code review wrapper that writes append-only quality-review.md files for phase tracking, stable finding IDs, delta review, and verification passes.
---

# Quality Review

Use this skill as a wrapper around @.opencode/skills/baicai-vibe/code-review-expert/SKILL.md when the user wants repeated review/fix/review loops and a machine-readable artifact that survives multiple rounds.

## Base reviewer

- Load @.opencode/skills/baicai-vibe/code-review-expert/SKILL.md first.
- Reuse its severity model, heuristics, and review-first behavior.
- Do not expand scope beyond the requested diff, staged changes, or commit range.

## Inputs

Use these sources, in order:

- Current git diff or requested commit range
- Step-local planning files in @.planning/phase/<step-folder>/
- Existing quality-review.md in the same step folder, when present

## Modes

### full

- Review the full requested change set.
- Establish new phase-scoped finding IDs.
- Initialize the quality-review.md state.

### delta

- Review only changed files plus findings that are still open from the latest quality-review.md.
- Focus on `active_batch_under_review`, findings marked `fixed_pending_review`, and remaining open required findings.
- Do not re-audit unchanged areas.
- Keep IDs stable for carried-forward findings.

### verification

- Check whether previously open findings are now closed, blocked, or still open.
- Only add new findings if they are P0-P2 and directly related to the current delta.

## Output contract

Write or append to @.planning/phase/<step-folder>/quality-review.md.

- If the file does not exist: create it with YAML frontmatter including current `step-version` and `requirement-version` from step.md and requirement.md, then append the first round section.
- If the file exists AND the caller detected version mismatch: invoke in `full` mode, update frontmatter `step-version` and `requirement-version` to current values atomically with the new round section.
- If the file exists AND versions match: append a new round section for the current mode (full, delta, or verification).
- Keep the file append-only for review history.
- Treat only the latest appended round as the current source of truth.
- Keep finding IDs stable across the whole phase.

## Required file shape

Follow @.opencode/skills/baicai-vc/quality-review/references/review-result-schema.md.

At minimum, each round must include:

- Code Review Summary
- Normalized Findings
- Suggested Required Fix Batches
- Previous Findings Verification

## Scope constraints

- Focus on P0-P2 first.
- Limit P3 findings to at most 3 items.
- In delta mode, do not invent new unrelated findings.
- Prefer a small number of sharp findings over noisy coverage.
- Do not open a new batch while the current batch is still under review.

## ID rules

- Use IDs in the form `QR-<phase>-P<level>-NNN`.
- Reuse the same ID for the same underlying issue across rounds.
- Keep the ID if the finding moves or is clarified.
- Do not create a new ID when the issue survives multiple rounds unchanged.
- Do not regenerate IDs randomly.

## Status rules

Use only these statuses:

- `open`
- `fixed_pending_review`
- `closed`
- `blocked`
- `optional`

Ownership rules:

- only the fix workflow may set `fixed_pending_review`
- only quality review may move a finding from `fixed_pending_review` to `closed` or back to `open`
- only quality review may mark a finding `blocked` or `optional`
- the fix workflow must never mark a finding `closed`

## Batch clustering

- Group fixable findings into batches when they share a module or root cause.
- Keep batches small; target a maximum of 3 findings per batch.
- Give each batch a stable `QB-###` identifier.
- Assign each batch a `selection_order` so the primary agent does not re-rank batches between rounds.

## Verification loop

- Read prior findings from the latest quality-review.md before reviewing.
- Treat earlier rounds as history only.
- Track each prior finding as open, closed, blocked, fixed_pending_review, or optional.
- If no P0-P2 findings remain, say so clearly and stop.

## Guardrails

- Allow one `full` quality review, then at most 5 `delta` review rounds before escalation.
- If the same finding ID or same root-cause cluster stays unresolved across repeated rounds without meaningful progress, stop and escalate.
- Meaningful progress means at least one of:
  - fewer open required findings
  - the active batch closes
  - a repeated root-cause cluster is cleared
  - a finding becomes `blocked` with a clear `block_reason`
- If churn is detected, report suspected inadequate fix strategy and manual intervention needed.

## Writing rules

- Keep the human summary brief.
- Put the machine-readable state in the quality-review.md file.
- Preserve prior history when appending a new round.
- Use plain Markdown plus YAML frontmatter only where the schema requires it.
