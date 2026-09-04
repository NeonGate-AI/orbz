export interface OrbzVoiceEnginePort {
  speak(text: string): Promise<void>
  stop(): void
}
