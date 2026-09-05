# ADR-0014: Select voice models and isolate live conversations behind a port

- Status: Accepted for implementation; runtime validation pending
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective

## Context

SPEC-018 needs one native selection property for browser speech, OpenAI speech
output and direct OpenAI Realtime conversations. The existing `speak(text)`
voice port cannot represent microphone input and a persistent audio session.
Product instructions, tools, context and provider authorization remain owned
by the consuming application.

## Decision

`voiceModel` is a typed object discriminated by `provider`: `web-speech`,
`openai-speech` or `openai-realtime`. It is a property, not a serialized HTML
attribute. Unknown options are rejected, and assignment only prepares inert
configuration. Model/voice/language/timeouts come from the shared JSON defaults.
The Realtime default model is explicitly `gpt-realtime-2`.

An explicitly assigned `voiceEngine` retains precedence over `voiceModel`.
Clear `voiceEngine` to use a selected built-in adapter. `startTalking()` remains
output-only and keeps the existing speech, talk-flow and intelligence contracts.
`startConversation()` starts a selected Realtime session, while
`stopConversation()` and `interruptConversation()` stop the session or its
current response respectively. Starting either mode stops the other mode.
Replacing voice selection/engine, disconnecting or stopping releases active work.

`OrbzConversationPort` carries only start, stop, interruption and narrow
state/transcript/error handlers. The element consumes services and ports;
`voice-model.service.ts` resolves concrete adapters. Browser APIs are accessed
at explicit start time so module imports and adapter construction remain SSR-safe.

`OpenAIRealtimeAdapter` uses the OpenAI unified WebRTC handshake: its consumer
`realtimeSession` authorizer receives `{sdp, model, voice, signal}` and returns
an SDP answer. Alternatively, an application endpoint receives JSON
`{sdp, model, voice}` and returns SDP text. The application authenticates and
authorizes its user, forwards an allowed session configuration and the offer to
OpenAI `/v1/realtime/calls`, and keeps the permanent key on its server. After
negotiation, browser microphone and remote audio flow directly over WebRTC.
Orbz never accepts a permanent key or ephemeral token in `voiceModel`.

The server remains authoritative for persona, tools, conversation context and
VAD configuration. It can retain the OpenAI call ID for its own sideband
connection. Configure server VAD with response creation and interruption enabled
for natural barge-in. Explicit interruption cancels active generation and clears
buffered output. No persona, greeting or automatic response is sent by Orbz.

## Failure and lifecycle policy

Startup, including microphone permission, SDP exchange and connection readiness,
has one bounded timeout. Stop aborts pending waits, closes the peer/data channel,
pauses remote audio and stops local/remote tracks. A microphone granted after
cancellation is immediately stopped. Late provider or callback completions are
fenced by both adapter session ownership and the provider-independent runner.
The adapter fails closed on disconnection; reconnection requires a new explicit
start. It does not automatically retry microphone access, authorization or playback.

Only whitelisted transcript and state events are emitted. Caption strings and
IDs are bounded; provider event objects, SDP, endpoint responses and callback
exception messages are never forwarded. Applications render transcript strings
as text and provide the visible text alternative. Error events retain fixed,
sanitized messages; existing custom voice/intelligence errors retain their
established consumer-owned contract.

## Evidence and limitations

- Implementation: `src/ports/conversation.port.ts`, `src/talk/voice-model.types.ts`,
  `src/talk/openai-realtime.adapter.ts`, `src/services/voice-model.service.ts`,
  `src/services/conversation-runner.service.ts`, native element contracts.
- Provider reference inspected 2026-09-05:
  [WebRTC unified interface](https://developers.openai.com/api/docs/guides/realtime-webrtc),
  [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2),
  [server controls](https://developers.openai.com/api/docs/guides/realtime-server-controls).
- Owner delivery-first instruction defers tests, browser/provider sessions and
  the full Orb check gate. Focused integration compilation is recorded by the
  delivery owner. This ADR does not claim live microphone or provider validation.
- Callback code that ignores AbortSignal can continue on the application side;
  Orbz stops awaiting it and prevents late browser media activation.
- Remote audio playback still depends on browser permission/activation policy.
  Input captions require transcription enabled by the application session.

## Related records

- SPEC-018; ADR-0001, ADR-0002, ADR-0003.
- Rules 001, 003, 004 and 005.
