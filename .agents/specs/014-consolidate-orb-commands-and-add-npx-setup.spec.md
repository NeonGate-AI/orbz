# SPEC-014: Consolidate commands in Orb and add npx project setup

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

The package manifest duplicated repository commands and retained a `prepack`
reference to a removed `check` script. The distributed package had no executable
for explicit one-command consumer setup.

## Scope

Move linting, type checking, tests, builds, audits, release checks, and commit
history validation behind the shell-only Orb CLI. Reduce package scripts to the
setup bridge and lifecycle gate. Publish Orb as a package binary whose default
non-repository action installs Orbz into the invoking project.

## Acceptance criteria

- [x] `orb lint`, `orb typecheck`, `orb test`, `orb build`, `orb audit`, and `orb check` exist.
- [x] CI calls Orb rather than removed package script aliases.
- [x] `package.json#scripts.setup` delegates to Orb launcher setup.
- [x] `package.json#scripts.prepack` delegates to `./cli/orb check`.
- [x] No `orb`, `lint`, `test`, `typecheck`, `build`, `audit`, or `check` package-script aliases remain.
- [x] `package.json#bin` exposes only `orb`.
- [x] The published payload includes `cli/` and `dist/`.
- [x] A package-manager-linked symlink resolves the real CLI location.
- [x] Running the published CLI without arguments selects project setup.
- [x] Project setup detects npm, pnpm, yarn, and bun and supports an explicit override.
- [x] Project setup is idempotent and does not create application source files.
- [x] The terminal logo renders ORB with cyan, magenta, and blue ANSI colors.
- [x] README and harness documentation describe the npx flow and payload exception.

## Evidence

- `package.json`
- `cli/`
- `.github/workflows/ci.yml`
- `.audits/cli.audit.sh`
- `.audits/package.audit.sh`
- `README.md`

## Related records

- ADR-0011
- Rules 001, 008, and 011
