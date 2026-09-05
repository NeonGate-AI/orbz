import type {
  OpenAISpeechFormat,
  OpenAISpeechModel,
  OpenAISpeechVoice,
  WebSpeechAdapterOptions
} from './talk.types'

export interface OrbzWebSpeechVoiceModel extends WebSpeechAdapterOptions {
  provider: 'web-speech'
}

/** The endpoint belongs to the application and returns audio, never a provider key. */
export interface OrbzOpenAISpeechVoiceModel {
  provider: 'openai-speech'
  endpoint: string | URL
  model?: OpenAISpeechModel
  voice?: OpenAISpeechVoice
  responseFormat?: OpenAISpeechFormat
  requestTimeoutMs?: number
}

export type OpenAIRealtimeModel = 'gpt-realtime-2' | (string & {})

export interface OrbzOpenAIRealtimeVoiceModel {
  provider: 'openai-realtime'
  model?: OpenAIRealtimeModel
  voice?: string
  sessionTimeoutMs?: number
}

/** Assigning a selection is silent; only an explicit start method activates it. */
export type OrbzVoiceModel =
  | OrbzWebSpeechVoiceModel
  | OrbzOpenAISpeechVoiceModel
  | OrbzOpenAIRealtimeVoiceModel

export interface OrbzRealtimeSessionRequest {
  readonly sdp: string
  readonly model: string
  readonly voice: string
  readonly signal: AbortSignal
}

/** The application authorizes a session on its server and returns the SDP answer. */
export type OrbzRealtimeSessionAuthorizer = (request: OrbzRealtimeSessionRequest) => Promise<string>

export interface OrbzRealtimeSessionEndpoint {
  /** POST receives JSON {sdp, model, voice}; return application/sdp text. */
  endpoint: string | URL
  credentials?: RequestCredentials
  fetch?: typeof globalThis.fetch
}

/** Runtime authorization is deliberately separate from JSON/model selection. */
export type OrbzRealtimeSession = OrbzRealtimeSessionAuthorizer | OrbzRealtimeSessionEndpoint

export interface OpenAIRealtimeAdapterOptions {
  session: OrbzRealtimeSession
  model?: OpenAIRealtimeModel
  voice?: string
  sessionTimeoutMs?: number
}
