# Architecture context

## Entry points

- `@neongate-ai/orbz` is side-effect free and safe to import during SSR.
- `@neongate-ai/orbz/browser` registers `<orb-z>` in the active custom-element registry.
- `@neongate-ai/orbz/react-types` provides type-only JSX augmentation.
- `@neongate-ai/orbz/standalone` is the direct-browser bundle.
- `@neongate-ai/orbz/index.css` exposes package CSS when explicitly needed.

## Runtime layers

`core/` owns appearance and motion data plus pure normalization. `element/`
owns the public element contracts and styles. `factories/` creates the closed
shadow tree and the DOM-dependent class only when a DOM exists. `services/`
owns animation, registration, and talk execution. `ports/` defines consumer
integration seams. `talk/` owns adapters, speech data, and talk types.

The shadow tree is closed and visual-only. Tests and consumers must use public
properties, attributes, methods, and events rather than private descendants.

## Dependency direction

Pure data and types do not depend on DOM services. Services depend on ports,
not provider credentials. Browser registration is isolated from the main entry
point. No framework runtime is part of the package.
