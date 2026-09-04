# SPEC-009: Add Git quality and semantic-version gates

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

The repository lacks deterministic local enforcement for staged files, commit
message structure, and forward-only package version changes.

## Scope

Add Commitlint CLI and conventional configuration, lint-staged, Husky, and
semver as development dependencies. Route hook behavior through Orb and validate
commit ranges in CI.

## Acceptance criteria

- [x] Commitlint validates `commit-msg` using Conventional Commits.
- [x] lint-staged runs from `pre-commit` and checks Biome-supported files plus shell syntax.
- [x] Husky hooks are executable thin adapters to Orb.
- [x] `package.json#version` must be canonical SemVer.
- [x] A staged version change cannot remain equal as a version change, downgrade, or become invalid.
- [x] Git doctor diagnoses dependencies, configuration, hooks, and activation.
- [x] CI lints pull-request or pushed commit history.

## Evidence

- `commitlint.config.cjs`
- `.lintstagedrc.json`
- `.husky/`
- `cli/src/commands/git-*.sh`
- `package.json`
- `.github/workflows/ci.yml`

## Related records

- ADR-0008
- Rule 009
