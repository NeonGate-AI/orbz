# Architecture decision records

ADRs preserve durable Orbz decisions. Records `0001` through `0006` were
reconstructed retrospectively on **2026-08-21** from the package's intended
contracts. Records `0007` onward document current decisions from their stated
creation date. ADR-0010 establishes Orb as the single repository command
surface; ADR-0011 adds the explicit public npx installer exception; ADR-0012 adds agent-native workflows, runtime guardrails, and harness maturity enforcement.

Use [`template.md`](./template.md) for new decisions. Never rewrite an accepted
ADR to hide a changed decision; record the update and supersede it explicitly.

[ADR-0013](0013-canonical-json-configuration.adr.md) establishes the single JSON source and derived typed configuration.
