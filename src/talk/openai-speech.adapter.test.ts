import { OpenAISpeechAdapter } from '@talk/openai-speech.adapter'
import { describe, expect, it, vi } from 'vitest'

describe('talk/openai-speech-adapter', () => {
  it('sends Brazilian Portuguese delivery instructions by default', async () => {
    const fetch = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
      return new Response('provider unavailable', { status: 503 })
    })
    const adapter = new OpenAISpeechAdapter({
      endpoint: '/api/speech',
      fetch
    })

    await expect(adapter.speak('Olá.')).rejects.toThrow('OpenAI speech endpoint failed with 503')

    const request = fetch.mock.calls[0]?.[1]
    const body = JSON.parse(String(request?.body)) as Record<string, unknown>
    expect(body.input).toBe('Olá.')
    expect(body.instructions).toContain('português do Brasil')
  })

  it('allows English delivery instructions to be supplied explicitly', async () => {
    const fetch = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
      return new Response('provider unavailable', { status: 503 })
    })
    const adapter = new OpenAISpeechAdapter({
      endpoint: '/api/speech',
      fetch,
      instructions: 'Speak in clear American English.'
    })

    await expect(adapter.speak('Hello.')).rejects.toThrow()

    const request = fetch.mock.calls[0]?.[1]
    const body = JSON.parse(String(request?.body)) as Record<string, unknown>
    expect(body.instructions).toBe('Speak in clear American English.')
  })
})
