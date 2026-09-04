#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

case "${1:-}" in
  --help|-h)
    [ "$#" -eq 1 ] || orb_die 'Git setup help does not accept additional arguments.' 2
    printf 'Usage: orb git setup\n'
    exit 0
    ;;
  '') ;;
  *) orb_die "Unknown git setup option: $1" 2 ;;
esac

orb_need git
orb_git_checkout || orb_die 'Git setup must run inside the Orbz checkout.'

mkdir -p "$ORB_PROJECT_ROOT/.husky"
cat >"$ORB_PROJECT_ROOT/.husky/pre-commit" <<'HOOK'
#!/bin/sh
exec ./cli/orb git pre-commit "$@"
HOOK
cat >"$ORB_PROJECT_ROOT/.husky/commit-msg" <<'HOOK'
#!/bin/sh
exec ./cli/orb git commit-message "$@"
HOOK
chmod 755 "$ORB_PROJECT_ROOT/.husky/pre-commit" "$ORB_PROJECT_ROOT/.husky/commit-msg"

orb_need pnpm
cd "$ORB_PROJECT_ROOT"
pnpm exec husky >/dev/null
orb_print_success 'Husky hooks configured for Orbz'
