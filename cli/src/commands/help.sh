#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

[ "$#" -eq 0 ] || orb_die 'Help does not accept arguments.' 2

orb_print_logo
cat <<'EOF'
Orbz repository engineering CLI

Usage:
  orb [--logs] <command> [arguments]
  ./cli/orb <command> [arguments]
  pnpm orb <command> [arguments]

Commands:
  help                                  Show this guide
  --version                             Print the local Orbz/Orb version
  bootstrap                             Install dependencies and configure the checkout
  setup [--bin-dir <directory>]         Install the user-scoped orb launcher
  doctor [--ci]                         Diagnose the Orbz engineering environment
  cleanup [--dependencies]              Remove generated output
  audit                                 Run every versioned repository audit
  git setup [--prepare]                 Install Husky hook adapters
  git doctor [--ci]                     Diagnose Commitlint, Husky, and lint-staged
  git pre-commit                        Run staged-file and SemVer gates
  git commit-message <file>             Validate a Conventional Commit message
  git commit message <file>             Alias for git commit-message
  git version-check [--staged]          Validate package semantic versioning

Global flags:
  --help, -h     Show this guide
  --logs         Print operational diagnostics to stderr
  --version, -V  Print the local version

First checkout:
  ./cli/orb bootstrap

Manual recovery:
  pnpm install --no-frozen-lockfile
  ./cli/orb setup
  ./cli/orb git setup
  ./cli/orb doctor

Orb is implemented entirely with POSIX shell scripts. It does not edit shell
profiles, publish packages, or become part of the @neongate-ai/orbz runtime.
EOF
