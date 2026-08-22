import { DEFAULT_ORBZ_STATE } from './config.data'
import { isOrbzState } from './is-state.guard'
import type { OrbzState } from './appearance.types'

export function normalizeOrbzState(value: unknown): OrbzState {
  return isOrbzState(value) ? value : DEFAULT_ORBZ_STATE
}
