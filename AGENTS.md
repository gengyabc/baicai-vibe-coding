# baicai-vc Agent Guide

This package provides structured development workflows for OpenCode.

## Installation Behavior

When installed, baicai-vc copies artifacts to `.opencode/baicai-vc/` subdirectories:
- `agents/baicai-vc/`
- `commands/baicai-vc/`
- `rules/baicai-vc/`
- `skills/baicai-vc/`
- `workflows/baicai-vc/`

The postinstall script prompts before overwriting. In CI environments with `CI=true` or `BAICAI_VC_FORCE=true`, prompts are auto-approved.

## Primary Workflows

### Requirements Discovery
Use `/discover-requirements` to transform user requests into plan-ready units.

### Implementation Pipeline
1. `/review-requirements` - Verify requirements alignment
2. `/plan-step` - Plan specific step
3. `/decide-step-specs` - Decide if specs needed
4. `/implement-from-plan` - Implement
5. `/review-quality` - Quality review
6. `/write-step-e2e` - E2E tests if needed

### Phase Management
- `/archive-phase` - Archive completed phases
- `/lookup-archive-context` - Lookup archived context
- `/recover-phase-log` - Recover lost phase logs

## Key Rules

- `naming-layout.md` - File/directory naming conventions
- `tdd.md` - TDD principles
- `review-flow.md` - Review process flow
- `scope.md` - Scope boundaries

## Skills

Use skills for specialized tasks:
- `quality-review` - Code quality review
- `step-spec-gate` - Spec decision helper
- `tdd-review-implementation` - TDD implementation review
- `write-step-e2e` - E2E test creation

## Dependencies

baicai-vc depends on baicai-vibe for shared base functionality. Both packages should be installed together.
