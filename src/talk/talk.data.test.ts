import { describe, expect, it } from 'vitest'

import { DEFAULT_SPEECH_LANGUAGE, DEFAULT_TALK_FLOW, talk } from './talk.data'

describe('talk/defaults', () => {
  it('defaults synthesis to pt-BR and packages no conversation copy', () => {
    expect(DEFAULT_SPEECH_LANGUAGE).toBe('pt-BR')
    expect(DEFAULT_TALK_FLOW).toEqual([])
    expect(talk).toEqual({})
  })
})
