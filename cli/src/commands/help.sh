#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

[ "$#" -eq 0 ] || orb_die 'Help does not accept arguments.' 2

orb_print_logo
cat <<'EOF_HELP'
Orbz repository engineering CLI

Usage:
  orb [--logs] <command> [arguments]
  ./cli/orb <command> [arguments]

Commands:
  help                                  Show this guide
  --version                             Print the local Orbz/Orb version
  bootstrap                             Install dependencies and configure the checkout
  setup [--bin-dir <directory>]         Install the user-scoped orb launcher
  doctor [--ci]                         Diagnose the Orbz engineering environment
  cleanup [--dependencies]              Remove generated output
  lint [--write|--staged]               Run Biome or staged-file checks
  typecheck                             Type-check package source and colocated tests
  test [--coverage|--watch] [args]      Run Vitest
  build                                 Build package and standalone entry points
  harness [args]                        Run the Neon engineering harness dependency
  audit                                 Run every versioned repository audit
  check                                 Run lint, types, tests, builds, SemVer, and audits
  git setup                             Install Husky hook adapters
  git doctor [--ci]                     Diagnose Commitlint, Husky, and lint-staged
  git pre-commit                        Run staged-file and SemVer gates
  git commit-message <file>             Validate a Conventional Commit message
  git commit message <file>             Alias for git commit-message
  git commits --last                    Validate the most recent commit
  git commits --from <ref> --to <ref>   Validate a commit range
  git version-check [--staged]          Validate package semantic versioning

Global flags:
  --help, -h     Show this guide
  --logs         Print operational diagnostics to stderr
  --version, -V  Print the local version

First checkout:
  ./cli/orb bootstrap

Install only the user-scoped launcher:
  pnpm run setup

Manual recovery:
  pnpm install --no-frozen-lockfile
  pnpm run setup
  orb git setup
  orb doctor

The only user-facing package script is setup. The prepack lifecycle is retained
as a safety adapter and delegates to `./cli/orb check`. Every engineering
operation otherwise belongs to this POSIX shell CLI.
EOF_HELP
