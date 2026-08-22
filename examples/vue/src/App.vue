<script setup lang="ts">
import {
  ORBZ_PRESET_NAMES,
  ORBZ_PRESETS,
  type OrbzColors,
  type OrbzPresetName,
  type OrbzReducedMotion,
  type OrbzState,
} from "@neongate-ai/orbz";
import { reactive, ref } from "vue";

type ColorKey = keyof OrbzColors;

const states: readonly OrbzState[] = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "asleep",
];

const colorControls: ReadonlyArray<{ key: ColorKey; label: string }> = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "highlight", label: "Highlight" },
  { key: "background", label: "Core" },
];

const defaultPreset = "neongate" satisfies OrbzPresetName;
const presetNames = ORBZ_PRESET_NAMES;

const state = ref<OrbzState>("idle");
const size = ref(300);
const speed = ref(1);
const paused = ref(false);
const elevated = ref(false);
const reducedMotion = ref<OrbzReducedMotion>("system");
const activePreset = ref<OrbzPresetName | null>(defaultPreset);
const colors = reactive<OrbzColors>({ ...ORBZ_PRESETS[defaultPreset] });

function applyPreset(name: OrbzPresetName): void {
  activePreset.value = name;
  Object.assign(colors, ORBZ_PRESETS[name]);
}

function setColor(key: ColorKey, event: Event): void {
  activePreset.value = null;
  colors[key] = (event.target as HTMLInputElement).value;
}

function formatPresetName(name: OrbzPresetName): string {
  return name === "neongate"
    ? "NeonGate"
    : `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

function reset(): void {
  state.value = "idle";
  size.value = 300;
  speed.value = 1;
  paused.value = false;
  elevated.value = false;
  reducedMotion.value = "system";
  applyPreset(defaultPreset);
}
</script>

<template>
  <main class="shell">
    <header class="hero">
      <a class="brand" href="https://github.com/NeonGate-AI/orbz">
        <span class="brand-mark" aria-hidden="true"></span>
        orbz
      </a>
      <span class="framework-badge">Vue Example</span>
    </header>

    <section class="playground" aria-labelledby="playground-title">
      <div class="stage">
        <div class="stage-copy">
          <h1 id="playground-title">One voice component. Every framework.</h1>
          <p class="lede">
            One <code>&lt;orb-z&gt;</code>, controlled directly from a standalone
            web-component.
          </p>
        </div>

        <div class="orb-frame">
          <div class="orb-glow" aria-hidden="true"></div>
          <orb-z
            :state="state"
            :size="`${size}px`"
            :speed="speed"
            :paused="paused"
            :elevated="elevated"
            :reduced-motion="reducedMotion"
            :preset="activePreset"
            :color-primary="activePreset === null ? colors.primary : null"
            :color-secondary="activePreset === null ? colors.secondary : null"
            :color-accent="activePreset === null ? colors.accent : null"
            :color-highlight="activePreset === null ? colors.highlight : null"
            :color-background="activePreset === null ? colors.background : null"
            :aria-label="`Assistant is ${state}`"
          ></orb-z>
        </div>

        <div class="now-playing" aria-live="polite">
          <span class="status-dot" aria-hidden="true"></span>
          <span>Assistant is {{ paused ? "paused" : state }}</span>
          <span class="status-meta">{{ size }} px · {{ speed.toFixed(2) }}×</span>
        </div>
      </div>

      <aside class="controls" aria-label="Orbz controls">
        <div class="controls-heading">
          <div>
            <p class="eyebrow">Live controls</p>
            <h2>Tune the behavior</h2>
          </div>
          <button class="icon-button" type="button" @click="reset">Speak</button>
        </div>

        <fieldset class="control-group">
          <legend>State</legend>
          <div class="segmented">
            <button
              v-for="item in states"
              :key="item"
              type="button"
              :aria-pressed="state === item"
              @click="state = item"
            >
              {{ item.charAt(0).toUpperCase() + item.slice(1) }}
            </button>
          </div>
        </fieldset>

        <div class="range-grid">
          <label class="control-group">
            <span class="label-row">
              <span>Orb size</span>
              <output>{{ size }} px</output>
            </span>
            <input v-model.number="size" type="range" min="160" max="420" step="4" />
          </label>

          <label class="control-group">
            <span class="label-row">
              <span>Motion speed</span>
              <output>{{ speed.toFixed(2) }}×</output>
            </span>
            <input v-model.number="speed" type="range" min="0.25" max="2.5" step="0.05" />
          </label>
        </div>

        <div class="switch-row">
          <div>
            <strong>Pause motion</strong>
            <span>Keep the current visual state</span>
          </div>
          <button
            class="switch"
            type="button"
            role="switch"
            :aria-checked="paused"
            aria-label="Pause Orbz animation"
            @click="paused = !paused"
          ><span></span></button>
        </div>

        <div class="switch-row">
          <div>
            <strong>Elevated</strong>
            <span>Add a subtle, centered shadow</span>
          </div>
          <button
            class="switch"
            type="button"
            role="switch"
            :aria-checked="elevated"
            aria-label="Elevate Orbz"
            @click="elevated = !elevated"
          ><span></span></button>
        </div>

        <label class="select-control">
          <span>
            <strong>Reduced motion</strong>
            <small>Respect accessibility preferences</small>
          </span>
          <select v-model="reducedMotion" aria-label="Reduced motion preference">
            <option value="system">System</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </label>

        <fieldset class="control-group preset-group">
          <legend>Preset</legend>
          <div class="preset-options" aria-label="Color presets">
            <button
              v-for="name in presetNames"
              :key="name"
              type="button"
              :aria-pressed="activePreset === name"
              @click="applyPreset(name)"
            >
              {{ formatPresetName(name) }}
            </button>
          </div>
        </fieldset>

        <fieldset class="control-group custom-palette">
          <legend>Custom palette</legend>
          <div class="color-grid">
            <label v-for="color in colorControls" :key="color.key">
              <input
                :value="colors[color.key]"
                type="color"
                :aria-label="`${color.label} color`"
                @input="setColor(color.key, $event)"
              />
              <span>{{ color.label }}</span>
            </label>
          </div>
        </fieldset>
      </aside>
    </section>

    <footer>Framework-native controls · Shadow DOM isolation · No adapter required</footer>
  </main>
</template>
