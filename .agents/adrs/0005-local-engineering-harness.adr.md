# ADR-0005: Keep a local, repository-specific engineering harness

- Status: Superseded in part by ADR-0007 and ADR-0008
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction

## Context

Engineering guidance copied without product context becomes misleading. Orbz
needs decisions, constraints, procedures, and checks that evolve beside its
code without becoming runtime dependencies.

## Decision

Store context, ADRs, rules, specs, prompts, and skills under `.agents/`. Store
executable invariant checks under `.audits/`. Provide a repository-local CLI
that delegates quality operations and audits.

The original implementation choice of a Node/MJS command runner is superseded by
ADR-0007. Git lifecycle integration is now narrowly allowed for Husky activation
under ADR-0008; the harness remains outside the published runtime surface.

## Consequences

Changes link intent to evidence. Every harness directory requires a `readme.md`.
Imported terminology unrelated to Orbz is prohibited. Audits and the Orb CLI are
portable shell scripts.

## Evidence

- `.agents/`
- `.audits/`
- `cli/`
- `package.json`

## Related records

- ADR-0007 and ADR-0008
- SPEC-001, SPEC-003, SPEC-007, SPEC-008, and SPEC-009
- Rules 007, 008, and 009
