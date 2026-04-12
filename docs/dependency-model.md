# Dependency Model

`baicai-vibe-coding` depends on `baicai-vibe` as a package.

## Rule

- package dependency is allowed: `baicai-vibe-coding -> baicai-vibe`
- OpenCode runtime references must stay local to the project
- therefore shared artifacts must be synced into `@.opencode/_vendor/baicai-vibe/`

## Expected package flow

1. install `baicai-vibe`
2. materialize its shared `.opencode` artifacts into `@.opencode/_vendor/baicai-vibe/`
3. let local commands, workflows, rules, skills, and agents reference only local files

## Why

- works for future `npx` install flows
- keeps runtime behavior reproducible per project
- avoids hidden global machine state
- preserves one-way dependency only

## Sync contract

Use `@scripts/sync-baicai-vibe.sh <source-dir>` to copy the shared OpenCode artifact tree into the vendored location.

Expected source shape from `baicai-vibe`:

- `commands/`
- `workflows/`
- `rules/`
- `skills/`
- `agents/`
