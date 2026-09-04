import { ORBZ_COLOR_ATTRIBUTES } from '@core/config.data'

export const ORBZ_TAG_NAME = 'orb-z'

export const ORBZ_OBSERVED_ATTRIBUTES = Object.freeze([
  'state',
  'size',
  'speed',
  'speech',
  'paused',
  'elevated',
  'preset',
  'reduced-motion',
  ...Object.values(ORBZ_COLOR_ATTRIBUTES)
])
