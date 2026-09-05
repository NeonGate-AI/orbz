# ADR-0013: Author public defaults in canonical JSON

- Status: Accepted
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective

## Context

The owner requested one discoverable `src/orbz.config.json` file for package
configuration. Existing palette, motion, component and speech defaults were
distributed among TypeScript data modules and adapter implementations. The
owner-selected filename requires a narrow exception to the earlier naming rule.

## Decision

Author serializable defaults in `src/orbz.config.json`, organized into
`component`, `appearance`, `motion`, `speech` and `realtime`. Keep public
compatibility bindings in their existing modules, derived from bundled JSON.
Existing presets, states, colors and full/reduced motion values remain stable.

Represent endless animation repeat as `"infinite"` exclusively in motion
transition `repeat` fields. Decode it to positive Infinity at the typed data
boundary. Freeze nested runtime configuration through one shared operation;
consumers cannot mutate shared defaults. Array order that defines public tuples
is part of the configuration contract.

Bundle JSON through the normal source build. No import needs filesystem access,
fetch, DOM globals or provider initialization. Store only public configuration:
request credentials policy is serializable, whereas credentials themselves,
headers, endpoint callbacks and runtime media objects are supplied by consumers.
The default voice selection remains null and the default talk flow remains empty.

SPEC-017 establishes bundled data and compatible bindings. SPEC-019 adds a pure
typed transformer with strict path-oriented validation, input isolation and
derived runtime values. SPEC-020 migrates the remaining data consumers. Type
definitions, validation grammar, runtime state and executable behavior are not
configuration and remain in TypeScript.

## Consequences

New configurable package defaults belong in the JSON surface. Data facades may
derive aliases and compatibility objects without authoring independent defaults.
The source-name exception applies only to this exact JSON path. Changing its
schema or published typed bindings is a compatibility decision. JSON tooling
cannot express Infinity or executable values and must use the documented grammar.

## Evidence

- `src/orbz.config.json`
- `src/core/configuration.data.ts`
- `src/core/config.types.ts`
- `src/core/config.data.ts`
- `src/core/motion/motion.data.ts`
- `src/core/lib/deep-freeze.compute.ts`
- `tsconfig.json`

Focused integration compilation is recorded in the specifications. Broad tests,
provider calls and release validation remain deferred by the owner instruction.

## Related records

- SPEC-017, SPEC-019, SPEC-020
- Rules 001, 002, 003, 005 and 007
- Supersedes ADR-0006 only for the exact canonical JSON filename exception.
