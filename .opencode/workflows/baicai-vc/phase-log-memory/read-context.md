# Workflow: Phase Log Memory Read Context

## Input

- current task context
- optional live step folder
- optional lookup hint
- optional mode: `normal` or `archive-only`

## Rules

- @.opencode/rules/baicai-vc/planning-memory.md
- @.opencode/rules/baicai-vibe/entrypoint-compatibility.md

## Steps

### Normal mode

1. resolve the narrowest useful planning-memory target
2. read live `phase-log.md` only when it helps the current task
3. read matching archived `phase-log.md` only when needed
4. read `topic-log.md` only when broader history is needed
5. return concise active outcomes, superseded decisions, follow-ups, and relevant refs

### Archive-only mode

Use this mode for `/lookup-archive-context` and any other explicit archive-only lookup flow.

1. use live step context and live `phase-log.md` only to resolve or disambiguate the lookup target
2. do not use live sources as the final answer source
3. search archived sources in this order:
   - archived same `step-key`
   - archived same `phase-topic`
   - @.planning/archive/<big-topic>/topic-log.md
   - broader related archive in the same `big-topic` only as fallback
4. if no relevant archive match exists, report that no relevant archive context was found
5. return only archive-grounded active direction, superseded decisions, follow-ups, and refs

## Exit rules

- do not let planning memory override the live step folder or current code
- do not load broad archive history when local context is enough
- do not let archive-only lookup answer from live sources
