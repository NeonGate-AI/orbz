# SPEC-022: Align the README with configuration and voice ownership

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

SPEC-018 and SPEC-021 documented the new voice API and credential boundary, but
there is no dedicated README alignment contract. The README and catalog still
assume an open-review-only workflow, while the owner now authorizes validation,
conflict repair and merging eligible PRs into staging. Consumers also need a
clear distinction between source implementation, npm availability, public voice
selection and application-owned authorization.

## Scope

Update the root README and specification catalog against the existing source,
ADR-0013, ADR-0014 and ADR-0015. Preserve product introduction, installation,
CLI, accessibility, contribution and license sections. Introduce no runtime API,
backend, dependency, version bump, tag or npm publication. This specification
documents the existing decisions; it does not replace their ADRs.

## Requirements

- The README MUST identify configuration and voice additions as implemented in
  source but unpublished, and distinguish package installation from fork rebuilds.
- The README MUST distinguish provider, model and voice, output-only speech from
  live conversation, and property assignment from explicit activation.
- Examples MUST use public settings and an application endpoint or SDP authorizer.
  Permanent provider keys MUST stay on the backend. JavaScript references, HTML
  properties and runtime memory MUST NOT be presented as credential vaults.
- The configuration explanation MUST name the canonical JSON, immutable derived
  values, rebuild requirement and consumer ownership of runtime authorization.
- Existing transcript/accessibility requirements and browser-only activation MUST
  remain explicit; documentation MUST NOT claim provider or browser verification
  from source inspection alone.
- The catalog MUST record current owner authorization for validation and eligible
  staging merges, preserve historical evidence and identify dependency order.
  A validation blocked for roughly ten minutes may be parked while another
  eligible PR proceeds. Authorization MUST NOT be described as a completed merge
  or as approval to publish a package.

## Acceptance criteria

- [x] README accurately distinguishes source availability from npm publication.
- [x] Voice selection, activation, model/voice distinction and secret ownership match types/source.
- [x] Configuration, SSR, accessibility and local architecture links remain coherent.
- [x] Catalog contains SPEC-022 and the current conditional staging authorization.
- [x] Changed documentation has local-link and whitespace evidence; release checks are recorded separately.

## Evidence

Primary seam: source-backed documentation review against
`src/talk/voice-model.types.ts`, `src/talk/normalize-realtime-session.compute.ts`,
`src/services/voice-model.service.ts`, `src/talk/openai-realtime.adapter.ts`,
`src/orbz.config.json` and the public exports. Negative review checks cover secret
fields in examples, markup serialization claims, implicit microphone activation
and premature release/merge claims.

Source review completed on 2026-09-05 against the files above. All 14 relative
Markdown link targets in the changed documents exist. `git diff --check` passed.
The README preserves all existing section headings, identifies source-only
availability and documents accessible external controls. No secrets appear in
configuration examples; the existing endpoint/SDP and credential explanations
remain consistent with ADR-0015.
No implementation-mirroring tests are needed for this documentation-only change.
Integration validation on 2026-09-05: `npm pack --dry-run` passed, including the
full `orb check` prepack gate: lint, source/test type checks, 42 tests, both builds,
version checks and all audits. GitHub checks are required before the staging merge.
Live provider/browser acceptance is not implied by these deterministic gates.

## Related records

- ADRs: 0013, 0014, 0015.
- SPECs: 016 through 021.
- Rules: 001, 004, 005, 007, 009, 011, 012.
- Skills: `.agents/skills/to-spec/SKILL.md`, `.agents/skills/documentation-and-adrs/SKILL.md`.

## Compatibility and risks

Documentation-only; no runtime, import, event or type-contract changes. SSR-safe
imports, visible transcripts, consumer language ownership and explicit voice
activation remain intact. Staging integration and a future npm release remain
separate operations; package version stays unchanged in this specification.
