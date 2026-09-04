# ADR-0003: Make speech explicit and default Web Speech to pt-BR

- Status: Accepted
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction

## Context

A reusable visual component must not unexpectedly speak, invent a persona, or
ship product-specific copy. Browser playback also requires an explicit user
activation strategy. Brazilian Portuguese is the package's default speech
locale, while consumers still need language control.

## Decision

Orbz ships with an empty default talk flow and no mocked phrases. Direct speech
requires a non-blank `speech` value, a configured `voiceEngine`, and an explicit
`startTalking()` call. Blank or absent `speech` is silent. Assigning properties
does not autoplay.

`WebSpeechAdapter` defaults to `pt-BR`. Consumers override `language` for another
locale. Custom talk flows remain an advanced, explicit consumer-owned path and
must include all copy they need.

## Consequences

Default connection is silent and predictable. Applications own localization,
transcripts, and conversation content. Existing consumers relying on packaged
mock copy must supply their own speech or flow.

## Evidence

- `src/talk/talk.data.ts`
- `src/factories/element-class.factory.ts`
- `src/services/talk-runner.service.ts`
- `src/factories/element-class.factory.test.ts`
- `src/talk/talk.data.test.ts`
- `src/talk/web-speech.adapter.test.ts`

## Related records

- SPEC-005
- Rules 004 and 005
