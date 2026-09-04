# SPEC-004: Establish the Vitest Web Component test environment

- Status: Implemented
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

The package had lint, type, and build gates but no executable behavioral suite
for custom elements, SSR, speech, or adapters.

## Scope

Configure Vitest, happy-dom, V8 coverage, test type checking, shared media-query
setup, and representative source-contract tests. SPEC-010 later changes suite
placement without changing this runner decision.

## Acceptance criteria

- [x] DOM tests use happy-dom and SSR imports use Node.
- [x] Test aliases match source aliases and virtual CSS is replaced by a fixture.
- [x] Tests cover registration, closed shadow, reflection, speech silence, events, adapters, and defaults.
- [x] `pnpm check` runs tests and test type checks.
- [x] CI executes the complete check.

## Evidence

- `vitest.config.ts`
- `tsconfig.test.json`
- `src/**/*.test.ts`
- `test/setup.ts`
- `.github/workflows/ci.yml`

## Related records

- ADR-0004 and ADR-0009
- SPEC-010
- Rules 006 and 010
