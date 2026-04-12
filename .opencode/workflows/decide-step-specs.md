# Workflow: Decide Step Specs

## Input

- @.planning/phase/<step-folder>/requirement.md
- @.planning/phase/<step-folder>/step.md

## Rules

- @.opencode/rules/scope.md
- @.opencode/rules/planning-memory.md
- @.opencode/rules/decision-artifact.md

## Steps

1. read @.planning/phase/<step-folder>/requirement.md and @.planning/phase/<step-folder>/step.md
2. consult @.opencode/workflows/phase-log-memory/read-context.md only when continuity context is useful
3. apply @.opencode/skills/step-spec-gate
4. keep outputs in the same step folder as `step.md`

## Exit rules

- do not implement code
- do not modify `step.md`
- do not use planning memory as spec authority
- default next action is `/implement-from-plan <step-number>`
