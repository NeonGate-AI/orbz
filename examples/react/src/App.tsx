import { useState } from "react";
import {
  ORBZ_PRESET_NAMES,
  ORBZ_PRESETS,
  type OrbzColors,
  type OrbzPresetName,
  type OrbzReducedMotion,
  type OrbzState,
} from "@neongate-ai/orbz";
import "@neongate-ai/orbz/browser";

const STATES: readonly OrbzState[] = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "asleep",
];

const PRESET_LABELS: Readonly<Record<OrbzPresetName, string>> = {
  neongate: "NeonGate",
  periwinkle: "Periwinkle",
  magenta: "Magenta",
  peach: "Peach",
  mocha: "Mocha",
  ivory: "Ivory",
};

type ColorKey = keyof OrbzColors;

const COLOR_LABELS: Readonly<Record<ColorKey, string>> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  highlight: "Highlight",
  background: "Core",
};

const COLOR_KEYS = Object.keys(COLOR_LABELS) as ColorKey[];

export function App() {
  const [state, setState] = useState<OrbzState>("idle");
  const [size, setSize] = useState(300);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [reducedMotion, setReducedMotion] =
    useState<OrbzReducedMotion>("system");
  const [colors, setColors] = useState<OrbzColors>(() => ({
    ...ORBZ_PRESETS.neongate,
  }));
  const [activePreset, setActivePreset] = useState<OrbzPresetName | null>(
    "neongate",
  );

  function applyPreset(name: OrbzPresetName): void {
    setColors({ ...ORBZ_PRESETS[name] });
    setActivePreset(name);
  }

  function updateColor(key: ColorKey, value: string): void {
    setColors((currentColors) => ({ ...currentColors, [key]: value }));
    setActivePreset(null);
  }

  function resetControls(): void {
    setState("idle");
    setSize(300);
    setSpeed(1);
    setPaused(false);
    setElevated(false);
    setReducedMotion("system");
    setColors({ ...ORBZ_PRESETS.neongate });
    setActivePreset("neongate");
  }

  return (
    <main className="shell">
      <header className="hero">
        <a className="brand" href="https://github.com/NeonGate-AI/orbz">
          <span className="brand-mark" aria-hidden="true" />
          orbz
        </a>
        <span className="framework-badge">React Example</span>
      </header>

      <section className="playground" aria-labelledby="playground-title">
        <div className="stage">
          <div className="stage-copy">
            <h1 id="playground-title">One voice component. Every framework.</h1>
            <p className="lede">
              One <code>&lt;orb-z&gt;</code>, controlled directly from a standalone
              web-component.
            </p>
          </div>

          <div className="orb-frame">
            <div className="orb-glow" aria-hidden="true" />
            <orb-z
              aria-label={`Assistant is ${paused ? "paused" : state}`}
              color-accent={activePreset === null ? colors.accent : undefined}
              color-background={
                activePreset === null ? colors.background : undefined
              }
              color-highlight={
                activePreset === null ? colors.highlight : undefined
              }
              color-primary={activePreset === null ? colors.primary : undefined}
              color-secondary={
                activePreset === null ? colors.secondary : undefined
              }
              elevated={elevated ? "" : undefined}
              paused={paused ? "" : undefined}
              preset={activePreset ?? undefined}
              reduced-motion={reducedMotion}
              size={`${size}px`}
              speed={String(speed)}
              state={state}
            />
          </div>

          <div className="now-playing" aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            <span>Assistant is {paused ? "paused" : state}</span>
            <span className="status-meta">
              {size} px · {speed.toFixed(2)}×
            </span>
          </div>
        </div>

        <aside className="controls" aria-label="Orbz controls">
          <div className="controls-heading">
            <div>
              <p className="eyebrow">Live controls</p>
              <h2>Tune the behavior</h2>
            </div>
            <button className="icon-button" type="button" onClick={resetControls}>
              Speak
            </button>
          </div>

          <fieldset className="control-group">
            <legend>State</legend>
            <div className="segmented">
              {STATES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={state === item}
                  onClick={() => setState(item)}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="range-grid">
            <label className="control-group" htmlFor="size">
              <span className="label-row">
                <span>Orb size</span>
                <output htmlFor="size">{size} px</output>
              </span>
              <input
                id="size"
                type="range"
                min="160"
                max="420"
                step="4"
                value={size}
                onChange={(event) => setSize(event.currentTarget.valueAsNumber)}
              />
            </label>

            <label className="control-group" htmlFor="speed">
              <span className="label-row">
                <span>Motion speed</span>
                <output htmlFor="speed">{speed.toFixed(2)}×</output>
              </span>
              <input
                id="speed"
                type="range"
                min="0.25"
                max="2.5"
                step="0.05"
                value={speed}
                onChange={(event) => setSpeed(event.currentTarget.valueAsNumber)}
              />
            </label>
          </div>

          <div className="switch-row">
            <div>
              <strong>Pause motion</strong>
              <span>Keep the current visual state</span>
            </div>
            <button
              className="switch"
              type="button"
              role="switch"
              aria-checked={paused}
              aria-label="Pause motion"
              onClick={() => setPaused((current) => !current)}
            >
              <span />
            </button>
          </div>

          <div className="switch-row">
            <div>
              <strong>Elevated</strong>
              <span>Add a subtle, centered shadow</span>
            </div>
            <button
              className="switch"
              type="button"
              role="switch"
              aria-checked={elevated}
              aria-label="Elevated"
              onClick={() => setElevated((current) => !current)}
            >
              <span />
            </button>
          </div>

          <label className="select-control" htmlFor="reduced-motion">
            <span>
              <strong>Reduced motion</strong>
              <small>Respect accessibility preferences</small>
            </span>
            <select
              id="reduced-motion"
              value={reducedMotion}
              onChange={(event) =>
                setReducedMotion(event.currentTarget.value as OrbzReducedMotion)
              }
            >
              <option value="system">System</option>
              <option value="always">Always</option>
              <option value="never">Never</option>
            </select>
          </label>

          <fieldset className="control-group preset-group">
            <legend>Preset</legend>
            <div className="preset-options" aria-label="Color presets">
              {ORBZ_PRESET_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={activePreset === name}
                  onClick={() => applyPreset(name)}
                >
                  {PRESET_LABELS[name]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="control-group custom-palette">
            <legend>Custom palette</legend>
            <div className="color-grid">
              {COLOR_KEYS.map((key) => (
                <label key={key}>
                  <input
                    type="color"
                    value={colors[key]}
                    aria-label={`${COLOR_LABELS[key]} color`}
                    onChange={(event) =>
                      updateColor(key, event.currentTarget.value)
                    }
                  />
                  <span>{COLOR_LABELS[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </aside>
      </section>

      <footer>Framework-native controls · Shadow DOM isolation · No adapter required</footer>
    </main>
  );
}
