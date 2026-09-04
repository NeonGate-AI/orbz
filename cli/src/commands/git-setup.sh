#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

prepare=false
while [ "$#" -gt 0 ]; do
  case "$1" in
    --prepare) prepare=true ;;
    --help|-h)
      printf 'Usage: orb git setup [--prepare]\n'
      exit 0
      ;;
    *) orb_die "Unknown git setup option: $1" 2 ;;
  esac
  shift
done

if [ "$prepare" = true ] && { orb_ci_enabled || [ "${HUSKY:-1}" = 0 ]; }; then
  printf 'Orb Git setup skipped for this lifecycle environment.\n'
  exit 0
fi

orb_need git
if ! orb_git_checkout; then
  if [ "$prepare" = true ]; then
    printf 'Orb Git setup skipped: no Git checkout.\n'
    exit 0
  fi
  orb_die 'Git setup must run inside the Orbz checkout.'
fi

mkdir -p "$ORB_PROJECT_ROOT/.husky"
cat >"$ORB_PROJECT_ROOT/.husky/pre-commit" <<'EOF'
#!/bin/sh
exec ./cli/orb git pre-commit "$@"
EOF
cat >"$ORB_PROJECT_ROOT/.husky/commit-msg" <<'EOF'
#!/bin/sh
exec ./cli/orb git commit-message "$@"
EOF
chmod 755 "$ORB_PROJECT_ROOT/.husky/pre-commit" "$ORB_PROJECT_ROOT/.husky/commit-msg"

orb_need pnpm
cd "$ORB_PROJECT_ROOT"
pnpm exec husky >/dev/null
orb_print_success 'Husky hooks configured for Orbz'
