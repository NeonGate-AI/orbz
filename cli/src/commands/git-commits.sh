#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

mode=
from_ref=
to_ref=

while [ "$#" -gt 0 ]; do
  case "$1" in
    --last)
      [ -z "$mode" ] || orb_die 'Choose either --last or --from/--to.' 2
      mode=last
      ;;
    --from)
      orb_require_option_value "$1" "${2:-}"
      shift
      [ "$#" -gt 0 ] || orb_die '--from requires a Git reference.' 2
      [ -z "$mode" ] || [ "$mode" = range ] || orb_die 'Choose either --last or --from/--to.' 2
      mode=range
      from_ref=$1
      ;;
    --to)
      orb_require_option_value "$1" "${2:-}"
      shift
      [ "$#" -gt 0 ] || orb_die '--to requires a Git reference.' 2
      [ -z "$mode" ] || [ "$mode" = range ] || orb_die 'Choose either --last or --from/--to.' 2
      mode=range
      to_ref=$1
      ;;
    --help|-h)
      [ "$#" -eq 1 ] || orb_die 'Git commits help does not accept additional arguments.' 2
      cat <<'USAGE'
Usage:
  orb git commits --last
  orb git commits --from <ref> --to <ref>

Validate committed history using Commitlint and the repository Conventional
Commits policy.
USAGE
      exit 0
      ;;
    *) orb_die "Unknown git commits option: $1" 2 ;;
  esac
  shift
done

orb_need pnpm
orb_need git
orb_git_checkout || orb_die 'Commit history validation must run inside the Orbz checkout.'
cd "$ORB_PROJECT_ROOT"

case "$mode" in
  last) exec pnpm exec commitlint --last --verbose ;;
  range)
    [ -n "$from_ref" ] && [ -n "$to_ref" ] || orb_die 'Both --from and --to are required.' 2
    exec pnpm exec commitlint --from "$from_ref" --to "$to_ref" --verbose
    ;;
  *) orb_die 'Usage: orb git commits --last | --from <ref> --to <ref>' 2 ;;
esac
