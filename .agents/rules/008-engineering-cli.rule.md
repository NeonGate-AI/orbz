# Rule 008: Engineering CLI

- Effective: 2026-09-04
- Priority: High
- Applies: `cli/**` and CLI package scripts

1. The repository CLI is named Orb and every implementation file is POSIX shell.
2. Do not add a Node, MJS, TypeScript, or framework-based command runner.
3. Required commands are `bootstrap`, `setup`, `doctor`, `cleanup`, `audit`, and the Git subcommands `setup`, `doctor`, `pre-commit`, `commit-message`, and `version-check`.
4. Keep hooks and package scripts as thin delegates to `./cli/orb`.
5. Do not expose Orb through the package `bin` field or include it in `dist/`.
6. `bootstrap` may install declared development dependencies; no other command performs network installation.
7. `setup` may install a user-scoped launcher but must not edit shell profiles or replace unmanaged paths.
8. `cleanup` removes generated state only and protects `.git/`, `.agents/`, `.audits/`, source, and assets.
9. `doctor` exits nonzero when required repository conditions fail and supports CI mode.
10. Remove commands, terminology, and infrastructure assumptions that do not belong to the Orbz library.
