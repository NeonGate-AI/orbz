#!/bin/sh
set -eu

[ "$#" -gt 0 ] || exit 0
for shell_file in "$@"; do
  [ -f "$shell_file" ] || continue
  /bin/sh -n "$shell_file"
done
