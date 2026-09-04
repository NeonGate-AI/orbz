# SPEC-008: Replace the MJS engineering CLI with Orb shell commands

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

The Node/MJS CLI does not match the desired Orb shell architecture, while the
ported shell files contain unrelated application, deployment, workspace, and
product assumptions.

## Scope

Retain the `orb` entry point, remove unrelated commands, implement the required
Orbz operations with POSIX shell, and update package integration and documentation. Distribution through npx is specified separately by SPEC-014.

## Acceptance criteria

- [x] No CLI command runner uses MJS, TypeScript, or framework runtime code.
- [x] `bootstrap`, `setup`, `doctor`, `cleanup`, `lint`, `typecheck`, `test`, `build`, `audit`, `check`, and `help` are available.
- [x] Git setup, doctor, pre-commit, commit-message, and version-check commands are available.
- [x] `git commit message` and `git commit-msg` aliases resolve to commit-message validation.
- [x] Setup does not edit shell profiles or replace unmanaged launchers.
- [x] Cleanup protects source, assets, `.git`, `.agents`, and `.audits`.
- [x] Unrelated imported commands and terminology are removed.

## Evidence

- `cli/`
- `package.json`
- `.audits/cli.audit.sh`
- `README.md`

## Related records

- ADR-0007
- Rules 008 and 011
- SPEC-014
- Supersedes SPEC-003
