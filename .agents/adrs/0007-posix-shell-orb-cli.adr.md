# ADR-0007: Implement the Orb engineering CLI with POSIX shell

- Status: Accepted; command-surface scope extended by ADR-0010
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

The CLI may delegate to pnpm tools already declared by the repository. It is not
an npm package binary and is never part of the runtime distribution.

## Consequences

The CLI can run before TypeScript compilation and is inspectable with `sh -n`.
Shell portability becomes an enforced contract. Application runtime, deployment, workspace, environment-template, changelog, and scaffold commands are excluded.

## Evidence

- `cli/orb`
- `cli/src/orb.sh`
- `cli/src/commands/`
- `cli/readme.md`

## Related records

- SPEC-008 and SPEC-012
- Rule 008
- ADR-0010 extends the command-surface decision
- Supersedes the CLI implementation portion of ADR-0005
