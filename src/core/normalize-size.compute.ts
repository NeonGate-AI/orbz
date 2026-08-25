import { DEFAULT_ORBZ_SIZE } from './config.data'
import type { OrbzSize } from './appearance.types'

export function normalizeOrbzSize(value: OrbzSize | null | undefined): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? `${value}px` : DEFAULT_ORBZ_SIZE
  }

  if (typeof value !== 'string') {
    return DEFAULT_ORBZ_SIZE
  }

  const trimmedValue = value.trim()
  if (trimmedValue.length === 0) {
    return DEFAULT_ORBZ_SIZE
  }

  const numericValue = Number(trimmedValue)
  if (Number.isFinite(numericValue)) {
    return numericValue > 0 ? `${numericValue}px` : DEFAULT_ORBZ_SIZE
  }

  return trimmedValue
}
