# Rule: Scope

## Requirements

- stay within the current command or reviewed step scope
- honor `requirement.md`, `step.md`, `decision.md`, `feature.feature`, and `contract.md` in source order
- respect non-goals, deferred items, and locked constraints
- for reviewed step delivery work, also respect the step's objective, scope, TDD batches, files section, and symbols section
- when verifying delivery or fixes, confirm the changed work stays within the current reviewed step and does not introduce adjacent-step behavior

## Violations

- implementing adjacent steps
- introducing speculative architecture
- broad cleanup unrelated to the current task
- implementing optional ideas not frozen by the current step
- accepting out-of-scope behavior during verification
