---
version: 1
name: Isolate WAAPI from Happy DOM
status: implemented
date: 2026-09-04
---

# SPEC-013: Isolate WAAPI from Happy DOM

- Status: Implemented
- Created: 2026-09-04
- Updated: 2026-09-04
- Mode: Current implementation
- Owner: Orbz maintainers

## Problem

Happy DOM 20.14.0 implements `Element.animate()`, but its `Animation.cancel()`
currently rejects the internal `finished` promise as an unhandled `AbortError`.
Orbz intentionally cancels active animations during state transitions and
custom-element teardown, so otherwise-passing Vitest suites fail the process.

## Decision

Keep Orbz runtime cancellation behavior unchanged. In the Happy DOM Vitest
setup, replace `Element.prototype.animate` with a deterministic animation double
that implements the `play()`, `pause()`, and `cancel()` surface consumed by
`OrbzAnimationService`.

Do not globally suppress Vitest unhandled rejections and do not change runtime
animation semantics to accommodate a simulated-DOM defect.

## Acceptance criteria

- [x] Production `OrbzAnimationService` keeps native WAAPI cancellation behavior.
- [x] Happy DOM component tests do not use Happy DOM's `Animation` implementation.
- [x] The animation double exposes `play()`, `pause()`, and `cancel()`.
- [x] Test teardown restores the original `Element.prototype.animate` descriptor.
- [x] Vitest remains configured with colocated `src/**/*.test.ts` suites.
- [x] No global unhandled-rejection ignore rule is introduced.

## Evidence

- `test/setup.ts`
- `src/services/animation.service.ts`
- `vitest.config.ts`
