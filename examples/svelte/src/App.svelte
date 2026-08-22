<script lang="ts">
  import {
    ORBZ_PRESET_NAMES,
    ORBZ_PRESETS,
    type OrbzColors,
    type OrbzPresetName,
    type OrbzReducedMotion,
    type OrbzState,
  } from "@neongate-ai/orbz";

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

  let state = $state<OrbzState>("idle");
  let size = $state(300);
  let speed = $state(1);
  let paused = $state(false);
  let elevated = $state(false);
  let reducedMotion = $state<OrbzReducedMotion>("system");
  let activePreset = $state<OrbzPresetName | null>(defaultPreset);
  let colors = $state<OrbzColors>({ ...ORBZ_PRESETS[defaultPreset] });

  function setColor(key: ColorKey, value: string): void {
    activePreset = null;
    colors = { ...colors, [key]: value };
  }

  function applyPreset(name: OrbzPresetName): void {
    activePreset = name;
    colors = { ...ORBZ_PRESETS[name] };
  }

  function formatPresetName(name: OrbzPresetName): string {
    return name === "neongate"
      ? "NeonGate"
      : `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  }

  function reset(): void {
    state = "idle";
    size = 300;
    speed = 1;
    paused = false;
    elevated = false;
    reducedMotion = "system";
    applyPreset(defaultPreset);
  }
</script>

<svelte:head>
  <meta name="theme-color" content="#070810" />
</svelte:head>

<main class="shell">
  <header class="hero">
    <a class="brand" href="https://github.com/NeonGate-AI/orbz">
      <span class="brand-mark" aria-hidden="true"></span>
      orbz
    </a>
    <span class="framework-badge">Svelte Example</span>
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
          {state}
          size={`${size}px`}
          {speed}
          {paused}
          {elevated}
          reduced-motion={reducedMotion}
          preset={activePreset ?? undefined}
          color-primary={activePreset === null ? colors.primary : undefined}
          color-secondary={activePreset === null ? colors.secondary : undefined}
          color-accent={activePreset === null ? colors.accent : undefined}
          color-highlight={activePreset === null ? colors.highlight : undefined}
          color-background={activePreset === null ? colors.background : undefined}
          aria-label={`Assistant is ${state}`}
        ></orb-z>
      </div>

      <div class="now-playing" aria-live="polite">
        <span class="status-dot" aria-hidden="true"></span>
        <span>Assistant is {paused ? "paused" : state}</span>
        <span class="status-meta">{size} px · {speed.toFixed(2)}×</span>
      </div>
    </div>

    <aside class="controls" aria-label="Orbz controls">
      <div class="controls-heading">
        <div>
          <p class="eyebrow">Live controls</p>
          <h2>Tune the behavior</h2>
        </div>
        <button class="icon-button" type="button" onclick={reset}>Speak</button>
      </div>

      <fieldset class="control-group">
        <legend>State</legend>
        <div class="segmented">
          {#each states as item}
            <button
              type="button"
              aria-pressed={state === item}
              onclick={() => (state = item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          {/each}
        </div>
      </fieldset>

      <div class="range-grid">
        <label class="control-group">
          <span class="label-row">
            <span>Orb size</span>
            <output>{size} px</output>
          </span>
          <input bind:value={size} type="range" min="160" max="420" step="4" />
        </label>

        <label class="control-group">
          <span class="label-row">
            <span>Motion speed</span>
            <output>{speed.toFixed(2)}×</output>
          </span>
          <input bind:value={speed} type="range" min="0.25" max="2.5" step="0.05" />
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
          aria-checked={paused}
          aria-label="Pause Orbz animation"
          onclick={() => (paused = !paused)}
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
          aria-checked={elevated}
          aria-label="Elevate Orbz"
          onclick={() => (elevated = !elevated)}
        ><span></span></button>
      </div>

      <label class="select-control">
        <span>
          <strong>Reduced motion</strong>
          <small>Respect accessibility preferences</small>
        </span>
        <select bind:value={reducedMotion} aria-label="Reduced motion preference">
          <option value="system">System</option>
          <option value="always">Always</option>
          <option value="never">Never</option>
        </select>
      </label>

      <fieldset class="control-group preset-group">
        <legend>Preset</legend>
        <div class="preset-options" aria-label="Color presets">
          {#each presetNames as name}
            <button
              type="button"
              aria-pressed={activePreset === name}
              onclick={() => applyPreset(name)}
            >
              {formatPresetName(name)}
            </button>
          {/each}
        </div>
      </fieldset>

      <fieldset class="control-group custom-palette">
        <legend>Custom palette</legend>
        <div class="color-grid">
          {#each colorControls as color}
            <label>
              <input
                type="color"
                value={colors[color.key]}
                aria-label={`${color.label} color`}
                oninput={(event) =>
                  setColor(
                    color.key,
                    (event.currentTarget as HTMLInputElement).value,
                  )}
              />
              <span>{color.label}</span>
            </label>
          {/each}
        </div>
      </fieldset>
    </aside>
  </section>

  <footer>Framework-native controls · Shadow DOM isolation · No adapter required</footer>
</main>
