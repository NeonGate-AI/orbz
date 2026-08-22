import { ORBZ_PRESET_NAMES } from './config.data'
import type { OrbzPresetName } from './appearance.types'

export function isOrbzPresetName(value: unknown): value is OrbzPresetName {
  return (
    typeof value === 'string' &&
    (ORBZ_PRESET_NAMES as readonly string[]).includes(value)
  )
}
