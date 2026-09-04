# SPEC-002: Repair source organization after concern extraction

- Status: Implemented
- Created: 2026-08-21
- Updated: 2026-08-21
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

Core files were moved into concern folders while imports and test/build aliases
still referenced the former flat paths, leaving the repository uncompilable.

## Scope

Complete the appearance, motion, and library extraction; update all imports;
retain package exports and SSR behavior.

## Acceptance criteria

- [x] No source import references removed flat core paths.
- [x] Appearance, motion, and shared library folders each contain related files.
- [x] TypeScript, build, and Vitest aliases resolve the new paths.
- [x] Public exports retain their existing symbol names.
- [x] Architecture audit enforces the resulting tree.

## Evidence

- `src/core/`
- `src/index.ts`
- `vitest.config.ts`
- `.audits/architecture.audit.sh`

## Related records

- ADR-0001 and ADR-0006
- Rules 001, 002, and 003
