---
version: 1
name: Orbz Package Contract
description: Publishing and public API constraints for @neongate-ai/orbz.
alwaysApply: true
priority: critical
---

# Orbz Package Contract

- `@neongate-ai/orbz` is a library, not an application and not a monorepo.
- Keep the package framework-agnostic and SSR-safe.
- The package may expose provider adapters through ports, but provider secrets
  must remain owned by the consuming application.
- Only files in `dist/` are intentional package payload, plus npm's automatic
  root metadata files (`package.json`, `README.md`, and `LICENSE`).
- Do not publish source maps.
- Any new public export is a compatibility commitment and must be intentional.
- `@neongate-ai/orbz/browser` owns browser registration side effects.
- `@neongate-ai/orbz/react-types` may provide type-only JSX augmentation; it must never introduce a React component or runtime React dependency.
- `@neongate-ai/orbz/standalone` is the direct-browser/CDN entry.
- Documentation and framework examples live in separate repositories.
