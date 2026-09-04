# SPEC-012: Consolidate engineering commands in Orb

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

Package scripts duplicated CLI operations and `prepack` referenced the removed
`pnpm check` alias, causing package validation and publication to fail.

## Scope

Move linting, type checking, test modes, builds, Neon harness execution, commit
history validation, and the complete quality gate into POSIX shell Orb commands.
Reduce package scripts to the explicit setup bridge and the prepack safety
lifecycle. Update CI, hooks, documentation, rules, and audits to use Orb.

## Acceptance criteria

- [x] `orb lint`, `orb typecheck`, `orb test`, `orb build`, `orb harness`, and `orb check` exist.
- [x] `orb test` supports deterministic, coverage, and watch modes.
- [x] `orb check` runs lint, source/test type checks, tests, builds, SemVer validation, and audits.
- [x] `orb git commits` validates the latest commit or an explicit range for CI.
- [x] The only user-facing package script is `setup`, delegating to `./cli/orb setup`.
- [x] `prepack` delegates directly to `./cli/orb check` and no longer calls `pnpm check`.
- [x] Git hooks and CI invoke Orb instead of package-script aliases.
- [x] Help, README, harness context, and executable audits describe and enforce the single command surface.
- [x] The terminal ORB wordmark uses ANSI neon colors and honors `NO_COLOR`.

## Evidence

- `package.json`
- `cli/`
- `.github/workflows/ci.yml`
- `.husky/`
- `README.md`
- `.agents/rules/008-engineering-cli.rule.md`
- `.audits/cli.audit.sh`
- `.audits/package.audit.sh`
- `.audits/tests.audit.sh`

## Related records

- ADR-0010
- Rules 006, 008, 009, and 010
