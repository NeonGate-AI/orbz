# Rule 011: Public Orb installer

- Effective: 2026-09-04
- Priority: High
- Applies: `package.json`, `cli/**`, release documentation, and npm payload

1. The package exposes exactly one binary named `orb`, implemented with POSIX shell.
2. `npx @neongate-ai/orbz` with no Orb arguments performs consumer project setup, not repository engineering operations.
3. Consumer setup requires an existing `package.json`, installs Orbz into `dependencies`, and never overwrites application source files.
4. Detect npm, pnpm, yarn, or bun from explicit input, `packageManager`, lockfiles, then npm as the fallback.
5. Install the same Orbz version that supplied the running CLI unless an explicit package specifier is provided.
6. Do not trigger consumer setup through `preinstall`, `install`, `postinstall`, or `prepare`.
7. Repository-only commands must reject execution when the CLI is running from the published package.
8. Package scripts must not duplicate Orb commands. Keep only the setup bridge and npm lifecycle gates.
9. `prepack` must delegate to `./cli/orb check`.
10. `dist/`, `cli/`, and npm's standard root metadata are the only intentional package payload.
