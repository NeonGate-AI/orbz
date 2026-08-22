import type { OrbzIntelligencePort } from '@ports/intelligence.port'
import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
import { resolveTalkText } from '@talk/resolve-talk-text.compute'
import { DEFAULT_TALK_FLOW } from '@talk/talk.data'
import type { OrbzTalkContext, OrbzTalkStep } from '@talk/talk.types'

type SpeakingChangeHandler = (speaking: boolean) => void
type TalkErrorHandler = (error: unknown) => void

export class OrbzTalkRunnerService {
  #context: OrbzTalkContext = {}
  #flow: readonly OrbzTalkStep[] = DEFAULT_TALK_FLOW
  #intelligence: OrbzIntelligencePort | undefined
  #position = 0
  #run = 0
  #speech = 0
  readonly #onError: TalkErrorHandler
  readonly #onSpeakingChange: SpeakingChangeHandler
  #voiceEngine: OrbzVoiceEnginePort

  constructor(
    voiceEngine: OrbzVoiceEnginePort,
    onSpeakingChange: SpeakingChangeHandler,
    onError: TalkErrorHandler
  ) {
    this.#voiceEngine = voiceEngine
    this.#onSpeakingChange = onSpeakingChange
    this.#onError = onError
  }

  get context(): Readonly<OrbzTalkContext> {
    return Object.freeze({ ...this.#context })
  }

  set intelligence(value: OrbzIntelligencePort | undefined) {
    this.#intelligence = value
  }

  set voiceEngine(value: OrbzVoiceEnginePort) {
    this.#speech += 1
    this.#voiceEngine.stop()
    this.#onSpeakingChange(false)
    this.#voiceEngine = value
  }

  async start(
    flow: readonly OrbzTalkStep[] = DEFAULT_TALK_FLOW
  ): Promise<void> {
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
    this.#voiceEngine.stop()
    this.#onSpeakingChange(false)
  }

  async #advance(run: number): Promise<void> {
    while (run === this.#run) {
      const step = this.#flow[this.#position]
      if (!step || step.kind === 'respond') {
        return
      }

      const spoken = await this.#speak(
        resolveTalkText(step.text, this.#context),
        run
      )
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
        await this.#speak(
          normalizedResponse.length > 0 ? normalizedResponse : step.fallback,
          run
        )
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

    const speech = ++this.#speech
    this.#voiceEngine.stop()
    this.#onSpeakingChange(true)

    try {
      await this.#voiceEngine.speak(text)
      return true
    } catch (error) {
      this.#onError(error)
      return false
    } finally {
      if (run === this.#run && speech === this.#speech) {
        this.#onSpeakingChange(false)
      }
    }
  }
}
