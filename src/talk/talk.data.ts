import { orbzConfiguration } from '@core/config.data'

import type { OrbzTalkStep } from './talk.types'

export const DEFAULT_SPEECH_LANGUAGE = orbzConfiguration.speech.webSpeech.language

/**
 * Orbz ships without product copy. Consumers may provide an explicit talk flow,
 * but the package never invents a greeting, persona, or fallback conversation.
 */
export const talk: Readonly<Record<string, OrbzTalkStep>> = orbzConfiguration.speech.talk

export const DEFAULT_TALK_FLOW: readonly OrbzTalkStep[] = orbzConfiguration.speech.defaultTalkFlow
