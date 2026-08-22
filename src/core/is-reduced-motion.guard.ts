import { ORBZ_REDUCED_MOTION_MODES } from './config.data'
import type { OrbzReducedMotion } from './appearance.types'

export function isOrbzReducedMotion(
  value: unknown
): value is OrbzReducedMotion {
  return (
    typeof value === 'string' &&
    (ORBZ_REDUCED_MOTION_MODES as readonly string[]).includes(value)
  )
}
