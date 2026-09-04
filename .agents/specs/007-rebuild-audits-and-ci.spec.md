# SPEC-007: Rebuild executable audits and the quality gate

- Status: Implemented
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

Imported audit scripts enforced unrelated architecture and workflow rules. The
CI gate did not run behavioral tests.

## Scope

Replace audits with Orbz-specific checks and compose linting, type checks,
Vitest, builds, and audits under `orb check`.

## Acceptance criteria

- [x] Architecture, documentation, harness, package, and test audits exist.
- [x] Scripts are POSIX shell, deterministic, executable, and network-free.
- [x] The local CLI discovers and runs all audits.
- [x] CI runs `./cli/orb check` and inspects `npm pack --dry-run`.
- [x] Generated outputs remain ignored and cleanable.

## Evidence

- `.audits/`
- `cli/orb`
- `package.json`
- `.github/workflows/ci.yml`

## Related records

- ADR-0004, ADR-0005, ADR-0007, and ADR-0008
- Rules 006 through 010
