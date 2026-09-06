import type {
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@core/appearance/appearance.types'
import type { OrbzIntelligencePort } from '@ports/intelligence.port'
import type { OrbzConversationState } from '@ports/conversation.port'
import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
import type { OrbzTalkContext, OrbzTalkStep } from '@talk/talk.types'
import type { OrbzRealtimeSession, OrbzVoiceModel } from '@talk/voice-model.types'

export interface OrbzAnimationLayers {
  aura: HTMLElement
  core: HTMLElement
  field: HTMLElement
  highlight: HTMLElement
  ring: HTMLElement
  root: HTMLElement
}

export interface OrbzAnimationSettings {
  paused: boolean
  reduced: boolean
  speed: number
  state: OrbzState
}

export interface OrbzShadowTree {
  layers: OrbzAnimationLayers
  root: HTMLElement
}

export interface OrbzVoiceOptions {
  intelligence?: OrbzIntelligencePort
  talkFlow?: readonly OrbzTalkStep[]
  speech?: string
  voiceEngine?: OrbzVoiceEnginePort
  voiceModel?: OrbzVoiceModel
  realtimeSession?: OrbzRealtimeSession
}

export interface OrbzElement extends HTMLElement {
  readonly conversationState: OrbzConversationState
  elevated: boolean
  intelligence: OrbzIntelligencePort | undefined
  paused: boolean
  get preset(): OrbzPresetName
  set preset(value: OrbzPresetName | null | undefined)
  reducedMotion: OrbzReducedMotion
  size: OrbzSize
  get speech(): string | undefined
  set speech(value: string | null | undefined)
  speed: number
  state: OrbzState
  readonly talkContext: Readonly<OrbzTalkContext>
  get talkFlow(): readonly OrbzTalkStep[]
  set talkFlow(value: readonly OrbzTalkStep[] | undefined)
  get voiceEngine(): OrbzVoiceEnginePort | undefined
  set voiceEngine(value: OrbzVoiceEnginePort | undefined)
  /** Public model options only; this property is not reflected into attributes. */
  get voiceModel(): Readonly<OrbzVoiceModel> | undefined
  set voiceModel(value: OrbzVoiceModel | null | undefined)
  /** Application authorization boundary; never pass provider keys or tokens. */
  get realtimeSession(): OrbzRealtimeSession | undefined
  set realtimeSession(value: OrbzRealtimeSession | undefined)
  pause(): void
  play(): void
  receive(input: string): Promise<void>
  restart(): void
  startTalking(): Promise<void>
  stopTalking(): void
  startConversation(): Promise<void>
  stopConversation(): void
  interruptConversation(): void
}

export type OrbzElementConstructor = CustomElementConstructor & {
  new (): OrbzElement
  readonly observedAttributes: readonly string[]
  readonly prototype: OrbzElement
}
