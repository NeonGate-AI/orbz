#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

orb_require_repository_source

orb_setup_mode=manual
orb_bin_dir=${ORB_BIN_DIR:-}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --bin-dir)
      shift
      [ "$#" -gt 0 ] || orb_die '--bin-dir requires a directory' 2
      orb_bin_dir=$1
      ;;
    --bootstrap)
      orb_setup_mode=bootstrap
      ;;
    --launcher)
      ;;
    --help|-h)
      cat <<'EOF'
Usage:
  orb setup --launcher [--bin-dir <directory>]

Destination precedence:
  --bin-dir, ORB_BIN_DIR, PNPM_HOME, XDG_BIN_HOME, ~/.local/bin

Set ORB_SETUP_DISABLED=1 to skip launcher installation. Orb never edits a
shell profile and never replaces an unmanaged file or symlink.
EOF
      exit 0
      ;;
    *) orb_die "Unknown setup option: $1" 2 ;;
  esac
  shift
done

case "${ORB_SETUP_DISABLED:-0}" in
  1|true|TRUE|yes|YES)
    printf 'Orb launcher setup skipped: ORB_SETUP_DISABLED is set.\n'
    exit 0
    ;;
esac

if [ "$orb_setup_mode" = bootstrap ] && orb_ci_enabled; then
  printf 'Orb launcher setup skipped in CI.\n'
  exit 0
fi

if [ -z "$orb_bin_dir" ]; then
  orb_bin_dir=$(orb_default_bin_dir 2>/dev/null || true)
fi
[ -n "$orb_bin_dir" ] || orb_die 'No user binary directory is available. Set ORB_BIN_DIR or HOME.'

mkdir -p "$orb_bin_dir" || orb_die "Cannot create binary directory: $orb_bin_dir"
orb_bin_dir=$(CDPATH= cd -P "$orb_bin_dir" && pwd)
[ -w "$orb_bin_dir" ] || orb_die "Binary directory is not writable: $orb_bin_dir"

orb_target="$orb_bin_dir/orb"
if [ -L "$orb_target" ]; then
  orb_die "Refusing to replace symlink: $orb_target"
elif [ -e "$orb_target" ]; then
  [ -f "$orb_target" ] || orb_die "Refusing to replace non-regular path: $orb_target"
  orb_marker=$(sed -n '2p' "$orb_target" 2>/dev/null || true)
  [ "$orb_marker" = '# managed-by: orbz-orb' ] || orb_die "Unmanaged command already exists: $orb_target"
fi

orb_tmp_dir="$orb_bin_dir/.orb.tmp.$$"
(umask 077 && mkdir "$orb_tmp_dir") || orb_die "Cannot reserve temporary directory in $orb_bin_dir"
orb_tmp="$orb_tmp_dir/orb"
trap 'rm -f "$orb_tmp"; rmdir "$orb_tmp_dir" 2>/dev/null || :' 0 1 2 15

orb_fallback_root=$(orb_shell_quote "$ORB_PROJECT_ROOT")
{
  cat <<'EOF'
#!/bin/sh
# managed-by: orbz-orb
set -eu

EOF
  printf 'fallback_root=%s\n' "$orb_fallback_root"
  cat <<'EOF'

if [ ! -x "$fallback_root/cli/orb" ]; then
  printf 'orb: configured Orbz checkout is unavailable: %s\n' "$fallback_root" >&2
  printf 'orb: run ./cli/orb setup from a valid checkout\n' >&2
  exit 2
fi

exec "$fallback_root/cli/orb" "$@"
EOF
} >"$orb_tmp"
chmod 755 "$orb_tmp"

if [ -x "$orb_target" ] && cmp -s "$orb_tmp" "$orb_target"; then
  printf 'Orb launcher already configured at %s\n' "$orb_target"
  exit 0
fi

mv "$orb_tmp" "$orb_target"
rmdir "$orb_tmp_dir"
trap - 0 1 2 15

printf 'Orb launcher installed at %s\n' "$orb_target"
if ! orb_path_contains "$orb_bin_dir"; then
  orb_warn "$orb_bin_dir is not on PATH"
fi
