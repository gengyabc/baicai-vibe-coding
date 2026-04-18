# Write Step Contract

Write `contract.md` for the current reviewed live step folder.

## Purpose

`contract.md` defines the minimum technical boundaries required before implementation.

It describes what must remain true, not how it is implemented.

## Source

Read:

- @.planning/phase/<step-number>-<step-topic>/step.md

Write:

- @.planning/phase/<step-number>-<step-topic>/contract.md

## Scope rules

- write only for the current reviewed step
- do not expand scope
- do not invent requirements
- do not describe architecture
- do not duplicate feature behavior

## Recommended structure

```md
# Contract: <step-folder-name>

## Invariants
- ...

## Rendering / Resolution Constraints
- ...

## Compatibility Constraints
- ...
```

Use only necessary sections.

## Contract content

Include only:

- invariants
- data shape guarantees
- selection guarantees
- resolution rules
- rendering restrictions
- compatibility constraints

Do not include:

- helper names
- setter names
- function names
- file paths
- module paths
- architecture decisions

## Cleanup pass

Before finalizing:

- ensure every line reads as an invariant or guarantee
- remove implementation-detail wording
- delete any line that cannot be rewritten cleanly as a boundary rule
