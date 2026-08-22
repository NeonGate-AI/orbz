import type { OrbzTalkContext } from '@talk/talk.types'

const TALK_TOKEN_PATTERN = /\{\{([a-zA-Z][a-zA-Z0-9]*)\}\}/g

export function resolveTalkText(
  text: string,
  context: Readonly<OrbzTalkContext>
): string {
  return text.replace(TALK_TOKEN_PATTERN, (_token, key: string) => {
    return context[key] ?? ''
  })
}
