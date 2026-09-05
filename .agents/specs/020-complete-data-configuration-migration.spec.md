# SPEC-020: Make JSON the single source for remaining runtime configuration

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

Owner request item 5: Orbz must offer one understandable configuration surface and an explicit selectable voice connection suitable for the Amarelo PWA. This bounded change owns: Migrate remaining uppercase serializable data, speech defaults, element attributes, animation mappings and token-pattern configuration into the canonical JSON and derived bindings. Preserve executable logic and runtime object lifecycles in code. Reconcile all obsolete data sources and add an explicit migration inventory.

## Scope

Migrate remaining uppercase serializable data, speech defaults, element attributes, animation mappings and token-pattern configuration into the canonical JSON and derived bindings. Preserve executable logic and runtime object lifecycles in code. Reconcile all obsolete data sources and add an explicit migration inventory.

Affected boundary: src/ and relevant deterministic source audits. One numbered spec and its implementation belong to one open review PR. No PR merge, release tag, package publication or Amarelo code change is authorized in this delivery. The five requested items are SPEC-016 through SPEC-020; dependencies are recorded in PR descriptions.

## Requirements

Preserve the native component, strict public types, SSR-safe imports, explicit user activation and consumer-owned credentials. Existing defaults should remain compatible unless this contract explicitly adds behavior. Runtime configuration is public; callbacks, tokens and secrets are supplied by the consuming application and never stored in the JSON file.

Use local to-spec, implement, web-components and voice-engineering procedures where applicable. The owner's five-item instruction authorizes spec creation and implementation without another approval round. The earlier delivery-first instruction remains in force: focused integration compilation is allowed, while broad tests/evals/CI waiting and live provider calls remain deferred. Do not claim unexecuted acceptance as passing.

## Observable contract and failure behavior

Existing component, animation and talk consumers keep their exported bindings
and default values while reading the same immutable configuration. The token
matcher compiles the canonical regular-expression source and flags; mutable
registries, controllers and browser instances retain their runtime lifecycles.
The package ships no default conversation copy and remains silent without
consumer activation.

The deterministic source audit is the primary acceptance seam for this
migration: a production uppercase initializer containing independent authored
data fails with its source path and line. Existing compatibility `.data.ts`
modules also reject new lowercase configuration initializers. Typed validation
and special-value conversion remain owned by SPEC-019; invalid canonical input
must fail at that pure boundary before browser effects.

## Acceptance criteria

- [x] Every production uppercase declaration holding authored serializable configuration is derived from orbz.config.json or explicitly identified as a runtime mechanism.
- [x] Existing .data.ts modules no longer contain independently maintained configuration literals.
- [x] Adapters, animation, element contracts and talk text use the canonical values consistently.
- [x] A durable inventory explains retained runtime registries/types/computed values and a deterministic check detects reintroduced configuration sources.

## Evidence

Implementation evidence is source inspection, not an executed behavioral gate:

- `src/element/element.data.ts`, `src/services/animation.service.ts`,
  `src/talk/talk.data.ts` and `src/talk/resolve-talk-text.compute.ts` now use
  canonical bindings; the authored empty talk array and token-pattern literal
  were removed.
- SPEC-017 supplies the JSON/core/motion compatibility bindings. SPEC-018's
  adapters read canonical Web Speech, OpenAI speech and realtime defaults;
  SPEC-019 supplies typed validation and immutable transformation.
- `.audits/configuration.inventory.md` maps every original uppercase source and
  the lowercase talk defaults to canonical fields. It explicitly retains the
  constructor WeakMap, compiled matcher, type contracts and runtime algorithms.
- `.audits/configuration.audit.sh` rejects independent initializers and checks
  the migration bindings. `.audits/architecture.audit.sh` now checks the
  canonical configuration and `.audits/readme.md` documents the new guard.
- A separate read-only source inventory found no omitted uppercase authored
  configuration. No tests, audits, evaluations or provider calls were executed
  for this slice under the owner's delivery-first instruction. Focused
  integration compilation passed across SPEC-017 through SPEC-020 on 2026-09-05:
  `tsc --noEmit -p tsconfig.json`, the main `tsdown` package/declaration build,
  and `tsdown --config tsdown.standalone.config.ts`. Browser/provider behavior,
  execution of the delivered audits and the full `orb check` gate remain pending
  evidence.

## Related records

- ADRs: .agents/adrs/0013-canonical-json-configuration.adr.md
- Rules: 001 package contract, 002 source organization, 003 code style, 005 voice and speech, 007 harness, 008 CLI and 009 Git/SemVer as applicable.
- Skills: `.agents/skills/to-spec/SKILL.md`, `.agents/skills/implement/SKILL.md`, `.agents/skills/web-components/SKILL.md`, `.agents/skills/voice-engineering/SKILL.md`.

## Compatibility and risks

Keep legacy public entry points and existing adapter contracts operational. JSON values are developer-authored build inputs, not arbitrary executable runtime code. Any prospective 1.0 release remains human-reviewed; these PRs do not publish a new package version.
