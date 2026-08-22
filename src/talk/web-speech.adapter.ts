import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'

import type { WebSpeechAdapterOptions } from './talk.types'

interface ActiveSpeech {
  cancel(): void
}

const DEFAULT_LANGUAGE = 'en-US'
const DEFAULT_PREFERRED_VOICES = Object.freeze([
  'Google US English',
  'Microsoft Aria Online',
  'Microsoft Jenny Online',
  'Microsoft Ava Online',
  'Microsoft Guy Online',
  'Microsoft Zira',
  'English United States',
  'English (America)',
  'US English'
])
const DEFAULT_VOICE_LOAD_TIMEOUT = 1_500
const SPEECH_START_TIMEOUT = 5_000

export class WebSpeechAdapter implements OrbzVoiceEnginePort {
  #activeSpeech: ActiveSpeech | undefined
  readonly #language: string
  readonly #pitch: number
  readonly #preferredVoices: readonly string[]
  readonly #rate: number
  readonly #voiceLoadTimeoutMs: number
  readonly #volume: number

  constructor(options: WebSpeechAdapterOptions = {}) {
    this.#language = normalizeLanguage(options.language)
    this.#pitch = clamp(options.pitch ?? 1, 0, 2)
    this.#preferredVoices = Object.freeze([
      ...(options.preferredVoices ?? DEFAULT_PREFERRED_VOICES)
    ])
    this.#rate = clamp(options.rate ?? 1, 0.1, 10)
    this.#voiceLoadTimeoutMs = Math.max(
      0,
      options.voiceLoadTimeoutMs ?? DEFAULT_VOICE_LOAD_TIMEOUT
    )
    this.#volume = clamp(options.volume ?? 1, 0, 1)
  }

  async speak(text: string): Promise<void> {
    const synthesis = globalThis.speechSynthesis
    const Utterance = globalThis.SpeechSynthesisUtterance

    if (!synthesis || typeof Utterance !== 'function') {
      throw new Error('Speech synthesis is not available in this browser.')
    }

    const normalizedText = text.trim()
    if (normalizedText.length === 0) {
      return
    }

    this.stop()

    const voices = await loadVoices(synthesis, this.#voiceLoadTimeoutMs)
    const utterance = new Utterance(normalizedText)
    const voice = selectVoice(
      voices,
      this.#language,
      this.#preferredVoices
    )

    utterance.lang = this.#language
    utterance.pitch = this.#pitch
    utterance.rate = this.#rate
    utterance.volume = this.#volume
    if (voice) {
      utterance.voice = voice
    }

    let activeSpeech: ActiveSpeech | undefined

    await new Promise<void>((resolve, reject) => {
      let settled = false
      let started = false
      const startTimer = globalThis.setTimeout(() => {
        if (started) {
          return
        }

        finish(createSpeechStartError())
        synthesis.cancel()
      }, SPEECH_START_TIMEOUT)

      const finish = (error?: Error): void => {
        if (settled) {
          return
        }

        settled = true
        globalThis.clearTimeout(startTimer)
        utterance.removeEventListener('end', handleEnd)
        utterance.removeEventListener('error', handleError)
        utterance.removeEventListener('start', handleStart)

        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }

      const handleEnd = (): void => finish()
      const handleError = (event: SpeechSynthesisErrorEvent): void => {
        finish(createSpeechError(event.error))
      }
      const handleStart = (): void => {
        started = true
        globalThis.clearTimeout(startTimer)
      }

      activeSpeech = {
        cancel: () => finish()
      }
      this.#activeSpeech = activeSpeech

      utterance.addEventListener('end', handleEnd, { once: true })
      utterance.addEventListener('error', handleError, { once: true })
      utterance.addEventListener('start', handleStart, { once: true })
      synthesis.speak(utterance)
    }).finally(() => {
      if (this.#activeSpeech === activeSpeech) {
        this.#activeSpeech = undefined
      }
    })
  }

  stop(): void {
    const synthesis = globalThis.speechSynthesis
    if (synthesis?.speaking || synthesis?.pending) {
      synthesis.cancel()
    }

    const activeSpeech = this.#activeSpeech
    this.#activeSpeech = undefined
    activeSpeech?.cancel()
  }
}

async function loadVoices(
  synthesis: SpeechSynthesis,
  timeoutMs: number
): Promise<readonly SpeechSynthesisVoice[]> {
  const availableVoices = synthesis.getVoices()
  if (availableVoices.length > 0 || timeoutMs === 0) {
    return availableVoices
  }

  return new Promise((resolve) => {
    const timer = globalThis.setTimeout(finish, timeoutMs)

    function finish(): void {
      globalThis.clearTimeout(timer)
      synthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      resolve(synthesis.getVoices())
    }

    function handleVoicesChanged(): void {
      if (synthesis.getVoices().length > 0) {
        finish()
      }
    }

    synthesis.addEventListener('voiceschanged', handleVoicesChanged)
  })
}

function selectVoice(
  voices: readonly SpeechSynthesisVoice[],
  language: string,
  preferredVoices: readonly string[]
): SpeechSynthesisVoice | undefined {
  const normalizedLanguage = language.toLowerCase()
  const languageRoot = normalizedLanguage.split('-')[0]
  const languageVoices = voices.filter((voice) => {
    return voice.lang.toLowerCase().split('-')[0] === languageRoot
  })

  return [...languageVoices].sort((left, right) => {
    return (
      scoreVoice(right, normalizedLanguage, preferredVoices) -
      scoreVoice(left, normalizedLanguage, preferredVoices)
    )
  })[0]
}

function scoreVoice(
  voice: SpeechSynthesisVoice,
  language: string,
  preferredVoices: readonly string[]
): number {
  const name = voice.name.toLowerCase()
  const voiceLanguage = voice.lang.toLowerCase()
  const preferredIndex = preferredVoices.findIndex((preferredVoice) => {
    return name.includes(preferredVoice.toLowerCase())
  })
  let score = 0

  if (preferredIndex >= 0) {
    score += 1_000 - preferredIndex
  }
  if (voiceLanguage === language) {
    score += 250
  }
  if (/natural|neural|premium|enhanced|online/.test(name)) {
    score += 100
  }
  if (/google/.test(name)) {
    score += 50
  }
  if (/microsoft/.test(name)) {
    score += 40
  }
  if (!voice.localService) {
    score += 20
  }
  if (voice.default) {
    score += 10
  }

  return score
}

function normalizeLanguage(value: string | undefined): string {
  const normalized = value?.trim()
  return normalized && normalized.length > 0 ? normalized : DEFAULT_LANGUAGE
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) {
    return minimum
  }

  return Math.min(maximum, Math.max(minimum, value))
}

function createSpeechError(code: string): Error {
  const error = new Error(`Speech synthesis failed: ${code}`)
  error.name = code === 'not-allowed' ? 'NotAllowedError' : 'SpeechSynthesisError'
  return error
}

function createSpeechStartError(): Error {
  const userActivation = globalThis.navigator?.userActivation
  const requiresActivation = userActivation?.hasBeenActive === false
  const error = new Error(
    requiresActivation
      ? 'Speech playback requires a user interaction in this browser.'
      : 'Speech synthesis did not start.'
  )
  error.name = requiresActivation
    ? 'NotAllowedError'
    : 'SpeechSynthesisStartError'
  return error
}
