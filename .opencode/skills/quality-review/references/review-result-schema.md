# quality-review.md schema

This file defines the append-only artifact written by @.opencode/skills/quality-review/SKILL.md.

## File path

Write to:

- `.planning/phase/<step-folder>/quality-review.md`

## Top-level frontmatter

The first block in the file must be YAML frontmatter.

```yaml
---
schema: review-result-v1
skill: quality-review
phase: <phase-topic>
step_folder: <step-folder>
result_file: .planning/phase/<step-folder>/quality-review.md
finding_id_scope: phase
append_only: true
step-version: <step-version>
requirement-version: <requirement-version>
---
```

## Current-state rule

- The latest appended round is the only current source of truth.
- Earlier rounds are history only.
- Earlier rounds may be used only for churn comparison and audit history.

## Round section

Append one round section per pass.

```md
## Round <n>

```yaml
round: <n>
mode: full|delta|verification
assessment: clean|mixed|blocked
base_sha: <git-sha>
head_sha: <git-sha>
scope: <files-or-range>
stop_reason: none|max_rounds|repeated_unresolved|blocked|clean
manual_intervention_required: true|false
active_batch_under_review: QB-###|none
open_findings: <number>
batch_count: <number>
repeated_findings:
  - QR-...
repeated_root_cause_clusters:
  - <cluster>
```

### Code Review Summary

Brief human summary.

### Normalized Findings

Each finding must use this shape:

- ID: `QR-<phase>-P<level>-NNN`
- Priority: `P0|P1|P2|P3`
- Required: `yes|no`
- Status: `open|fixed_pending_review|closed|blocked|optional`
- Title:
- Location:
- Root Cause Cluster:
- Batch Candidate:
- Summary:
- Impact:
- Recommended Fix:
- Block Reason: required when status is `blocked`

### Suggested Required Fix Batches

Each batch must use this shape:

- Batch ID: `QB-###`
- Selection Order: `<number>`
- Findings:
- Reason:

### Previous Findings Verification

Each prior finding must use this shape:

- ID:
- Previous Status:
- Current Status: `open|fixed_pending_review|closed|blocked|optional`
- Notes:
```

## Stability rules

- Reuse the same finding ID for the same issue across the whole phase.
- Keep the same ID if the title, location, or explanation changes.
- Only create a new ID for a genuinely new issue.
- Only the latest round may be used as current state.
- Only review may move findings to `closed`.

## Delta rules

- Review changed files first.
- Also check prior open findings.
- Do not rescan unrelated unchanged code.

## Verification rules

- Confirm previously open findings are closed, blocked, or still open.
- Only introduce new findings if they are clearly tied to the current delta and matter at P0-P2.
