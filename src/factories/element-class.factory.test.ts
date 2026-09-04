import { ORBZ_TAG_NAME } from '@element/element.data'
import type { OrbzElement } from '@element/element.types'
import { defineOrbz } from '@services/registration.service'
import { beforeAll, describe, expect, it, vi } from 'vitest'

function createOrbz(): OrbzElement {
  const element = document.createElement(ORBZ_TAG_NAME) as OrbzElement
  document.body.append(element)
  return element
}

describe('factory/element-class', () => {
  beforeAll(() => {
    defineOrbz()
  })

  it('keeps the visual shadow tree closed', () => {
    expect(createOrbz().shadowRoot).toBeNull()
  })

  it('normalizes reflected appearance and speech attributes', () => {
    const orb = createOrbz()

    orb.setAttribute('state', 'unknown')
    orb.setAttribute('size', ' 20rem ')
    orb.speech = '  Olá, mundo.  '

    expect(orb.state).toBe('idle')
    expect(orb.getAttribute('state')).toBe('idle')
    expect(orb.size).toBe('20rem')
    expect(orb.getAttribute('size')).toBe('20rem')
    expect(orb.speech).toBe('Olá, mundo.')
    expect(orb.getAttribute('speech')).toBe('Olá, mundo.')

    orb.speech = '   '
    expect(orb.speech).toBeUndefined()
    expect(orb.hasAttribute('speech')).toBe(false)
  })

  it('does not speak when no speech or explicit flow exists', async () => {
    const voiceEngine = {
      speak: vi.fn(async (_text: string) => undefined),
      stop: vi.fn()
    }
    const orb = createOrbz()
    orb.voiceEngine = voiceEngine

    await orb.startTalking()

    expect(voiceEngine.speak).not.toHaveBeenCalled()
  })

  it('speaks explicit content and restores the prior visual state', async () => {
    const voiceEngine = {
      speak: vi.fn(async (_text: string) => undefined),
      stop: vi.fn()
    }
    const speakingStates: boolean[] = []
    const orb = createOrbz()
    orb.state = 'thinking'
    orb.speech = 'Olá, mundo.'
    orb.voiceEngine = voiceEngine
    orb.addEventListener('orbz-speaking-change', (event) => {
      speakingStates.push((event as CustomEvent<{ speaking: boolean }>).detail.speaking)
    })

    await orb.startTalking()

    expect(voiceEngine.speak).toHaveBeenCalledWith('Olá, mundo.')
    expect(speakingStates).toEqual([true, false])
    expect(orb.state).toBe('thinking')
  })

  it('emits an error when explicit speech has no engine', async () => {
    const errors: unknown[] = []
    const orb = createOrbz()
    orb.speech = 'Olá.'
    orb.addEventListener('orbz-talk-error', (event) => {
      errors.push((event as CustomEvent<{ error: unknown }>).detail.error)
    })

    await expect(orb.startTalking()).rejects.toThrow(
      'Orbz voiceEngine must be configured before startTalking().'
    )
    expect(errors).toHaveLength(1)
  })
})
