# SPEC-017: Establish canonical Orbz JSON configuration

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

Owner request item 2: Orbz must offer one understandable configuration surface and an explicit selectable voice connection suitable for a consuming PWA. This bounded change owns: Create src/orbz.config.json with semantic sections for component, appearance, motion, speech and realtime defaults; migrate current core configuration and motion data without changing appearance. Preserve readonly typed compatibility bindings with no independent literal sources.

## Scope

Create src/orbz.config.json with semantic sections for component, appearance, motion, speech and realtime defaults; migrate current core configuration and motion data without changing appearance. Preserve readonly typed compatibility bindings with no independent literal sources.

Affected boundary: src/core/ and src/orbz.config.json. One numbered spec and its implementation belong to one open review PR. No PR merge, release tag, package publication or consuming-application code change is authorized in this delivery. The five requested items are SPEC-016 through SPEC-020; dependencies are recorded in PR descriptions.

## Requirements

Preserve the native component, strict public types, SSR-safe imports, explicit user activation and consumer-owned credentials. Existing defaults should remain compatible unless this contract explicitly adds behavior. Runtime configuration is public; callbacks, tokens and secrets are supplied by the consuming application and never stored in the JSON file.

Use local to-spec, implement, web-components and voice-engineering procedures where applicable. The owner's five-item instruction authorizes spec creation and implementation without another approval round. The earlier delivery-first instruction remains in force: focused integration compilation is allowed, while broad tests/evals/CI waiting and live provider calls remain deferred. Do not claim unexecuted acceptance as passing.

## Acceptance criteria

- [ ] Appearance and full/reduced motion defaults come from src/orbz.config.json with semantically named sections.
- [ ] JSON contains only serializable public configuration and never credentials, mutable runtime instances or executable functions.
- [ ] Existing exported constants and documented presets preserve values through derived bindings, with configurable default types accurately represented.
- [ ] Source organization rules explicitly authorize the owner-selected file and retire the old canonical-source claim.

## Evidence

Implementation: `src/orbz.config.json` now owns all existing palette and full/reduced motion values, plus component, Web Speech, OpenAI speech and realtime defaults. `src/core/configuration.data.ts` bundles the JSON and derives runtime motion profiles with scoped `infinite` conversion; `src/core/config.data.ts` and `src/core/motion/motion.data.ts` expose readonly derived bindings. `src/core/config.types.ts` preserves finite state/preset/color contracts and accurate configurable value types, while the shared deep-freeze utility owns recursive immutability. TypeScript JSON resolution and the matching Vitest alias are configured. Rule 002 and ADR-0013 record the canonical-source exception.

Focused source integration compilation passed in the assembled configuration/voice worktree. Acceptance checkboxes remain unexecuted evidence, not claims of passing tests. Live browser/provider behavior and the full `orb check` gate remain deferred under the owner delivery-first instruction.

## Related records

- ADRs: .agents/adrs/0013-canonical-json-configuration.adr.md
- Rules: 001 package contract, 002 source organization, 003 code style, 005 voice and speech, 007 harness, 008 CLI and 009 Git/SemVer as applicable.
- Skills: `.agents/skills/to-spec/SKILL.md`, `.agents/skills/implement/SKILL.md`, `.agents/skills/web-components/SKILL.md`, `.agents/skills/voice-engineering/SKILL.md`.

## Compatibility and risks

Keep legacy public entry points and existing adapter contracts operational. JSON values are developer-authored build inputs, not arbitrary executable runtime code. Any prospective 1.0 release remains human-reviewed; these PRs do not publish a new package version.

Configurable defaults use supported unions/primitives rather than falsely retaining literal types after a fork edits JSON. The potential widening of default-value types is disclosed for release review.

## Validation follow-up — 2026-09-05

The owner now authorizes validation, conflict repair and merging passing PRs into
`staging`. The earlier validation deferral described the initial delivery only.
`npm pack --dry-run` passed, including its full `orb check` prepack gate: lint,
source/test types, Vitest, both builds, SemVer and every audit. Package payload
remains limited to the documented library, CLI and root metadata. The inherited
harness terminology failure was repaired by keeping this package's scope wording
product-neutral; no audit was disabled or weakened. Live provider calls remain
outside this local validation.
