#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

failures=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1" >&2; failures=$((failures + 1)); }

for path in \
  cli/orb \
  cli/readme.md \
  cli/src/orb.sh \
  cli/src/core/common.sh \
  cli/src/core/output.sh \
  cli/src/core/shell-syntax.sh \
  cli/src/commands/bootstrap.sh \
  cli/src/commands/setup.sh \
  cli/src/commands/doctor.sh \
  cli/src/commands/cleanup.sh \
  cli/src/commands/audit.sh \
  cli/src/commands/help.sh \
  cli/src/commands/git-setup.sh \
  cli/src/commands/git-doctor.sh \
  cli/src/commands/git-pre-commit.sh \
  cli/src/commands/git-commit-msg.sh \
  cli/src/commands/git-version-check.sh
do
  if [ -f "$path" ]; then pass "$path"; else fail "missing $path"; fi
done

for executable in cli/orb cli/src/orb.sh cli/src/commands/*.sh cli/src/core/shell-syntax.sh; do
  if [ -x "$executable" ]; then pass "$executable is executable"; else fail "$executable is not executable"; fi
done

shell_failures=0
for shell_file in cli/orb cli/src/*.sh cli/src/core/*.sh cli/src/commands/*.sh; do
  if ! /bin/sh -n "$shell_file"; then
    printf 'FAIL  invalid shell syntax: %s\n' "$shell_file" >&2
    shell_failures=$((shell_failures + 1))
  fi
done
if [ "$shell_failures" -eq 0 ]; then pass 'all Orb shell files pass /bin/sh -n'; else failures=$((failures + shell_failures)); fi

if find cli -type f \( -name '*.mjs' -o -name '*.js' -o -name '*.ts' \) -print | grep . >/dev/null 2>&1; then
  fail 'CLI contains a non-shell implementation file'
else
  pass 'CLI implementation is shell-only'
fi

legacy_cli_name=$(printf '%s%s' 'e' 'lo')
legacy_cli_title=$(printf '%s%s' 'E' 'lo')
legacy_cli_upper=$(printf '%s%s' 'E' 'LO')

if [ -e "cli/$legacy_cli_name" ] || [ -e "cli/src/$legacy_cli_name.sh" ]; then
  fail 'legacy CLI entry points remain in cli/'
else
  pass 'legacy CLI entry points are absent'
fi

legacy_cli_pattern="(^|[^[:alnum:]_])${legacy_cli_title}([^[:alnum:]_]|$)|(^|[^[:alnum:]_])${legacy_cli_name}([^[:alnum:]_]|$)|${legacy_cli_upper}_|${legacy_cli_name}_"
if find cli .agents .audits .husky .github README.md AGENTS.md package.json .lintstagedrc.json \
  -type f ! -path '.audits/cli.audit.sh' \
  -exec grep -n -E "$legacy_cli_pattern" {} + \
  >/dev/null 2>&1; then
  fail 'legacy CLI naming remains in the active repository surface'
else
  pass 'CLI naming is consistently Orb'
fi

if grep -R -n -i -E 'k8s|container orchestrator|workspace task graph|product changelog|environment template' cli >/dev/null 2>&1; then
  fail 'CLI retains unrelated application or infrastructure behavior'
else
  pass 'CLI scope is specific to the Orbz library'
fi

for command in bootstrap setup doctor cleanup audit help 'git setup' 'git doctor' 'git pre-commit' 'git commit-message' 'git version-check'; do
  if TERM=dumb ./cli/orb help | grep -F "$command" >/dev/null 2>&1; then
    pass "help documents $command"
  else
    fail "help does not document $command"
  fi
done

node <<'NODE' || failures=$((failures + 1))
const fs = require('node:fs')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
if (pkg.scripts?.orb !== './cli/orb') {
  console.error('FAIL  package script orb must delegate to ./cli/orb')
  process.exit(1)
}
if (Object.values(pkg.scripts ?? {}).some((value) => /cli\/.*\.mjs|node .*cli\//.test(value))) {
  console.error('FAIL  package scripts retain a Node/MJS CLI runner')
  process.exit(1)
}
console.log('PASS  package scripts delegate to the shell CLI')
NODE

if grep -F '# managed-by: orbz-orb' cli/src/commands/setup.sh >/dev/null 2>&1; then
  pass 'launcher uses the Orbz-managed marker'
else
  fail 'launcher marker is not Orbz-specific'
fi

if grep -F '.agents' cli/src/commands/cleanup.sh >/dev/null 2>&1 && grep -F '.audits' cli/src/commands/cleanup.sh >/dev/null 2>&1; then
  pass 'cleanup protects harness directories'
else
  fail 'cleanup does not explicitly protect harness directories'
fi

if [ "$failures" -ne 0 ]; then
  printf '\n%d CLI audit failure(s).\n' "$failures" >&2
  exit 1
fi
printf '\nCLI audit passed.\n'
