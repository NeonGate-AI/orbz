import "@neongate-ai/orbz/browser";
import {
  ORBZ_COLOR_ATTRIBUTES,
  ORBZ_PRESETS,
  type OrbzColors,
  type OrbzElement,
  type OrbzPresetName,
  type OrbzReducedMotion,
  type OrbzState,
} from "@neongate-ai/orbz";
import "./styles.css";

type ColorKey = keyof OrbzColors;

const orb = required<OrbzElement>("#orb");
const statusText = required<HTMLSpanElement>("#status-text");
const statusMeta = required<HTMLSpanElement>("#status-meta");
const sizeInput = required<HTMLInputElement>("#size");
const speedInput = required<HTMLInputElement>("#speed");
const sizeOutput = required<HTMLOutputElement>("#size-output");
const speedOutput = required<HTMLOutputElement>("#speed-output");
const pauseButton = required<HTMLButtonElement>("#pause");
const elevatedButton = required<HTMLButtonElement>("#elevated");
const reducedMotion = required<HTMLSelectElement>("#reduced-motion");
const stateButtons = document.querySelectorAll<HTMLButtonElement>("[data-state]");
const presetButtons = document.querySelectorAll<HTMLButtonElement>("[data-preset]");

const colorInputs: Record<ColorKey, HTMLInputElement> = {
  accent: required<HTMLInputElement>("#accent"),
  background: required<HTMLInputElement>("#background"),
  highlight: required<HTMLInputElement>("#highlight"),
  primary: required<HTMLInputElement>("#primary"),
  secondary: required<HTMLInputElement>("#secondary"),
};

let state: OrbzState = "idle";
let paused = false;
let elevated = false;
let activePreset: OrbzPresetName | null = "neongate";

for (const button of stateButtons) {
  button.addEventListener("click", () => {
    setState(button.dataset.state as OrbzState);
  });
}

for (const button of presetButtons) {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.preset as OrbzPresetName);
  });
}

for (const [key, input] of Object.entries(colorInputs) as [
  ColorKey,
  HTMLInputElement,
][]) {
  input.addEventListener("input", () => {
    activateCustomColors();
    orb.setAttribute(ORBZ_COLOR_ATTRIBUTES[key], input.value);
  });
}

sizeInput.addEventListener("input", () => {
  const size = Number(sizeInput.value);
  orb.size = size;
  sizeOutput.value = `${size} px`;
  updateStatus();
});

speedInput.addEventListener("input", () => {
  const speed = Number(speedInput.value);
  orb.speed = speed;
  speedOutput.value = `${speed.toFixed(2)}×`;
  updateStatus();
});

pauseButton.addEventListener("click", () => {
  paused = !paused;
  orb.paused = paused;
  pauseButton.setAttribute("aria-checked", String(paused));
  updateStatus();
});

elevatedButton.addEventListener("click", () => {
  elevated = !elevated;
  orb.elevated = elevated;
  elevatedButton.setAttribute("aria-checked", String(elevated));
});

reducedMotion.addEventListener("change", () => {
  orb.reducedMotion = reducedMotion.value as OrbzReducedMotion;
});

required<HTMLButtonElement>("#reset").addEventListener("click", resetControls);

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

function setState(nextState: OrbzState): void {
  state = nextState;
  orb.state = nextState;
  orb.setAttribute("aria-label", `Assistant is ${nextState}`);

  for (const button of stateButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.state === nextState));
  }

  updateStatus();
}

function applyPreset(name: OrbzPresetName): void {
  const colors = ORBZ_PRESETS[name];
  activePreset = name;

  for (const key of Object.keys(colorInputs) as ColorKey[]) {
    orb.removeAttribute(ORBZ_COLOR_ATTRIBUTES[key]);
    colorInputs[key].value = colors[key];
  }

  orb.preset = name;

  for (const button of presetButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.preset === name));
  }
}

function activateCustomColors(): void {
  if (activePreset === null) {
    return;
  }

  const colors = ORBZ_PRESETS[activePreset];
  activePreset = null;
  orb.removeAttribute("preset");

  for (const key of Object.keys(colorInputs) as ColorKey[]) {
    orb.setAttribute(ORBZ_COLOR_ATTRIBUTES[key], colors[key]);
  }

  for (const button of presetButtons) {
    button.setAttribute("aria-pressed", "false");
  }
}

function updateStatus(): void {
  statusText.textContent = `Assistant is ${paused ? "paused" : state}`;
  statusMeta.textContent = `${sizeInput.value} px · ${Number(
    speedInput.value,
  ).toFixed(2)}×`;
}

function resetControls(): void {
  paused = false;
  elevated = false;
  sizeInput.value = "300";
  speedInput.value = "1";
  reducedMotion.value = "system";
  sizeOutput.value = "300 px";
  speedOutput.value = "1.00×";
  pauseButton.setAttribute("aria-checked", "false");
  elevatedButton.setAttribute("aria-checked", "false");
  orb.size = 300;
  orb.speed = 1;
  orb.paused = false;
  orb.elevated = false;
  orb.reducedMotion = "system";
  applyPreset("neongate");
  setState("idle");
  orb.restart();
}

applyPreset("neongate");
updateStatus();
