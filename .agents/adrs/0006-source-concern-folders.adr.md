# ADR-0006: Organize core modules by appearance, motion, and shared library concern

- Status: Accepted
- Created: 2026-08-21
- Updated: 2026-08-21
- Mode: Retrospective reconstruction

## Context

The original flat `core/` directory mixed appearance, motion, guards, and
normalizers. The package needs discoverable concerns without deep or singleton
folder hierarchies.

## Decision

Use `core/appearance/` for appearance contracts and palette computation,
`core/motion/` for motion data/types/guards, and `core/lib/` for shared guards
and normalizers. Keep cross-cutting `factories/`, `ports/`, and `services/`
directly under `src/`, and keep speech in `talk/`.

Use configured aliases for non-sibling imports and responsibility suffixes for
file names.

## Consequences

Imports and build aliases must remain synchronized. A concern folder exists only
when it contains at least two related source files. No source file or folder
below `src/` starts with `orbz`.

## Evidence

- `src/core/`
- `tsconfig.json`
- `tsdown.config.ts`
- `vitest.config.ts`

## Related records

- SPEC-002
- Rules 002 and 003
