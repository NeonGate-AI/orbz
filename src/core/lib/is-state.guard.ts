import type { OrbzState } from '@core/appearance/appearance.types'
import { ORBZ_STATES } from '@core/config.data'

export function isOrbzState(value: unknown): value is OrbzState {
  return typeof value === 'string' && (ORBZ_STATES as readonly string[]).includes(value)
}
