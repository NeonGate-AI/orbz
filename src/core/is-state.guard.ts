import { ORBZ_STATES } from './config.data'
import type { OrbzState } from './appearance.types'

export function isOrbzState(value: unknown): value is OrbzState {
  return (
    typeof value === 'string' &&
    (ORBZ_STATES as readonly string[]).includes(value)
  )
}
