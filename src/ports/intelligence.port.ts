import type { OrbzTalkContext } from '@talk/talk.types'

export interface OrbzIntelligencePort {
  respond(
    input: string,
    context: Readonly<OrbzTalkContext>
  ): Promise<string>
}
