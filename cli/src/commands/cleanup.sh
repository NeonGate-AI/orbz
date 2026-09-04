#!/bin/sh
set -eu
. "$ORB_CLI_DIR/core/common.sh"

include_dependencies=false
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dependencies) include_dependencies=true ;;
    --help|-h)
      printf 'Usage: orb cleanup [--dependencies]\n'
      exit 0
      ;;
    *) orb_die "Unknown cleanup option: $1" 2 ;;
  esac
  shift
done

remove_path() {
  cleanup_path=$1
  [ -e "$cleanup_path" ] || return 0
  rm -rf "$cleanup_path"
  printf 'removed %s\n' "$(orb_rel "$cleanup_path")"
}

for cleanup_name in dist coverage .vitest .cache build out; do
  remove_path "$ORB_PROJECT_ROOT/$cleanup_name"
done

find "$ORB_PROJECT_ROOT" \
  \( -path "$ORB_PROJECT_ROOT/.git" -o -path "$ORB_PROJECT_ROOT/.agents" -o -path "$ORB_PROJECT_ROOT/.audits" -o -path "$ORB_PROJECT_ROOT/node_modules" \) -prune \
  -o -type f \( -name '*.tsbuildinfo' -o -name '*.tgz' \) -print |
  while IFS= read -r cleanup_file; do
    remove_path "$cleanup_file"
  done

if [ "$include_dependencies" = true ]; then
  remove_path "$ORB_PROJECT_ROOT/node_modules"
fi
