import type {
  OrbzColorOverrides,
  OrbzColors,
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@core/appearance/appearance.types'
import { mergeOrbzColors } from '@core/appearance/merge-colors.compute'
import {
  DEFAULT_ORBZ_REDUCED_MOTION,
  ORBZ_COLOR_ATTRIBUTES,
  ORBZ_COLOR_KEYS,
  ORBZ_PRESETS
} from '@core/config.data'
import { normalizeOrbzPreset } from '@core/lib/normalize-preset.compute'
import { normalizeOrbzReducedMotion } from '@core/lib/normalize-reduced-motion.compute'
import { normalizeOrbzSize } from '@core/lib/normalize-size.compute'
import { normalizeOrbzSpeed } from '@core/lib/normalize-speed.compute'
import { normalizeOrbzState } from '@core/lib/normalize-state.compute'
import { ORBZ_OBSERVED_ATTRIBUTES } from '@element/element.data'
import type { OrbzElement, OrbzElementConstructor } from '@element/element.types'
import { orbzShadowTreeFactory } from '@factories/shadow-tree.factory'
import type { OrbzIntelligencePort } from '@ports/intelligence.port'
import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
import { OrbzAnimationService } from '@services/animation.service'
import { OrbzTalkRunnerService } from '@services/talk-runner.service'
import { DEFAULT_TALK_FLOW } from '@talk/talk.data'
import type { OrbzTalkContext, OrbzTalkStep } from '@talk/talk.types'

const ELEMENT_CONSTRUCTORS = new WeakMap<object, OrbzElementConstructor>()

/**
 * Creates the Orbz custom-element class only when a DOM implementation exists.
 * Importing this module on a server never evaluates an HTMLElement subclass.
 */
export function orbzElementClassFactory(): OrbzElementConstructor | undefined {
  if (typeof globalThis.HTMLElement === 'undefined') {
    return undefined
  }

  const HTMLElementBase = globalThis.HTMLElement
  const existingConstructor = ELEMENT_CONSTRUCTORS.get(HTMLElementBase)
  if (existingConstructor) {
    return existingConstructor
  }

  class OrbzHTMLElement extends HTMLElementBase implements OrbzElement {
    static readonly observedAttributes = ORBZ_OBSERVED_ATTRIBUTES

    readonly #animationService: OrbzAnimationService
    readonly #talkRunner: OrbzTalkRunnerService
    readonly #visualRoot: HTMLElement
    #activationAbortController: AbortController | undefined
    #colorConflictCheckQueued = false
    #connected = false
    #hasColorConflict = false
    #motionQuery: MediaQueryList | undefined
    #speaking = false
    #stateBeforeSpeech: OrbzState | undefined
    #talkFlow: readonly OrbzTalkStep[] = DEFAULT_TALK_FLOW

    readonly #handleMotionPreferenceChange = (): void => {
      if (this.reducedMotion === 'system') {
        this.#renderMotion()
      }
    }

    constructor() {
      super()

      const shadowRoot = this.attachShadow({ mode: 'closed' })
      const shadowTree = orbzShadowTreeFactory(shadowRoot, this.ownerDocument)

      this.#visualRoot = shadowTree.root
      this.#animationService = new OrbzAnimationService(this.#visualRoot, shadowTree.layers)
      this.#talkRunner = new OrbzTalkRunnerService(
        this.#handleSpeakingChange.bind(this),
        this.#handleTalkError.bind(this)
      )
    }

    get intelligence(): OrbzIntelligencePort | undefined {
      return this.#talkRunner.intelligence
    }

    set intelligence(value: OrbzIntelligencePort | undefined) {
      if (value !== undefined && typeof value.respond !== 'function') {
        throw new TypeError('Orbz intelligence must implement respond().')
      }

      this.#talkRunner.intelligence = value
    }

    get talkContext(): Readonly<OrbzTalkContext> {
      return this.#talkRunner.context
    }

    get talkFlow(): readonly OrbzTalkStep[] {
      return Object.freeze([...this.#talkFlow])
    }

    set talkFlow(value: readonly OrbzTalkStep[] | undefined) {
      const flow = value ?? DEFAULT_TALK_FLOW
      if (!Array.isArray(flow)) {
        throw new TypeError('Orbz talkFlow must be an array of talk steps.')
      }

      this.#talkFlow = [...flow]
    }

    get voiceEngine(): OrbzVoiceEnginePort | undefined {
      return this.#talkRunner.voiceEngine
    }

    set voiceEngine(value: OrbzVoiceEnginePort | undefined) {
      if (
        value !== undefined &&
        (typeof value.speak !== 'function' || typeof value.stop !== 'function')
      ) {
        throw new TypeError('Orbz voiceEngine must implement speak() and stop().')
      }

      this.#activationAbortController?.abort()
      this.#activationAbortController = undefined
      this.#talkRunner.voiceEngine = value
    }

    get elevated(): boolean {
      return this.hasAttribute('elevated')
    }

    set elevated(value: boolean) {
      this.toggleAttribute('elevated', Boolean(value))
    }

    get preset(): OrbzPresetName {
      return normalizeOrbzPreset(this.getAttribute('preset'))
    }

    set preset(value: OrbzPresetName | null | undefined) {
      if (value === null || value === undefined) {
        this.removeAttribute('preset')
        return
      }

      this.setAttribute('preset', normalizeOrbzPreset(value))
    }

    get paused(): boolean {
      return this.hasAttribute('paused')
    }

    set paused(value: boolean) {
      this.toggleAttribute('paused', Boolean(value))
    }

    get reducedMotion(): OrbzReducedMotion {
      return normalizeOrbzReducedMotion(this.getAttribute('reduced-motion'))
    }

    set reducedMotion(value: OrbzReducedMotion) {
      this.setAttribute('reduced-motion', normalizeOrbzReducedMotion(value))
    }

    get size(): string {
      return normalizeOrbzSize(this.getAttribute('size'))
    }

    set size(value: OrbzSize) {
      this.setAttribute('size', normalizeOrbzSize(value))
    }

    get speech(): string | undefined {
      return normalizeSpeech(this.getAttribute('speech'))
    }

    set speech(value: string | null | undefined) {
      const normalized = normalizeSpeech(value)
      if (normalized === undefined) {
        this.removeAttribute('speech')
        return
      }

      this.setAttribute('speech', normalized)
    }

    get speed(): number {
      return normalizeOrbzSpeed(this.getAttribute('speed'))
    }

    set speed(value: number) {
      this.setAttribute('speed', String(normalizeOrbzSpeed(value)))
    }

    get state(): OrbzState {
      return normalizeOrbzState(this.getAttribute('state'))
    }

    set state(value: OrbzState) {
      this.setAttribute('state', normalizeOrbzState(value))
    }

    connectedCallback(): void {
      if (this.#connected) {
        return
      }

      this.#connected = true
      this.#connectMotionPreference()
      this.#synchronizePresentationAttributes()
      this.#renderMotion()
    }

    disconnectedCallback(): void {
      if (!this.#connected) {
        return
      }

      this.#connected = false
      this.#activationAbortController?.abort()
      this.#activationAbortController = undefined
      this.#disconnectMotionPreference()
      this.#animationService.dispose()
      this.#talkRunner.stop()
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      if (oldValue === newValue) {
        return
      }

      if (name === 'size') {
        this.#synchronizeSize(newValue)
        return
      }

      const colorKey = colorKeyForAttribute(name)
      if (colorKey) {
        if (!this.#normalizeColorAttribute(colorKey, newValue)) {
          return
        }
        this.#synchronizeColors()
        return
      }

      if (name === 'preset') {
        if (newValue !== null) {
          const normalized = normalizeOrbzPreset(newValue)
          if (newValue !== normalized) {
            this.setAttribute(name, normalized)
            return
          }
        }
        this.#synchronizeColors()
        return
      }

      if (name === 'elevated') {
        return
      }

      if (name === 'speech') {
        const normalized = normalizeSpeech(newValue)
        if (normalized === undefined) {
          if (newValue !== null) {
            this.removeAttribute(name)
          }
          return
        }
        if (newValue !== normalized) {
          this.setAttribute(name, normalized)
        }
        return
      }

      if (name === 'state' && newValue !== null) {
        const normalized = normalizeOrbzState(newValue)
        if (newValue !== normalized) {
          this.setAttribute(name, normalized)
          return
        }
      }

      if (name === 'speed' && newValue !== null) {
        const normalized = String(normalizeOrbzSpeed(newValue))
        if (newValue !== normalized) {
          this.setAttribute(name, normalized)
          return
        }
      }

      if (name === 'reduced-motion' && newValue !== null) {
        const normalized = normalizeOrbzReducedMotion(newValue)
        if (newValue !== normalized) {
          this.setAttribute(name, normalized)
          return
        }
      }

      if (!this.#connected) {
        return
      }

      if (name === 'paused') {
        if (newValue === null) {
          this.#animationService.play()
        } else {
          this.#animationService.pause()
        }
        return
      }

      this.#renderMotion()
    }

    play(): void {
      if (this.paused) {
        this.paused = false
      } else {
        this.#animationService.play()
      }
    }

    pause(): void {
      if (!this.paused) {
        this.paused = true
      } else {
        this.#animationService.pause()
      }
    }

    restart(): void {
      if (this.#connected) {
        this.#renderMotion()
      }
    }

    receive(input: string): Promise<void> {
      return this.#talkRunner.receive(input)
    }

    startTalking(): Promise<void> {
      this.#activationAbortController?.abort()
      this.#activationAbortController = undefined

      const speech = this.speech
      if (speech !== undefined) {
        return this.#talkRunner.speak(speech)
      }
      if (this.#talkFlow.length > 0) {
        return this.#talkRunner.start(this.#talkFlow)
      }

      return Promise.resolve()
    }

    stopTalking(): void {
      this.#activationAbortController?.abort()
      this.#activationAbortController = undefined
      this.#talkRunner.stop()
    }

    #waitForTalkActivation(): void {
      if (this.#activationAbortController || !this.#connected) {
        return
      }

      const abortController = new AbortController()
      const handleActivation = (): void => {
        abortController.abort()
        if (this.#activationAbortController === abortController) {
          this.#activationAbortController = undefined
        }

        queueMicrotask(() => {
          if (this.#connected) {
            void this.startTalking()
          }
        })
      }
      const options = {
        capture: true,
        once: true,
        signal: abortController.signal
      } as const

      this.#activationAbortController = abortController
      this.ownerDocument.addEventListener('keydown', handleActivation, options)
      this.ownerDocument.addEventListener('pointerdown', handleActivation, options)
      this.ownerDocument.addEventListener('touchend', handleActivation, options)
    }

    #connectMotionPreference(): void {
      if (typeof globalThis.matchMedia !== 'function') {
        return
      }

      this.#motionQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
      if (typeof this.#motionQuery.addEventListener === 'function') {
        this.#motionQuery.addEventListener('change', this.#handleMotionPreferenceChange)
      } else {
        this.#motionQuery.addListener(this.#handleMotionPreferenceChange)
      }
    }

    #disconnectMotionPreference(): void {
      if (typeof this.#motionQuery?.removeEventListener === 'function') {
        this.#motionQuery.removeEventListener('change', this.#handleMotionPreferenceChange)
      } else {
        this.#motionQuery?.removeListener(this.#handleMotionPreferenceChange)
      }
      this.#motionQuery = undefined
    }

    #synchronizePresentationAttributes(): void {
      this.#synchronizeSize(this.getAttribute('size'))

      const presetAttribute = this.getAttribute('preset')
      if (presetAttribute !== null) {
        const normalized = normalizeOrbzPreset(presetAttribute)
        if (presetAttribute !== normalized) {
          this.setAttribute('preset', normalized)
        }
      }

      for (const key of ORBZ_COLOR_KEYS) {
        this.#normalizeColorAttribute(key, this.getAttribute(ORBZ_COLOR_ATTRIBUTES[key]))
      }

      this.#synchronizeColors()
    }

    #synchronizeSize(value: string | null): void {
      const normalized = normalizeOrbzSize(value)
      if (value !== null && value !== normalized) {
        this.setAttribute('size', normalized)
        return
      }

      this.#visualRoot.style.setProperty('--orbz-size', normalized)
    }

    #normalizeColorAttribute(key: keyof OrbzColors, value: string | null): boolean {
      if (value === null) {
        return true
      }

      const normalized = value.trim()
      const attribute = ORBZ_COLOR_ATTRIBUTES[key]
      if (normalized.length === 0) {
        this.removeAttribute(attribute)
        return false
      }

      if (value !== normalized) {
        this.setAttribute(attribute, normalized)
        return false
      }

      return true
    }

    #synchronizeColors(): void {
      const hasExplicitPreset = this.hasAttribute('preset')
      const colors = hasExplicitPreset
        ? { ...ORBZ_PRESETS[this.preset] }
        : mergeOrbzColors(this.#readColorOverrides())

      for (const key of ORBZ_COLOR_KEYS) {
        this.#visualRoot.style.setProperty(`--orbz-${key}`, colors[key])
      }

      this.#queueColorConflictCheck()
    }

    #queueColorConflictCheck(): void {
      if (this.#colorConflictCheckQueued) {
        return
      }

      this.#colorConflictCheckQueued = true
      queueMicrotask(() => {
        this.#colorConflictCheckQueued = false
        const customAttributes = ORBZ_COLOR_KEYS.filter((key) =>
          this.hasAttribute(ORBZ_COLOR_ATTRIBUTES[key])
        )
        const hasConflict = this.hasAttribute('preset') && customAttributes.length > 0

        if (hasConflict && !this.#hasColorConflict) {
          const names = customAttributes.map((key) => ORBZ_COLOR_ATTRIBUTES[key]).join(', ')
          console.error(
            `[Orbz] preset='${this.preset}' cannot be combined with ` +
              `${names}. ` +
              'The preset is applied and custom color attributes are ignored.'
          )
        }
        this.#hasColorConflict = hasConflict
      })
    }

    #readColorOverrides(): OrbzColorOverrides {
      const overrides: OrbzColorOverrides = {}
      for (const key of ORBZ_COLOR_KEYS) {
        const value = this.getAttribute(ORBZ_COLOR_ATTRIBUTES[key])
        if (value !== null) {
          overrides[key] = value
        }
      }
      return overrides
    }

    #handleSpeakingChange(speaking: boolean): void {
      if (this.#speaking === speaking) {
        return
      }

      this.#speaking = speaking

      if (speaking) {
        if (this.state !== 'speaking') {
          this.#stateBeforeSpeech = this.state
          this.state = 'speaking'
        }
      } else {
        const stateBeforeSpeech = this.#stateBeforeSpeech
        this.#stateBeforeSpeech = undefined

        if (stateBeforeSpeech && this.state === 'speaking') {
          this.state = stateBeforeSpeech
        }
      }

      this.dispatchEvent(
        new CustomEvent('orbz-speaking-change', {
          detail: Object.freeze({ speaking })
        })
      )
    }

    #handleTalkError(error: unknown): void {
      if (isSpeechActivationError(error)) {
        this.#waitForTalkActivation()
      }

      this.dispatchEvent(
        new CustomEvent('orbz-talk-error', {
          detail: Object.freeze({ error })
        })
      )
    }

    #renderMotion(): void {
      if (!this.#connected) {
        return
      }

      const reducedMotion = this.reducedMotion
      const reduced =
        reducedMotion === 'always' ||
        (reducedMotion === DEFAULT_ORBZ_REDUCED_MOTION && (this.#motionQuery?.matches ?? false))

      this.#animationService.render({
        paused: this.paused,
        reduced,
        speed: this.speed,
        state: this.state
      })
    }
  }

  const elementConstructor = OrbzHTMLElement as unknown as OrbzElementConstructor
  ELEMENT_CONSTRUCTORS.set(HTMLElementBase, elementConstructor)

  return elementConstructor
}

function normalizeSpeech(value: string | null | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized && normalized.length > 0 ? normalized : undefined
}

function colorKeyForAttribute(name: string): keyof OrbzColors | undefined {
  return ORBZ_COLOR_KEYS.find((key) => ORBZ_COLOR_ATTRIBUTES[key] === name)
}

function isSpeechActivationError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  return (
    error.name === 'NotAllowedError' ||
    error.name === 'SpeechSynthesisStartError' ||
    /autoplay|not[- ]allowed|user (?:gesture|interaction)/i.test(error.message)
  )
}
