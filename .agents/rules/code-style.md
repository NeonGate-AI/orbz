---
version: 1
name: Orbz Code Style
description: Mandatory TypeScript conventions for the Orbz package.
alwaysApply: true
priority: high
---

# Orbz Code Style

- Use TypeScript in strict mode.
- Use single quotes in TypeScript and JavaScript.
- Prefer interfaces for object contracts.
- Use `./` imports only for sibling modules; use the configured aliases for
  non-sibling source imports.
- Keep imports grouped as third-party, absolute aliases, then relative.
- Keep public APIs explicit and typed; do not leak implementation-only types.
- Keep modules small and named by responsibility plus an approved suffix.
- Never add framework-specific runtime code to the package.
- Never embed API keys, provider secrets, or product-specific credentials.
