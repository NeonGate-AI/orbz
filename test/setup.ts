import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  const matchMedia = vi.fn((query: string): MediaQueryList => {
    return {
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn()
    }
  })

  vi.stubGlobal('matchMedia', matchMedia)
})

afterEach(() => {
  if (typeof document !== 'undefined') {
    document.body.replaceChildren()
  }

  vi.unstubAllGlobals()
})
