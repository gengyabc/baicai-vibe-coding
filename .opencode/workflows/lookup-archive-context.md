# Workflow: Lookup Archive Context

## Input

- user question and optional lookup hint

## Rules

- @.opencode/rules/planning-memory.md

## Steps

1. identify the current live need or user question
2. resolve a durable lookup target from the user hint or live context only for disambiguation
3. if no durable lookup target can be resolved, stop and report: `Archive lookup needs a hint or a resolvable live/archive target`
4. call @.opencode/workflows/phase-log-memory/read-context.md in archive-only lookup mode
5. summarize only the relevant active direction, superseded decisions, follow-ups, and archive references

## Exit rules

- do not modify files
- do not use live step context or live `phase-log.md` as the final answer source for this command
- do not dump full archive files when a concise summary is enough
- when history is missing or ambiguous, say so explicitly
