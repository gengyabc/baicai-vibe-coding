# Rule: Archive Safety

## Requirements

### Content Integrity
- Archive the whole live phase tree, not a partial step subset
- Never overwrite archived content silently
- Keep archived phase logs mostly immutable after archive
- Make the live phase move rollback-safe so partial archive moves do not leave split state

### Preflight & User Direction
- Run @.opencode/workflows/phase-log-memory/archive-preflight.md before moving live phase content
- Do not move live phase content until preflight confirms the topic-log update is safe
- Require explicit user choice for ambiguous merges or rewrites

### Recovery & Resumption
- If branch state is `archive-sync-pending`, resume recovery before any new archive move begins

### Branch State (Live-Only Files)
- Treat @.planning/phase/branch-phase.toml as live-only state and never archive it
- Write `archive-sync-pending` only after the live phase move succeeds and before topic sync begins

### Cleanup Ordering
- Clear branch memory only after the live move and topic sync both succeed
- Remove the remaining empty live phase tree only after branch memory cleanup finishes

## Violations

- moving @.planning/phase/ before preflight succeeds
- silently merging conflicting archive folders or logs
- dropping manual `topic-log.md` content without explicit direction
- archiving live-only branch state
- starting a fresh archive move while unresolved recovery state is present
