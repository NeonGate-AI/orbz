import { orbzElementClassFactory } from '@factories/element-class.factory'
import type { OrbzElementConstructor } from '@element/element.types'
import { ORBZ_TAG_NAME } from '@element/element.data'

/** Defines `<orb-z>` once in the active Custom Element registry. */
export function defineOrbz(): OrbzElementConstructor | undefined {
  if (typeof globalThis.customElements === 'undefined') {
    return undefined
  }

  const existing = globalThis.customElements.get(ORBZ_TAG_NAME)
  if (existing) {
    return existing as OrbzElementConstructor
  }

  const elementConstructor = orbzElementClassFactory()
  if (!elementConstructor) {
    return undefined
  }

  globalThis.customElements.define(ORBZ_TAG_NAME, elementConstructor)

  return elementConstructor
}
