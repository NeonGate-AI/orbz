# Specifications

SPECs describe bounded changes and their acceptance evidence. Records `001`
through `007` are retrospective reconstructions dated **2026-08-21** because the
package intent predated the recovered harness. Records `008` onward describe
current work and use their actual creation date. SPEC-012 consolidates repository
commands in Orb, SPEC-013 isolates WAAPI from Happy DOM tests, and SPEC-014 adds
the explicit npx project-setup flow. SPEC-015 strengthens skill/rule discoverability, workflows, runtime guardrails, and harness-score CI enforcement.

Statuses are `Proposed`, `In progress`, `Implemented`, `Superseded`, and
`Rejected`. Use [`template.md`](./template.md), follow
[`workflow.md`](./workflow.md), and link applicable ADRs and rules.

## Configuration and voice delivery

| Spec | Status | Scope |
| --- | --- | --- |
| [SPEC-016](016-orb-cli-parity.spec.md) | Implemented; behavioral validation deferred | Engineering CLI ergonomics |
| [SPEC-017](017-canonical-json-configuration.spec.md) | Implemented; live validation deferred | Canonical JSON configuration |
| [SPEC-018](018-voice-model-property.spec.md) | Implemented; browser/provider validation deferred | Native voice model selection and direct Realtime audio |
| [SPEC-019](019-typed-configuration-transformer.spec.md) | Implemented; behavioral validation deferred | Pure validated configuration transformer |

The owner requested one specification and implementation per open PR. These review branches are not releases and must not be merged automatically. Compilation/syntax evidence is separate from deferred behavioral and live-provider acceptance.
