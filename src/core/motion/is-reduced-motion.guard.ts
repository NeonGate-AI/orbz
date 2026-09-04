import type { OrbzReducedMotion } from '@core/appearance/appearance.types'
import { ORBZ_REDUCED_MOTION_MODES } from '@core/config.data'

export function isOrbzReducedMotion(value: unknown): value is OrbzReducedMotion {
  return (
    typeof value === 'string' && (ORBZ_REDUCED_MOTION_MODES as readonly string[]).includes(value)
  )
}
