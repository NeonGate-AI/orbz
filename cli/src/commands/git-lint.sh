#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"
orb_require_repository_source

orb_lint_mode=
orb_from=
orb_to=

while [ "$#" -gt 0 ]; do
  case "$1" in
    --last)
      [ -z "$orb_lint_mode" ] || orb_die 'Choose either --last or --from/--to.' 2
      orb_lint_mode=last
      ;;
    --from)
      orb_require_option_value "$1" "${2:-}"
      [ "$orb_lint_mode" != last ] || orb_die 'Choose either --last or --from/--to.' 2
      shift
      [ "$#" -gt 0 ] || orb_die '--from requires a Git revision.' 2
      orb_from=$1
      orb_lint_mode=range
      ;;
    --to)
      orb_require_option_value "$1" "${2:-}"
      [ "$orb_lint_mode" != last ] || orb_die 'Choose either --last or --from/--to.' 2
      shift
      [ "$#" -gt 0 ] || orb_die '--to requires a Git revision.' 2
      orb_to=$1
      orb_lint_mode=range
      ;;
    --help|-h)
      [ "$#" -eq 1 ] || orb_die 'Git lint help does not accept additional arguments.' 2
      cat <<'HELP'
Usage:
  orb git lint --last
  orb git lint --from <revision> --to <revision>
HELP
      exit 0
      ;;
    *) orb_die "Unknown git lint option: $1" 2 ;;
  esac
  shift
done

[ -n "$orb_lint_mode" ] || orb_die 'Git lint requires --last or --from/--to.' 2
orb_need pnpm
cd "$ORB_PROJECT_ROOT"

case "$orb_lint_mode" in
  last) exec pnpm exec commitlint --last --verbose ;;
  range)
    [ -n "$orb_from" ] && [ -n "$orb_to" ] || orb_die 'Git lint range requires both --from and --to.' 2
    exec pnpm exec commitlint --from "$orb_from" --to "$orb_to" --verbose
    ;;
esac
