# Orbz engineering instructions

This repository owns only the `@neongate-ai/orbz` npm package.

## Required reading order

1. `.agents/context/readme.md`
2. `.agents/rules/001-package-contract.rule.md`
3. `.agents/rules/002-source-organization.rule.md`
4. `.agents/rules/003-code-style.rule.md`
5. `.agents/rules/004-web-component-accessibility-and-localization.rule.md`
6. `.agents/rules/005-voice-and-speech.rule.md`
7. `.agents/rules/006-testing.rule.md`
8. `.agents/rules/007-harness-documentation-and-audits.rule.md`
9. `.agents/rules/008-engineering-cli.rule.md`
10. `.agents/rules/009-git-commits-and-semantic-versioning.rule.md`
11. `.agents/rules/010-colocated-tests.rule.md`
12. The relevant SPEC and linked ADRs.

## Repository boundaries

- Keep `<orb-z>` as the single runtime UI implementation.
- Keep the package framework-agnostic and SSR-safe.
- Do not add documentation-site code or framework example applications here.
- Do not add runtime framework wrappers.
- Keep provider secrets and product conversation copy outside the package.
- Treat public API additions as compatibility commitments.
- Run `pnpm check` before completing a release-oriented change.

## Harness, CLI, and Git gates

- `.agents/` contains context, ADRs, rules, specs, prompts, and procedures.
- `.audits/` contains deterministic repository checks.
- `./cli/orb help` lists the shell-only local engineering commands.
- Husky hooks are thin adapters; Orb owns pre-commit and commit-message behavior.
- Commit messages follow Conventional Commits and package versions follow SemVer.
- Executable Vitest suites are colocated with source under `src/`.
- Start behavioral changes with a SPEC and link an ADR when architecture changes.
- Keep a `readme.md` in every directory under `.agents/` and `.audits/`.

## Neon CLI

The Neon CLI is an engineering harness dependency only. Run `pnpm neon` after
dependency installation when the repository harness needs reconciliation. Do not
run Neon setup automatically from install, build, test, or CI lifecycle hooks.
