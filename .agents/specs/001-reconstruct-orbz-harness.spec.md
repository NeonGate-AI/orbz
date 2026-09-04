# SPEC-001: Reconstruct the Orbz engineering harness

- Status: Implemented
- Created: 2026-08-21
- Updated: 2026-08-21
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

The imported harness described unrelated application-domain concerns, so agents
could not reliably infer Orbz boundaries or evidence requirements.

## Scope

Replace `.agents/` with Orbz context, ADRs, rules, specs, prompts, and skills.
Normalize executable checks under `.audits/`. Add navigation readmes to every
harness directory.

## Requirements

The harness must be repository-specific, cross-linked, date its retrospective
records, and remain outside the published package.

## Acceptance criteria

- [x] Every `.agents/` and `.audits/` directory has `readme.md`.
- [x] Context covers product, architecture, voice/localization, testing, and release.
- [x] Retrospective ADRs and SPECs use 2026-08-21.
- [x] Unrelated imported contracts are removed.
- [x] A harness audit verifies structure and terminology.

## Evidence

- `.agents/`
- `.audits/harness.audit.sh`
- `package.json#files`

## Related records

- ADR-0005
- Rules 001 and 007
