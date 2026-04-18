# Rule: Naming And Layout

## Requirements

- live work stays under @.planning/phase/
- each reviewed step lives at @.planning/phase/<step-number>-<step-topic>/
- branch phase mapping lives at @.planning/phase/branch-phase.toml
- semantic requirement drift for a live step is recorded at @.planning/phase/<step-folder>/delta.md when needed
- canonical archive path is @.planning/archive/<big-topic>/<archive-number>-<phase-topic>/
- canonical E2E path is @tests/e2e/<big-topic>/<phase-topic>/<step-key>.spec.ts
- slugs are lowercase ASCII kebab-case

## Notes

- `step-key` is durable and should remain stable when folders are renumbered
- `phase-topic` comes from branch memory when available
- `archive-number` is assigned only at archive time
- `step.md`, `requirement.md`, `delta.md`, and review artifacts should not repeat `step-number`, `step-folder`, or `phase-topic` in front matter unless a workflow explicitly needs them
- `branch-phase.toml` is live-only state, must not move into archive, and should be cleared only after archive success is confirmed
- `branch-phase.toml` is the live source of truth for the current branch `phase-topic`; live topic changes are normal metadata updates while `status = "live"`
- keep `branch-phase.toml` in a valid schema shape; a light reminder is enough, so avoid casual manual edits unless you mean to change the live mapping intentionally
- during archive, `branch-phase.toml` may temporarily record `status = "archive-sync-pending"` only after the live phase move succeeds so recovery can distinguish an incomplete archive sync from a healthy live mapping

## `step-key`

`step-key` is the durable E2E identity for the reviewed step.

Use this priority:

- `step-key:` in `requirement.md` front matter
- slugged step title from `step.md`
- slugged `<step-number>-<step-topic>` folder name

Keep `step-key` stable even if the step folder is renumbered during archive merge.

## Version Fields

- `requirement-version:` in `requirement.md` front matter tracks requirement drift.
- `requirement.md` front matter should stay slim; avoid repeating path-derived fields like step number, folder, or phase topic.
- `requirement-version:` in `step.md` front matter must match the current requirement revision for the step plan to be fresh.
- `step.md` front matter should stay slim: `step-key`, `step-version`, and `requirement-version` are enough for freshness and identity.
- `step-version:` in `step.md` front matter tracks step-plan revisions.
- When `requirement.md` changes materially, bump `requirement-version` and refresh `step.md` so its copied `requirement-version` matches.
- When a requirements review is saved, copy both the reviewed `requirement-version` and `step-version` so stale review evidence is detectable.
- When `requirement.md` changes materially after an earlier reviewed version existed, create or refresh `delta.md` so implementation and review can see the semantic delta explicitly.

## `big-topic`

Choose one bucket only:

- `browser-host`
- `editor`
- `domain-core`
- `host-contracts`
- `misc`

Pick the main delivery target. If unsure, use `misc`.

## Branch Phase Schema

Healthy live mapping shape:

```toml
branch = "<branch>"
phaseTopic = "<phase-topic>"
livePhasePath = ".planning/phase"
status = "live"
implementedStepKeys = ["<step-key>"]
```

Archive recovery shape:

```toml
branch = "<branch>"
phaseTopic = "<phase-topic>"
livePhasePath = ".planning/phase"
status = "archive-sync-pending"
archiveDestination = ".planning/archive/<big-topic>/<archive-number>-<phase-topic>/"
```

Requirements:

- `status` is always required
- `status = "archive-sync-pending"` means the live phase move has completed and `/archive-phase` must resume sync/cleanup before any normal planning continues
- `phaseTopic` remains required so the branch retains phase identity during recovery
- `archiveDestination` is required for `archive-sync-pending` so recovery can resume `topic-sync` deterministically
- `implementedStepKeys` is optional for `status = "live"` and records implemented reviewed steps by durable `step-key`
- do not use step numbers for implemented-step tracking because future re-planning may renumber folders

## Transition examples

Before archive:

```text
@.planning/phase/
  branch-phase.toml        # status = "live"
  01-example-step/
```

After move succeeds and before cleanup finishes:

```text
@.planning/phase/
  branch-phase.toml        # status = "archive-sync-pending"

@.planning/archive/<big-topic>/<archive-number>-<phase-topic>/
  01-example-step/
```

After cleanup clears branch memory:

```text
@.planning/archive/<big-topic>/<archive-number>-<phase-topic>/
  01-example-step/
```
