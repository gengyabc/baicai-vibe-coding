---
name: tdd-review-implementation
description: Review one reviewed live planning step against its step folder plan and specs with strict TDD validation.
---

# Review Implementation Skill

You are a senior reviewer validating correctness and TDD discipline for one reviewed live step.

Follow @.opencode/_vendor/baicai-vibe/rules/coding-style.md.

## Core rules

- do not modify code
- do not implement fixes
- only review and report
- be precise and evidence-based
- do not invent requirements outside the step folder
- detect both correctness issues and TDD process violations

## Input priority

1. `requirement.md`
2. `step.md`
3. `delta.md` when present
4. `decision.md`, `feature.feature`, `contract.md` in the same step folder
5. tests
6. codebase
7. live and archived planning memory only as optional context
8. @.opencode/workflows/phase-log-memory/read-context.md and @.opencode/workflows/phase-log-memory/review-note.md when planning-memory context is needed
9. @.opencode/workflows/review-requirements.md as the review workflow contract

## Spec discovery

Default live locations:

- @.planning/phase/<step-number>-<step-topic>/requirement.md
- @.planning/phase/<step-number>-<step-topic>/step.md
- @.planning/phase/<step-number>-<step-topic>/feature.feature
- @.planning/phase/<step-number>-<step-topic>/contract.md

Archive files are not implicit fallback spec sources.

Use archived `feature.feature` or `contract.md` only when the current live step folder explicitly references them.

Matching priority:

1. files in the current live step folder
2. archived files explicitly referenced by the current step or decision

If @.planning/phase/phase-log.md exists:

- use it only for execution-memory context
- never treat it as a stronger source than the step folder, tests, or code

If matching archived `phase-log.md` or `topic-log.md` exists:

- use it only for historical context and continuity checks
- prefer exact `step-key` and same `phase-topic` matches before broader `big-topic` history
- never treat it as a stronger source than the live step folder, tests, or code

## Review dimensions

You must check all 5 dimensions:

1. requirement and plan -> code alignment
2. spec -> code alignment
3. contract validation
4. test quality
5. TDD compliance

## Behavior replacement validation

Before reviewing code details, derive a behavior matrix from the live step folder:

- preserved behaviors
- removed behaviors
- replacement behaviors

Use that matrix to validate implementation and tests.

If `delta.md` is present, treat it as the semantic-drift guide for identifying which evidence is stale and which removed behaviors must be disproven.

For each removed or superseded behavior named by the current step artifacts:

- verify tests and code no longer require or preserve it
- verify any replacement behavior does not merely coexist with the removed behavior
- treat contradictory surviving behavior as a correctness issue, not a minor stylistic issue

Do not treat different UI surfaces as interchangeable evidence. If the step distinguishes inline feedback, toast feedback, and bottom-panel feedback, review each surface separately.

The implementation is not `correct` if:

- any removed behavior still exists
- a preserved behavior is proven only through a different UI surface than the live step requires
- a replacement behavior was added without deleting the superseded behavior

## TDD validation

Check:

- were tests written for new behavior
- would those tests fail without the implementation
- is implementation minimal
- is refactor safe
- do tests also prove removed behavior is gone when the step explicitly removes or replaces prior behavior

Detect anti-patterns:

- fake TDD
- overly weak tests
- over-implementation
- future-proofing outside scope

## Output format

Return the review as the exact durable artifact defined by @.opencode/rules/review-artifact.md.


- return review content that the workflow can save to @.planning/phase/<step-number>-<step-topic>/requirements-review.md
- follow @.opencode/rules/review-artifact.md exactly so later `/review-quality` work can parse the same durable structure every time
- keep the returned content concise, deterministic, and sufficient for later `/review-quality` work

## Completion rule

Do not stop until the review clearly states whether the implementation matches the current live step folder and whether true TDD was followed.
