# baicai-vibe-coding Architecture

`baicai-vibe-coding` owns the project runtime that depends on local planning state and step-scoped artifacts.

## Owns

- `@.planning/phase/` step resolution and numbering
- local artifact contracts such as `requirement.md`, `step.md`, `quality-review.md`, and `test-checklist.md`
- planning-memory and archive flows
- review and implementation workflow orchestration tied to this project's conventions

## Depends On

- shared repo-agnostic utilities from `baicai-vibe`
- especially shared rules, skills, agents, and reusable discovery logic

Dependency resolution rule:

- `baicai-vibe-coding` may depend on the `baicai-vibe` package
- shared artifacts must be materialized into `@.opencode/{commands,workflows,rules,skills,agents,plugins}/baicai-vibe/`
- runtime markdown references must target only local project files

## Split Rule

If a file can run without local planning paths or step-local artifact names, it belongs upstream in `baicai-vibe`.
