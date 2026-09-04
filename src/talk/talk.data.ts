import type { OrbzTalkStep } from './talk.types'

export const DEFAULT_SPEECH_LANGUAGE = 'pt-BR' as const

/**
 * Orbz ships without product copy. Consumers may provide an explicit talk flow,
 * but the package never invents a greeting, persona, or fallback conversation.
 */
export const talk = Object.freeze({} satisfies Record<string, OrbzTalkStep>)

const emptyTalkFlow: OrbzTalkStep[] = []
export const DEFAULT_TALK_FLOW: readonly OrbzTalkStep[] = Object.freeze(emptyTalkFlow)
