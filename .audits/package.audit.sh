#!/bin/sh
set -eu

ROOT=$(CDPATH= cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

node <<'NODE'
const { readFileSync } = require('node:fs')

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const failures = []
const pass = (message) => console.log(`PASS  ${message}`)
const fail = (message) => {
  console.error(`FAIL  ${message}`)
  failures.push(message)
}

if (pkg.type === 'module') pass('package is ESM')
else fail('package type must be module')

if (JSON.stringify(pkg.files) === JSON.stringify(['dist'])) pass('npm payload is limited to dist')
else fail('package files must contain only dist')

if (!pkg.dependencies || Object.keys(pkg.dependencies).length === 0) pass('package has no runtime dependencies')
else fail('unexpected runtime dependencies detected')

if (!pkg.bin) pass('engineering CLI is not a published bin')
else fail('engineering CLI must not be exposed through package bin')

for (const entry of ['.', './browser', './react-types', './standalone', './index.css', './package.json']) {
  if (entry in pkg.exports) pass(`export ${entry}`)
  else fail(`missing export ${entry}`)
}

const expectedScripts = {
  setup: './cli/orb setup',
  prepack: './cli/orb check'
}
const actualScriptNames = Object.keys(pkg.scripts ?? {}).sort()
const expectedScriptNames = Object.keys(expectedScripts).sort()
if (JSON.stringify(actualScriptNames) === JSON.stringify(expectedScriptNames)) {
  pass('package scripts are limited to setup and prepack')
} else {
  fail(`package scripts must be exactly ${expectedScriptNames.join(', ')}; found ${actualScriptNames.join(', ')}`)
}
for (const [name, command] of Object.entries(expectedScripts)) {
  if (pkg.scripts?.[name] === command) pass(`${name} delegates to ${command}`)
  else fail(`${name} must delegate to ${command}`)
}

const forbiddenScripts = ['orb', 'audit', 'bootstrap', 'build', 'check', 'clean', 'commitlint', 'doctor', 'git:doctor', 'git:setup', 'lint', 'lint:staged', 'prepare', 'test', 'test:coverage', 'test:watch', 'typecheck', 'version:check']
const presentForbidden = forbiddenScripts.filter((name) => name in (pkg.scripts ?? {}))
if (presentForbidden.length === 0) pass('redundant package command aliases are absent')
else fail(`redundant package command aliases remain: ${presentForbidden.join(', ')}`)

if (Object.values(pkg.scripts ?? {}).some((value) => /cli\/.*\.mjs|node .*cli\//.test(value))) {
  fail('package scripts retain a Node/MJS CLI runner')
} else {
  pass('package scripts contain no Node/MJS CLI runner')
}

const expectedDependencies = {
  '@commitlint/cli': '21.2.2',
  '@commitlint/config-conventional': '21.2.2',
  husky: '9.1.7',
  'lint-staged': '17.4.1',
  semver: '7.8.5'
}
for (const [name, version] of Object.entries(expectedDependencies)) {
  if (pkg.devDependencies?.[name] === version) pass(`${name} ${version}`)
  else fail(`${name} must be pinned to ${version}`)
}

const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
if (semverPattern.test(pkg.version)) pass(`package version is canonical SemVer: ${pkg.version}`)
else fail(`package version is not canonical SemVer: ${pkg.version}`)

if (pkg.engines?.node === '24.x') pass('Node engine remains 24.x')
else fail('Node engine must remain 24.x')

const commitlint = require('./commitlint.config.cjs')
if (commitlint.extends?.includes('@commitlint/config-conventional')) pass('Commitlint extends config-conventional')
else fail('Commitlint must extend @commitlint/config-conventional')

const staged = JSON.parse(readFileSync('.lintstagedrc.json', 'utf8'))
if (Object.values(staged).some((value) => String(value).includes('biome check --write'))) pass('lint-staged runs Biome')
else fail('lint-staged must run Biome')
if (Object.values(staged).some((value) => String(value).includes('shell-syntax.sh'))) pass('lint-staged validates shell syntax')
else fail('lint-staged must validate shell syntax')

if (failures.length > 0) {
  console.error(`\n${failures.length} package audit failure(s).`)
  process.exit(1)
}
console.log('\nPackage metadata audit passed.')
NODE

for hook in .husky/pre-commit .husky/commit-msg; do
  if [ -f "$hook" ] && [ -x "$hook" ] && /bin/sh -n "$hook"; then
    printf 'PASS  %s is an executable shell hook\n' "$hook"
  else
    printf 'FAIL  %s must be an executable shell hook\n' "$hook" >&2
    exit 1
  fi
done

if grep -F 'orb git pre-commit' .husky/pre-commit >/dev/null 2>&1; then printf 'PASS  pre-commit delegates to Orb\n'; else printf 'FAIL  pre-commit must delegate to Orb\n' >&2; exit 1; fi
if grep -F 'orb git commit-message' .husky/commit-msg >/dev/null 2>&1; then printf 'PASS  commit-msg delegates to Orb\n'; else printf 'FAIL  commit-msg must delegate to Orb\n' >&2; exit 1; fi
if grep -F 'commands/lint.sh" --staged' cli/src/commands/git-pre-commit.sh >/dev/null 2>&1; then printf 'PASS  pre-commit staged lint is owned by Orb\n'; else printf 'FAIL  pre-commit must delegate staged lint to Orb\n' >&2; exit 1; fi

for config in tsdown.config.ts tsdown.standalone.config.ts; do
  if grep -E 'sourcemap:[[:space:]]*false' "$config" >/dev/null 2>&1; then
    printf 'PASS  %s disables source maps\n' "$config"
  else
    printf 'FAIL  %s must disable source maps\n' "$config" >&2
    exit 1
  fi
done
