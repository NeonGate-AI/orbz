import { DEFAULT_ORBZ_SIZE } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { normalizeOrbzSize } from './normalize-size.compute'

describe('core/normalize-size', () => {
  it('trims valid CSS sizes and restores the default for blank input', () => {
    expect(normalizeOrbzSize(' 24px ')).toBe('24px')
    expect(normalizeOrbzSize('   ')).toBe(DEFAULT_ORBZ_SIZE)
  })
})
