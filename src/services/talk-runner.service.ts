import type { OrbzIntelligencePort } from '@ports/intelligence.port'
import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
import { resolveTalkText } from '@talk/resolve-talk-text.compute'
import type { OrbzTalkContext, OrbzTalkStep } from '@talk/talk.types'

type SpeakingChangeHandler = (speaking: boolean) => void
type TalkErrorHandler = (error: unknown) => void

export class OrbzTalkRunnerService {
  #context: OrbzTalkContext = {}
  #flow: readonly OrbzTalkStep[] = []
  #intelligence: OrbzIntelligencePort | undefined
  #position = 0
  #run = 0
  #speaking = false
  #speech = 0
  readonly #onError: TalkErrorHandler
  readonly #onSpeakingChange: SpeakingChangeHandler
  #voiceEngine: OrbzVoiceEnginePort | undefined

  constructor(onSpeakingChange: SpeakingChangeHandler, onError: TalkErrorHandler) {
    this.#onSpeakingChange = onSpeakingChange
    this.#onError = onError
  }

  get context(): Readonly<OrbzTalkContext> {
    return Object.freeze({ ...this.#context })
  }

  get intelligence(): OrbzIntelligencePort | undefined {
    return this.#intelligence
  }

  set intelligence(value: OrbzIntelligencePort | undefined) {
    this.#intelligence = value
  }

  get voiceEngine(): OrbzVoiceEnginePort | undefined {
    return this.#voiceEngine
  }

  set voiceEngine(value: OrbzVoiceEnginePort | undefined) {
    this.stop()
    this.#voiceEngine = value
  }

  async speak(text: string): Promise<void> {
    const normalizedText = text.trim()
    if (normalizedText.length === 0) {
      return
    }

    this.#assertVoiceEngine()
    this.stop()
    await this.#speak(normalizedText, this.#run)
  }

  async start(flow: readonly OrbzTalkStep[]): Promise<void> {
    if (flow.length === 0) {
      return
    }

    this.#assertVoiceEngine()
    this.stop()
    this.#context = {}
    this.#flow = [...flow]
    this.#position = 0
    const run = this.#run

    await this.#advance(run)
  }

  async receive(input: string): Promise<void> {
    const normalizedInput = input.trim()
    if (normalizedInput.length === 0) {
      return
    }

    const step = this.#flow[this.#position]
    if (!step) {
      return
    }

    if (step.kind === 'ask') {
      this.#context[step.capture] = normalizedInput
      this.#position += 1
      await this.#advance(this.#run)
      return
    }

    if (step.kind === 'respond') {
      await this.#respond(step, normalizedInput, this.#run)
    }
  }

  stop(): void {
    this.#run += 1
    this.#speech += 1
    this.#voiceEngine?.stop()
    this.#setSpeaking(false)
  }

  #assertVoiceEngine(): void {
    if (this.#voiceEngine) {
      return
    }

    const error = createVoiceEngineNotConfiguredError()
    this.#onError(error)
    throw error
  }

  async #advance(run: number): Promise<void> {
    while (run === this.#run) {
      const step = this.#flow[this.#position]
      if (!step || step.kind === 'respond') {
        return
      }

      const spoken = await this.#speak(resolveTalkText(step.text, this.#context), run)
      if (!spoken || run !== this.#run) {
        return
      }

      if (step.kind === 'ask') {
        return
      }

      this.#position += 1
    }
  }

  async #respond(
    step: Extract<OrbzTalkStep, { kind: 'respond' }>,
    input: string,
    run: number
  ): Promise<void> {
    if (!this.#intelligence) {
      await this.#speak(step.fallback, run)
      return
    }

    try {
      const response = await this.#intelligence.respond(input, this.context)
      if (run === this.#run) {
        const normalizedResponse = response.trim()
        await this.#speak(normalizedResponse.length > 0 ? normalizedResponse : step.fallback, run)
      }
    } catch (error) {
      this.#onError(error)
      await this.#speak(step.fallback, run)
    }
  }

  async #speak(text: string, run: number): Promise<boolean> {
    if (run !== this.#run) {
      return false
    }

    const voiceEngine = this.#voiceEngine
    if (!voiceEngine) {
      this.#onError(createVoiceEngineNotConfiguredError())
      return false
    }

    const speech = ++this.#speech
    voiceEngine.stop()
    this.#setSpeaking(true)

    try {
      await voiceEngine.speak(text)
      return true
    } catch (error) {
      this.#onError(error)
      return false
    } finally {
      if (run === this.#run && speech === this.#speech) {
        this.#setSpeaking(false)
      }
    }
  }

  #setSpeaking(speaking: boolean): void {
    if (this.#speaking === speaking) {
      return
    }

    this.#speaking = speaking
    this.#onSpeakingChange(speaking)
  }
}

function createVoiceEngineNotConfiguredError(): Error {
  return new Error('Orbz voiceEngine must be configured before startTalking().')
}
