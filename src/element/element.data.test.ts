import { describe, expect, it } from 'vitest'

import { ORBZ_OBSERVED_ATTRIBUTES, ORBZ_TAG_NAME } from './element.data'

describe('element/public-data', () => {
  it('defines the native tag and observes speech plus appearance attributes', () => {
    expect(ORBZ_TAG_NAME).toBe('orb-z')
    expect(ORBZ_OBSERVED_ATTRIBUTES).toContain('speech')
    expect(ORBZ_OBSERVED_ATTRIBUTES).toContain('state')
    expect(ORBZ_OBSERVED_ATTRIBUTES).toContain('color-primary')
  })
})
