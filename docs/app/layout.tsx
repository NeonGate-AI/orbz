import type { Metadata, Viewport } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import type { ReactNode } from "react";
import { siteConfig } from "../site.config";
import { RegisterElement } from "./register-element.client";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Orbz — One voice component. Every framework.",
    template: "%s | Orbz",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    description: siteConfig.description,
    siteName: siteConfig.name,
    title: "Orbz — One voice component. Every framework.",
    type: "website",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    title: "Orbz — One voice component. Every framework.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { color: "#f6f7ff", media: "(prefers-color-scheme: light)" },
    { color: "#070810", media: "(prefers-color-scheme: dark)" },
  ],
};

function OrbzBrand() {
  return (
    <span className="orbz-logo">
      <span aria-hidden="true" className="orbz-logo__mark" />
      <span className="orbz-logo__wordmark">orbz</span>
      <span className="orbz-logo__version">v{siteConfig.version}</span>
    </span>
  );
}

const navbar = (
  <Navbar
    logo={<OrbzBrand />}
    projectLink={siteConfig.github}
    logoLink={siteConfig.url}
  >
    <a className="orbz-navbar-link" href={siteConfig.npm}>
      npm
    </a>
  </Navbar>
);

const footer = (
  <Footer>
    <span>
      Orbz {siteConfig.version} · MIT licensed · Built by NeonGate AI
    </span>
  </Footer>
);

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <Head
        backgroundColor={{ dark: "#070810", light: "#f6f7ff" }}
        color={{
          hue: 246,
          lightness: { dark: 72, light: 50 },
          saturation: 100,
        }}
        faviconGlyph="◉"
      />
      <body>
        <RegisterElement />
        <Layout
          docsRepositoryBase="https://github.com/NeonGate-AI/orbz/tree/main/docs"
          editLink="Edit this page on GitHub"
          feedback={{
            content: "Suggest a documentation improvement",
            labels: "documentation",
          }}
          footer={footer}
          navbar={navbar}
          nextThemes={{ defaultTheme: "dark", storageKey: "orbz-theme" }}
          pageMap={await getPageMap()}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
