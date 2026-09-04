import styles from 'virtual:orbz-styles'

import {
  DEFAULT_ORBZ_COLORS,
  DEFAULT_ORBZ_SIZE,
  DEFAULT_ORBZ_STATE,
  ORBZ_COLOR_KEYS
} from '@core/config.data'
import { ORBZ_APPEARANCE_BY_STATE } from '@core/motion/motion.data'
import type { OrbzAnimationLayers, OrbzShadowTree } from '@element/element.types'

export function orbzShadowTreeFactory(shadowRoot: ShadowRoot, document: Document): OrbzShadowTree {
  const style = document.createElement('style')
  style.textContent = styles

  const root = createLayer(document, 'div', 'orbz-root', 'root')
  root.setAttribute('aria-hidden', 'true')
  seedDefaultStyles(root)

  const aura = createLayer(document, 'span', 'orbz-aura', 'aura')
  const ring = createLayer(document, 'span', 'orbz-ring', 'ring')
  const sphere = createLayer(document, 'span', 'orbz-sphere')
  const field = createLayer(document, 'span', 'orbz-field', 'field')
  const texture = createLayer(document, 'span', 'orbz-texture')
  const core = createLayer(document, 'span', 'orbz-core', 'core')
  const highlight = createLayer(document, 'span', 'orbz-highlight', 'highlight')

  sphere.append(field, texture, core, highlight)
  root.append(aura, ring, sphere)
  shadowRoot.append(style, root)

  const layers: OrbzAnimationLayers = {
    aura,
    core,
    field,
    highlight,
    ring,
    root
  }

  return { layers, root }
}

function seedDefaultStyles(root: HTMLElement): void {
  for (const key of ORBZ_COLOR_KEYS) {
    root.style.setProperty(`--orbz-${key}`, DEFAULT_ORBZ_COLORS[key])
  }

  const appearance = ORBZ_APPEARANCE_BY_STATE[DEFAULT_ORBZ_STATE]
  root.style.setProperty('--orbz-contrast', String(appearance.contrast))
  root.style.setProperty('--orbz-saturation', String(appearance.saturation))
  root.style.setProperty('--orbz-size', DEFAULT_ORBZ_SIZE)
}

function createLayer<K extends keyof HTMLElementTagNameMap>(
  document: Document,
  tagName: K,
  className: string,
  layerName?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  element.className = className

  if (layerName) {
    element.dataset.layer = layerName
  }

  return element
}
