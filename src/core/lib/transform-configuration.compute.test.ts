import configuration from '@configuration'
import { describe, expect, it, vi } from 'vitest'

import { transformOrbzConfiguration } from './transform-configuration.compute'

describe('core/transform-configuration', () => {
  it('derives editable defaults into an isolated immutable runtime configuration', () => {
    const input = structuredClone(configuration)
    input.component.defaultSize = '32rem'
    input.appearance.defaultPreset = 'peach'
    input.appearance.byState.listening.contrast = 1.7
    input.motion.full.listening.root.transition.repeat = 'infinite'
    const before = structuredClone(input)

    const result = transformOrbzConfiguration(input)

    expect(result.component.defaultSize).toBe('32rem')
    expect(result.appearance.defaultPreset).toBe('peach')
    expect(result.motion.full.listening.contrast).toBe(1.7)
    expect(result.motion.full.listening.root.transition.repeat).toBe(Number.POSITIVE_INFINITY)
    expect(result.component.observedAttributes).toContain('color-primary')
    expect(input).toEqual(before)
    expect(Object.isFrozen(input.appearance.presets.peach)).toBe(false)
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.appearance.presets.peach)).toBe(true)
    expect(Object.isFrozen(result.motion.full.listening.root.animate)).toBe(true)
    expect(Object.isFrozen(result.component.observedAttributes)).toBe(true)
    expect(Reflect.set(result.appearance.presets.peach, 'primary', '#000')).toBe(false)

    input.appearance.presets.peach.primary = '#000'
    input.motion.full.listening.root.transition.repeat = 'changed-after-transform'
    expect(result.appearance.presets.peach.primary).toBe(before.appearance.presets.peach.primary)
    expect(result.motion.full.listening.root.transition.repeat).toBe(Number.POSITIVE_INFINITY)
  })

  it('rejects a default preset that does not resolve to a supported palette', () => {
    const input = structuredClone(configuration)
    input.appearance.defaultPreset = 'missing-palette'

    expect(() => transformOrbzConfiguration(input)).toThrow(
      'Invalid Orbz configuration at $.appearance.defaultPreset: unsupported value or reference.'
    )
  })

  it('rejects undeclared secret fields without including their values in diagnostics', () => {
    const input = structuredClone(configuration)
    Object.assign(input.realtime.openai, { apiKey: 'private-configuration-value' })

    expect(() => transformOrbzConfiguration(input)).toThrow(
      new TypeError('Invalid Orbz configuration at $.realtime.openai: unknown configuration field.')
    )
  })

  it('rejects accessor input without executing the getter', () => {
    const input = structuredClone(configuration)
    const getter = vi.fn(() => 2)
    Object.defineProperty(input.component, 'defaultSpeed', { enumerable: true, get: getter })

    expect(() => transformOrbzConfiguration(input)).toThrow(
      new TypeError('Invalid Orbz configuration at $: JSON accessors are not allowed.')
    )
    expect(getter).not.toHaveBeenCalled()
  })

  it('rejects infinite repetition in reduced motion profiles', () => {
    const input = structuredClone(configuration)
    Object.assign(input.motion.reduced.listening.root.transition, { repeat: 'infinite' })

    expect(() => transformOrbzConfiguration(input)).toThrow(
      'Invalid Orbz configuration at $.motion.reduced.listening.root.transition.repeat'
    )
  })
})
