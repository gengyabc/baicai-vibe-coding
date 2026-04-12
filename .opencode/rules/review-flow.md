# Rule: Review Flow

## Requirements

- use the live step folder as the source of truth
- read `requirement.md` before `step.md`, and `delta.md` when present
- treat copied `requirement-version` values as stale when they differ from `requirement.md`
- treat copied `step-version` values as stale when they differ from `step.md`
- **MANDATORY**: If `requirement-version` changed from prior committed version but `delta.md` is missing:
  - do NOT proceed to requirements review loop
  - stop immediately with finding: "delta.md missing for requirement version change"
  - require action: "Run `/plan-step <step-number>` to generate delta.md"
- read review artifacts deterministically so repeated fix loops use the same current state
- requirements-review and quality-review both run an automatic fix loop before they exit
- in requirements-review flow, use `requirements-review.md` as the durable source of truth for the reviewed requirement and step versions
- in quality-review flow, use the latest appended round in `quality-review.md` as the only current source of truth
- in quality-review flow, select the caller-supplied batch when present, otherwise pick the next open batch by lowest `selection_order`
- do not open a new batch while the active batch is still under review or any targeted finding remains `fixed_pending_review`
- after each quality fix pass, run `@quality-review` in `delta` mode
- when no open required findings remain, run `@quality-review` in `verification` mode and stop on the latest verification result
- stop on `correct`, `clean`, `max_rounds`, `repeated_unresolved`, or `blocked` as applicable to the current flow
- update step tracking only when requirements review is `correct` and the latest quality round is clean with no unresolved required findings

## Requirements Review Loop

- run `@requirements-review` and persist its result to @.planning/phase/<step-folder>/requirements-review.md
- if requirements review status is not `correct`, fix alignment issues and rerun `@requirements-review` until status is `correct` or the work becomes blocked
- stop immediately if requirements review remains blocked or major issues cannot be resolved within the current step scope

## Quality Review Loop

- invoke `@quality-review` in `full` mode; it records the first quality round in @.planning/phase/<step-folder>/quality-review.md
- read only the latest round in @.planning/phase/<step-folder>/quality-review.md as current state
- if no open required findings remain, invoke `@quality-review` in `verification` mode; stop if verification is clean, otherwise treat the latest verification round as the current state and continue only if required findings reopened
- otherwise select the next batch by lowest `selection_order`, set it as `active_batch_under_review`, and enter the quality fix loop
- for each quality fix loop round:
  - run @.opencode/workflows/review-quality.md against the active batch; only the targeted findings may become `fixed_pending_review`
  - invoke `@quality-review` in `delta` mode
  - read only the latest round in @.planning/phase/<step-folder>/quality-review.md as current state
  - if the latest round reports `stop_reason: repeated_unresolved`, stop immediately, report escalation, and do not select another batch
  - if the latest round reports `stop_reason: max_rounds`, stop immediately, report unresolved required findings, and do not select another batch
  - if the latest round reports blocked required findings that prevent safe progress, stop and report manual intervention needed
  - if there is still an `active_batch_under_review` or any targeted finding remains `fixed_pending_review`, do not open a new batch; continue verification of that batch first
  - if no open required findings remain, invoke `@quality-review` in `verification` mode and stop on the latest verification result
  - otherwise select the next batch by lowest `selection_order` and repeat the quality fix loop

## Notes

- keep the loops bounded and deterministic
- escalation is better than selecting another batch while the current one is still unresolved
