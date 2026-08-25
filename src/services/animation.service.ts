import { ORBZ_MOTION_BY_STATE, REDUCED_ORBZ_MOTION_BY_STATE } from '@core/motion.data'
import type {
  OrbzAnimationScalar,
  OrbzAnimationSeries,
  OrbzAnimationValues,
  OrbzLayerMotion,
  OrbzTransition
} from '@core/motion.types'
import type { OrbzAnimationLayers, OrbzAnimationSettings } from '@element/element.types'

const ANIMATED_STYLE_PROPERTIES = [
  '--orbz-angle',
  'opacity',
  'rotate',
  'scale',
  'translate'
] as const

const EASINGS = {
  easeInOut: 'ease-in-out',
  easeOut: 'ease-out',
  linear: 'linear'
} as const

let anglePropertyRegistration: boolean | undefined

/**
 * Registers the angle as a typed custom property so WAAPI interpolates it.
 * The guarded function is safe to import during SSR.
 */
function registerOrbzAngleProperty(): boolean {
  if (anglePropertyRegistration !== undefined) {
    return anglePropertyRegistration
  }

  if (
    typeof globalThis.CSS === 'undefined' ||
    typeof globalThis.CSS.registerProperty !== 'function'
  ) {
    anglePropertyRegistration = false
    return false
  }

  try {
    globalThis.CSS.registerProperty({
      inherits: true,
      initialValue: '0deg',
      name: '--orbz-angle',
      syntax: '<angle>'
    })
    anglePropertyRegistration = true
  } catch (error) {
    // InvalidModificationError means another Orbz instance registered it.
    anglePropertyRegistration =
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'InvalidModificationError'
  }

  return anglePropertyRegistration
}

export class OrbzAnimationService {
  readonly #animations: Animation[] = []
  readonly #layers: OrbzAnimationLayers
  readonly #styleTarget: HTMLElement

  constructor(styleTarget: HTMLElement, layers: OrbzAnimationLayers) {
    this.#styleTarget = styleTarget
    this.#layers = layers
  }

  render(settings: OrbzAnimationSettings): void {
    this.cancel()

    const profile = settings.reduced
      ? REDUCED_ORBZ_MOTION_BY_STATE[settings.state]
      : ORBZ_MOTION_BY_STATE[settings.state]

    this.#styleTarget.style.setProperty('--orbz-contrast', String(profile.contrast))
    this.#styleTarget.style.setProperty('--orbz-saturation', String(profile.saturation))

    this.#animateLayer(this.#layers.root, profile.root, settings.speed)
    this.#animateLayer(this.#layers.aura, profile.aura, settings.speed)
    this.#animateLayer(this.#layers.ring, profile.ring, settings.speed)
    this.#animateLayer(this.#layers.field, profile.field, settings.speed)
    this.#animateLayer(this.#layers.core, profile.core, settings.speed)
    this.#animateLayer(this.#layers.highlight, profile.highlight, settings.speed)

    if (settings.paused) {
      this.pause()
    }
  }

  play(): void {
    for (const animation of this.#animations) {
      animation.play()
    }
  }

  pause(): void {
    for (const animation of this.#animations) {
      animation.pause()
    }
  }

  cancel(): void {
    for (const animation of this.#animations) {
      animation.cancel()
    }
    this.#animations.length = 0

    for (const element of Object.values(this.#layers)) {
      for (const property of ANIMATED_STYLE_PROPERTIES) {
        element.style.removeProperty(property)
      }
    }
  }

  dispose(): void {
    this.cancel()
  }

  #animateLayer(element: HTMLElement, motion: OrbzLayerMotion, speed: number): void {
    const values = motion.animate

    this.#animateProperty(
      element,
      'opacity',
      values.opacity,
      motion.transition,
      speed,
      serializeNumber
    )
    this.#animateProperty(element, 'scale', values.scale, motion.transition, speed, serializeNumber)
    this.#animateProperty(
      element,
      'rotate',
      values.rotate,
      motion.transition,
      speed,
      serializeAngle
    )
    this.#animateTranslate(element, values, motion.transition, speed)
    this.#animateAngle(element, values, motion.transition, speed)
  }

  #animateTranslate(
    element: HTMLElement,
    values: OrbzAnimationValues,
    transition: OrbzTransition,
    speed: number
  ): void {
    if (values.x === undefined && values.y === undefined) {
      return
    }

    const xValues = asArray(values.x ?? 0)
    const yValues = asArray(values.y ?? 0)
    const frameCount = Math.max(xValues.length, yValues.length)
    const translations = Array.from({ length: frameCount }, (_, index) => {
      const x = valueAt(xValues, index, frameCount)
      const y = valueAt(yValues, index, frameCount)
      return `${serializeDistance(x)} ${serializeDistance(y)}`
    })

    this.#animateProperty(element, 'translate', translations, transition, speed, String)
  }

  #animateAngle(
    element: HTMLElement,
    values: OrbzAnimationValues,
    transition: OrbzTransition,
    speed: number
  ): void {
    const angle = values['--orb-angle']
    if (angle === undefined) {
      return
    }

    if (registerOrbzAngleProperty()) {
      this.#animateProperty(element, '--orbz-angle', angle, transition, speed, serializeAngle)
      return
    }

    // Older engines cannot interpolate custom properties. Rotating the entire
    // field preserves motion while the first gradient angle remains set.
    const angles = asArray(angle).map(serializeAngle)
    element.style.setProperty('--orbz-angle', angles[0] ?? '0deg')
    this.#animateProperty(element, 'rotate', angles, transition, speed, String)
  }

  #animateProperty(
    element: HTMLElement,
    property: string,
    series: OrbzAnimationSeries | undefined,
    transition: OrbzTransition,
    speed: number,
    serialize: (value: OrbzAnimationScalar) => string
  ): void {
    if (series === undefined) {
      return
    }

    const values = asArray(series)
    if (values.length <= 1 || transition.duration <= 0 || typeof element.animate !== 'function') {
      element.style.setProperty(property, serialize(values[0] ?? 0))
      return
    }

    const offsets = transition.times?.length === values.length ? transition.times : undefined
    const keyframes = values.map((value, index) => {
      const frame = { [property]: serialize(value) } as Keyframe
      if (offsets) {
        frame.offset = offsets[index]
      }
      if (transition.ease) {
        frame.easing = EASINGS[transition.ease]
      }
      return frame
    })

    const animation = element.animate(keyframes, {
      direction: transition.repeatType === 'reverse' ? 'alternate' : 'normal',
      duration: (transition.duration * 1_000) / speed,
      easing: 'linear',
      fill: 'both',
      iterations:
        transition.repeat === Number.POSITIVE_INFINITY
          ? Number.POSITIVE_INFINITY
          : (transition.repeat ?? 0) + 1
    })

    this.#animations.push(animation)
  }
}

function asArray(series: OrbzAnimationSeries): readonly OrbzAnimationScalar[] {
  return Array.isArray(series)
    ? (series as readonly OrbzAnimationScalar[])
    : [series as OrbzAnimationScalar]
}

function valueAt(
  values: readonly OrbzAnimationScalar[],
  index: number,
  targetLength: number
): OrbzAnimationScalar {
  if (values.length <= 1 || targetLength <= 1) {
    return values[0] ?? 0
  }

  const sourceIndex = Math.round((index * (values.length - 1)) / (targetLength - 1))
  return values[sourceIndex] ?? values[values.length - 1] ?? 0
}

function serializeNumber(value: OrbzAnimationScalar): string {
  return String(value)
}

function serializeAngle(value: OrbzAnimationScalar): string {
  return typeof value === 'number' ? `${value}deg` : value
}

function serializeDistance(value: OrbzAnimationScalar): string {
  return typeof value === 'number' ? `${value}px` : value
}
