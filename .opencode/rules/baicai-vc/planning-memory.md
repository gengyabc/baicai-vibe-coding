# Rule: Planning Memory

## Variables
- `planning_path`: `.planning/`
- `archive_path`: `<planning_path>/archive`
- `phase_path`: `<planning_path>/phase/`
- `step_path`: `<phase_path>/<step-folder>/`

## Step-local file roles
- `requirement.md`: discovered user requirement, scope authority, constraints, success criteria, and planning focus
- `step.md`: execution plan, files, symbols, non-goals, deferred items, batch structure
- `decision.md`: which optional specs are expected
- `feature.feature`: observable behavior to test (if present)
- `contract.md`: invariants and boundaries to preserve (if present)

## Source priority (narrowest to broadest)
1. Step-local: `requirement.md` → `step.md` → `decision.md` → `feature.feature` → `contract.md`
2. Tests and code when relevant
3. Live `phase-log.md`
4. Archived phase memory: `<archive_path>/<topic_folder>/<phase_folder>/phase-log.md`
5. Archived topic memory: `<archive_path>/<topic_folder>/topic-log.md`
6. Spikes

For implementation workflows, add current user instructions (if they don't expand scope) after step-local files, before broader planning memory.

## Rules
- Planning memory is supporting context only, never scope authority
- Prefer narrowest relevant context first
- `requirement.md` is the first step-local scope authority when present
- If specs don't exist, follow the plan—don't invent behavior
- If `decision.md` expects a missing file, note the gap and continue with existing files
- Archive lookups: use live sources only to disambiguate the target
- Keep `phase-log.md` and `topic-log.md` in canonical structure
- Preserve superseded direction; don't delete history silently
- Update planning memory only for phase-level handoff, not routine progress

## Violations
- Using planning memory as scope authority
- Letting archive override current step
- Loading broad archive when step-local files answer the question
- Answering archive lookups from live sources
- Silently dropping superseded direction or safe manual content
