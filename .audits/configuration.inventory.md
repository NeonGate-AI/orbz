# Canonical configuration migration inventory

- Updated: 2026-09-05
- Scope: production TypeScript under `src/`; SPEC-017, SPEC-019 and SPEC-020
- Canonical authored data: `src/orbz.config.json`
- Runtime binding: `orbzConfiguration` from `@core/config.data`

The initial inventory covered every production uppercase `const`, `let`, and
`var` declaration. The table includes the lowercase empty talk defaults so the
legacy data modules retain no second source of configuration. Test fixtures,
engineering configuration, CSS rules and compile-time declarations are outside
the runtime data migration.

## Migrated sources

JSON paths below are relative to the canonical document. Existing exported
names remain compatibility bindings; private adapter constants were removed
and their consumers read the corresponding canonical section.

| Original module | Original binding | Canonical path or derivation |
| --- | --- | --- |
| `core/config.data.ts` | `ORBZ_STATES` | `component.states` |
| `core/config.data.ts` | `ORBZ_REDUCED_MOTION_MODES` | `component.reducedMotionModes` |
| `core/config.data.ts` | `ORBZ_PRESET_NAMES` | `appearance.presetNames` |
| `core/config.data.ts` | `ORBZ_PRESETS` | `appearance.presets` |
| `core/config.data.ts` | `DEFAULT_ORBZ_PRESET` | `appearance.defaultPreset` |
| `core/config.data.ts` | `DEFAULT_ORBZ_COLORS` | Preset lookup using the two canonical bindings above; already derived before migration |
| `core/config.data.ts` | `DEFAULT_ORBZ_SIZE` | `component.defaultSize` |
| `core/config.data.ts` | `DEFAULT_ORBZ_SPEED` | `component.defaultSpeed` |
| `core/config.data.ts` | `DEFAULT_ORBZ_STATE` | `component.defaultState` |
| `core/config.data.ts` | `DEFAULT_ORBZ_REDUCED_MOTION` | `component.defaultReducedMotion` |
| `core/config.data.ts` | `ORBZ_COLOR_ATTRIBUTES` | `appearance.colorAttributes` |
| `core/config.data.ts` | `ORBZ_COLOR_KEYS` | `appearance.colorKeys` |
| `core/config.data.ts` | `config` | Frozen compatibility view composed only of the canonical bindings above |
| `core/motion/motion.data.ts` | `ORBZ_APPEARANCE_BY_STATE` | `appearance.byState` |
| `core/motion/motion.data.ts` | `ORBZ_MOTION_BY_STATE` | `motion.full`, combined with `appearance.byState` by the transformer |
| `core/motion/motion.data.ts` | `REDUCED_ORBZ_MOTION_BY_STATE` | `motion.reduced`, combined with `appearance.byState` by the transformer |
| `element/element.data.ts` | `ORBZ_TAG_NAME` | `component.tagName` |
| `element/element.data.ts` | `ORBZ_OBSERVED_ATTRIBUTES` | `component.observedAttributes` plus the values of `appearance.colorAttributes`, derived once |
| `services/animation.service.ts` | `ANIMATED_STYLE_PROPERTIES` | `motion.animatedStyleProperties` |
| `services/animation.service.ts` | `EASINGS` | `motion.easings` |
| `talk/talk.data.ts` | `DEFAULT_SPEECH_LANGUAGE` | `speech.webSpeech.language` |
| `talk/talk.data.ts` | `talk` | `speech.talk`, an empty record |
| `talk/talk.data.ts` | `emptyTalkFlow`, `DEFAULT_TALK_FLOW` | `speech.defaultTalkFlow`, an empty array; the intermediate authored array was removed |
| `talk/resolve-talk-text.compute.ts` | `TALK_TOKEN_PATTERN` | `speech.tokenPattern.source` and `.flags`; the compiled runtime matcher is named `talkTokenPattern` |
| `talk/web-speech.adapter.ts` | `DEFAULT_PREFERRED_VOICES` | `speech.webSpeech.preferredVoices` |
| `talk/web-speech.adapter.ts` | `DEFAULT_VOICE_LOAD_TIMEOUT` | `speech.webSpeech.voiceLoadTimeoutMs` |
| `talk/web-speech.adapter.ts` | `SPEECH_START_TIMEOUT` | `speech.webSpeech.speechStartTimeoutMs` |
| `talk/openai-speech.adapter.ts` | `DEFAULT_INSTRUCTIONS` | `speech.openaiSpeech.instructions` |
| `talk/openai-speech.adapter.ts` | `DEFAULT_MODEL` | `speech.openaiSpeech.model` |
| `talk/openai-speech.adapter.ts` | `DEFAULT_RESPONSE_FORMAT` | `speech.openaiSpeech.responseFormat` |
| `talk/openai-speech.adapter.ts` | `DEFAULT_VOICE` | `speech.openaiSpeech.voice` |

New voice configuration follows the same boundary: model selection and its
silent default use `speech.models` and `speech.defaultVoiceModel`; Web Speech
pitch/rate/volume use `speech.webSpeech`; OpenAI fetch credentials policy,
legacy voice fallback and request timeout use `speech.openaiSpeech`. Realtime
model, voice, fetch credentials policy, session timeout, data-channel label and
message/transcript bounds use `realtime` and `realtime.openai`.
`ORBZ_VOICE_DEFAULTS` is a frozen view of these existing canonical sections,
with no additional authored defaults.

The retained `.data.ts` compatibility modules are `core/config.data.ts`,
`core/motion/motion.data.ts`, `element/element.data.ts` and `talk/talk.data.ts`.
`core/configuration.data.ts` owns the bundled JSON import and one initialization
through the pure transformer. It is an initialization boundary, not another
authored data source.

## Retained code and exemptions

| Location or construct | Why it remains executable code |
| --- | --- |
| `ELEMENT_CONSTRUCTORS` in `factories/element-class.factory.ts` | A `WeakMap<object, OrbzElementConstructor>` stores lazy constructors per DOM realm. It cannot be serialized, frozen as configuration, or shared as JSON data. This is the sole retained uppercase runtime registry exemption. |
| `talkTokenPattern` in `talk/resolve-talk-text.compute.ts` | A `RegExp` compiles validated JSON source/flags. Its execution state belongs to the matcher; the regular-expression literal has been removed. |
| Configuration transformation and deep freezing | Key/type/range checks, path diagnostics, cloning, combining appearance with motion, adding color attributes, and turning the symbolic `infinite` repeat into `Number.POSITIVE_INFINITY` are algorithms. The input remains serializable. |
| `config` and `ORBZ_VOICE_DEFAULTS` views | These combine existing immutable bindings without new literal values. Their wrappers preserve the public compatibility surface. |
| Type unions, tuple types, interfaces and DOM/API identifiers | These define compile-time contracts and executable protocol grammar. State/preset/color types remain narrow even though JSON imports widen strings by default. |
| `anglePropertyRegistration`, CSS property registration and WAAPI serialization | The capability cache and browser registration have runtime lifecycles. Units, seconds-to-milliseconds conversion, keyframe interpolation and repeat-count arithmetic implement the browser API. |
| Voice scoring, locale comparison, validation bounds and protocol dispatch | Ranking, normalization, API limits, event names, response parsing and safe diagnostics implement algorithms/protocols. They are not independently authored uppercase configuration tables. |
| Arrays, maps, sets, counters, listeners, controllers, streams and peer/audio objects inside services/adapters | These hold per-instance or per-run mutable state and must be created and disposed at runtime. |
| Consumer endpoints, fetch callbacks, tokens, headers, speech and conversation context | Applications supply these values. JSON must never acquire consumer secrets, executable callbacks or product conversation copy. The JSON `credentials` field is only the public fetch credentials policy. |

## Deterministic guard

`configuration.audit.sh` uses POSIX shell, `find`, `awk` and `grep`; it requires
no network or source execution. It conservatively requires uppercase
production declarations to use canonical bindings, accepts only the exact
constructor-registry exemption, and restricts compatibility aggregates to
already derived values. It applies the same initializer rule to lowercase
declarations in compatibility `.data.ts` modules and verifies the empty talk
bindings and token matcher inputs. Unsupported declaration forms fail with a
source path and line so an intentional change requires an inventory/audit
update. This lexical guard does not replace the typed transformer or behavioral
tests.

The existing `orb audit` command discovers the new `*.audit.sh` automatically.
The architecture audit checks the canonical source exception and default
speech/empty-talk contracts against the JSON and derived modules.

## Delivery evidence

Source inventory and the changed bindings were inspected directly on
2026-09-05. An independent read-only inventory found no additional uppercase
authored configuration. The new audit is delivered but was not executed during
this delivery-first implementation. Behavioral suites, browser/provider calls
and the complete `orb check` gate remain deferred. Focused integration
compilation, when performed by the coordinating implementation, is recorded in
the SPEC evidence rather than inferred from this inventory.
