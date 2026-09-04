# ADR-0009: Colocate Vitest suites with source responsibilities

- Status: Accepted
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current decision

## Context

A central test directory obscures ownership as source concerns grow. Pure
functions, adapters, factories, and services are easier to discover and maintain
when their behavioral suites move with them.

## Decision

Place executable Vitest suites beside source files under `src/`. Keep shared
setup and fixtures under root `test/`. Discover `src/**/*.test.ts`, exclude tests
from source builds and coverage accounting, and use concern-prefixed suite names.

Canonical prefixes are `core`, `element`, `factory`, `port`, `service`, and
`talk`. The prefix describes architectural ownership rather than a test level.

## Consequences

Source moves carry their tests, and ownership is visible from file layout and
failure output. Build and test TypeScript projects need explicit complementary
include/exclude rules.

## Evidence

- `src/**/*.test.ts`
- `test/setup.ts`
- `test/fixtures/`
- `vitest.config.ts`
- `tsconfig.json`
- `tsconfig.test.json`

## Related records

- ADR-0004
- SPEC-010
- Rules 006 and 010
