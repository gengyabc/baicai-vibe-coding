# Continue Step

Use this workflow when `/plan-step <step-number>` resolves to an existing live step whose `step-key` is already present in `implementedStepKeys` and whose copied `requirement-version` still matches `requirement.md`.

- Treat the resolved step as the only planning target.
- Create or refresh `step.md` for that resolved step only.
- Read the step's `requirement.md` and `step.md` front matter before changing `step.md`.
- If `step.md` conflicts with `requirement.md` or its copied `requirement-version` is stale, refresh it from the current `requirement.md` instead of stopping.
- If the `requirement.md` is too broad, ambiguous, or would need decomposition into multiple future steps, stop and require refreshed discovery instead of changing the requirement topology during planning.
- Do not touch any other `step.md` file.

See @.opencode/workflows/baicai-vc/plan-step/common.md
