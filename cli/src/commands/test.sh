#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

mode=run
case "${1:-}" in
  --help|-h)
    cat <<'USAGE'
Usage:
  orb test [vitest arguments]
  orb test --coverage [vitest arguments]
  orb test --watch [vitest arguments]

The default mode executes Vitest once. Positional arguments after the optional
mode are forwarded to Vitest, so a colocated suite can be targeted directly.
USAGE
    exit 0
    ;;
  --coverage|coverage)
    mode=coverage
    shift
    ;;
  --watch|watch)
    mode=watch
    shift
    ;;
esac

orb_need pnpm
cd "$ORB_PROJECT_ROOT"

case "$mode" in
  run) exec pnpm exec vitest run "$@" ;;
  coverage) exec pnpm exec vitest run --coverage "$@" ;;
  watch) exec pnpm exec vitest "$@" ;;
esac
