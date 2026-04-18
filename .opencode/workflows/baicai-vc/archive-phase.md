# Workflow: Archive Phase

## Input

- current live @.planning/phase/ tree
- live branch state: @.planning/phase/branch-phase.toml

## Rules

- @.opencode/rules/baicai-vc/archive-safety.md
- @.opencode/rules/baicai-vc/naming-layout.md
- @.opencode/rules/baicai-vc/planning-memory.md

## Steps

### 1. Handle recovery state

1. If @.planning/phase/branch-phase.toml is already in `archive-sync-pending` state:
   - verify the stored `archiveDestination` is accessible
   - if it is not accessible, stop and report that archive recovery cannot continue until the destination is confirmed
   - rerun @.opencode/workflows/baicai-vc/phase-log-memory/topic-sync.md using the stored destination
   - if topic sync stops for user direction, stop and ask the user how to resolve the canonical conflict before retrying
   - go to [Finalize archived state](#5-finalize-archived-state)

### 2. Resolve and validate the destination

2. resolve current branch live phase metadata and inspect archive layout
3. derive canonical archive destination with the safest deterministic default
4. stop if the destination is ambiguous or requires merge/rewrite

### 3. Validate before moving

5. run @.opencode/workflows/baicai-vc/phase-log-memory/archive-preflight.md
6. if preflight reports `stop for user direction`, stop and ask the user how to proceed
7. only proceed once preflight confirms the move is safe

### 4. Move and stage the archive

8. move the live phase tree into the archive destination with an atomic rename or rollback-safe staged move, excluding @.planning/phase/branch-phase.toml
9. preserve the archived phase `phase-log.md` as the phase snapshot when present
10. if the move fails partway, restore the live phase tree before continuing
11. verify moved content exists in the archive and is complete
12. mark @.planning/phase/branch-phase.toml as `archive-sync-pending` with the chosen archive destination
13. run @.opencode/workflows/baicai-vc/phase-log-memory/topic-sync.md
14. if sync fails or stops for user direction:
   - keep @.planning/phase/branch-phase.toml in `archive-sync-pending`
   - report the blocker with the stored destination
   - exit workflow (sync pending user resolution)
15. if sync succeeds, go to [Finalize archived state](#5-finalize-archived-state)

### 5. Finalize archived state

16. verify archived content exists at the destination
17. clear @.planning/phase/branch-phase.toml
18. remove the remaining empty @.planning/phase/ tree
19. exit workflow (archive complete or recovery complete)

## Exit rules

Follow all rules in @.opencode/rules/baicai-vc/archive-safety.md.
