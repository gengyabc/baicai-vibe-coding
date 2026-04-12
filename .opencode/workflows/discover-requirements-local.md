## Objective

Adapt the shared discovery core output into this project's local planning runtime.

## Responsibilities

- call the shared `discover-requirements` core from `baicai-vibe`
- inspect `@.planning/phase/` to decide reuse versus new step creation
- assign local step numbers when new steps are needed
- map approved units to `@.planning/phase/<step-number>-<step-key>/`
- write `requirement.md` only after explicit approval
- enforce `@.opencode/rules/discover-requirements-output.md`

## Non-Responsibilities

- do not redo generic discovery analysis already handled by the shared core
- do not change the shared output contract
