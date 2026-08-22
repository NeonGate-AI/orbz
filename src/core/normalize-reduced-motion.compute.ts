import { DEFAULT_ORBZ_REDUCED_MOTION } from './config.data'
import { isOrbzReducedMotion } from './is-reduced-motion.guard'
import type { OrbzReducedMotion } from './appearance.types'

export function normalizeOrbzReducedMotion(
  value: unknown
): OrbzReducedMotion {
  return isOrbzReducedMotion(value) ? value : DEFAULT_ORBZ_REDUCED_MOTION
}
