#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

failures=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1" >&2; failures=$((failures + 1)); }

first_line=$(sed -n '1p' README.md)
case "$first_line" in
  '# Orbz'*'assets/images/neongate-sphere.png'*'align="middle"'*) pass 'README title includes the NeonGate sphere' ;;
  *) fail 'README first line must place the NeonGate sphere beside # Orbz' ;;
esac

for image in assets/images/neongate-sphere.png assets/images/readme-banner.png; do
  if [ -s "$image" ]; then pass "$image exists"; else fail "missing or empty $image"; fi
done

summary_end=$(grep -n -m1 '^or backend\.$' README.md | cut -d: -f1 || true)
banner_line=$(grep -n -m1 'assets/images/readme-banner.png' README.md | cut -d: -f1 || true)
links_line=$(grep -n -m1 '\[Documentation\]' README.md | cut -d: -f1 || true)
if [ -n "$summary_end" ] && [ -n "$banner_line" ] && [ -n "$links_line" ] && [ "$summary_end" -lt "$banner_line" ] && [ "$banner_line" -lt "$links_line" ]; then
  pass 'README banner follows the opening summary and precedes navigation links'
else
  fail 'README banner is not directly positioned after the opening package summary'
fi

for heading in \
  '## Getting started' \
  '## Speech and language' \
  '## States' \
  '## Presets' \
  '## Custom palette' \
  '## Accessibility' \
  '## Server rendering and frameworks' \
  '## Development' \
  '## Git quality gates and semantic versioning'
do
  if grep -F "$heading" README.md >/dev/null 2>&1; then pass "README contains $heading"; else fail "README is missing $heading"; fi
done

for value in neongate periwinkle magenta peach mocha ivory; do
  if grep -F "$value" README.md >/dev/null 2>&1; then pass "README documents preset $value"; else fail "README does not document preset $value"; fi
done

for value in idle listening thinking speaking asleep; do
  if grep -F "$value" README.md >/dev/null 2>&1; then pass "README documents state $value"; else fail "README does not document state $value"; fi
done

for token in speech pt-BR en-US color-primary reduced-motion 'startTalking()' './cli/orb bootstrap' lint-staged Commitlint SemVer; do
  if grep -F "$token" README.md >/dev/null 2>&1; then pass "README documents $token"; else fail "README does not document $token"; fi
done

if [ "$failures" -ne 0 ]; then
  printf '\n%d documentation audit failure(s).\n' "$failures" >&2
  exit 1
fi
printf '\nDocumentation audit passed.\n'
