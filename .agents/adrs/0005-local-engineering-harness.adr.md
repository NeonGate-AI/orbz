# ADR-0005: Keep a local, repository-specific engineering harness

- Status: Superseded in part by ADR-0007, ADR-0008, and ADR-0010; amended by ADR-0011
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
under ADR-0008; the harness remains outside the published package. ADR-0011 creates a narrow exception for the shell CLI itself, not for `.agents/` or `.audits/`.

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

- ADR-0007, ADR-0008, ADR-0010, and ADR-0011
- SPEC-001, SPEC-003, SPEC-007, SPEC-008, SPEC-009, SPEC-012, and SPEC-014
- Rules 007, 008, 009, and 011
