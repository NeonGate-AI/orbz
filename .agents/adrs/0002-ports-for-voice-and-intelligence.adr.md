# ADR-0002: Integrate voice and intelligence through ports

- Status: Accepted
- Created: 2026-08-21
- Updated: 2026-08-21
- Mode: Retrospective reconstruction

## Context

Voice providers, browser APIs, and intelligence backends have different
credentials, transports, and lifecycle behavior. Embedding provider ownership
inside the element would compromise portability and security.

## Decision

Orbz depends on `OrbzVoiceEnginePort` and `OrbzIntelligencePort`. Adapters may be
shipped for common providers, but endpoints, headers, credentials, and
intelligence implementations remain consumer-owned.

## Consequences

The element stays provider-neutral and test doubles can exercise talk behavior.
Adapters must never embed secrets. New providers implement ports rather than
changing the custom-element contract.

## Evidence

- `src/ports/`
- `src/talk/web-speech.adapter.ts`
- `src/talk/openai-speech.adapter.ts`
- `src/services/talk-runner.service.ts`

## Related records

- SPEC-005
- Rules 001 and 005
