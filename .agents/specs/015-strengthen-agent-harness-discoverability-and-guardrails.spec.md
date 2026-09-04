# SPEC-015: Strengthen agent harness discoverability and runtime guardrails

- Created: 2026-09-04
- Mode: Current
- Status: Implemented

## Problem

Harness measurement reports strong repository sensors but weak Skills & Commands
and zero Hooks & Guardrails. Existing Orbz-specific skills are partially missing
activation frontmatter, recurring procedures are not represented as workflows,
and no agent-runtime mechanism prevents destructive or release-boundary shell
operations before execution.

## Scope

- Normalize frontmatter for every existing skill.
- Add activation metadata to repository rules.
- Add explicit regression, review, release, and harness-improvement workflows.
- Add Cursor shell-gate and edit-feedback hooks with committed scripts.
- Add a focused Orbz reviewer subagent.
- Expose lint, typecheck, and test separately in CI.
- Add a pinned harness-score L4 CI gate.
- Extend deterministic repository audits to cover the new guardrails.
- Keep package/runtime behavior unchanged.

## Acceptance criteria

- [x] Every `.agents/skills/*/SKILL.md` contains `name` and `description` frontmatter.
- [x] Every numbered rule contains activation metadata (`alwaysApply` or `globs`).
- [x] `.agents/workflows/` contains documented, executable-procedure workflows using real Orb commands.
- [x] `.cursor/hooks.json` contains `beforeShellExecution` and `afterFileEdit` only.
- [x] The shell gate returns allow for ordinary commands, deny for destructive/publication commands, and ask for malformed/release-boundary operations.
- [x] The edit hook is advisory and cannot format files outside the workspace.
- [x] A frontmatter-described Orbz review subagent exists.
- [x] CI contains explicit lint, typecheck, and test steps.
- [x] CI runs pinned `harness-score@1.5.2` with `--min-level 4`.
- [x] Deterministic audits validate the new hook and metadata contracts.

## Decision links

- ADR-0012: agent runtime guardrails and discoverability.
- Rule 007: harness documentation and audits.
- Rule 008: Orb remains the canonical repository command surface.
- Rule 012: runtime guardrails and harness maturity enforcement.

## Evidence

Evidence is provided by `.audits/harness.audit.sh`, `.audits/guardrails.audit.sh`,
explicit CI sensor steps, and the pinned harness-score workflow. Product source
files are intentionally unchanged by this SPEC.
