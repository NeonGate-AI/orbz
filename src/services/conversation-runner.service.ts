import type {
  OrbzConversationHandlers,
  OrbzConversationPort,
  OrbzConversationState
} from '@ports/conversation.port'

/** Owns session supersession independently of a provider or DOM implementation. */
export class OrbzConversationRunnerService {
  readonly #handlers: OrbzConversationHandlers
  #conversation: OrbzConversationPort | undefined
  #run = 0
  #state: OrbzConversationState = 'idle'

  constructor(handlers: OrbzConversationHandlers) {
    this.#handlers = handlers
  }

  get state(): OrbzConversationState {
    return this.#state
  }

  async start(conversation: OrbzConversationPort): Promise<void> {
    this.stop()
    const run = ++this.#run
    this.#conversation = conversation
    let reportedError = false
    try {
      await conversation.start({
        onStateChange: (state) => {
          if (run === this.#run) {
            this.#setState(state)
          }
        },
        onTranscript: (transcript) => {
          if (run === this.#run) {
            this.#handlers.onTranscript(transcript)
          }
        },
        onError: (error) => {
          if (run === this.#run && !reportedError) {
            reportedError = true
            this.#handlers.onError(error)
          }
        }
      })
    } catch (error) {
      if (run !== this.#run) {
        return
      }
      // Retire the failed run before cleanup, which may itself emit callbacks.
      this.#run += 1
      this.#conversation = undefined
      conversation.stop()
      this.#setState('error')
      if (!reportedError) {
        const safe = new Error('Orbz conversation could not start.')
        this.#handlers.onError(safe)
        throw safe
      }
      throw error
    }
  }

  stop(): void {
    this.#run += 1
    this.#conversation?.stop()
    this.#conversation = undefined
    this.#setState('idle')
  }

  interrupt(): void {
    this.#conversation?.interrupt()
  }

  #setState(state: OrbzConversationState): void {
    if (this.#state !== state) {
      this.#state = state
      this.#handlers.onStateChange(state)
    }
  }
}
