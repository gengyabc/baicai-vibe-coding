# Subagent Failure Response

## Scope

- applies to workflows that delegate to a subagent, including `requirements-review`, `quality-review`, and `implement-from-plan`

## Rules

- if a delegated subagent returns no usable result, disconnects, or raises a session error, treat the workflow as `blocked`
- send a desktop notification through `@.opencode/plugins/baicai-vibe/workflow-failure-notify.ts`
- stop the current workflow immediately
- keep the current session open and wait for the user to reply `继续` in the same session
- do not auto-retry or advance to the next step until the user confirms
