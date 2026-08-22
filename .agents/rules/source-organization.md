---
version: 2
name: Orbz Source Organization
description: Canonical organization and naming rules for the Orbz package source.
alwaysApply: true
priority: critical
tags:
  - architecture
  - source
  - organization
---

# Orbz Source Organization

## Authority

This file is the source of truth for package source organization. When another
rule, example, or existing implementation conflicts with this document, this
document wins and the conflicting instruction must be removed or corrected.

## Scope

These rules apply to the package source tree rooted at `/src`. Framework-owned
files outside `/src` may keep the filenames required by their frameworks.

## Required source-root folders

Keep these cross-cutting folders directly under `/src`:

```text
src/
├── factories/
├── ports/
└── services/
```

Concern-specific folders such as `core/`, `element/`, and `talk/` may also live
directly under `/src` when they contain multiple related files.

## Talk concern

Use `talk/` for speech, talk-flow data, voice adapters, and related types.
Never create or restore a `voice/` source folder.

## Suffix rules

- Keep `.port.ts` for architecture ports.
- Keep `.adapter.ts` for adapter implementations.
- Aggregate related types and interfaces into a concern-level `.types.ts` file.
- Never create singular `.type.ts` files.
- Keep established behavioral suffixes such as `.service.ts`, `.factory.ts`,
  `.compute.ts`, `.guard.ts`, `.data.ts`, and `.client.ts` when they accurately
  describe the module.
- Public entry-point exceptions may use `index.ts` and `index.css`.

Examples:

```text
ports/voice-engine.port.ts
services/talk-runner.service.ts
talk/web-speech.adapter.ts
talk/talk.types.ts
```

## Orbz naming

No file or directory below `/src` may begin with `orbz` or `orbz-`. Use only
the responsibility and suffix in source paths.

```text
Incorrect: src/element/orbz-element.data.ts
Correct:   src/element/element.data.ts

Incorrect: src/orbz-talk/
Correct:   src/talk/
```

Public TypeScript symbols may retain the `Orbz` prefix because they belong to
the published package API. This exception applies to symbols, not paths.

## Native element only

The package exposes one UI implementation: the native `<orb-z>` custom
element.

- Do not create or export a React component or React adapter.
- Do not create framework-specific Orbz components.
- React, Next.js, Vue, Svelte, Angular, and Vanilla examples must render the
  literal `<orb-z>` element.
- Framework applications register it through `@neongate-ai/orbz/browser` or
  call `defineOrbz()` explicitly.

## Folder flattening

A source folder must contain at least two source files. When a folder contains
only one source file, remove the folder and move that file to its parent.
Repeat this process until the file reaches `/src` or joins a folder containing
at least one other source file.

Do not create one-file organizational wrappers.
