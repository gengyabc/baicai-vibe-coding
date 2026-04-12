# Rule: Decision Artifact

## Requirements

- persist the spec decision at @.planning/phase/<step-folder>/decision.md
- keep the artifact deterministic so spec-gate, implementation, and E2E flows reuse the same headings and field order
- include these required sections in this order:
  - `# Spec Decision: <step-folder-name>`
  - `- Decision: <none | feature-only | contract-only | feature-and-contract>`
  - `## Why`
  - `## Outputs`
- `## Why` must contain at least one short bullet grounded in the current reviewed step
- `## Outputs` must include exactly these bullets in this order:
  - `- decision.md`
  - `- feature.feature: yes/no`
  - `- contract.md: yes/no`

## Notes

- this artifact is the durable decision basis for step-local spec files
- E2E is written when `feature.feature: yes` is present
