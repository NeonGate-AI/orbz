# Orb CLI for Orbz

Orb is the POSIX shell command surface for `@neongate-ai/orbz`. It has two
execution contexts:

1. **Repository mode** operates on an Orbz source checkout.
2. **Project setup mode** is the published npm binary used by
   `npx @neongate-ai/orbz`.

There is no Node, MJS, TypeScript, or framework-based command runner. Small
inline Node programs are used only where reliable JSON parsing is required.

## Entry points

```bash
./cli/orb help                    # source checkout
orb help                          # optional user-scoped launcher
npx -y @neongate-ai/orbz@latest  # consumer project setup
```

`cli/orb` resolves npm/pnpm symlinks before delegating to `cli/src/orb.sh`.
Command modules live under `cli/src/commands/`; shared output and filesystem
helpers live under `cli/src/core/`.

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

`orb git commit message <file>` and `orb git commit-msg <file>` are aliases for
`orb git commit-message <file>`.

## Consumer project setup

The published package exposes one binary:

```json
{
  "bin": {
    "orb": "./cli/orb"
  }
}
```

Because it is the package's only binary, npm can infer it for:

```bash
npx -y @neongate-ai/orbz@latest
```

With no arguments, the published binary runs project setup. It requires an
existing `package.json`, detects npm, pnpm, yarn, or bun, installs the executing
Orbz version into `dependencies`, and prints the registration snippet. It does
not create or overwrite application source files.

Useful variants:

```bash
npx -y @neongate-ai/orbz@latest --package-manager pnpm
npx -y @neongate-ai/orbz@latest --project ./apps/web
npx -y @neongate-ai/orbz@latest --dry-run
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
