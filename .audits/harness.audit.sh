#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

failures=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1" >&2; failures=$((failures + 1)); }

for directory in .agents .agents/context .agents/adrs .agents/rules .agents/specs .agents/prompts .agents/skills .audits; do
  if [ -f "$directory/readme.md" ]; then pass "$directory/readme.md"; else fail "missing $directory/readme.md"; fi
done

missing_readmes=$(find .agents .audits -type d ! -exec test -f '{}/readme.md' ';' -print)
if [ -n "$missing_readmes" ]; then
  printf '%s\n' "$missing_readmes" >&2
  fail 'one or more harness directories have no readme.md'
else
  pass 'every harness directory has readme.md'
fi

adr_count=$(find .agents/adrs -type f -name '[0-9][0-9][0-9][0-9]-*.adr.md' | wc -l | tr -d ' ')
spec_count=$(find .agents/specs -type f -name '[0-9][0-9][0-9]-*.spec.md' | wc -l | tr -d ' ')
rule_count=$(find .agents/rules -type f -name '[0-9][0-9][0-9]-*.rule.md' | wc -l | tr -d ' ')
[ "$adr_count" -ge 9 ] && pass "$adr_count ADRs" || fail 'expected at least 9 Orbz ADRs'
[ "$spec_count" -ge 11 ] && pass "$spec_count SPECs" || fail 'expected at least 11 Orbz SPECs'
[ "$rule_count" -ge 10 ] && pass "$rule_count rules" || fail 'expected at least 10 Orbz rules'

for record in .agents/adrs/000[1-6]-*.adr.md .agents/specs/00[1-7]-*.spec.md; do
  if grep -F 'Created: 2026-08-21' "$record" >/dev/null 2>&1 && grep -F 'Mode: Retrospective reconstruction' "$record" >/dev/null 2>&1; then
    :
  else
    fail "$record lacks the retrospective date/mode contract"
  fi
done

for record in .agents/adrs/000[7-9]-*.adr.md .agents/specs/00[8-9]-*.spec.md .agents/specs/01[0-1]-*.spec.md; do
  if grep -F 'Created: 2026-09-04' "$record" >/dev/null 2>&1 && grep -F 'Mode: Current' "$record" >/dev/null 2>&1; then
    :
  else
    fail "$record lacks the current date/mode contract"
  fi
done
if [ "$failures" -eq 0 ]; then pass 'record dates distinguish retrospective and current work'; fi

legacy_name=$(printf '%s%s' 'ama' 'relo')
legacy_phrase=$(printf '%s%s' 'yellow' ' project')
if grep -R -n -i -E "$legacy_name|$legacy_phrase" .agents .audits cli AGENTS.md README.md package.json >/dev/null 2>&1; then
  fail 'repository harness retains unrelated product terminology'
else
  pass 'repository harness terminology is Orbz-specific'
fi

if grep -R -n -i -E 'container orchestrator|workspace task graph|product changelog|environment template' .agents cli >/dev/null 2>&1; then
  fail 'repository harness retains unrelated application assumptions'
else
  pass 'repository harness contains no imported application assumptions'
fi

if [ -d .audit ]; then fail 'legacy .audit directory still exists'; else pass 'audit directory is .audits'; fi

for rule in 009-git-commits-and-semantic-versioning 010-colocated-tests; do
  if grep -F ".agents/rules/$rule.rule.md" AGENTS.md >/dev/null 2>&1; then pass "AGENTS reads rule $rule"; else fail "AGENTS omits rule $rule"; fi
done

if [ "$failures" -ne 0 ]; then
  printf '\n%d harness audit failure(s).\n' "$failures" >&2
  exit 1
fi
printf '\nHarness audit passed.\n'
