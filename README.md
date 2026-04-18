# baicai-vc

OpenCode artifacts for Vibe Coding methodology - agents, commands, rules, skills, and workflows.

This package extends baicai-vibe with project-specific workflows for structured development processes.

## Owned Paths

This package manages the following paths in `.opencode/`:

### baicai-vc (this package)
- `agents/baicai-vc/`
- `commands/baicai-vc/`
- `rules/baicai-vc/`
- `skills/baicai-vc/`
- `workflows/baicai-vc/`

### baicai-vibe (dependency)
- `agents/baicai-vibe/`
- `commands/baicai-vibe/`
- `plugins/baicai-vibe/`
- `rules/baicai-vibe/`
- `skills/baicai-vibe/`
- `workflows/baicai-vibe/`

Since baicai-vibe is a dependency, both packages' artifacts are managed together:
- **Install**: Copies both baicai-vc and baicai-vibe artifacts
- **Backup**: Backs up both packages before overwriting
- **Uninstall**: Removes both packages' artifacts

## Install

### Prerequisites

This package requires baicai-vibe as a dependency. Both packages must be available.

### Local Development (unpublished)

`bun link` only creates the package link. It does **not** run `postinstall`, so `.opencode/` will not be copied automatically.

To do both steps in one command, use the helper:

```bash
bun /path/to/baicai-vc/bin/link.js
# or
bun ./bin/link.js /path/to/target-project
```

Run that from the target project. It will register the source repo with `bun link`, then link the package into the target project, then run `postinstall`.

Or run the steps manually:

```bash
# In this repo
bun link

# In target project
bun link baicai-vc
node node_modules/baicai-vc/bin/postinstall.js
```

### Via bun (recommended)

```bash
bun add baicai-vc
```

Project install will:
- Copy both baicai-vc and baicai-vibe artifacts into your project
- Prompt before overwriting existing content

Global install is also supported:

```bash
bun add -g baicai-vc
```

To uninstall:
```bash
bun remove baicai-vc
```

> **Note:** Bun doesn't run `preuninstall` scripts for dependencies. Run unlink before removing to clean up `.opencode/` artifacts.
>
> **For normal installs (npm/bun add):**
> ```bash
> baicai-vc-unlink
> bun remove baicai-vc
> ```
>
> **For local development (bun link):** The bin command may not be available, so run manually:
> ```bash
> node node_modules/baicai-vc/bin/unlink.js
> bun remove baicai-vc
> ```

### Update

To update to the latest version:

```bash
bun update baicai-vc
```

Use `BAICAI_VC_FORCE=true` to auto-accept in CI:

```bash
BAICAI_VC_FORCE=true bun update baicai-vc
```

## CI/Non-interactive Install

Postinstall scripts auto-approve prompts when:
- `CI=true` (GitHub Actions, CI environments)
- `BAICAI_VC_FORCE=true` (force mode)
- No TTY (stdin not available)

Set `BAICAI_VC_INSTALL_SCOPE=global` for global installs in CI.

## Artifacts

### Commands

| Command | What it does | When to use |
|---|---|---|
| `archive-phase` | Archive a completed phase to phase archive directory | When a phase is complete and needs preservation |
| `decide-step-specs` | Decide whether a step needs feature/contract specs | Before implementing a planned step |
| `discover-requirements` | Transform user request into plan-ready units | At the start of any feature request |
| `implement-from-plan` | Implement from a verified plan | After planning is complete |
| `lookup-archive-context` | Look up context from archived phases | When needing historical context |
| `plan-step` | Plan a specific step from phase plan | Before implementing a step |
| `recover-phase-log` | Recover lost phase log context | When phase log is missing/corrupted |
| `review-quality` | Run quality review on implementation | After implementation completion |
| `review-requirements` | Run requirements alignment review | Before implementation |
| `write-step-e2e` | Write E2E test for current step | After step implementation |

### Skills

| Skill | What it does | When to use |
|---|---|---|
| `quality-review` | Code review with quality-review.md output | When asked to review code quality |
| `step-spec-gate` | Decide step spec requirements | Before implementing a step |
| `tdd-review-implementation` | Review against step folder plan and specs | After step implementation |
| `write-step-e2e` | Create Playwright E2E spec from step folder | After step implementation |

### Agents

| Agent | What it does | When to use |
|---|---|---|
| `quality-review` | Subagent for quality review workflow | During review-quality workflow |
| `requirements-review` | Subagent for requirements review | During review-requirements workflow |

### Rules

| Rule | What it does | When to use |
|---|---|---|
| `archive-safety` | Safety checks for archiving | During archive operations |
| `decision-artifact` | Structured decision output format | When making decisions |
| `discover-requirements-output` | Output format for discovery | During discovery workflow |
| `naming-layout` | Naming conventions for artifacts | When naming files/directories |
| `planning-memory` | Memory rules for planning phase | During planning |
| `review-artifact` | Structured review output format | During reviews |
| `review-flow` | Flow control for review process | During review workflows |
| `review-quality` | Quality review output structure | During quality review |
| `scope` | Scope boundaries for operations | When defining scope |
| `step-delta-artifact` | Delta format for step changes | When tracking step changes |
| `subagent-failure-response` | Response handling for failures | When subagent fails |
| `tdd` | TDD principles and practices | During test-driven development |
| `test-checklist-artifact` | Checklist format for tests | During test creation |
| `test-layer-mode` | Test layer definitions | When defining test layers |

### Workflows

| Workflow | What it does | When to use |
|---|---|---|
| `archive-phase` | Archive completed phase | When phase is complete |
| `decide-step-specs` | Decide spec requirements for step | Before implementing step |
| `discover-requirements` | Core discovery workflow | At start of feature request |
| `implement-from-plan` | Implement from verified plan | After planning |
| `lookup-archive-context` | Lookup archived context | When needing history |
| `phase-log-memory/*` | Phase log management | During phase tracking |
| `plan-step/*` | Step planning subworkflows | When planning steps |
| `recover-phase-log` | Recover phase log | When phase log lost |
| `review-quality` | Quality review workflow | After implementation |
| `review-requirements` | Requirements review workflow | Before implementation |
| `update-step-tracking` | Update step tracking | After step completion |
| `write-step-e2e` | Write E2E test workflow | After implementation |

## Testing

Tests are located in `bin/__tests__/` and excluded from the npm package.

```bash
bun test
```

Run with coverage:

```bash
bun test --coverage
```

## Validate Package

```bash
npm pack --dry-run
```