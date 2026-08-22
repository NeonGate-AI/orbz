export type OrbzAnimationScalar = number | string

export type OrbzAnimationSeries =
  | OrbzAnimationScalar
  | readonly OrbzAnimationScalar[]

export interface OrbzAnimationValues {
  '--orb-angle'?: OrbzAnimationSeries
  opacity?: OrbzAnimationSeries
  rotate?: OrbzAnimationSeries
  scale?: OrbzAnimationSeries
  x?: OrbzAnimationSeries
  y?: OrbzAnimationSeries
}

export interface OrbzTransition {
  /** Duration in seconds, matching the original Orb motion profiles. */
  duration: number
  ease?: 'easeInOut' | 'easeOut' | 'linear'
  repeat?: number
  repeatType?: 'reverse'
  times?: readonly number[]
}

export interface OrbzLayerMotion {
  animate: OrbzAnimationValues
  transition: OrbzTransition
}

export interface OrbzMotionProfile {
  aura: OrbzLayerMotion
  contrast: number
  core: OrbzLayerMotion
  field: OrbzLayerMotion
  highlight: OrbzLayerMotion
  ring: OrbzLayerMotion
  root: OrbzLayerMotion
  saturation: number
}
