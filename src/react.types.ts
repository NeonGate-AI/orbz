import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import type {
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@core/appearance.types'
import type { OrbzElement } from '@element/element.types'

export interface OrbzReactAttributes {
  'color-accent'?: string
  'color-background'?: string
  'color-highlight'?: string
  'color-primary'?: string
  'color-secondary'?: string
  elevated?: boolean | string
  paused?: boolean | string
  preset?: OrbzPresetName
  'reduced-motion'?: OrbzReducedMotion
  size?: OrbzSize
  speed?: number | string
  state?: OrbzState
}

export type OrbzReactIntrinsicProps = DetailedHTMLProps<
  HTMLAttributes<OrbzElement>,
  OrbzElement
> &
  OrbzReactAttributes

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'orb-z': OrbzReactIntrinsicProps
    }
  }
}
