# ADR-0015: Keep provider credentials behind application authorization

- Status: Accepted
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective

## Context

The owner requires a dedicated decision preventing secret-bearing component
configuration. ADR-0014 already separates public voice selection from application
authorization. An undeclared JavaScript field could nevertheless be retained by
the realtimeSession setter and direct Realtime adapter. This ADR tightens that
boundary and clarifies what a JavaScript element reference can protect.

## Decision

1. Permanent OpenAI/provider API keys belong only to the application backend's
   secret storage/runtime. Do not send them to the browser, including in private
   fields, closures, element properties, attributes, cookies, JSON or bundles.
2. `voiceModel` and `orbz.config.json` contain public provider/model/voice settings.
   No `apiKey`, `secret`, `token`, authorization header or credential-value option
   is introduced on the element. Existing `credentials` values are the Fetch
   policy (`omit`, `same-origin`, `include`), never a credential itself.
3. `realtimeSession` is an application endpoint description or callback returning
   an SDP answer. Endpoint descriptions are validated, copied and frozen at both
   component and direct-adapter entry points. Reject undeclared fields, accessors
   and invalid option types with fixed errors before retaining any configuration.
4. The browser calls the application's authorized endpoint; that backend uses the
   provider key to establish the session. Audio then flows directly between browser
   and provider over WebRTC. No provider token is needed by Orbz in this flow.
5. Applications own user-session authentication, authorization, model/budget
   enforcement, origin/CSRF controls and backend call cleanup. A server-issued
   Secure, HttpOnly application-session cookie is an available approach: the
   browser sends it automatically according to fetch policy, without Orbz reading
   its value. The cookie represents the application session, not the provider key.
6. Application callbacks/fetch overrides may implement their own authorization
   flow. Any browser-scoped application token remains the consumer's responsibility
   and outside Orbz's configuration contract. Do not put bearer tokens in endpoint
   URLs. Custom engine internals and closures are not inspected by the package.

`const orb = document.querySelector('orb-z')` references the same element; it does
not create a separate protected controller. JavaScript properties do not become
HTML attributes unless code reflects them. Neither a reference variable, private
field, closed shadow root nor runtime memory protects a permanent key delivered
to the browser. Preventing arbitrary application scripts from setting their own
expando properties is outside this library's scope.

## Consequences

The documented consumer API remains small and compatible. No credential handoff
property or wrapper instance is needed. Unknown session fields that were previously
retained now fail. Invalid assignment is checked before stopping the current run.
Consumer endpoints must handle session authorization; Orbz cannot secure an
application backend or a compromised page through object validation.

## Evidence

- SPEC-021: shared session normalization in the native setter and Realtime adapter.
- Existing strict JSON validation and voiceModel allowlisting remain in place.
- README demonstrates cookie-compatible setup with public values only.
- Source inspection and compilation are recorded in SPEC-021. Runtime negative
  cases and live provider acceptance remain deferred under the owner instruction.

## Related records

- SPEC: 021; 018.
- Rules: 001, 003, 005.
- Supersedes: no transport decision; refines ADR-0014's credential boundary.
