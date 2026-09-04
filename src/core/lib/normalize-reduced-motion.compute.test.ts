import { DEFAULT_ORBZ_REDUCED_MOTION } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { normalizeOrbzReducedMotion } from './normalize-reduced-motion.compute'

describe('core/normalize-reduced-motion', () => {
  it('normalizes invalid input to the stable default', () => {
    expect(normalizeOrbzReducedMotion('unknown')).toBe(DEFAULT_ORBZ_REDUCED_MOTION)
  })
})
