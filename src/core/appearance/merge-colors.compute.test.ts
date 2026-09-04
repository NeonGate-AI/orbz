import { DEFAULT_ORBZ_COLORS, ORBZ_PRESETS } from '@core/config.data'
import { describe, expect, it } from 'vitest'
import { mergeOrbzColors } from './merge-colors.compute'

describe('core/merge-colors', () => {
  it('merges an override without mutating the default preset', () => {
    const colors = mergeOrbzColors({ primary: '#000000' })

    expect(colors).toEqual({ ...DEFAULT_ORBZ_COLORS, primary: '#000000' })
    expect(ORBZ_PRESETS.neongate.primary).not.toBe('#000000')
  })
})
