# ADR-0001: Keep one native Web Component implementation

- Status: Accepted
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction

## Context

Orbz must work across framework and non-framework applications while remaining
safe to import during server rendering. Framework wrappers would multiply
runtime implementations and create divergent behavior.

## Decision

The package exposes one native `<orb-z>` custom element. The main entry is
side-effect free; browser registration belongs to the browser entry. React
integration is limited to type-only JSX augmentation.

The DOM-dependent element class is created lazily only when `HTMLElement`
exists, and registration is idempotent.

## Consequences

Consumers use the same element in every framework. Public behavior must be
expressed through native attributes, properties, methods, and events. No runtime
React, Vue, Angular, Svelte, or Next.js component may be added.

## Evidence

- `src/factories/element-class.factory.ts`
- `src/services/registration.service.ts`
- `src/browser.client.ts`
- `src/index.test.ts`
- `src/factories/element-class.factory.test.ts`
- `src/services/registration.service.test.ts`

## Related records

- SPEC-001, SPEC-002, SPEC-010
- Rules 001, 002, 004, and 010
