import { OrbPlayground } from "./orb-playground";

export default function Page() {
  return (
    <main className="shell">
      <header className="hero">
        <a className="brand" href="https://github.com/NeonGate-AI/orbz">
          <span className="brand-mark" aria-hidden="true" />
          orbz
        </a>
        <span className="framework-badge">Next.js Example</span>
      </header>
      <OrbPlayground />
    </main>
  );
}
