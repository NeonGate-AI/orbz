---
description: Scopes explicit speech, pt-BR defaults, voice adapters, talk-flow behavior, cancellation, events, and provider-boundary constraints.
globs:
  - "src/talk/**"
  - "src/services/talk-runner.service.ts"
  - "src/factories/element-class.factory.ts"
  - "README.md"
---
# Rule 005: Voice and speech behavior

- Effective: 2026-08-21
- Priority: Critical
- Applies: `src/talk/**`, talk service, element speech API

1. Orbz is silent unless the consumer supplies speech or an explicit custom flow and invokes a start method.
2. Assigning `speech`, `voiceEngine`, or `talkFlow` must never autoplay.
3. Blank `speech` is normalized to absence and produces no utterance.
4. `WebSpeechAdapter` defaults to `pt-BR`; consumers may override its language.
5. Orbz never translates, invents, or completes consumer copy.
6. The package default talk flow is empty and contains no mocked phrases.
7. Stop or supersede stale speech runs deterministically.
8. Dispatch public speaking and error events without exposing provider secrets.
9. Provider adapters depend on consumer endpoints and credentials, never embedded secrets.
