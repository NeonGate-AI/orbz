import { orbzConfiguration } from '@core/config.data'
import type { OrbzTalkContext } from '@talk/talk.types'

const talkTokenPattern = new RegExp(
  orbzConfiguration.speech.tokenPattern.source,
  orbzConfiguration.speech.tokenPattern.flags
)

export function resolveTalkText(
  text: string,
  context: Readonly<OrbzTalkContext>
): string {
  return text.replace(talkTokenPattern, (_token, key: string) => {
    return context[key] ?? ''
  })
}
