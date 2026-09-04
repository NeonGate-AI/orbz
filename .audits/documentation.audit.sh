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
npx_line=$(grep -n -m1 'npx -y --package=@neongate-ai/orbz@latest orb' README.md | cut -d: -f1 || true)
badges_line=$(grep -n -m1 'badge-l4.svg' README.md | cut -d: -f1 || true)
banner_line=$(grep -n -m1 'assets/images/readme-banner.png' README.md | cut -d: -f1 || true)
links_line=$(grep -n -m1 '\[Documentation\]' README.md | cut -d: -f1 || true)
if [ -n "$summary_end" ] && [ -n "$npx_line" ] && [ -n "$badges_line" ] && [ -n "$banner_line" ] && [ -n "$links_line" ] && \
   [ "$summary_end" -lt "$npx_line" ] && [ "$npx_line" -lt "$badges_line" ] && [ "$badges_line" -lt "$banner_line" ] && [ "$banner_line" -lt "$links_line" ]; then
  pass 'README orders npx clipboard, centered badges, banner, then navigation links'
else
  fail 'README hero ordering must be summary -> npx -> badges -> banner -> links'
fi

for heading in \
  '## Getting started' \
  '## Speech and language' \
  '## States' \
  '## Presets' \
  '## Custom palette' \
  '## Accessibility' \
  '## Server rendering and frameworks' \
  '## Contributing' \
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

for token in speech pt-BR en-US color-primary reduced-motion 'startTalking()' './cli/orb bootstrap' 'orb check' 'npx -y --package=@neongate-ai/orbz@latest orb' lint-staged Commitlint SemVer; do
  if grep -F "$token" README.md >/dev/null 2>&1; then pass "README documents $token"; else fail "README does not document $token"; fi
done


for token in \
  'paladini.github.io/harness-score/maturity/badge-l4.svg' \
  'github/actions/workflow/status/NeonGate-AI/orbz/ci.yml' \
  'img.shields.io/npm/v/%40neongate-ai%2Forbz' \
  '## Orb CLI' \
  'pnpm exec orb --help' \
  'npm exec -- orb --help'
do
  if grep -F "$token" README.md >/dev/null 2>&1; then pass "README documents $token"; else fail "README does not document $token"; fi
done


if grep -E 'pnpm (orb|check|version:check)' README.md cli/readme.md >/dev/null 2>&1; then
  fail 'documentation retains removed package-script command aliases'
else
  pass 'documentation routes repository commands through Orb'
fi

if grep -F 'package binary' README.md >/dev/null 2>&1 && grep -F 'POSIX shell' README.md >/dev/null 2>&1; then
  pass 'README documents the published POSIX shell binary'
else
  fail 'README does not document the published POSIX shell binary'
fi

if [ "$failures" -ne 0 ]; then
  printf '\n%d documentation audit failure(s).\n' "$failures" >&2
  exit 1
fi
printf '\nDocumentation audit passed.\n'
