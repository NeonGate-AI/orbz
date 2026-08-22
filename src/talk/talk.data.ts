import type { OrbzTalkStep } from '@talk/talk.types'

export const talk = Object.freeze({
  welcoming: Object.freeze({
    id: 'welcoming',
    kind: 'say',
    needsAuth: false,
    text: 'Hi, my name is Ana. How are you doing today?'
  }),
  askName: Object.freeze({
    capture: 'fullName',
    id: 'ask-name',
    kind: 'ask',
    needsAuth: false,
    text: 'Welcome to Neongate AI. I\'m here to help.'
  }),
  help: Object.freeze({
    id: 'help',
    kind: 'say',
    needsAuth: false,
    text: 'Okay, {{fullName}}. How can I help you today?'
  }),
  answer: Object.freeze({
    fallback: 'I am not able to answer that yet.',
    id: 'answer',
    kind: 'respond',
    needsAuth: false,
    strategy: 'openai'
  })
} satisfies Record<string, OrbzTalkStep>)

export const DEFAULT_TALK_FLOW = Object.freeze([
  talk.welcoming,
  talk.askName,
  talk.help,
  talk.answer
] satisfies readonly OrbzTalkStep[])
