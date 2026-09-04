# SPEC-010: Colocate Vitest suites with Orbz source

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

Centralized executable tests make the tested source responsibility and ownership
less visible.

## Scope

Move `*.test.ts` files beside source, split broad configuration coverage by
responsibility, keep only shared support under `test/`, and enforce concern-based
suite names.

## Acceptance criteria

- [x] Vitest discovers `src/**/*.test.ts`.
- [x] No executable `*.test.ts` remains under root `test/`.
- [x] Test files are adjacent to their primary source subject.
- [x] Top-level suites use `core`, `element`, `factory`, `port`, `service`, or `talk` prefixes.
- [x] Source TypeScript excludes tests and the test project includes them.
- [x] Coverage excludes colocated test files.
- [x] Shared setup and the virtual-style fixture remain under `test/`.

## Evidence

- `src/**/*.test.ts`
- `test/setup.ts`
- `test/fixtures/orbz-styles.ts`
- `vitest.config.ts`
- `tsconfig.json`
- `tsconfig.test.json`

## Related records

- ADR-0009
- Rule 010
- Extends SPEC-004
