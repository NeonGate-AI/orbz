import { orbzConfiguration } from '@core/config.data'
import type { OrbzConversationPort } from '@ports/conversation.port'
import type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
import { OpenAIRealtimeAdapter } from '@talk/openai-realtime.adapter'
import { OpenAISpeechAdapter } from '@talk/openai-speech.adapter'
import type { OrbzRealtimeSession, OrbzVoiceModel } from '@talk/voice-model.types'
import { WebSpeechAdapter } from '@talk/web-speech.adapter'

/** Resolve only at element construction; explicitly clearing a selection stays cleared. */
export function createDefaultOrbzVoiceModel(): Readonly<OrbzVoiceModel> | undefined {
  const provider = orbzConfiguration.speech.defaultVoiceModel
  if (provider === 'web-speech' || provider === 'openai-realtime') {
    return Object.freeze({ provider })
  }
  // OpenAI speech requires the application's endpoint. A JSON selector cannot
  // supply it, so remain unset until the consumer assigns a complete voiceModel.
  return undefined
}

/** Resolution creates inert adapters; activation belongs to explicit start methods. */
export function createOrbzVoiceEngine(
  model: Readonly<OrbzVoiceModel> | undefined
): OrbzVoiceEnginePort | undefined {
  switch (model?.provider) {
    case 'web-speech':
      return new WebSpeechAdapter(model)
    case 'openai-speech':
      return new OpenAISpeechAdapter(model)
    default:
      return undefined
  }
}

export function createOrbzConversation(
  model: Readonly<OrbzVoiceModel> | undefined,
  session: OrbzRealtimeSession | undefined
): OrbzConversationPort {
  if (model?.provider !== 'openai-realtime') {
    throw new Error('Orbz startConversation() requires a Realtime voiceModel.')
  }
  if (!session) {
    throw new Error('Orbz realtimeSession must be configured before startConversation().')
  }
  return new OpenAIRealtimeAdapter({ ...model, session })
}
