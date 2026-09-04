import type {
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@core/appearance/appearance.types'
import type { OrbzElement } from '@element/element.types'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface OrbzReactAttributes {
  'color-accent'?: string
  'color-background'?: string
  'color-highlight'?: string
  'color-primary'?: string
  'color-secondary'?: string
  /** Use Orbz presets/properties and an outer element for layout styling. */
  className?: never
  elevated?: boolean | string
  paused?: boolean | string
  preset?: OrbzPresetName
  'reduced-motion'?: OrbzReducedMotion
  size?: OrbzSize
  speech?: string
  speed?: number | string
  state?: OrbzState
}

type OrbzReactHostProps = Omit<
  DetailedHTMLProps<HTMLAttributes<OrbzElement>, OrbzElement>,
  'className'
>

export type OrbzReactIntrinsicProps = OrbzReactHostProps & OrbzReactAttributes

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'orb-z': OrbzReactIntrinsicProps
    }
  }
}
