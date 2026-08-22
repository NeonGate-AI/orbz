import { DEFAULT_ORBZ_SIZE } from './config.data'
import type { OrbzSize } from './appearance.types'

export function normalizeOrbzSize(
  value: OrbzSize | null | undefined
): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0
      ? `${value}px`
      : DEFAULT_ORBZ_SIZE
  }

  if (typeof value !== 'string') {
    return DEFAULT_ORBZ_SIZE
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : DEFAULT_ORBZ_SIZE
}
