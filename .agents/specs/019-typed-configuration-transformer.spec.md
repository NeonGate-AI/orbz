# SPEC-019: Transform canonical JSON into validated typed configuration

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

Owner request item 4: Orbz must offer one understandable configuration surface and an explicit selectable voice connection suitable for the Amarelo PWA. This bounded change owns: Implement a pure configuration transformer that validates semantic structure, converts serialized special values such as infinite animation repeat, derives existing TypeScript bindings and freezes nested output once. Avoid repeated ad hoc freezes and runtime file/network reads.

## Scope

Implement a pure configuration transformer that validates semantic structure, converts serialized special values such as infinite animation repeat, derives existing TypeScript bindings and freezes nested output once. Avoid repeated ad hoc freezes and runtime file/network reads.

Affected boundary: src/core/lib/, src/core/ and configuration integration. One numbered spec and its implementation belong to one open review PR. No PR merge, release tag, package publication or Amarelo code change is authorized in this delivery. The five requested items are SPEC-016 through SPEC-020; dependencies are recorded in PR descriptions.

## Requirements

Preserve the native component, strict public types, SSR-safe imports, explicit user activation and consumer-owned credentials. Existing defaults should remain compatible unless this contract explicitly adds behavior. Runtime configuration is public; callbacks, tokens and secrets are supplied by the consuming application and never stored in the JSON file.

Use local to-spec, implement, web-components and voice-engineering procedures where applicable. The owner's five-item instruction authorizes spec creation and implementation without another approval round. The earlier delivery-first instruction remains in force: focused integration compilation is allowed, while broad tests/evals/CI waiting and live provider calls remain deferred. Do not claim unexecuted acceptance as passing.

## Acceptance criteria

- [ ] A reusable typed pure function transforms valid JSON into immutable configuration and derived values.
- [ ] Invalid keys, types, ranges and references fail with safe path-oriented diagnostics before browser side effects.
- [ ] JSON Infinity representation converts only where valid; input objects are not mutated.
- [ ] Bundled entry points remain SSR-safe and need no filesystem or remote JSON request.

## Evidence

Implementation: `src/core/lib/transform-configuration.compute.ts` exposes
`transformOrbzConfiguration(input: unknown): OrbzConfiguration`. The function
clones caller input through `clone-configuration.compute.ts`, validates it through
`validate-configuration.compute.ts`, derives complete motion profiles and observed
color attributes, decodes motion repeat, then freezes the entire owned output.
`src/core/configuration.data.ts` now uses this utility for the bundled source.

Validation enforces the supported state/preset/color/voice-model tuples and their
references, exact object fields, CSS palette colors and animation units, finite
numbers, nonnegative durations and repeat counts, speech ranges and timeouts,
valid BCP 47 language, matching monotonic keyframe offsets, static reduced-motion
profiles, request credential policy, bounded transport settings and empty default
conversation data. Infinity is allowed only as `"infinite"` in full-motion repeat.
The token pattern is validated against the supported interpolation grammar.
Invalid inputs throw `TypeError` with a schema path and a reason without printing
caller values. JSON cloning rejects cycles, sparse arrays, accessors, symbols,
non-finite values, non-plain objects and excessive nesting before deriving output.

Public source and runtime types express supported unions and primitive types;
they do not pretend editable defaults permanently equal the bundled literals.
Default size is a CSS-size string (numeric strings are supported); the element
size property continues to accept numbers and strings. The utility transforms a
complete source object; it does not load files or install per-element settings.

Focused formatting was applied only to the three new utility modules. Integration
compilation remains pending the root pass. No tests, evaluations, provider calls
or broad `orb check` were run under the owner's delivery-first instruction;
acceptance checkboxes are intentionally not claims of passing those gates.

## Related records

- ADRs: .agents/adrs/0013-canonical-json-configuration.adr.md
- Rules: 001 package contract, 002 source organization, 003 code style, 005 voice and speech, 007 harness, 008 CLI and 009 Git/SemVer as applicable.
- Skills: `.agents/skills/to-spec/SKILL.md`, `.agents/skills/implement/SKILL.md`, `.agents/skills/web-components/SKILL.md`, `.agents/skills/voice-engineering/SKILL.md`.

## Compatibility and risks

Keep legacy public entry points and existing adapter contracts operational. JSON values are developer-authored build inputs, not arbitrary executable runtime code. Any prospective 1.0 release remains human-reviewed; these PRs do not publish a new package version.

Source integration compilation passed in the assembled worktree. This records type integration only; behavioral assertions and live execution remain deferred.
