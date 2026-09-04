#!/bin/sh
set -eu

CLI_DIR=$(CDPATH= cd -P "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -P "$CLI_DIR/../.." && pwd)

export ORB_CLI_DIR="$CLI_DIR"
export ORB_PROJECT_ROOT="$PROJECT_ROOT"

. "$CLI_DIR/core/common.sh"

orb_usage_error() {
  orb_print_error "Orb: $1"
  printf "Run 'orb help' for usage.\n" >&2
  exit 2
}

orb_default_command() {
  if orb_is_repository_source; then
    printf 'help\n'
  else
    printf 'setup\n'
  fi
}

if [ "$#" -eq 0 ]; then
  orb_command=$(orb_default_command)
else
  orb_command=$1
  shift
fi

if [ "$orb_command" = --logs ]; then
  ORB_LOGS=true
  export ORB_LOGS
  if [ "$#" -eq 0 ]; then
    orb_command=$(orb_default_command)
  else
    orb_command=$1
    shift
  fi
fi

if [ "${1:-}" = --logs ]; then
  ORB_LOGS=true
  export ORB_LOGS
  shift
fi

orb_log "command=$orb_command"

case "$orb_command" in
  help|--help|-h)
    exec "$CLI_DIR/commands/help.sh" "$@"
    ;;
  version|--version|-V)
    [ "$#" -eq 0 ] || orb_usage_error 'Version does not accept arguments.'
    orb_version=$(orb_project_version 2>/dev/null || true)
    [ -n "$orb_version" ] || orb_die 'Unable to read the Orbz version.'
    printf 'orb %s\n' "$orb_version"
    ;;
  setup)
    exec "$CLI_DIR/commands/setup.sh" "$@"
    ;;
  --project|--package-manager|--package-spec|--force|--dry-run)
    orb_is_repository_source && orb_usage_error "Unknown option: $orb_command"
    exec "$CLI_DIR/commands/setup.sh" "$orb_command" "$@"
    ;;
  bootstrap)
    orb_require_repository_source
    exec "$CLI_DIR/commands/bootstrap.sh" "$@"
    ;;
  doctor)
    orb_require_repository_source
    exec "$CLI_DIR/commands/doctor.sh" "$@"
    ;;
  cleanup|clean)
    orb_require_repository_source
    exec "$CLI_DIR/commands/cleanup.sh" "$@"
    ;;
  lint)
    orb_require_repository_source
    exec "$CLI_DIR/commands/lint.sh" "$@"
    ;;
  typecheck)
    orb_require_repository_source
    exec "$CLI_DIR/commands/typecheck.sh" "$@"
    ;;
  test)
    orb_require_repository_source
    exec "$CLI_DIR/commands/test.sh" "$@"
    ;;
  build)
    orb_require_repository_source
    exec "$CLI_DIR/commands/build.sh" "$@"
    ;;
  harness|neon)
    orb_require_repository_source
    exec "$CLI_DIR/commands/harness.sh" "$@"
    ;;
  audit)
    orb_require_repository_source
    exec "$CLI_DIR/commands/audit.sh" "$@"
    ;;
  check)
    orb_require_repository_source
    exec "$CLI_DIR/commands/check.sh" "$@"
    ;;
  git)
    orb_require_repository_source
    orb_subcommand=${1:-}
    if [ "$#" -gt 0 ]; then
      shift
    fi
    case "$orb_subcommand" in
      setup) exec "$CLI_DIR/commands/git-setup.sh" "$@" ;;
      doctor) exec "$CLI_DIR/commands/git-doctor.sh" "$@" ;;
      pre-commit) exec "$CLI_DIR/commands/git-pre-commit.sh" "$@" ;;
      commit-message|commit-msg) exec "$CLI_DIR/commands/git-commit-msg.sh" "$@" ;;
      lint) exec "$CLI_DIR/commands/git-lint.sh" "$@" ;;
      commits) exec "$CLI_DIR/commands/git-commits.sh" "$@" ;;
      commit)
        [ "${1:-}" = message ] || orb_usage_error 'Usage: orb git commit message <message-file>'
        shift
        exec "$CLI_DIR/commands/git-commit-msg.sh" "$@"
        ;;
      version-check) exec "$CLI_DIR/commands/git-version-check.sh" "$@" ;;
      *) orb_usage_error 'Usage: orb git <setup|doctor|pre-commit|commit-message|lint|commits|version-check>' ;;
    esac
    ;;
  --*) orb_usage_error "Unknown option: $orb_command" ;;
  *) orb_usage_error "Unknown command: $orb_command" ;;
esac
