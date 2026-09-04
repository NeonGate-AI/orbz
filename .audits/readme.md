# Orbz audits

These executable checks protect repository invariants broader than one unit
test. They are deterministic, network-free POSIX shell scripts.

Run all audits with:

```bash
./cli/orb audit
# or
pnpm audit
```

The complete quality gate also runs them through `./cli/orb check`.

- `architecture.audit.sh`: source boundaries, concern folders, and speech defaults.
- `cli.audit.sh`: shell-only Orb command surface and removal of imported application assumptions.
- `documentation.audit.sh`: title assets, banner position, package usage, and Git guidance.
- `harness.audit.sh`: record structure, dates, navigation, and terminology.
- `package.audit.sh`: payload, scripts, dependencies, hooks, Commitlint, and SemVer policy.
- `tests.audit.sh`: colocated suite layout, naming, Vitest configuration, and CI integration.

When an invariant changes intentionally, update its SPEC, linked ADR/rule,
implementation, documentation, and audit in the same change.
