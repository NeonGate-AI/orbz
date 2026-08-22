import "@neongate-ai/orbz/browser";
import { mount } from "svelte";
import App from "./App.svelte";
import "./styles.css";

const target = document.getElementById("app");

if (!target) {
  throw new Error("Could not find the #app mount point.");
}

mount(App, { target });
