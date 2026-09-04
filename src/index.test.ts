/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest'

describe('core/ssr-entry', () => {
  it('imports without evaluating an HTMLElement subclass', async () => {
    const orbz = await import('./index')

    expect(globalThis.HTMLElement).toBeUndefined()
    expect(orbz.orbzElementClassFactory()).toBeUndefined()
    expect(orbz.defineOrbz()).toBeUndefined()
  })
})
