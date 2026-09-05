import bundledSource from '@configuration'
import { deepFreezeOrbzConfiguration } from '@core/lib/deep-freeze.compute'
import type { OrbzLayerMotion, OrbzMotionProfile } from '@core/motion/motion.types'

import type {
  OrbzBundledConfiguration,
  OrbzConfigurationSource,
  OrbzMotionConfigurationSource
} from './config.types'

// The JSON is bundled into every entry point; importing never performs I/O.
const source = bundledSource as unknown as OrbzConfigurationSource

function motionProfiles(
  profiles: OrbzMotionConfigurationSource['full']
): Record<OrbzConfigurationSource['component']['states'][number], OrbzMotionProfile> {
  return Object.fromEntries(
    Object.entries(profiles).map(([state, layers]) => [
      state,
      {
        ...source.appearance.byState[state as keyof typeof source.appearance.byState],
        ...Object.fromEntries(
          Object.entries(layers).map(([layer, motion]) => {
            const transition = { ...motion.transition }
            if (transition.repeat === 'infinite') {
              transition.repeat = Number.POSITIVE_INFINITY
            }
            return [layer, { animate: motion.animate, transition } as OrbzLayerMotion]
          })
        )
      }
    ])
  ) as Record<OrbzConfigurationSource['component']['states'][number], OrbzMotionProfile>
}

export const orbzConfiguration = deepFreezeOrbzConfiguration({
  ...source,
  component: {
    ...source.component,
    observedAttributes: [
      ...source.component.observedAttributes,
      ...Object.values(source.appearance.colorAttributes)
    ]
  },
  motion: {
    ...source.motion,
    full: motionProfiles(source.motion.full),
    reduced: motionProfiles(source.motion.reduced)
  }
}) as OrbzBundledConfiguration
