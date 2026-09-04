#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

case "${1:-}" in
  --help|-h)
    cat <<'USAGE'
Usage: orb harness [neon arguments]

Run the Neon engineering harness dependency from this checkout. Arguments are
forwarded to the Neon CLI. This command is never part of the published runtime.
USAGE
    exit 0
    ;;
esac

orb_need pnpm
cd "$ORB_PROJECT_ROOT"
exec pnpm exec neon "$@"
