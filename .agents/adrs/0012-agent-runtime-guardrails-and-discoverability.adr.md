# ADR-0012: Add agent runtime guardrails and discoverable workflows

- Created: 2026-09-04
- Mode: Current
- Status: Accepted

## Context

Orbz already has strong deterministic sensors through Vitest, Biome, TypeScript,
repository audits, Git hooks, and CI. Harness measurement still identified weak
agent-native discoverability and no runtime guardrails: several skills lacked
frontmatter, recurring procedures were not represented as workflows, and an
agent could attempt destructive or release-boundary shell commands before Git or
CI gates had a chance to react.

## Decision

Keep `AGENTS.md` and `.agents/` as the cross-tool source of truth, while adding a
small Cursor-native adapter layer:

1. Every skill declares `name` and trigger-worthy `description` frontmatter.
2. Scoped rules declare activation metadata through `globs` or `alwaysApply`.
3. Repeated explicit procedures live under `.agents/workflows/`.
4. `.cursor/hooks.json` registers exactly one shell gate and one post-edit feedback hook.
5. The shell gate denies destructive or package-publication operations, requests human approval for release-boundary Git operations, and fails to `ask` on malformed input.
6. The feedback hook runs local Biome feedback for supported edited files and never replaces CI as the source of truth.
7. A focused Orbz reviewer subagent may be used for compatibility and release-surface review.
8. CI exposes lint, typecheck, and test sensors explicitly and separately enforces a pinned harness-score maturity gate.

## Consequences

- Agent procedures become easier to discover without duplicating product rules.
- High-impact shell operations gain an enforceable boundary before execution.
- Formatting feedback arrives while an edit is still in context.
- Publication, tagging, pushing, and history integration remain human-controlled.
- Cursor-specific files are adapters only; product and package behavior remain unchanged.
- The harness score becomes a versioned CI signal rather than an informal local metric.
