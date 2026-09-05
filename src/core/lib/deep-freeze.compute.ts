import type { OrbzDeepReadonly } from '@core/config.types'

/** Freeze a configuration tree once at its ownership boundary. */
export function deepFreezeOrbzConfiguration<T>(value: T): OrbzDeepReadonly<T> {
  if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) {
      deepFreezeOrbzConfiguration(child)
    }
    Object.freeze(value)
  }

  return value as OrbzDeepReadonly<T>
}
