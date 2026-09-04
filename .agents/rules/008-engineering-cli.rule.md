# Rule 008: Engineering CLI

- Effective: 2026-09-04
- Updated: 2026-09-04
- Priority: High
- Applies: `cli/**`, package scripts, lifecycle adapters, hooks, and CI commands

1. The repository CLI is named Orb and every implementation file is POSIX shell.
2. Do not add a Node, MJS, TypeScript, or framework-based command runner.
3. Orb owns `bootstrap`, `setup`, `doctor`, `cleanup`, `lint`, `typecheck`, `test`, `build`, `harness`, `audit`, and `check`.
4. Orb owns Git setup, doctor, pre-commit, commit-message, commit-history, and version-check behavior.
5. `package.json#scripts` may expose only `setup` as a user command. It must delegate to `./cli/orb setup`.
6. A package lifecycle such as `prepack` may exist only as a thin safety adapter to an Orb command; it is not a second command surface.
7. CI and Git hooks must invoke `./cli/orb` rather than package-script aliases.
8. Do not expose Orb through the package `bin` field or include it in `dist/`.
9. `bootstrap` may install declared development dependencies; no other command performs network installation.
10. `setup` may install a user-scoped launcher but must not edit shell profiles or replace unmanaged paths.
11. `cleanup` removes generated state only and protects `.git/`, `.agents/`, `.audits/`, source, and assets.
12. `doctor` exits nonzero when required repository conditions fail and supports CI mode.
13. Remove commands, terminology, and infrastructure assumptions that do not belong to the Orbz library.
