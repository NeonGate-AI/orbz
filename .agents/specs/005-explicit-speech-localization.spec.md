# SPEC-005: Replace mocked speech with explicit localized speech

- Status: Implemented
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

Packaged greetings and fallback sentences imposed a persona and could make the
orb speak content the consumer did not supply.

## Scope

Add reflected `speech`, remove all default conversation copy, make blank speech
silent, and use Brazilian Portuguese as the default Web Speech language.

## Acceptance criteria

- [x] The default talk flow is empty and contains no phrases.
- [x] `speech` is a typed reflected property and observed attribute.
- [x] Missing or blank speech does not call the voice engine.
- [x] Direct speech requires explicit `startTalking()`.
- [x] Web Speech defaults to `pt-BR` and accepts `en-US` or other BCP 47 tags.
- [x] README demonstrates both Portuguese and English configuration.
- [x] Speech behavior has deterministic tests.

## Evidence

- `src/talk/talk.data.ts`
- `src/factories/element-class.factory.ts`
- `src/talk/web-speech.adapter.ts`
- `src/factories/element-class.factory.test.ts`
- `src/talk/talk.data.test.ts`
- `src/talk/web-speech.adapter.test.ts`

## Related records

- ADR-0002 and ADR-0003
- Rules 004, 005, and 010
