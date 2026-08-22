import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import type {
  OrbzColors,
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzState,
} from "@neongate-ai/orbz";
import { ORBZ_PRESET_NAMES, ORBZ_PRESETS } from "@neongate-ai/orbz";

const DEFAULT_PRESET = "neongate" satisfies OrbzPresetName;

type ColorKey = keyof OrbzColors;

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  readonly presetNames = ORBZ_PRESET_NAMES;

  readonly states: readonly OrbzState[] = [
    "idle",
    "listening",
    "thinking",
    "speaking",
    "asleep",
  ];

  readonly colorControls: ReadonlyArray<{ key: ColorKey; label: string }> = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "accent", label: "Accent" },
    { key: "highlight", label: "Highlight" },
    { key: "background", label: "Core" },
  ];

  state: OrbzState = "idle";
  size = 300;
  speed = 1;
  paused = false;
  elevated = false;
  reducedMotion: OrbzReducedMotion = "system";
  colors: OrbzColors = { ...ORBZ_PRESETS[DEFAULT_PRESET] };
  activePreset: OrbzPresetName | null = DEFAULT_PRESET;

  get statusText(): string {
    return `Assistant is ${this.paused ? "paused" : this.state}`;
  }

  setState(state: OrbzState): void {
    this.state = state;
  }

  formatState(state: OrbzState): string {
    return `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
  }

  setSize(event: Event): void {
    this.size = Number((event.target as HTMLInputElement).value);
  }

  setSpeed(event: Event): void {
    this.speed = Number((event.target as HTMLInputElement).value);
  }

  setReducedMotion(event: Event): void {
    this.reducedMotion = (event.target as HTMLSelectElement)
      .value as OrbzReducedMotion;
  }

  setColor(key: ColorKey, event: Event): void {
    this.activePreset = null;
    this.colors = {
      ...this.colors,
      [key]: (event.target as HTMLInputElement).value,
    };
  }

  applyPreset(name: OrbzPresetName): void {
    this.activePreset = name;
    this.colors = { ...ORBZ_PRESETS[name] };
  }

  formatPresetName(name: OrbzPresetName): string {
    return name === "neongate"
      ? "NeonGate"
      : `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  }

  togglePaused(): void {
    this.paused = !this.paused;
  }

  toggleElevated(): void {
    this.elevated = !this.elevated;
  }

  reset(): void {
    this.state = "idle";
    this.size = 300;
    this.speed = 1;
    this.paused = false;
    this.elevated = false;
    this.reducedMotion = "system";
    this.applyPreset(DEFAULT_PRESET);
  }
}
