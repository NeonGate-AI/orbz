# ADR-0008: Separate staged-file, commit-message, and SemVer Git gates

- Status: Accepted
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current decision

## Context

Orbz needs fast local enforcement without placing all repository checks in every
commit. Staged source quality, commit-message syntax, and package-version policy
occur at different Git lifecycle phases.

## Decision

Use Husky for hook activation. `pre-commit` delegates to Orb, which validates a
staged package version and then runs lint-staged. `commit-msg` delegates to Orb,
which runs Commitlint with `@commitlint/config-conventional`.

Use the `semver` CLI to require a canonical package version and reject staged
version downgrades. CI validates commit history and runs the complete package
gate independently of local hooks.

## Consequences

Commits fail early for malformed staged files, invalid commit messages, and
non-forward package version changes. Hooks remain thin, reusable, and easy to
diagnose. Conventional commit signals guide release version selection but do not
automatically publish a release.

## Evidence

- `.husky/`
- `commitlint.config.cjs`
- `.lintstagedrc.json`
- `cli/src/commands/git-*.sh`
- `.github/workflows/ci.yml`

## Related records

- SPEC-009
- Rule 009
