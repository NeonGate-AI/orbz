#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

case "${1:-}" in
  --help|-h)
    printf 'Usage: orb git commit-message <message-file>\n'
    exit 0
    ;;
esac

[ "$#" -eq 1 ] || orb_die 'Usage: orb git commit-message <message-file>' 2
message_file=$1
[ -f "$message_file" ] || orb_die "Commit message file does not exist: $message_file" 2

orb_need pnpm
cd "$ORB_PROJECT_ROOT"
exec pnpm exec commitlint --edit "$message_file" --verbose
