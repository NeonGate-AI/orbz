# Voice and localization context

Speech is opt-in and owned by the consumer.

- `speech` contains the direct utterance text.
- `voiceEngine` provides `speak()` and `stop()`.
- `startTalking()` is the explicit activation boundary.
- Missing or blank `speech` produces no default utterance.
- Assigning `speech` or `voiceEngine` never starts playback automatically.

`WebSpeechAdapter` defaults to the BCP 47 language tag `pt-BR`. A consumer can
set another language, such as `en-US`, through adapter options. The OpenAI
adapter defaults to Brazilian Portuguese delivery instructions but accepts
consumer instructions.

Language selection is separate from translation. Orbz never translates supplied
copy and never invents missing copy. Applications own localized messages,
transcripts, captions, and language switching.
