# Orbz

One voice component. Every framework.

`@neongate-ai/orbz` is the framework-agnostic Web Component package that gives
AI voice experiences motion, voice integration, and presence on the web.

- [Documentation](https://orbz.site)
- [npm](https://www.npmjs.com/package/@neongate-ai/orbz)
- [GitHub](https://github.com/NeonGate-AI/orbz)
- [Framework examples](https://github.com/NeonGate-AI/orbz-examples)

```bash
pnpm install
pnpm neon
pnpm check
```

MIT © NeonGate AI

## React and Next.js JSX types

React and Next.js applications can opt into JSX typing for the native custom
element without installing a wrapper component:

```ts
import '@neongate-ai/orbz/react-types'
import '@neongate-ai/orbz/browser'
```

`react-types` is type-only integration. The rendered UI remains the native
`<orb-z>` Web Component.
