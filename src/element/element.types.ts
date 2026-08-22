import type {
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@core/appearance.types'
import type { OrbzIntelligencePort } from '@ports/intelligence.port'
import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
import type { OrbzTalkContext, OrbzTalkStep } from '@talk/talk.types'

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
  voiceEngine?: OrbzVoiceEnginePort
}

export interface OrbzElement extends HTMLElement {
  elevated: boolean
  intelligence: OrbzIntelligencePort | undefined
  paused: boolean
  get preset(): OrbzPresetName
  set preset(value: OrbzPresetName | null | undefined)
  reducedMotion: OrbzReducedMotion
  size: OrbzSize
  speed: number
  state: OrbzState
  readonly talkContext: Readonly<OrbzTalkContext>
  get talkFlow(): readonly OrbzTalkStep[]
  set talkFlow(value: readonly OrbzTalkStep[] | undefined)
  get voiceEngine(): OrbzVoiceEnginePort
  set voiceEngine(value: OrbzVoiceEnginePort | undefined)
  pause(): void
  play(): void
  receive(input: string): Promise<void>
  restart(): void
  startTalking(): Promise<void>
  stopTalking(): void
}

export type OrbzElementConstructor = CustomElementConstructor & {
  new (): OrbzElement
  readonly observedAttributes: readonly string[]
  readonly prototype: OrbzElement
}
