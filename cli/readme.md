# Orb CLI for Orbz

Orb is the POSIX shell command surface for `@neongate-ai/orbz`. It has two
execution contexts:

1. **Repository mode** operates on an Orbz source checkout.
2. **Project setup mode** is the published npm binary used by
   `npx --package=@neongate-ai/orbz orb`.

There is no Node, MJS, TypeScript, or framework-based command runner. Small
inline Node programs are used only where reliable JSON parsing is required.

## Entry points

```bash
./cli/orb help                    # source checkout
orb help                          # optional user-scoped launcher
npx -y --package=@neongate-ai/orbz@latest orb  # consumer project setup
```

`cli/orb` resolves npm/pnpm symlinks before delegating to `cli/src/orb.sh`.
Command modules live under `cli/src/commands/`; shared output and filesystem
helpers live under `cli/src/core/`.

With no arguments, the checkout entry point shows help. Find command details
with `orb help setup`, `orb help git lint`, or `orb git lint --help`.
`orb git` and `orb git help` show the Git command catalog. Help stays local and
does not execute the selected command.

`--logs` is repeatable before or immediately after a command and at each Git
command level, for example `orb --logs doctor`, `orb doctor --logs`, or
`orb git doctor --logs --ci`. Diagnostics go to stderr. Arguments following
command options are left for that command or its delegated utility; put Orb's
diagnostic flag before those options. Unknown commands, invalid options,
missing option values and incompatible Git lint modes return status 2.
Missing required executables return 127; delegated utilities retain their
own exit status. ANSI output is disabled by `NO_COLOR` or noninteractive stdout.

`npx` is transient and does not add a global `orb` command to the user's PATH.
Once Orbz is a project dependency, use the package manager's local executable
runner, for example `pnpm exec orb --help` or `npm exec -- orb --help`.
To intentionally install a global launcher from npm, use
`npm install --global @neongate-ai/orbz@latest`; this is separate from the npx
project-setup flow.

## Repository commands

| Command | Purpose |
| --- | --- |
| `orb bootstrap` | Install development dependencies, configure hooks and the launcher, then run doctor. |
| `orb setup --launcher` | Install a user-scoped launcher without editing shell profiles. |
| `orb doctor` | Validate Node, pnpm, dependencies, configs, audits, hooks, and local setup. |
| `orb cleanup` | Remove generated output; add `--dependencies` to remove `node_modules`. |
| `orb lint` | Run Biome across the checkout. |
| `orb typecheck` | Type-check source and colocated tests. |
| `orb test` | Run Vitest once; supports `--watch` and `--coverage`. |
| `orb build` | Build the module and standalone distributions. |
| `orb harness` | Run the external harness-score utility explicitly. |
| `orb audit` | Run all `.audits/*.audit.sh` files through `/bin/sh`. |
| `orb check` | Run the complete release quality gate. |
| `orb git setup` | Write thin Husky adapters and activate the hooks path. |
| `orb git doctor` | Validate Commitlint, lint-staged, Husky, SemVer, and hook wiring. |
| `orb git pre-commit` | Validate staged version changes, then run lint-staged. |
| `orb git commit-message` | Validate one commit message using Commitlint. |
| `orb git lint` | Validate the latest commit or a revision range. |
| `orb git version-check` | Require canonical, forward-only SemVer changes. |

`orb install` is a repository-only alias for `orb bootstrap`. `orb clean` aliases
`orb cleanup`, and `orb neon` aliases `orb harness`. `orb version`, `orb --version`
and `orb -V` print the executing package version.

`orb git commit message <file>` and `orb git commit-msg <file>` are aliases for
`orb git commit-message <file>`. `orb git commits` retains the existing
commit-history validation interface (`--last` or `--from` plus `--to`).

Repository setup defaults to the optional launcher, so `./cli/orb setup` and
`./cli/orb setup --launcher` are equivalent. The launcher delegates to the
checkout that most recently completed setup, regardless of the caller's working
directory. After moving that checkout, run setup again from its new location.
The launcher destination is selected from `--bin-dir`, `ORB_BIN_DIR`,
`PNPM_HOME`, `XDG_BIN_HOME`, then `$HOME/.local/bin`. Existing managed launchers
can be refreshed; unmanaged paths and symlinks are refused. A missing PATH entry
is reported for the user to configure.

## Consumer project setup

The published package exposes one binary:

```json
{
  "bin": {
    "orb": "./cli/orb"
  }
}
```

Use the explicit package-and-binary form so execution never depends on npm
inferring the binary name:

```bash
npx -y --package=@neongate-ai/orbz@latest orb
```

With no arguments, the published binary runs project setup. It requires an
existing `package.json`, detects npm, pnpm, yarn, or bun, installs the executing
Orbz version into `dependencies`, and prints the registration snippet. It does
not create or overwrite application source files.

Useful variants:

```bash
npx -y --package=@neongate-ai/orbz@latest orb --package-manager pnpm
npx -y --package=@neongate-ai/orbz@latest orb --project ./apps/web
npx -y --package=@neongate-ai/orbz@latest orb --dry-run
```

## Package scripts

Repository commands are not duplicated under `package.json#scripts`. The only
human-facing bridge is:

```bash
pnpm run setup
```

The `prepack` lifecycle delegates to `./cli/orb check` so npm packing and
publishing cannot bypass the release gate.

## Safety

Orb does not edit shell profiles, overwrite unmanaged launchers, generate
consumer source files, or publish packages. Network installation is limited to
explicit repository bootstrap, explicit project setup, and the explicit external
harness command.
Cleanup is limited to generated repository state. Provider credentials and
product conversation copy remain outside the CLI and package runtime.
