import { ORBZ_TAG_NAME } from '@element/element.data'
import { describe, expect, it } from 'vitest'
import { defineOrbz } from './registration.service'

describe('service/registration', () => {
  it('registers the custom element idempotently', () => {
    const first = defineOrbz()
    const second = defineOrbz()

    expect(first).toBe(second)
    expect(customElements.get(ORBZ_TAG_NAME)).toBe(first)
  })
})
