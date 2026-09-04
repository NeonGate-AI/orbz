# ADR-0007: Implement the Orb engineering CLI with POSIX shell

- Status: Accepted; amended by ADR-0010 and ADR-0011
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current decision

## Context

The ported shell CLI layout provides a useful repository command shape, but its
application and infrastructure commands do not belong to Orbz. The replacement
Node/MJS CLI also conflicts with the desired shell-first harness.

## Decision

Use `cli/orb` and modular scripts under `cli/src/` as the only engineering CLI
implementation. Keep the implementation POSIX shell and limit the public command
surface to bootstrap, setup, diagnosis, cleanup, audits, and Git quality gates.

The CLI may delegate to pnpm tools already declared by the repository. ADR-0011 later publishes the same shell entry point as an explicit project installer while keeping repository-only operations guarded.

## Consequences

The CLI can run before TypeScript compilation and is inspectable with `sh -n`.
Shell portability becomes an enforced contract. Application runtime, deployment, workspace, environment-template, changelog, and scaffold commands are excluded.

## Evidence

- `cli/orb`
- `cli/src/orb.sh`
- `cli/src/commands/`
- `cli/readme.md`

## Related records

- SPEC-008, SPEC-012, and SPEC-014
- Rules 008 and 011
- Supersedes the CLI implementation portion of ADR-0005
