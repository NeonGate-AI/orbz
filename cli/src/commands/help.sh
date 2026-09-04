#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

[ "$#" -eq 0 ] || orb_die 'Help does not accept arguments.' 2

orb_print_logo

if ! orb_is_repository_source; then
  cat <<'EOF_PUBLIC'
Orbz project installer

Usage:
  npx -y @neongate-ai/orbz@latest
  orb setup [options]

Options:
  --project <directory>                 Target project; defaults to the current directory
  --package-manager <npm|pnpm|yarn|bun> Override package-manager detection
  --package-spec <specifier>            Override the Orbz package/version to install
  --force                               Reinstall even when Orbz is already declared
  --dry-run                             Print the installation command without executing it
  --help, -h                            Show this guide
  --version, -V                         Print the executing Orbz version

The default command is setup. It adds @neongate-ai/orbz to an existing project
and prints the framework-neutral registration snippet. It does not generate or
overwrite application source files.
EOF_PUBLIC
  exit 0
fi

cat <<'EOF_REPOSITORY'
Orbz repository engineering CLI

Usage:
  orb [--logs] <command> [arguments]
  ./cli/orb <command> [arguments]

Commands:
  help                                  Show this guide
  --version                             Print the local Orbz/Orb version
  bootstrap                             Install dependencies and configure the checkout
  setup --launcher [--bin-dir <dir>]    Install the user-scoped orb launcher
  doctor [--ci]                         Diagnose the Orbz engineering environment
  cleanup [--dependencies]              Remove generated output
  lint [--write|--staged]               Run Biome or staged-file checks
  typecheck                             Type-check source and colocated tests
  test [--watch|--coverage] [args]      Run Vitest
  build                                 Build package and standalone distributions
  harness [args]                        Run the external engineering harness tool
  audit                                 Run every versioned repository audit
  check                                 Run the complete release quality gate
  git setup [--prepare]                 Install Husky hook adapters
  git doctor [--ci]                     Diagnose Commitlint, Husky, and lint-staged
  git pre-commit                        Run staged-file and SemVer gates
  git commit-message <file>             Validate a Conventional Commit message
  git commit message <file>             Alias for git commit-message
  git lint --last                       Validate the latest commit
  git lint --from <rev> --to <rev>      Validate a commit range
  git commits --last                    Backward-compatible commit lint alias
  git version-check [--staged]          Validate package semantic versioning

Global flags:
  --help, -h     Show this guide
  --logs         Print operational diagnostics to stderr
  --version, -V  Print the local version

First checkout:
  ./cli/orb bootstrap

Install only the user-scoped launcher:
  pnpm run setup

Consumer installation test:
  npx -y @neongate-ai/orbz@latest

Orb is implemented entirely with POSIX shell scripts. Package commands are
owned by Orb; package.json keeps only the setup bridge and npm lifecycle gates.
EOF_REPOSITORY
