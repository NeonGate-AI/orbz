import { afterEach, describe, expect, it, vi } from 'vitest'

import { OpenAIRealtimeAdapter } from './openai-realtime.adapter'

describe('talk/openai-realtime-adapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('releases microphone permission granted after startup cancellation without authorizing', async () => {
    let grantPermission: (stream: MediaStream) => void = () => {}
    const permission = new Promise<MediaStream>((resolve) => {
      grantPermission = resolve
    })
    const getUserMedia = vi.fn(() => permission)
    const channel = { close: vi.fn() }
    const peer = { createDataChannel: vi.fn(() => channel), close: vi.fn() }
    const audio = { pause: vi.fn(), removeAttribute: vi.fn(), srcObject: null }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })
    vi.stubGlobal(
      'RTCPeerConnection',
      class {
        createDataChannel = peer.createDataChannel
        close = peer.close
      }
    )
    vi.stubGlobal(
      'Audio',
      class {
        pause = audio.pause
        removeAttribute = audio.removeAttribute
        srcObject = null
      }
    )
    const authorize = vi.fn(async () => 'v=0\r\n')
    const handlers = { onStateChange: vi.fn(), onTranscript: vi.fn(), onError: vi.fn() }
    const adapter = new OpenAIRealtimeAdapter({ session: authorize })

    expect(getUserMedia).not.toHaveBeenCalled()
    const startup = adapter.start(handlers)
    adapter.stop()
    await startup
    const stop = vi.fn()
    grantPermission({ getTracks: () => [{ stop }] } as unknown as MediaStream)
    await permission

    expect(stop).toHaveBeenCalledOnce()
    expect(peer.close).toHaveBeenCalledOnce()
    expect(channel.close).toHaveBeenCalledOnce()
    expect(audio.pause).toHaveBeenCalledOnce()
    expect(authorize).not.toHaveBeenCalled()
    expect(handlers.onError).not.toHaveBeenCalled()
    expect(handlers.onStateChange.mock.calls).toEqual([['connecting'], ['idle']])
  })
})
