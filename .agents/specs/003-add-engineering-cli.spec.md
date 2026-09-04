# SPEC-003: Add a small Orbz engineering CLI

- Status: Superseded by SPEC-008
- Created: 2026-08-21
- Updated: 2026-09-04
- Mode: Retrospective reconstruction
- Owner: Orbz maintainers

## Problem

Common repository checks lacked one discoverable entry point, while a large
application-style CLI would be inappropriate for a small library.

## Historical scope

The initial implementation added a zero-dependency Node/MJS CLI that delegated
package tasks. The need for a local CLI remains accepted; its implementation and
command surface are superseded by the POSIX shell Orb CLI in SPEC-008.

## Historical acceptance evidence

- The CLI was local and excluded from the runtime package.
- Help and basic package operations were discoverable.
- Repository checks were delegated instead of reimplemented.

## Related records

- ADR-0005 and ADR-0007
- SPEC-008
- Rule 008
