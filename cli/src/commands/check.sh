#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

case "${1:-}" in
  --help|-h)
    [ "$#" -eq 1 ] || orb_die 'Check help does not accept additional arguments.' 2
    cat <<'USAGE'
Usage: orb check

Run the complete deterministic repository gate:
  lint -> typecheck -> test -> build -> SemVer -> audits
USAGE
    exit 0
    ;;
  '') ;;
  *) orb_die "Unknown check option: $1" 2 ;;
esac

run_gate() {
  gate_name=$1
  shift
  printf '\n==> %s\n' "$gate_name"
  "$@"
}

run_gate lint "$ORB_CLI_DIR/commands/lint.sh"
run_gate typecheck "$ORB_CLI_DIR/commands/typecheck.sh"
run_gate test "$ORB_CLI_DIR/commands/test.sh"
run_gate build "$ORB_CLI_DIR/commands/build.sh"
run_gate semver "$ORB_CLI_DIR/commands/git-version-check.sh"
run_gate audits "$ORB_CLI_DIR/commands/audit.sh"

printf '\n'
orb_print_success 'Orb check PASS'
