export type OrbzConversationState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'

/** Text alternatives only; never raw provider events, SDP, or credentials. */
export interface OrbzTranscript {
  readonly role: 'user' | 'assistant'
  readonly text: string
  readonly final: boolean
  readonly itemId?: string
}

export interface OrbzConversationHandlers {
  onStateChange(state: OrbzConversationState): void
  onTranscript(transcript: OrbzTranscript): void
  onError(error: Error): void
}

/** A live audio session, separate from the speak(text) output-only port. */
export interface OrbzConversationPort {
  start(handlers: OrbzConversationHandlers): Promise<void>
  stop(): void
  interrupt(): void
}
