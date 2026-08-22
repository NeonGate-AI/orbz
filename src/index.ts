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
} from '@core/appearance.types'
export {
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
  ORBZ_STATES,
  config
} from '@core/config.data'
export { isOrbzPresetName } from '@core/is-preset-name.guard'
export { isOrbzReducedMotion } from '@core/is-reduced-motion.guard'
export { isOrbzState } from '@core/is-state.guard'
export { mergeOrbzColors } from '@core/merge-colors.compute'
export { normalizeOrbzPreset } from '@core/normalize-preset.compute'
export {
  normalizeOrbzReducedMotion
} from '@core/normalize-reduced-motion.compute'
export { normalizeOrbzSize } from '@core/normalize-size.compute'
export { normalizeOrbzSpeed } from '@core/normalize-speed.compute'
export { normalizeOrbzState } from '@core/normalize-state.compute'
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
export { DEFAULT_TALK_FLOW, talk } from '@talk/talk.data'
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
