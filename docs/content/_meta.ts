import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    title: "Overview",
    type: "page",
    theme: {
      breadcrumb: false,
      footer: true,
      layout: "full",
      navbar: true,
      pagination: false,
      sidebar: false,
      timestamp: false,
      toc: false,
    },
  },
  "getting-started": "Getting started",
  concepts: "Core concepts",
  guides: "Guides",
  examples: "Examples",
  api: "API reference",
  troubleshooting: "Troubleshooting",
  changelog: "Changelog",
};

export default meta;

