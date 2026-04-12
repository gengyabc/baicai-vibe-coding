# Replan Step

Use this workflow when `/plan-step <step-number>` resolves to an existing live step that needs its plan refreshed because the step key is not yet implemented or the copied `requirement-version` is stale.

- Use the resolved step as the only planning target.
- Create or refresh `step.md` for that resolved step only.
- Read the step's `requirement.md` and `step.md` front matter before changing `step.md`.
- If `step.md` conflicts with `requirement.md` or its copied `requirement-version` is stale, refresh it from the current `requirement.md`.
- If the `requirement.md` is too broad, ambiguous, or would need decomposition into multiple future steps, stop and ask for `/discover-requirements <updated-needs>` instead of splitting during planning.
- Do not touch any other `step.md` file.

See @.opencode/workflows/plan-step/common.md
