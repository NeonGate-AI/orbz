# Orbz Engineering Instructions

This repository owns only the `@neongate-ai/orbz` npm package.

Read and follow, in order:

1. `.agents/rules/package-contract.md`
2. `.agents/rules/source-organization.md`
3. `.agents/rules/code-style.md`

## Repository boundaries

- Do not add documentation-site code here.
- Do not add framework example applications here.
- Do not add framework-specific Orbz components.
- Keep `<orb-z>` as the single UI implementation.
- Run `pnpm check` before release-oriented changes.
- The Neon CLI is an engineering harness dependency only; it is not part of the
  published runtime surface.

## Neon CLI

- Run `pnpm neon` after dependency installation when the repository harness needs to be bootstrapped or reconciled.
- Do not run Neon setup automatically from install, build, or CI lifecycle hooks.
