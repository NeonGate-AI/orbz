#!/bin/sh

: "${ORB_PROJECT_ROOT:?ORB_PROJECT_ROOT must be set by cli/src/orb.sh}"
: "${ORB_CLI_DIR:?ORB_CLI_DIR must be set by cli/src/orb.sh}"

. "$ORB_CLI_DIR/core/output.sh"

orb_die() {
  orb_message=$1
  orb_status=${2:-1}
  orb_print_error "Orb: $orb_message"
  exit "$orb_status"
}

orb_warn() {
  orb_print_warning "Orb: $*"
}

orb_has() {
  command -v "$1" >/dev/null 2>&1
}

orb_need() {
  orb_has "$1" || orb_die "Required command not found: $1" 127
}

orb_rel() {
  case "$1" in
    "$ORB_PROJECT_ROOT"/*) printf '%s\n' "${1#"$ORB_PROJECT_ROOT"/}" ;;
    *) printf '%s\n' "$1" ;;
  esac
}

orb_package_value() {
  orb_key=$1
  node - "$ORB_PROJECT_ROOT/package.json" "$orb_key" <<'NODE'
const fs = require('node:fs')
const [file, key] = process.argv.slice(2)
const data = JSON.parse(fs.readFileSync(file, 'utf8'))
let value = data
for (const part of key.split('.')) value = value == null ? undefined : value[part]
if (value == null) process.exit(1)
process.stdout.write(typeof value === 'string' ? value : JSON.stringify(value))
NODE
}

orb_package_dependency_version() {
  orb_package_name=$1
  node - "$ORB_PROJECT_ROOT/package.json" "$orb_package_name" <<'NODE'
const fs = require('node:fs')
const [file, name] = process.argv.slice(2)
const data = JSON.parse(fs.readFileSync(file, 'utf8'))
const value = data.devDependencies?.[name] ?? data.dependencies?.[name]
if (typeof value !== 'string') process.exit(1)
process.stdout.write(value)
NODE
}

orb_project_version() {
  orb_package_value version
}

orb_local_package_version() {
  orb_package_name=$1
  node - "$ORB_PROJECT_ROOT" "$orb_package_name" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const [root, name] = process.argv.slice(2)
const file = path.join(root, 'node_modules', ...name.split('/'), 'package.json')
try {
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (typeof manifest.version !== 'string') process.exit(1)
  process.stdout.write(manifest.version)
} catch {
  process.exit(1)
}
NODE
}

orb_git_checkout() {
  git -C "$ORB_PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1
}

orb_default_bin_dir() {
  if [ -n "${ORB_BIN_DIR:-}" ]; then
    printf '%s\n' "$ORB_BIN_DIR"
  elif [ -n "${PNPM_HOME:-}" ]; then
    printf '%s\n' "$PNPM_HOME"
  elif [ -n "${XDG_BIN_HOME:-}" ]; then
    printf '%s\n' "$XDG_BIN_HOME"
  elif [ -n "${HOME:-}" ]; then
    printf '%s\n' "$HOME/.local/bin"
  else
    return 1
  fi
}

orb_path_contains() (
  orb_path_wanted=$1
  orb_path_rest=${PATH:-}

  while :; do
    case "$orb_path_rest" in
      *:*)
        orb_path_entry=${orb_path_rest%%:*}
        orb_path_rest=${orb_path_rest#*:}
        ;;
      *)
        orb_path_entry=$orb_path_rest
        orb_path_rest=
        ;;
    esac

    [ "$orb_path_entry" = "$orb_path_wanted" ] && return 0
    [ -n "$orb_path_rest" ] || return 1
  done
)

orb_shell_quote() {
  printf "'"
  printf '%s' "$1" | sed "s/'/'\\\\''/g"
  printf "'"
}

orb_ci_enabled() {
  case "${CI:-}" in
    ''|0|false|FALSE|no|NO) return 1 ;;
    *) return 0 ;;
  esac
}
