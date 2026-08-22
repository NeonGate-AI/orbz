export const ORBZ_STATES = Object.freeze([
  'idle',
  'listening',
  'thinking',
  'speaking',
  'asleep'
] as const)

export const ORBZ_REDUCED_MOTION_MODES = Object.freeze([
  'system',
  'always',
  'never'
] as const)

export const ORBZ_PRESET_NAMES = Object.freeze([
  'neongate',
  'periwinkle',
  'magenta',
  'peach',
  'mocha',
  'ivory'
] as const)

export const ORBZ_PRESETS = Object.freeze({
  neongate: Object.freeze({
    accent: '#FF4DDE',
    background: '#14142B',
    highlight: '#FFB07A',
    primary: '#6C5CFF',
    secondary: '#00E9FF'
  }),
  periwinkle: Object.freeze({
    accent: '#E66FA9',
    background: '#111226',
    highlight: '#F3ECFF',
    primary: '#6667AB',
    secondary: '#8FB8FF'
  }),
  magenta: Object.freeze({
    accent: '#29B8A6',
    background: '#250A12',
    highlight: '#FFDCE4',
    primary: '#BB2649',
    secondary: '#F06A82'
  }),
  peach: Object.freeze({
    accent: '#D987A3',
    background: '#2A1516',
    highlight: '#FFF0E7',
    primary: '#FFBE98',
    secondary: '#FF8F70'
  }),
  mocha: Object.freeze({
    accent: '#7FA18F',
    background: '#211613',
    highlight: '#F2E2D7',
    primary: '#A47864',
    secondary: '#D3A17E'
  }),
  ivory: Object.freeze({
    accent: '#C8B3D4',
    background: '#171A20',
    highlight: '#FFFFFF',
    primary: '#F0EEE9',
    secondary: '#AFC7D3'
  })
} as const)

export const DEFAULT_ORBZ_PRESET = 'neongate' as const
export const DEFAULT_ORBZ_COLORS = ORBZ_PRESETS[DEFAULT_ORBZ_PRESET]
export const DEFAULT_ORBZ_SIZE = '16rem'
export const DEFAULT_ORBZ_SPEED = 1
export const DEFAULT_ORBZ_STATE = 'idle' as const
export const DEFAULT_ORBZ_REDUCED_MOTION = 'system' as const

export const ORBZ_COLOR_ATTRIBUTES = Object.freeze({
  accent: 'color-accent',
  background: 'color-background',
  highlight: 'color-highlight',
  primary: 'color-primary',
  secondary: 'color-secondary'
} as const)

export const ORBZ_COLOR_KEYS = Object.freeze([
  'accent',
  'background',
  'highlight',
  'primary',
  'secondary'
] as const)

export const config = Object.freeze({
  DEFAULT_ORBZ_COLORS,
  DEFAULT_ORBZ_PRESET,
  DEFAULT_ORBZ_REDUCED_MOTION,
  DEFAULT_ORBZ_SIZE,
  DEFAULT_ORBZ_SPEED,
  DEFAULT_ORBZ_STATE,
  ORBZ_COLOR_ATTRIBUTES,
  ORBZ_COLOR_KEYS,
  ORBZ_PRESET_NAMES,
  ORBZ_PRESETS,
  ORBZ_REDUCED_MOTION_MODES,
  ORBZ_STATES
})
