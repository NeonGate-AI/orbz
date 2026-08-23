---
version: 3
name: Orbz Source Organization
description: Canonical organization and naming rules for the Orbz package source.
alwaysApply: true
priority: critical
---

# Orbz Source Organization

## Authority

This file is the source of truth for the package tree under `/src`.

## Required source-root folders

Keep these cross-cutting folders directly under `/src`:

```text
src/
├── factories/
├── ports/
└── services/
```

Concern folders such as `core/`, `element/`, and `talk/` may exist when they
contain at least two related source files.

## Suffix rules

- Keep `.port.ts` for ports.
- Keep `.adapter.ts` for adapters.
- Aggregate related type declarations into `.types.ts`; never use `.type.ts`.
- Keep `.service.ts`, `.factory.ts`, `.compute.ts`, `.guard.ts`, `.data.ts`, and
  `.client.ts` when they accurately describe the module.
- Public entry-point exceptions may use `index.ts` and `index.css`.

## Naming

No file or directory below `/src` may begin with `orbz` or `orbz-`. Public
TypeScript symbols may retain the `Orbz` prefix.

## Native element only

The package exposes one UI implementation: the native `<orb-z>` custom element.
Do not create React, Vue, Angular, Svelte, Next.js, or other framework wrappers.
A type-only React JSX augmentation entry is allowed when it only teaches TypeScript about the native `<orb-z>` element.

## Talk concern

Use `talk/` for speech, talk-flow data, voice adapters, and related types.
Never create a `voice/` source folder.

## Folder flattening

A source folder must contain at least two source files. If it contains only one,
move the file to the parent and remove the folder. Repeat until `/src` or a
multi-file concern is reached.
