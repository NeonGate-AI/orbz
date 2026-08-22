---
version: 1
extends: code-style.md
name: React Code Style
description: React component conventions, hooks, state management, and JSX organization.
priority: high
alwaysApply: false
appliesTo:
  - react
tags:
  - react
  - ui
  - frontend
---

# React Code Style

## Purpose

This document extends the rules defined in [`code-style.md`](./code-style.md).

It defines the mandatory coding standards for React source code.

## Scope

Apply these rules only to React source code.

Every rule defined in `code-style.md` also applies.

## Component Creation

### 1. Props Interface

#### Description

Declare the component props interface immediately after the import block.

Name the interface using the component name followed by the `Props` suffix.

Use an interface for component props.

Do not use a type alias.

An exported type alias is allowed when the public props contract must preserve
a mutually exclusive union that an interface cannot represent. Keep every
object member of that union declared as an interface.

#### Incorrect

```tsx
type BannerSectionProps = {
  title: string
}

export function BannerSection(props: BannerSectionProps) {}
```

#### Correct

```tsx
interface BannerSectionProps {
  title: string
}

export function BannerSection(props: BannerSectionProps) {}
```

---

### 2. Component Declaration

#### Description

Declare every component using a function declaration.

Export the component directly.

Do not use arrow functions.

Do not use default exports.

#### Incorrect

```tsx
const BannerSection = (props: BannerSectionProps) => {}

export default BannerSection
```

#### Correct

```tsx
export function BannerSection(props: BannerSectionProps) {}
```

---

### 3. Props Parameter

#### Description

Declare the component parameter as `props`.

Type the parameter using the corresponding props interface.

Do not destructure props in the function signature.

#### Incorrect

```tsx
export function BannerSection({
  title,
}: BannerSectionProps) {}
```

#### Correct

```tsx
export function BannerSection(
  props: BannerSectionProps,
) {}
```

---

## Component Creation

### 4. Local Types

#### Description

Declare component-specific types and interfaces in the same module.

Declare local types and interfaces immediately after the import block.

Declare the component props interface immediately after the local types and interfaces.

Extract reusable types and interfaces into a dedicated `.types.ts` module.

Do not declare nested object types inline.

Extract nested object types into their own type or interface.

### Incorrect

```tsx
interface BannerSectionProps {
  merchant: {
    id: string
    name: string
  }
}
```

### Correct

```tsx
interface Merchant {
  id: string
  name: string
}

interface BannerSectionProps {
  merchant: Merchant
}
```

---

### 5. Props Destructuring

#### Description

Declare the component parameter as `props`.

Destructure all required properties in the first statement of the component.

Do not access component properties through `props`.

Separate the destructuring block from the next section with a single empty line.

### Incorrect

```tsx
export function BannerSection(
  props: BannerSectionProps,
) {
  return <h1>{props.title}</h1>
}
```

### Correct

```tsx
export function BannerSection(
  props: BannerSectionProps,
) {
  const {
    title,
  } = props

  return <h1>{title}</h1>
}
```

---

### 6. Native React Hooks

#### Description

Declare native React hooks immediately after props destructuring.

Group all native React hooks together.

Do not separate native React hooks with empty lines.

### Correct

```tsx
const [isOpen, setIsOpen] = useState(false)
const inputRef = useRef<HTMLInputElement>(null)
const [isPending, startTransition] = useTransition()
```

---

### 7. Custom Hooks

#### Description

Declare custom and third-party hooks immediately after native React hooks.

Group all custom and third-party hooks together.

Do not separate hooks within the group with empty lines.

### Correct

```tsx
const user = useUser()
const merchant = useMerchant()
const [theme] = useAtom(themeAtom)
const draft = useImmer(initialState)
```

---

### 8. Derived Values

#### Description

Declare derived values immediately after custom hooks.

Declare memoized values before callbacks.

### Correct

```tsx
const filteredMerchants = useMemo(() => {
  return merchants.filter(...)
}, [merchants])

const total = calculateTotal(filteredMerchants)

const handleAnimation = useCallback(() => {
  ...
}, [])
```

---

### 9. Event Handlers

#### Description

Declare event handlers immediately after derived values.

Declare every event handler using a function declaration.

Prefix every event handler with `handle`.

Do not use arrow functions.

### Incorrect

```tsx
const onSubmit = () => {}
```

### Correct

```tsx
function handleSubmit() {}

function handleMerchantSelect() {}
```

---

### 10. Effects

#### Description

Declare React effects immediately after event handlers.

Group all effects together.

### Correct

```tsx
useEffect(() => {
  ...
}, [])
```

---

### 11. Component Sequence

#### Description

Declare component sections in the following order:

1. Imports
2. Local types and interfaces
3. Props interface
4. Component declaration
5. Props destructuring
6. Native React hooks
7. Custom and third-party hooks
8. Derived values
9. Event handlers
10. Effects
11. JSX return

Separate each section with a single empty line.

#### Notes

The component sequence defines the relative order of component sections.

A component does not need to contain every section.

Omit sections that are not required by the component.

For example:

- Omit the props interface when the component does not receive props.
- Omit props destructuring when the component does not receive props.
- Omit native React hooks when none are used.
- Omit custom hooks when none are used.
- Omit derived values when none are required.
- Omit event handlers when none are required.
- Omit effects when none are required.

When a section exists, declare it in the order defined by this rule.

## State Management

### Local State

#### 12. Local State

---

### Global State

#### 13. Global State


## Orbz custom-element integration

Inside this repository, React code must render the native `<orb-z>` tag.
Do not create, restore, import, or export an Orbz React component or adapter.
Register the custom element through `@neongate-ai/orbz/browser` in client code.
