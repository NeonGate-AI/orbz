# SPEC-021: Keep credentials outside the native component configuration

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

The owner clarified that neither component properties/attributes nor bundled
JSON may accept provider secrets. The existing voice API already uses public
model options and application-owned SDP authorization, but the realtimeSession
setter spreads undeclared JavaScript fields into an object exposed by its getter.
The direct Realtime adapter also retains a caller-owned endpoint object. Typed
interfaces alone do not protect these runtime entry points.

## Scope

Harden the existing session configuration boundary, record ADR-0015, and clarify
README, types and voice rules. Preserve the native component and direct WebRTC
transport; introduce no token property, controller wrapper, cookie reader,
backend, new provider flow, version bump or release. Stack one spec and its
implementation on SPEC-020 in an open PR; do not merge.

## Requirements

- Permanent provider keys MUST remain on the consuming application's server.
- Public JSON and element voice configuration MUST NOT define secret fields.
- Remove the unused `voice-model` observed attribute and its matching JSON
  validator entry; voice selection is a JavaScript property, not markup input.
- The session object MUST accept only endpoint, fetch credentials policy and an
  optional application fetch function. Unknown fields, accessor-backed options,
  invalid credentials policies and non-callable fetch overrides MUST fail with
  fixed errors that do not include supplied values.
- Both the native setter and direct adapter MUST use the same normalizer. Valid
  endpoint configuration MUST be copied and frozen, without retaining the input
  object or accepting later mutations. Failed assignment MUST preserve the prior
  configuration and active session.
- Application authorization callbacks remain opaque functions returning SDP;
  they do not return keys or session tokens to Orbz. Assignment remains inert.
- Document that a JavaScript reference/property does not automatically reflect
  into markup and is not a credential vault. Browser memory and a closed shadow
  root do not protect permanent provider keys from same-origin script compromise.

## Acceptance criteria

- [x] Source/types expose only public model configuration and session authorization.
- [x] Shared normalization rejects extra fields before retention at both entry points.
- [x] Valid endpoint/callback behavior remains compatible, immutable and SSR-safe.
- [x] Errors contain no supplied values; invalid setter input leaves the previous run intact.
- [x] ADR, README, voice context and catalogs explain backend keys and application authentication.

## Evidence

The checked criteria above record implementation/source-inspection evidence,
not executed behavioral tests. The shared normalizer copies only supported own
value properties and freezes the endpoint snapshot; unknown fields and accessors
fail with fixed errors. Both entry points delegate to it, and the setter validates
before stopping its existing run. The stale observed attribute was removed from
JSON and the matching validator. Existing strict voice/JSON option handling is
unchanged. Documentation and catalogs describe the credential boundary.

Source TypeScript compilation (`tsc --noEmit -p tsconfig.json`) and the main
package/declaration build (`tsdown`) passed on 2026-09-05. No provider calls,
credentials, behavioral tests, audits or full `orb check` were used.


Primary behavior seam: the pure session normalizer, with negative inputs for
extra secret-like fields, accessors, bad fetch policy and post-assignment mutation.
Secondary seam: native setter and direct adapter delegation. Use synthetic values
if behavioral tests are added later; never use a real credential as a fixture.

The owner authorized implementation and an open PR. The existing delivery-first
instruction defers tests, audits, CI waiting and live provider calls. Record source
inspection and focused compilation separately; do not claim pending behavioral
acceptance as executed.

## Related records

- ADR-0015; ADR-0014; SPEC-018 through SPEC-020.
- Rules 001, 002, 003, 005, 006, 007 and 009.
- Skills: `.agents/skills/to-spec/SKILL.md`, `.agents/skills/implement/SKILL.md`.

## Compatibility and risks

Documented endpoint and callback configurations remain supported. Previously
ignored or accidentally retained extra fields now throw. Application callbacks,
fetch overrides and custom voice engines are consumer-owned executable code;
Orbz cannot inspect closures, stop arbitrary expando properties or infer whether
a string contains a secret. Public URLs/options must not be used to smuggle tokens.
The boundary is API discipline and server ownership, not an XSS sandbox.

## Validation follow-up — 2026-09-05

The owner now authorizes behavioral validation and merging passing PRs into
staging. `npm pack --dry-run` passed with source/test types, lint, 42 tests, both
builds and all audits. Nine focused credential-boundary cases cover unknown and
hidden fields, accessors without invocation, immutable URL snapshots, inert
callbacks, fetch policy validation, direct-adapter enforcement, and native
property rejection that preserves existing configuration without stopping it.
Only synthetic strings were used; no provider credentials or live calls were
used. This supersedes the initial behavioral-validation deferral for these cases.
