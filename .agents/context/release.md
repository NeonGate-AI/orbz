# Release context

Only `dist/` is intentional package payload, in addition to npm's automatic
root metadata files. Source maps are disabled. Provider secrets, tests, CLI
files, Git hooks, and engineering harness records must not enter the package.

Commit messages follow Conventional Commits. Release planning maps `fix` and
`perf` to patch changes, `feat` to minor changes, and `!` or `BREAKING CHANGE`
to major changes. `package.json#version` must be canonical SemVer. A staged
version change must move forward relative to `HEAD`.

A release-oriented change runs `./cli/orb check`; CI also delegates environment,
commit-history, and quality checks to Orb before running `npm pack --dry-run`.
New exports, attributes, properties, methods, events, and entry points are
compatibility commitments and require an explicit SPEC plus an ADR when the
commitment is architectural.

Orb and Neon are engineering-only tools. Orb is implemented with POSIX shell and
is not exposed through the npm `bin` field. `pnpm run setup` is the only
user-facing package script. The `prepack` lifecycle is a publication safety
adapter that delegates to `./cli/orb check`; it must not duplicate the gate or
publish engineering files. Git hooks are configured explicitly by `orb
bootstrap` or `orb git setup`, never by an install lifecycle.
