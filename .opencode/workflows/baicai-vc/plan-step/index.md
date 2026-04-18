# Workflow Group: Plan Step

This workflow group handles reviewed step planning for the current branch phase topic.

## Modes

- `initial`: create the first plan for a live step whose `requirement.md` exists but `step.md` does not yet exist
- `replan-from`: re-plan from an existing unimplemented live step
- `continue-after`: plan after an existing implemented live step

## Routing

- `@.opencode/commands/baicai-vc/plan-step.md` is responsible for argument validation, step resolution, and mode selection
- `requirement.md` is the step-local requirement authority for every mode in this workflow group, and cross-folder decomposition must already be settled by discovery
- after routing, the command calls exactly one mode workflow under this folder
- shared planning rules live in @.opencode/workflows/baicai-vc/plan-step/common.md
