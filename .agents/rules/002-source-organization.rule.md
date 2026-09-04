# Rule 002: Source organization

- Effective: 2026-08-21
- Updated: 2026-09-04
- Priority: Critical
- Applies: `src/**`

1. Keep `factories/`, `ports/`, and `services/` directly under `src/`.
2. Use `core/appearance/`, `core/motion/`, and `core/lib/` for their named concerns.
3. Use `talk/` for speech, adapters, flow data, and talk types; never create `voice/`.
4. A source folder must contain at least two related source files or be flattened.
5. No file or directory below `src/` may begin with `orbz` or `orbz-`.
6. Production modules use `.port.ts`, `.adapter.ts`, `.types.ts`, `.service.ts`, `.factory.ts`, `.compute.ts`, `.guard.ts`, `.data.ts`, and `.client.ts` according to responsibility.
7. Colocated tests append `.test.ts` to the tested source base name under Rule 010.
8. Public entry points may use `index.ts` and `index.css`.
9. The shared configuration module is `src/core/config.data.ts`.
10. Never add framework-specific runtime components.
