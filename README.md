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

`className` is intentionally excluded from the typed React API. Configure the
visual through presets and the documented color properties, and use an outer
element for page layout. Native HTML still supports `class` on every custom
element, but a host class cannot style Orbz's closed shadow tree.

## Speech is opt-in

Connecting `<orb-z>` never starts speech. An implementation must explicitly
provide a voice engine and call `startTalking()`:

```ts
import {
  type OrbzElement,
  WebSpeechAdapter
} from '@neongate-ai/orbz'
import '@neongate-ai/orbz/browser'

const orb = document.querySelector<OrbzElement>('orb-z')

if (orb) {
  orb.voiceEngine = new WebSpeechAdapter({ language: 'pt-BR' })
  await orb.startTalking()
}
```

Assigning a voice engine alone remains silent. Call `stopTalking()` to stop the
active flow and clear `voiceEngine` to remove the configured provider.
