import type { OrbzReducedMotion } from '@core/appearance/appearance.types'
import { DEFAULT_ORBZ_REDUCED_MOTION } from '@core/config.data'
import { isOrbzReducedMotion } from '@core/motion/is-reduced-motion.guard'

export function normalizeOrbzReducedMotion(value: unknown): OrbzReducedMotion {
  return isOrbzReducedMotion(value) ? value : DEFAULT_ORBZ_REDUCED_MOTION
}
