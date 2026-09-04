# Rule 010: Colocated tests

- Effective: 2026-09-04
- Priority: High
- Applies: `src/**/*.test.ts`, `test/**`, Vitest, and test TypeScript configuration

1. Place each executable `*.test.ts` suite beside the source responsibility it verifies under `src/`.
2. Keep only shared setup, fixtures, and test utilities under root `test/`; do not place executable suites there.
3. A test file uses the source base name followed by `.test.ts` whenever one source module is its primary subject.
4. Top-level `describe` names use `<concern>/<responsibility>`.
5. Canonical concern prefixes are `core`, `element`, `factory`, `port`, `service`, and `talk`.
6. Do not create empty or artificial tests solely to exercise every prefix; test concrete runtime contracts.
7. Source builds exclude `*.test.ts`; the test TypeScript project includes both source and colocated suites.
8. Vitest discovers `src/**/*.test.ts` and excludes suites from coverage accounting.
9. SSR suites explicitly use the Node environment; DOM suites default to happy-dom.
