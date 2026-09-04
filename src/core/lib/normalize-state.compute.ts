import type { OrbzState } from '@core/appearance/appearance.types'
import { DEFAULT_ORBZ_STATE } from '@core/config.data'

import { isOrbzState } from './is-state.guard'

export function normalizeOrbzState(value: unknown): OrbzState {
  return isOrbzState(value) ? value : DEFAULT_ORBZ_STATE
}
