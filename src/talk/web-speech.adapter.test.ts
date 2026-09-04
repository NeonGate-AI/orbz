import { WebSpeechAdapter } from '@talk/web-speech.adapter'
import { afterEach, describe, expect, it, vi } from 'vitest'

class FakeSpeechSynthesisUtterance extends EventTarget {
  lang = ''
  pitch = 1
  rate = 1
  readonly text: string
  voice: SpeechSynthesisVoice | null = null
  volume = 1

  constructor(text: string) {
    super()
    this.text = text
  }
}

function voice(name: string, lang: string): SpeechSynthesisVoice {
  return {
    default: false,
    lang,
    localService: false,
    name,
    voiceURI: `${lang}:${name}`
  }
}

function installSpeechSynthesis(voices: readonly SpeechSynthesisVoice[]) {
  let utterance: FakeSpeechSynthesisUtterance | undefined
  const synthesis = {
    cancel: vi.fn(),
    getVoices: vi.fn(() => [...voices]),
    paused: false,
    pause: vi.fn(),
    pending: false,
    resume: vi.fn(),
    speak: vi.fn((value: FakeSpeechSynthesisUtterance) => {
      utterance = value
      value.dispatchEvent(new Event('start'))
      value.dispatchEvent(new Event('end'))
    }),
    speaking: false
  }

  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    FakeSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance
  )
  vi.stubGlobal('speechSynthesis', synthesis as unknown as SpeechSynthesis)

  return {
    get utterance() {
      return utterance
    },
    synthesis
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('talk/web-speech-adapter', () => {
  it('uses pt-BR and a Brazilian Portuguese voice by default', async () => {
    const portugueseVoice = voice('Google português do Brasil', 'pt-BR')
    const englishVoice = voice('Google US English', 'en-US')
    const speech = installSpeechSynthesis([englishVoice, portugueseVoice])
    const adapter = new WebSpeechAdapter({ voiceLoadTimeoutMs: 0 })

    await adapter.speak('Olá.')

    expect(speech.utterance?.lang).toBe('pt-BR')
    expect(speech.utterance?.voice).toBe(portugueseVoice)
  })

  it('allows consumers to select English explicitly', async () => {
    const portugueseVoice = voice('Google português do Brasil', 'pt-BR')
    const englishVoice = voice('Google US English', 'en-US')
    const speech = installSpeechSynthesis([portugueseVoice, englishVoice])
    const adapter = new WebSpeechAdapter({
      language: 'en-US',
      preferredVoices: ['Google US English'],
      voiceLoadTimeoutMs: 0
    })

    await adapter.speak('Hello.')

    expect(speech.utterance?.lang).toBe('en-US')
    expect(speech.utterance?.voice).toBe(englishVoice)
  })
})
