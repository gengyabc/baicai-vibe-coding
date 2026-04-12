# Planning Architecture Validation Checklist

Use this checklist before reducing legacy entrypoint layers or merging major planning-system refactors.

## Mapping checks

- every planning command maps to exactly one workflow
- every workflow references the rules it depends on
- every atomic skill avoids owning orchestration

## Entrypoint stability checks

- planning command wrappers do not duplicate workflow orchestration inline
- utility commands outside the planning pipeline are documented explicitly

## Behavior checks

- `/lookup-archive-context` uses archive-only final sources
- archive preflight still blocks unsafe archive moves
- implementation and fix flows still perform post-run review

## Caller audit

- verify planning commands fail fast when required nested workflow loading is unavailable
