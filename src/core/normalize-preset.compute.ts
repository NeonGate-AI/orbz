import { DEFAULT_ORBZ_PRESET } from './config.data'
import { isOrbzPresetName } from './is-preset-name.guard'
import type { OrbzPresetName } from './appearance.types'

export function normalizeOrbzPreset(value: unknown): OrbzPresetName {
  return isOrbzPresetName(value) ? value : DEFAULT_ORBZ_PRESET
}
