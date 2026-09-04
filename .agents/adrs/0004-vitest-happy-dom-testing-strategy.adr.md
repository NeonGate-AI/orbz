# ADR-0004: Use Vitest with happy-dom for the fast contract suite

- Status: Accepted
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction

## Context

Orbz needs rapid tests for pure functions, custom-element lifecycle, closed
shadow-DOM boundaries, events, SSR imports, and voice adapters. Most contracts
do not require a full browser for every run.

## Decision

Use Vitest with happy-dom as the default deterministic environment. Run SSR
imports in the Node environment. Keep aliases aligned with TypeScript and map
the virtual CSS module to a test fixture. Use V8 coverage as an optional report.

Real-browser checks remain necessary when a change depends on browser-specific
speech, accessibility trees, rendering, animation, or upgrade semantics.
Colocation and suite naming are defined by ADR-0009.

## Consequences

The suite stays fast and framework-independent. Element tests must not pierce the
closed shadow root; focused factory tests may verify generated semantics. DOM
emulation is not complete browser certification.

## Evidence

- `vitest.config.ts`
- `tsconfig.test.json`
- `src/**/*.test.ts`
- `test/setup.ts`
- `.github/workflows/ci.yml`

## Related records

- ADR-0009
- SPEC-004 and SPEC-010
- Rules 006 and 010
