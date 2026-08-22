import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface OrbzAttributes {
  "color-accent"?: string;
  "color-background"?: string;
  "color-highlight"?: string;
  "color-primary"?: string;
  "color-secondary"?: string;
  elevated?: string;
  paused?: string;
  preset?: string;
  "reduced-motion"?: string;
  size?: string;
  speed?: number | string;
  state?: string;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "orb-z": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > &
        OrbzAttributes;
    }
  }
}

export {};
