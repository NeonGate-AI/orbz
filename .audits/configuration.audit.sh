#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

failures=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1" >&2; failures=$((failures + 1)); }

for path in src/orbz.config.json .audits/configuration.inventory.md; do
  if [ -f "$path" ]; then pass "$path"; else fail "missing $path"; fi
done

# Deliberately conservative source guard: production uppercase declarations
# must use a canonical binding. Algorithms and runtime objects stay in
# code; the one legacy uppercase constructor registry has an exact exemption.
# Compatibility data modules also reject lowercase authored defaults. Their
# two legacy aggregate views may only combine already canonical bindings.
# New declaration forms require an explicit audit/inventory update.
if find src -type f -name '*.ts' ! -name '*.test.ts' -exec awk '
  function reject(message) {
    printf "FAIL  %s:%d: %s\n", source, sourceLine, message
    failures++
  }
  function inspect(declaration, name, initializer, compact) {
    if (declaration !~ /^const[ \t]/) {
      reject("configuration bindings must use const")
      return
    }
    name = declaration
    sub(/^(const|let|var)[ \t]+/, "", name)
    sub(/[^A-Za-z0-9_].*$/, "", name)
    initializer = declaration
    if (initializer !~ /=/) {
      reject("cannot establish a canonical initializer for " name)
      return
    }
    sub(/^[^=]*=[ \t]*/, "", initializer)
    sub(/[ \t]*;?[ \t]*$/, "", initializer)
    if (initializer ~ /^orbzConfiguration(\.[A-Za-z_][A-Za-z0-9_]*)+(\[[A-Z][A-Z0-9_]*\])?$/) return
    if (source == "src/core/config.data.ts" && name == "DEFAULT_ORBZ_COLORS" &&
        initializer == "ORBZ_PRESETS[DEFAULT_ORBZ_PRESET]") return
    if (source == "src/factories/element-class.factory.ts" && name == "ELEMENT_CONSTRUCTORS" &&
        initializer == "new WeakMap<object, OrbzElementConstructor>()") return
    compact = initializer
    gsub(/[ \t\r\n]/, "", compact)
    if (source == "src/core/config.data.ts" && name == "ORBZ_VOICE_DEFAULTS" &&
        compact ~ /^deepFreezeOrbzConfiguration\(\{([A-Za-z_][A-Za-z0-9_]*:orbzConfiguration(\.[A-Za-z_][A-Za-z0-9_]*)+,?)+\}\)$/) return
    if (source == "src/core/config.data.ts" && name == "config" &&
        compact ~ /^deepFreezeOrbzConfiguration\(\{([A-Z][A-Z0-9_]*,?)+\}\)$/) return
    reject(name " must derive directly from orbzConfiguration; see .audits/configuration.inventory.md")
  }
  FNR == 1 {
    if (pending != "") inspect(pending)
    pending = ""
    aggregate = 0
  }
  {
    if (pending != "") {
      pending = pending " " $0
      if ((aggregate && $0 ~ /^[ \t]*\}\)/) ||
          (!aggregate && pending ~ /=[ \t]*[^ \t]/)) {
        inspect(pending)
        pending = ""
        aggregate = 0
      }
      next
    }
    compatibility = FILENAME ~ /\.data\.ts$/ && FILENAME != "src/core/configuration.data.ts"
    if ((compatibility && match($0, /(const|let|var)[ \t]+[A-Za-z_][A-Za-z0-9_]*[ \t]*(:|=)/)) ||
        (!compatibility && match($0, /(const|let|var)[ \t]+[A-Z][A-Z0-9_]*[ \t]*(:|=)/))) {
      source = FILENAME
      sourceLine = FNR
      declaration = substr($0, RSTART)
      if (declaration ~ /= deepFreezeOrbzConfiguration\(\{[ \t]*$/) {
        pending = declaration
        aggregate = 1
      }
      else if (declaration ~ /=[ \t]*[^ \t]/) inspect(declaration)
      else pending = declaration
    }
  }
  END {
    if (pending != "") inspect(pending)
    exit failures != 0
  }
' {} +; then
  pass 'production uppercase declarations contain no independent configuration literals'
else
  fail 'production uppercase configuration must derive from the canonical JSON'
fi

for path in src/core/config.data.ts src/core/motion/motion.data.ts src/element/element.data.ts src/talk/talk.data.ts; do
  if grep -F 'orbzConfiguration.' "$path" >/dev/null 2>&1; then
    pass "$path uses canonical bindings"
  else
    fail "$path must remain a derived compatibility module"
  fi
done

if grep -F 'orbzConfiguration.speech.talk' src/talk/talk.data.ts >/dev/null 2>&1 &&
  grep -F 'orbzConfiguration.speech.defaultTalkFlow' src/talk/talk.data.ts >/dev/null 2>&1 &&
  ! grep -E '(emptyTalkFlow|Object\.freeze)' src/talk/talk.data.ts >/dev/null 2>&1; then
  pass 'talk data retains no independently maintained empty defaults'
else
  fail 'talk record and empty flow must be canonical bindings'
fi

if grep -F 'orbzConfiguration.speech.tokenPattern.source' src/talk/resolve-talk-text.compute.ts >/dev/null 2>&1 &&
  grep -F 'orbzConfiguration.speech.tokenPattern.flags' src/talk/resolve-talk-text.compute.ts >/dev/null 2>&1; then
  pass 'talk token matcher compiles canonical source and flags'
else
  fail 'talk token matcher must derive its source and flags from canonical configuration'
fi

if [ "$failures" -ne 0 ]; then
  printf '\n%d configuration audit failure(s).\n' "$failures" >&2
  exit 1
fi
printf '\nConfiguration audit passed.\n'
