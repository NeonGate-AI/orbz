import type { MetadataRoute } from "next";
import { siteConfig } from "../site.config";

const paths = [
  "",
  "/getting-started",
  "/getting-started/native",
  "/getting-started/react-next",
  "/getting-started/cdn",
  "/concepts/philosophy",
  "/concepts/states",
  "/concepts/appearance",
  "/concepts/motion-accessibility",
  "/guides/frameworks",
  "/guides/microfrontends",
  "/guides/voice-assistant",
  "/guides/ssr",
  "/examples",
  "/api",
  "/api/exports",
  "/troubleshooting",
  "/changelog",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    changeFrequency: path === "/changelog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
    url: `${siteConfig.url}${path}`,
  }));
}

