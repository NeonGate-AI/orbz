# Orb CLI for Orbz

Orb is the repository-local engineering CLI for `@neongate-ai/orbz`. Every
implementation file is POSIX shell; there is no Node/MJS command runner and no
runtime package export.

## Entry points

Use the checked-in entry point on a fresh clone:

```bash
./cli/orb help
./cli/orb bootstrap
```

Install the optional user-scoped `orb` launcher after dependencies are present:

```bash
pnpm run setup
orb help
```

`pnpm run setup` is the only user-facing package script. The explicit `run` is
required because `pnpm setup` is a pnpm command of its own. All repository
operations otherwise go through `orb` or `./cli/orb`.

The `prepack` package lifecycle is retained only as a publication safety adapter;
it delegates to `./cli/orb check` and is not an alternative command surface.

## Commands

| Command | Purpose |
| --- | --- |
| `orb bootstrap` | Install dependencies, configure hooks and the launcher, then run doctor. |
| `orb setup` | Install a user-scoped launcher without editing shell profiles. |
| `orb doctor` | Validate Node, pnpm, dependencies, configs, audits, hooks, and local setup. |
| `orb cleanup` | Remove generated output; add `--dependencies` to remove `node_modules`. |
| `orb lint` | Run the repository Biome linter. |
| `orb lint --write` | Apply Biome formatting and safe lint fixes. |
| `orb lint --staged` | Run lint-staged against the Git index. |
| `orb typecheck` | Type-check package source and colocated test suites. |
| `orb test` | Run Vitest once. |
| `orb test --coverage` | Run Vitest with V8 coverage. |
| `orb test --watch` | Run Vitest in watch mode. |
| `orb build` | Build package entry points and the standalone browser bundle. |
| `orb harness` | Run the Neon engineering harness dependency. |
| `orb audit` | Run all `.audits/*.audit.sh` files through `/bin/sh`. |
| `orb check` | Run lint, type checks, tests, builds, SemVer validation, and audits. |
| `orb git setup` | Write thin Husky adapters and activate the hooks path. |
| `orb git doctor` | Validate Commitlint, lint-staged, Husky, SemVer, and hook wiring. |
| `orb git pre-commit` | Validate staged version changes, then run staged-file checks. |
| `orb git commit-message` | Validate one commit message using Commitlint. |
| `orb git commits` | Validate the latest commit or an explicit commit range. |
| `orb git version-check` | Require canonical SemVer; `--staged` rejects version regressions. |

`orb git commit message <file>` and `orb git commit-msg <file>` are aliases for
`orb git commit-message <file>`.

## Complete quality gate

```bash
orb check
```

The command executes the gates in this order:

```text
lint -> typecheck -> test -> build -> SemVer -> audits
```

`npm pack` and package publication invoke the same gate through `prepack`, so a
removed package-script alias cannot break release validation.

## Git gate ownership

`.husky/pre-commit` delegates to `orb git pre-commit`. The command runs the
staged semantic-version check before `orb lint --staged`. `.husky/commit-msg`
delegates to Commitlint because the message file only exists at that phase.

Commit types follow Conventional Commits. In release planning, `fix` and `perf`
imply a patch, `feat` implies a minor, and `!` or a `BREAKING CHANGE` footer
implies a major version. Orb validates syntax and forward-only package version
changes; release automation remains an explicit maintainer action.

## Terminal logo

`orb help` and `orb doctor` render the ORB wordmark using terminal characters and
ANSI neon cyan, blue, and magenta. `NO_COLOR=1` disables color without changing
the text output.

## Safety

Orb does not publish, edit shell profiles, replace unmanaged launchers, or enter
the package `bin` field. Cleanup is limited to generated repository state.
Provider credentials and product conversation copy remain outside the CLI and
package runtime.
