# ADR-0010: Use Orb as the single engineering command surface

- Status: Accepted
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current decision

## Context

The repository exposed the same engineering operations through both package
scripts and the Orb CLI. This produced ambiguous invocations such as `pnpm orb cleanup`, duplicated
orchestration, and allowed lifecycle hooks to reference a package script that
maintainers could reasonably remove. The failed `prepack` call to `pnpm check`
demonstrated that the two command surfaces could drift.

A fresh checkout still needs one package-manager bridge before an optional
user-scoped `orb` launcher exists. Package publication also benefits from an
automatic validation lifecycle.

## Decision

Orb is the sole command surface for linting, type checking, tests, coverage,
builds, audits, harness reconciliation, Git gates, cleanup, diagnosis, and the
complete check.

`package.json` exposes only `setup` as a user-facing script, delegating to
`./cli/orb setup`. The `prepack` lifecycle remains as a non-interactive safety
adapter and delegates directly to `./cli/orb check`. CI and Husky call the
checked-in CLI rather than package-script aliases.

## Consequences

Command behavior has one implementation and one help surface. Removing a
redundant package alias cannot break the release gate. Contributors use
`./cli/orb` before launcher installation and `orb` afterward. Because pnpm owns
a built-in `setup` command, documentation must use the explicit `pnpm run setup`
form for the package script.

The CLI remains engineering-only, POSIX shell, absent from the npm `bin` field,
and excluded from the package payload.

## Evidence

- `package.json#scripts`
- `cli/src/orb.sh`
- `cli/src/commands/`
- `.github/workflows/ci.yml`
- `.audits/cli.audit.sh`
- `.audits/package.audit.sh`

## Related records

- ADR-0007 and ADR-0008
- SPEC-012
- Rules 006, 008, and 009
