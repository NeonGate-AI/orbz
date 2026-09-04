import { DEFAULT_ORBZ_PRESET } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { normalizeOrbzPreset } from './normalize-preset.compute'

describe('core/normalize-preset', () => {
  it('normalizes invalid input to the stable default', () => {
    expect(normalizeOrbzPreset('unknown')).toBe(DEFAULT_ORBZ_PRESET)
  })
})
