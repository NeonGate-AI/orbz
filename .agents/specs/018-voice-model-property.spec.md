# SPEC-018: Connect selectable voice models through the native element

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

Owner request item 3: Orbz must offer one understandable configuration surface and an explicit selectable voice connection suitable for a consuming PWA. This bounded change owns: Add a typed native voiceModel property supporting Web Speech, OpenAI text-to-speech and direct OpenAI Realtime WebRTC. Keep existing voiceEngine compatible. Public model configuration is distinct from consumer session authorization; built-in adapters use shared JSON defaults.

## Scope

Add a typed native voiceModel property supporting Web Speech, OpenAI text-to-speech and direct OpenAI Realtime WebRTC. Keep existing voiceEngine compatible. Public model configuration is distinct from consumer session authorization; built-in adapters use shared JSON defaults.

Affected boundary: src/talk/, src/ports/, src/services/, src/factories/ and element contracts. One numbered spec and its implementation belong to one open review PR. No PR merge, release tag, package publication or consuming-application code change is authorized in this delivery. The five requested items are SPEC-016 through SPEC-020; dependencies are recorded in PR descriptions.

## Requirements

Preserve the native component, strict public types, SSR-safe imports, explicit user activation and consumer-owned credentials. Existing defaults should remain compatible unless this contract explicitly adds behavior. Runtime configuration is public; callbacks, tokens and secrets are supplied by the consuming application and never stored in the JSON file.

Use local to-spec, implement, web-components and voice-engineering procedures where applicable. The owner's five-item instruction authorizes spec creation and implementation without another approval round. The earlier delivery-first instruction remains in force: focused integration compilation is allowed, while broad tests/evals/CI waiting and live provider calls remain deferred. Do not claim unexecuted acceptance as passing.

## Acceptance criteria

- [ ] Assigning voiceModel or loading JSON configuration never starts audio, microphone or paid provider work.
- [ ] Explicit start/stop methods select the configured adapter and preserve existing speech and custom voiceEngine contracts with documented precedence.
- [ ] Realtime gpt-realtime-2 uses direct browser/OpenAI WebRTC and a consumer-owned session authorization callback or endpoint; permanent API keys are never accepted as JSON defaults.
- [ ] Stop, supersession, disconnect and failed startup release microphone/audio/peer resources and fence stale completions.
- [ ] Public declarations, events and README cover native properties and type-only JSX without adding framework runtime wrappers.

## Evidence

Implemented native types and lifecycle in `src/element/element.types.ts` and
`src/factories/element-class.factory.ts`; selectable configuration in
`src/talk/voice-model.types.ts` and `src/talk/normalize-voice-model.compute.ts`;
provider selection and session supersession in `src/services/voice-model.service.ts`
and `src/services/conversation-runner.service.ts`; direct audio transport in
`src/talk/openai-realtime.adapter.ts`; provider-neutral live audio port in
`src/ports/conversation.port.ts`. Existing WebSpeech/OpenAI speech adapters now
consume shared defaults, fence stale work and sanitize built-in provider errors.

Source TypeScript compilation (`tsc --noEmit -p tsconfig.json`) and the main
package/declaration build (`tsdown`) passed on the integrated SPEC-017 through
SPEC-020 worktree on 2026-09-05. This is compilation evidence, not provider
behavioral acceptance. No live
browser/provider behavior, tests or full `orb check` gate were run for this slice
under the owner delivery-first instruction. Acceptance remains pending execution.

## Related records

- ADRs: .agents/adrs/0014-voice-model-and-realtime-port.adr.md
- Rules: 001 package contract, 002 source organization, 003 code style, 005 voice and speech, 007 harness, 008 CLI and 009 Git/SemVer as applicable.
- Skills: `.agents/skills/to-spec/SKILL.md`, `.agents/skills/implement/SKILL.md`, `.agents/skills/web-components/SKILL.md`, `.agents/skills/voice-engineering/SKILL.md`.

## Compatibility and risks

Keep legacy public entry points and existing adapter contracts operational. JSON values are developer-authored build inputs, not arbitrary executable runtime code. Any prospective 1.0 release remains human-reviewed; these PRs do not publish a new package version.

## Validation follow-up — 2026-09-05

The owner now authorizes validation and merging passing PRs into staging. The
full `npm pack --dry-run` prepack gate passes with lint, source/test types,
33 tests, both builds, version checks and all audits. New deterministic cases
exercise inert native selection/custom engine precedence, supersession, rejected
startup isolation, and microphone permission arriving after cancellation. The
failed-start case first reproduced a stale callback changing state to speaking;
the runner now retires the failed run and clears its port before cleanup. The
regression passes, preserving sanitized errors and ignoring late events. No live
provider session or paid call was used; actual browser voice quality and barge-in
remain live acceptance work.
