#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

case "${1:-}" in
  --help|-h)
    [ "$#" -eq 1 ] || orb_die 'Pre-commit help does not accept additional arguments.' 2
    printf 'Usage: orb git pre-commit\n'
    exit 0
    ;;
  '') ;;
  *) orb_die "Unknown pre-commit option: $1" 2 ;;
esac

orb_need pnpm
orb_need git
orb_git_checkout || orb_die 'Git pre-commit must run inside the Orbz checkout.'

cd "$ORB_PROJECT_ROOT"
"$ORB_CLI_DIR/commands/git-version-check.sh" --staged
exec "$ORB_CLI_DIR/commands/lint.sh" --staged
