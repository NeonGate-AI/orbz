import { DEFAULT_ORBZ_STATE } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { normalizeOrbzState } from './normalize-state.compute'

describe('core/normalize-state', () => {
  it('normalizes invalid input to the stable default', () => {
    expect(normalizeOrbzState('unknown')).toBe(DEFAULT_ORBZ_STATE)
  })
})
