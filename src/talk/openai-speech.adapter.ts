import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'

import type {
  OpenAISpeechAdapterOptions,
  OpenAISpeechFormat,
  OpenAISpeechModel,
  OpenAISpeechVoice
} from './talk.types'

interface ActiveAudio {
  finish(): void
}

const DEFAULT_INSTRUCTIONS =
  'Speak in fluent American English with a warm, natural, happy, excited conversational ' +
  'delivery. Keep the pacing calm and avoid exaggerated prosody.'
const DEFAULT_MODEL = 'gpt-4o-mini-tts'
const DEFAULT_RESPONSE_FORMAT = 'mp3'
const DEFAULT_VOICE = 'marin'

/**
 * Plays OpenAI text-to-speech audio returned by an implementer-owned endpoint.
 * The endpoint keeps the OpenAI API key outside the browser and should accept
 * the same JSON fields as OpenAI's audio speech endpoint.
 */
export class OpenAISpeechAdapter implements OrbzVoiceEnginePort {
  #activeAudio: ActiveAudio | undefined
  #abortController: AbortController | undefined
  readonly #credentials: RequestCredentials
  readonly #endpoint: string
  readonly #fetch: typeof globalThis.fetch | undefined
  readonly #headers: Readonly<Record<string, string>>
  readonly #instructions: string
  readonly #model: OpenAISpeechModel
  readonly #responseFormat: OpenAISpeechFormat
  #run = 0
  readonly #voice: OpenAISpeechVoice

  constructor(options: OpenAISpeechAdapterOptions) {
    const endpoint = String(options.endpoint).trim()
    if (endpoint.length === 0) {
      throw new TypeError('OpenAI speech endpoint must not be empty.')
    }

    this.#credentials = options.credentials ?? 'same-origin'
    this.#endpoint = endpoint
    this.#fetch = options.fetch ?? globalThis.fetch
    this.#headers = Object.freeze({ ...options.headers })
    this.#instructions = options.instructions ?? DEFAULT_INSTRUCTIONS
    this.#model = options.model ?? DEFAULT_MODEL
    this.#responseFormat = options.responseFormat ?? DEFAULT_RESPONSE_FORMAT
    this.#voice = options.voice ?? defaultVoiceForModel(this.#model)
  }

  async speak(text: string): Promise<void> {
    const normalizedText = text.trim()
    if (normalizedText.length === 0) {
      return
    }
    if (!this.#fetch) {
      throw new Error('Fetch is not available in this environment.')
    }

    this.stop()
    const run = ++this.#run
    const abortController = new AbortController()
    this.#abortController = abortController

    try {
      const headers = new Headers(this.#headers)
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json')
      }

      const body: Record<string, unknown> = {
        input: normalizedText,
        model: this.#model,
        response_format: this.#responseFormat,
        voice: this.#voice
      }
      if (supportsInstructions(this.#model)) {
        body.instructions = this.#instructions
      }

      const response = await this.#fetch(this.#endpoint, {
        body: JSON.stringify(body),
        credentials: this.#credentials,
        headers,
        method: 'POST',
        signal: abortController.signal
      })

      if (run !== this.#run) {
        return
      }
      if (!response.ok) {
        const detail = (await response.text()).trim()
        throw new Error(
          `OpenAI speech endpoint failed with ${response.status}` +
            (detail.length > 0 ? `: ${detail.slice(0, 300)}` : '.')
        )
      }

      const audioBlob = await response.blob()
      if (run !== this.#run) {
        return
      }

      await this.#play(audioBlob, run)
    } catch (error) {
      if (run !== this.#run && isAbortError(error)) {
        return
      }

      throw error
    } finally {
      if (this.#abortController === abortController) {
        this.#abortController = undefined
      }
    }
  }

  stop(): void {
    this.#run += 1
    this.#abortController?.abort()
    this.#abortController = undefined

    const activeAudio = this.#activeAudio
    this.#activeAudio = undefined
    activeAudio?.finish()
  }

  async #play(audioBlob: Blob, run: number): Promise<void> {
    const AudioConstructor = globalThis.Audio
    if (typeof AudioConstructor !== 'function') {
      throw new Error('Audio playback is not available in this environment.')
    }

    const objectUrl = URL.createObjectURL(audioBlob)
    const audio = new AudioConstructor(objectUrl)
    audio.preload = 'auto'

    await new Promise<void>((resolve, reject) => {
      let settled = false

      const finish = (error?: Error): void => {
        if (settled) {
          return
        }

        settled = true
        audio.pause()
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
        URL.revokeObjectURL(objectUrl)

        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }

      const handleEnded = (): void => finish()
      const handleError = (): void => {
        finish(new Error('The generated speech audio could not be played.'))
      }

      this.#activeAudio = { finish }
      audio.addEventListener('ended', handleEnded, { once: true })
      audio.addEventListener('error', handleError, { once: true })

      void audio.play().catch((error: unknown) => {
        finish(toPlaybackError(error))
      })
    }).finally(() => {
      if (run === this.#run) {
        this.#activeAudio = undefined
      }
    })
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function toPlaybackError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  return new Error('Speech audio playback failed.')
}

function supportsInstructions(model: OpenAISpeechModel): boolean {
  return model !== 'tts-1' && model !== 'tts-1-hd'
}

function defaultVoiceForModel(model: OpenAISpeechModel): OpenAISpeechVoice {
  return model === 'tts-1' || model === 'tts-1-hd'
    ? 'alloy'
    : DEFAULT_VOICE
}
