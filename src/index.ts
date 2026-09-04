export type {
  OrbzBaseOptions,
  OrbzColorOverrides,
  OrbzColorSelection,
  OrbzColors,
  OrbzCustomColorOptions,
  OrbzOptions,
  OrbzPresetName,
  OrbzPresetOptions,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@core/appearance/appearance.types'
export { mergeOrbzColors } from '@core/appearance/merge-colors.compute'
export {
  config,
  DEFAULT_ORBZ_COLORS,
  DEFAULT_ORBZ_PRESET,
  DEFAULT_ORBZ_REDUCED_MOTION,
  DEFAULT_ORBZ_SIZE,
  DEFAULT_ORBZ_SPEED,
  DEFAULT_ORBZ_STATE,
  ORBZ_COLOR_ATTRIBUTES,
  ORBZ_COLOR_KEYS,
  ORBZ_PRESET_NAMES,
  ORBZ_PRESETS,
  ORBZ_REDUCED_MOTION_MODES,
  ORBZ_STATES
} from '@core/config.data'
export { isOrbzPresetName } from '@core/lib/is-preset-name.guard'
export { isOrbzState } from '@core/lib/is-state.guard'
export { normalizeOrbzPreset } from '@core/lib/normalize-preset.compute'
export { normalizeOrbzReducedMotion } from '@core/lib/normalize-reduced-motion.compute'
export { normalizeOrbzSize } from '@core/lib/normalize-size.compute'
export { normalizeOrbzSpeed } from '@core/lib/normalize-speed.compute'
export { normalizeOrbzState } from '@core/lib/normalize-state.compute'
export { isOrbzReducedMotion } from '@core/motion/is-reduced-motion.guard'
export { ORBZ_OBSERVED_ATTRIBUTES, ORBZ_TAG_NAME } from '@element/element.data'
export type {
  OrbzElement,
  OrbzElementConstructor,
  OrbzVoiceOptions
} from '@element/element.types'
export { orbzElementClassFactory } from '@factories/element-class.factory'
export type { OrbzIntelligencePort } from '@ports/intelligence.port'
export type { OrbzVoiceEnginePort } from '@ports/voice-engine.port'
export { defineOrbz } from '@services/registration.service'
export { OpenAISpeechAdapter } from '@talk/openai-speech.adapter'
export { DEFAULT_SPEECH_LANGUAGE, DEFAULT_TALK_FLOW, talk } from '@talk/talk.data'
export type {
  OpenAISpeechAdapterOptions,
  OpenAISpeechFormat,
  OpenAISpeechModel,
  OpenAISpeechVoice,
  OrbzTalkContext,
  OrbzTalkStep,
  WebSpeechAdapterOptions
} from '@talk/talk.types'
export { WebSpeechAdapter } from '@talk/web-speech.adapter'
