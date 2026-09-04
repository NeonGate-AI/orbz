import { DEFAULT_ORBZ_SPEED } from '@core/config.data'

export function normalizeOrbzSpeed(value: unknown): number {
  const numericValue = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : DEFAULT_ORBZ_SPEED
}
