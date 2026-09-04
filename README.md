# Orbz&nbsp;<img src="./assets/images/neongate-sphere.png" alt="" width="44" height="44" align="middle">

One native voice-presence component for every web stack.

`@neongate-ai/orbz` is a framework-agnostic, SSR-safe Web Component for giving
AI voice interfaces a visible state, motion system, configurable palette, and
provider-neutral speech boundary. The package renders the native `<orb-z>`
element; it does not ship a framework wrapper, application, persona, transcript,
or backend.

<p align="center">
  <img src="./assets/images/readme-banner.png" alt="Orbz voice presence component" width="100%">
</p>

- [Documentation](https://orbz.site)
- [npm package](https://www.npmjs.com/package/@neongate-ai/orbz)
- [Framework examples](https://github.com/NeonGate-AI/orbz-examples)
- [License](./LICENSE)

## Getting started

### One-command project setup

From an existing JavaScript project, run:

```bash
npx -y @neongate-ai/orbz@latest
```

The temporary `orb` executable detects the project package manager from
`package.json#packageManager` or its lockfile, adds the executing version of
`@neongate-ai/orbz` to `dependencies`, and prints the registration snippet. It
does not generate or overwrite application source files. Omit `-y` when you
want npm to confirm the temporary CLI download.

Orb is a POSIX shell CLI. Use it from Linux, macOS, WSL, or another environment
that provides `/bin/sh`.

Manual installation remains available:

```bash
pnpm add @neongate-ai/orbz
```

Register the element from browser-only code and render it in HTML:

```ts
import {
  type OrbzElement,
  WebSpeechAdapter
} from '@neongate-ai/orbz'
import '@neongate-ai/orbz/browser'

const orb = document.querySelector<OrbzElement>('orb-z')
const speakButton = document.querySelector<HTMLButtonElement>('#speak')

if (orb && speakButton) {
  orb.speech = 'Olá. Como posso ajudar?'
  orb.voiceEngine = new WebSpeechAdapter()

  speakButton.addEventListener('click', () => {
    void orb.startTalking()
  })
}
```

```html
<orb-z
  aria-label="Assistente de voz"
  role="img"
  preset="neongate"
  state="idle"
></orb-z>
<button id="speak" type="button">Ouvir mensagem</button>
```

Speech is deliberately explicit:

1. `<orb-z>` connects silently.
2. Assigning `speech` or `voiceEngine` does not start playback.
3. `startTalking()` speaks only consumer-supplied content.
4. Missing or blank `speech` is a no-op when no custom talk flow is configured.
5. `stopTalking()` cancels the active run.

This keeps initial rendering safe, avoids unexpected audio, and provides a clear
place to satisfy browser user-activation requirements.

## Speech and language

The `speech` property has no default text. `WebSpeechAdapter` uses Brazilian
Portuguese (`pt-BR`) as its default language:

```ts
orb.speech = 'Bem-vindo ao atendimento.'
orb.voiceEngine = new WebSpeechAdapter()
await orb.startTalking()
```

Change to English by configuring the adapter:

```ts
orb.speech = 'Welcome. How can I help?'
orb.voiceEngine = new WebSpeechAdapter({
  language: 'en-US',
  preferredVoices: ['Google US English']
})
await orb.startTalking()
```

Any valid BCP 47 language tag can be supplied through `language`. Language
selection controls voice matching and pronunciation; Orbz does not translate
`speech`. The consuming application owns localized strings, language switching,
visible transcripts, and captions.

A custom provider can implement `OrbzVoiceEnginePort`. The included
`OpenAISpeechAdapter` accepts a consumer-owned endpoint, headers, and delivery
instructions. Provider credentials must stay on the application or server side.

### Advanced talk flow

The default talk flow is empty and contains no greetings, mocked answers, or
persona. Applications that need a multi-step conversation can provide their own
`talkFlow`, `voiceEngine`, and optional `intelligence` implementation:

```ts
orb.talkFlow = [
  {
    id: 'welcome',
    kind: 'say',
    needsAuth: false,
    text: 'Olá. Diga seu nome para continuar.'
  },
  {
    id: 'name',
    kind: 'ask',
    needsAuth: false,
    capture: 'fullName',
    text: 'Estou ouvindo.'
  }
]

await orb.startTalking()
await orb.receive('Ana')
```

Every sentence in a custom flow is consumer-supplied. Orbz never invents missing
copy or silently translates it.

## States

Use the `state` attribute or property to select a visual motion profile.

| State | Intended visual signal |
| --- | --- |
| `idle` | Ambient default presence. |
| `listening` | More responsive pulse while input is being captured. |
| `thinking` | Denser, exploratory motion while work is in progress. |
| `speaking` | Faster vocal-style pulse; applied automatically during active speech. |
| `asleep` | Lower-saturation, subdued presence. |

```html
<orb-z state="thinking"></orb-z>
```

When Orbz starts speaking, it temporarily changes to `speaking` and restores the
prior state after completion or cancellation. State is a visual API, not an
accessible status announcement; applications should expose meaningful status in
visible text or an appropriate external live region.

## Presets

Set `preset` to use one of the built-in five-color palettes.

| Preset | Primary | Secondary | Accent | Highlight | Background |
| --- | --- | --- | --- | --- | --- |
| `neongate` | `#6C5CFF` | `#00E9FF` | `#FF4DDE` | `#FFB07A` | `#14142B` |
| `periwinkle` | `#6667AB` | `#8FB8FF` | `#E66FA9` | `#F3ECFF` | `#111226` |
| `magenta` | `#BB2649` | `#F06A82` | `#29B8A6` | `#FFDCE4` | `#250A12` |
| `peach` | `#FFBE98` | `#FF8F70` | `#D987A3` | `#FFF0E7` | `#2A1516` |
| `mocha` | `#A47864` | `#D3A17E` | `#7FA18F` | `#F2E2D7` | `#211613` |
| `ivory` | `#F0EEE9` | `#AFC7D3` | `#C8B3D4` | `#FFFFFF` | `#171A20` |

```html
<orb-z preset="peach" state="listening"></orb-z>
```

The default palette is `neongate`. Omitting `preset` also allows individual
color overrides to merge with that default palette.

## Custom palette

Provide all or part of a palette with color attributes:

```html
<orb-z
  color-primary="#4F46E5"
  color-secondary="#22D3EE"
  color-accent="#F472B6"
  color-highlight="#FEF3C7"
  color-background="#0F172A"
></orb-z>
```

The corresponding keys in the exported `OrbzOptions` type are `colorPrimary`,
`colorSecondary`, `colorAccent`, `colorHighlight`, and `colorBackground`. On the
native element, use the documented kebab-case attributes.

Do not combine an explicit `preset` with custom color attributes. The preset
wins, custom attributes are ignored, and Orbz reports the conflict through
`console.error` so configuration mistakes are visible.

## Size, motion, and presentation

```html
<orb-z
  size="18rem"
  speed="1.2"
  reduced-motion="system"
  elevated
></orb-z>
```

| API | Values | Default |
| --- | --- | --- |
| `size` | Positive number or CSS size string | `16rem` |
| `speed` | Positive number | `1` |
| `paused` | Boolean attribute | absent |
| `elevated` | Boolean attribute | absent |
| `reduced-motion` | `system`, `always`, `never` | `system` |

Use `play()`, `pause()`, and `restart()` for imperative animation control.
`system` follows `prefers-reduced-motion`; `always` removes continuous motion;
`never` explicitly uses the full profile.

## Events

Orbz dispatches native `CustomEvent` instances from the host element:

```ts
orb.addEventListener('orbz-speaking-change', (event) => {
  const { speaking } = (event as CustomEvent<{ speaking: boolean }>).detail
  console.log({ speaking })
})

orb.addEventListener('orbz-talk-error', (event) => {
  const { error } = (event as CustomEvent<{ error: unknown }>).detail
  console.error(error)
})
```

`orbz-speaking-change` reports meaningful speech transitions.
`orbz-talk-error` reports adapter, activation, intelligence, and configuration
errors without embedding provider credentials in the package.

## Accessibility

The closed shadow tree is visual and marked `aria-hidden`. Decide what the host
means in the surrounding application:

- For a meaningful visual identity, supply an appropriate role and accessible
  name, such as `role="img" aria-label="Assistente de voz"`.
- For a purely decorative orb, hide the host from assistive technology.
- Keep spoken text available as visible text, captions, or a transcript.
- Use external status text or live regions for listening, thinking, speaking,
  and error announcements.
- Retain `reduced-motion="system"` unless the user has made a more specific
  application-level choice.

Palette and motion must not be the only way the application communicates
meaning.

## Server rendering and frameworks

The main package entry is safe to import when `HTMLElement` and
`customElements` are unavailable. Import the browser entry only in client code:

```ts
import type { OrbzElement } from '@neongate-ai/orbz'

// Client boundary only:
await import('@neongate-ai/orbz/browser')
```

React and Next.js can opt into native JSX typing without a wrapper component:

```ts
import '@neongate-ai/orbz/react-types'
import '@neongate-ai/orbz/browser'
```

The rendered UI remains `<orb-z>`. `className` is intentionally excluded from
the typed API because a host class cannot style the closed shadow tree; use
presets and documented properties for appearance, and an outer element for page
layout.

## Package entry points

| Import | Purpose |
| --- | --- |
| `@neongate-ai/orbz` | Types, constants, factories, ports, adapters, and explicit registration API. |
| `@neongate-ai/orbz/browser` | Main API plus browser registration side effect. |
| `@neongate-ai/orbz/react-types` | Type-only React JSX augmentation. |
| `@neongate-ai/orbz/standalone` | Direct-browser/CDN bundle. |
| `@neongate-ai/orbz/index.css` | Explicit stylesheet export. |
| `orb` package binary | POSIX shell project installer used by `npx @neongate-ai/orbz`. |

## Contributing

The repository requires Node.js 24 and pnpm 10.32.1. Bootstrap a checkout with
the POSIX shell Orb CLI:

```bash
./cli/orb bootstrap
```

The equivalent manual flow is:

```bash
pnpm install --no-frozen-lockfile
pnpm run setup
./cli/orb git setup
./cli/orb doctor
```

Repository operations are owned by Orb rather than duplicated as package
scripts:

```bash
orb lint
orb typecheck
orb test
orb test --coverage
orb build
orb harness
orb audit
orb check
orb cleanup
```

Before the optional user-scoped launcher exists, use the repository entry point:

```bash
./cli/orb check
```

`package.json#scripts` intentionally keeps only the `setup` bridge and npm's
`prepack` lifecycle. `prepack` delegates to `./cli/orb check`, so `npm pack` and
`npm publish` still enforce the complete quality gate without reintroducing
public script aliases.

The same shell CLI is published as the `orb` package binary so that
`npx -y @neongate-ai/orbz@latest` can install Orbz into a consuming project.
Repository-only commands reject execution from the temporary npm package.

## Git quality gates and semantic versioning

Run the Git setup after installing dependencies:

```bash
./cli/orb git setup
./cli/orb git doctor
```

Husky wires two thin shell adapters:

- `pre-commit` runs `orb git version-check --staged`, then lint-staged. Staged
  TypeScript, JavaScript, JSON, and CSS receive Biome checks; shell files receive
  `/bin/sh -n` syntax validation.
- `commit-msg` runs Commitlint with `@commitlint/config-conventional`.

Commit headers follow Conventional Commits, for example:

```text
feat(talk): add streaming speech delivery
fix(element): preserve state after cancellation
docs(readme): document custom palettes
```

Use `!` or a `BREAKING CHANGE` footer for incompatible public changes. Release
planning follows semantic versioning: `fix` and `perf` normally imply a patch,
`feat` implies a minor, and a breaking change implies a major. Orb verifies that
`package.json#version` is canonical SemVer and rejects a staged version change
that does not move forward:

```bash
orb git version-check
orb git version-check --staged
```

`orb check` runs Biome, source and colocated-test type checks, Vitest, both
builds, the SemVer check, and all versioned audits. CI also validates commit
messages through Orb and inspects the npm payload with `npm pack --dry-run`.
Tests live next to the source they verify; shared test setup and fixtures remain
under `test/`. The intentional package payload is `dist/`, the POSIX shell
`cli/`, and npm's standard root metadata.

MIT © NeonGate AI
