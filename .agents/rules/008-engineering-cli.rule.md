---
description: Scopes the shell-only Orb engineering CLI, command ownership, network boundaries, cleanup safety, setup behavior, and CI diagnostics.
globs:
  - "cli/**"
  - "package.json"
  - ".husky/**"
  - ".github/workflows/**"
---
# Rule 008: Engineering CLI

- Effective: 2026-09-04
- Priority: High
- Applies: `cli/**` and CLI package integration

1. The repository CLI is named Orb and every implementation file is POSIX shell.
2. Do not add a Node, MJS, TypeScript, or framework-based command runner.
3. Repository commands include `bootstrap`, `setup`, `doctor`, `cleanup`, `lint`, `typecheck`, `test`, `build`, `harness`, `audit`, `check`, and the Git quality subcommands.
4. Orb is the canonical repository command surface; do not duplicate its commands as package-script aliases.
5. The only human-facing package-script bridge is `setup`; npm lifecycle gates may delegate directly to Orb.
6. `bootstrap` may install declared development dependencies. Explicit consumer project setup may install the Orbz runtime dependency. The explicit `harness` command may invoke its external harness utility. No other command performs network installation.
7. Repository launcher setup must not edit shell profiles or replace unmanaged paths.
8. Consumer setup must not generate or overwrite application source files.
9. `cleanup` removes generated state only and protects `.git/`, `.agents/`, `.audits/`, source, and assets.
10. `doctor` exits nonzero when required repository conditions fail and supports CI mode.
11. Repository-only commands reject execution from the published package.
12. Remove commands, terminology, and infrastructure assumptions that do not belong to the Orbz library.
