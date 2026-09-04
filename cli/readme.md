# Orb CLI for Orbz

Orb is the repository-local engineering CLI for `@neongate-ai/orbz`. Every
implementation file is POSIX shell; there is no Node/MJS command runner and
no runtime package export.

## Entry points

```bash
./cli/orb help
pnpm orb help
orb help # after `./cli/orb setup`
```

`cli/orb` resolves the checkout and delegates to `cli/src/orb.sh`. Command
modules live under `cli/src/commands/`; shared output and filesystem helpers
live under `cli/src/core/`.

## Commands

| Command | Purpose |
| --- | --- |
| `orb bootstrap` | Install dependencies, configure hooks and the launcher, then run doctor. |
| `orb setup` | Install a user-scoped launcher without editing shell profiles. |
| `orb doctor` | Validate Node, pnpm, dependencies, configs, audits, hooks, and local setup. |
| `orb cleanup` | Remove generated output; add `--dependencies` to remove `node_modules`. |
| `orb audit` | Run all `.audits/*.audit.sh` files through `/bin/sh`. |
| `orb git setup` | Write thin Husky adapters and activate the hooks path. |
| `orb git doctor` | Validate Commitlint, lint-staged, Husky, SemVer, and hook wiring. |
| `orb git pre-commit` | Validate staged version changes, then run lint-staged. |
| `orb git commit-message` | Validate one commit message using Commitlint. |
| `orb git version-check` | Require a canonical SemVer package version; `--staged` rejects downgrades. |

`orb git commit message <file>` and `orb git commit-msg <file>` are aliases
for `orb git commit-message <file>`.

## Git gate ownership

`.husky/pre-commit` delegates to `orb git pre-commit`. The command runs the
staged semantic-version check before lint-staged. `.husky/commit-msg`
delegates to Commitlint because the message file only exists at that phase.

Commit types follow Conventional Commits. In release planning, `fix` and
`perf` imply a patch, `feat` implies a minor, and `!` or a `BREAKING CHANGE`
footer implies a major version. Orb validates syntax and forward-only
package version changes; release automation remains an explicit maintainer
action.

## Safety

Orb does not publish, edit shell profiles, replace unmanaged launchers, or
enter the package `bin` field. Cleanup is limited to generated repository
state. Provider credentials and product conversation copy remain outside the
CLI and package runtime.
