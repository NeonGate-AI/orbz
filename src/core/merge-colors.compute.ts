import type {
  OrbzColorOverrides,
  OrbzColors
} from './appearance.types'
import {
  DEFAULT_ORBZ_COLORS,
  ORBZ_COLOR_KEYS
} from './config.data'

export function mergeOrbzColors(
  colors?: OrbzColorOverrides | null,
  base: Readonly<OrbzColors> = DEFAULT_ORBZ_COLORS
): OrbzColors {
  const merged = { ...base } as OrbzColors

  if (!colors) {
    return merged
  }

  for (const key of ORBZ_COLOR_KEYS) {
    const value = colors[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      merged[key] = value.trim()
    }
  }

  return merged
}
