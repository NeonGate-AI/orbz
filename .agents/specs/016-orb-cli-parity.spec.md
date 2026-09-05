# SPEC-016: Align Orb engineering command ergonomics

- Status: Implemented; behavioral validation deferred
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Jonatas Sales

## Problem

Owner request item 1 asks Orb to follow the engineering CLI conventions used by
the Amarelo repository. Source comparison confirms the shared shell entry point,
managed launcher, contextual help, diagnostic output and usage-error status are
the relevant conventions. The application and infrastructure commands in that
repository do not belong to the Orbz package.

Orb already shares much of that structure, but lacks discoverable scoped help,
cannot accept diagnostic flags around nested Git commands, advertises a Git
setup option it does not implement, and accepts conflicting Git lint modes in
one argument order. Launcher temporary-file cleanup also needs to terminate on
signals and tolerate a stale temporary directory.

## Scope

Change only the existing POSIX shell CLI, its guide and this specification.
One numbered specification and its implementation belong to one open review PR.
No PR merge, release tag, package publication or Amarelo code change is included.

## Requirements

1. Preserve no-argument help in the source checkout and no-argument project
   setup in the published package.
2. Support `orb help <command>`, `orb help git <subcommand>`, `orb git help`,
   and the existing command-level `--help`/`-h` forms without running command
   operations. Advertise every supported command and alias accurately.
3. Accept repeatable `--logs` before and immediately after a command or nested
   Git command. Diagnostics go to stderr and contain command names rather than
   arguments or credentials. Forward delegated utility arguments unchanged.
4. Provide `install` as a repository-only alias for `bootstrap`, matching the
   reference command convention. Preserve existing Orb aliases and Git gates.
5. Return status 2 for unknown commands, invalid command options, missing
   required arguments and conflicting Git lint modes before command execution.
   Report the relevant command help entry when practical. Preserve child tool
   exit statuses and status 127 for missing required executables.
6. Keep the optional launcher bound to its configured checkout, usable from
   arbitrary working directories and safe for paths containing spaces. Preserve
   unmanaged files, symlinks, nonregular paths and shell profiles. Reserve an
   exclusive temporary directory and remove only that directory on exit/signals.
7. Keep published-package repository guards, explicit consumer installation,
   local dependency version selection and the ban on generated application
   source. Do not add application commands, lifecycle installation, a second
   command runner or new dependencies.

## Acceptance criteria

- [ ] Scoped and global help cover all command routes and aliases.
- [ ] Nested diagnostic flags are consumed by Orb; delegated arguments remain
  unchanged and diagnostics stay on stderr.
- [ ] Invalid Git lint mode combinations and missing option values return 2
  before delegation, independent of argument order.
- [ ] The direct launcher remains managed, idempotent and signal-safe.
- [ ] Consumer npx setup remains separate from repository operations.
- [x] Every changed CLI implementation file passes `/bin/sh -n`.

## Validation and delivery

The owner's five-item instruction authorizes specification and implementation
without another approval round. The earlier delivery-first instruction remains
in force: syntax/compilation checks are allowed; behavior tests, audits, broad
checks, CI waiting and live provider calls are deferred. Do not mark unexecuted
acceptance checks as passing. Focused verification is `/bin/sh -n` on each
changed CLI implementation file.

## Evidence

- `cli/src/orb.sh`: scoped Git help, version help, repeatable diagnostic flags
  around command paths, the repository-only `install` alias and contextual
  usage guidance.
- `cli/src/commands/help.sh` and `cli/readme.md`: local command help, accurate
  aliases, setup modes and direct-launcher invocation guidance.
- `cli/src/core/common.sh`, Git lint commands and setup commands: required
  option values and usage-error guidance. No-argument commands reject empty
  arguments; help handlers reject trailing arguments instead of ignoring them.
- `cli/src/commands/setup-launcher.sh`: exclusive temporary-directory retries
  and cleanup that terminates on signals while retaining unmanaged-path guards.
- On 2026-09-05, `/bin/sh -n` passed for all 23 changed shell scripts.
  Behavioral acceptance, audits and the full `orb check` gate were not run
  under the owner's delivery-first instruction and remain pending evidence.

## Related records

- ADR-0007: POSIX shell CLI.
- ADR-0010: single engineering command surface.
- ADR-0011: explicit published project installer.
- Rules 003, 007, 008, 009 and 011.
- Skills: `.agents/skills/implement/SKILL.md` and
  `.agents/skills/harness-maintenance/SKILL.md` (validation steps deferred by
  the owner's delivery-first instruction).

## Compatibility and risks

The runtime package API is unchanged. The additive `install` alias is guarded
as repository-only and never changes the published installer's default mode.
Command help remains local and free of tool installation or runtime work.
