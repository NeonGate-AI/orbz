import { DEFAULT_ORBZ_SPEED } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { normalizeOrbzSpeed } from './normalize-speed.compute'

describe('core/normalize-speed', () => {
  it('normalizes invalid input to the stable default', () => {
    expect(normalizeOrbzSpeed(Number.POSITIVE_INFINITY)).toBe(DEFAULT_ORBZ_SPEED)
  })
})
