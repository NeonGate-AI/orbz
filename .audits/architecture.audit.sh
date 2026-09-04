#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

failures=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1" >&2; failures=$((failures + 1)); }
require_file() { if [ -f "$1" ]; then pass "$1"; else fail "missing $1"; fi; }
require_dir() { if [ -d "$1" ]; then pass "$1/"; else fail "missing $1/"; fi; }

for directory in \
  src/core/appearance \
  src/core/lib \
  src/core/motion \
  src/element \
  src/factories \
  src/ports \
  src/services \
  src/talk
do
  require_dir "$directory"
done

for path in \
  src/core/config.data.ts \
  src/core/appearance/appearance.types.ts \
  src/core/appearance/merge-colors.compute.ts \
  src/core/motion/motion.data.ts \
  src/core/motion/motion.types.ts \
  src/talk/talk.data.ts \
  src/factories/element-class.factory.ts
do
  require_file "$path"
done

if [ -e src/core/core.data.ts ]; then
  fail 'legacy src/core/core.data.ts remains; canonical path is config.data.ts'
else
  pass 'configuration data uses src/core/config.data.ts'
fi

legacy_core_files='appearance.types.ts is-preset-name.guard.ts is-reduced-motion.guard.ts is-state.guard.ts merge-colors.compute.ts motion.data.ts motion.types.ts normalize-preset.compute.ts normalize-reduced-motion.compute.ts normalize-size.compute.ts normalize-speed.compute.ts normalize-state.compute.ts'
for name in $legacy_core_files; do
  if [ -e "src/core/$name" ]; then
    fail "legacy flat core file remains: src/core/$name"
  fi
done

if grep -R -n -E "@core/(appearance\.types|merge-colors\.compute|motion\.(data|types)|is-(preset-name|reduced-motion|state)\.guard|normalize-[a-z-]+\.compute)" src >/dev/null 2>&1; then
  fail 'source references removed flat @core paths'
else
  pass 'core imports use concern paths'
fi

if find src \( -type f -o -type d \) -name 'orbz*' -print | grep . >/dev/null 2>&1; then
  fail 'a source path begins with orbz'
else
  pass 'source paths use responsibility names'
fi

if find src -type f \( -iname '*react*component*' -o -iname '*vue*' -o -iname '*svelte*' -o -iname '*angular*' \) -print | grep . >/dev/null 2>&1; then
  fail 'framework runtime source detected'
else
  pass 'no framework runtime wrapper source'
fi

if grep -F "'speech'" src/element/element.data.ts >/dev/null 2>&1; then
  pass 'speech is observed by the custom element'
else
  fail 'speech is not an observed attribute'
fi

if grep -F "DEFAULT_SPEECH_LANGUAGE = 'pt-BR'" src/talk/talk.data.ts >/dev/null 2>&1; then
  pass 'Web Speech default language contract is pt-BR'
else
  fail 'default speech language is not pt-BR'
fi

if grep -E '(Hi,|Hello|Welcome to|How can I help|I am not able)' src/talk/talk.data.ts >/dev/null 2>&1; then
  fail 'default talk data contains packaged conversation copy'
else
  pass 'default talk data contains no packaged conversation copy'
fi

if [ "$failures" -ne 0 ]; then
  printf '\n%d architecture audit failure(s).\n' "$failures" >&2
  exit 1
fi
printf '\nArchitecture audit passed.\n'
