import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/configuration
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Melon Files",
    pageTitleSuffix: " · Rocky Wang",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "rwangqz.ca/melon-files",
    ignorePatterns: ["private", "templates", ".obsidian", ".trash"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      // Same fonts as the main site
      typography: {
        header: "Outfit",
        body: "DM Sans",
        code: "JetBrains Mono",
      },
      // Matched to the main site: near-black background, gold accent
      colors: {
        lightMode: {
          light: "#fafaf7",
          lightgray: "#e6e4dc",
          gray: "#a3a19a",
          darkgray: "#3f3f46",
          dark: "#18181b",
          secondary: "#a87400",
          tertiary: "#d19a00",
          highlight: "rgba(168, 116, 0, 0.10)",
          textHighlight: "#ffd54a88",
        },
        darkMode: {
          light: "#0f0f11",
          lightgray: "#2a2a2f",
          gray: "#6b6b74",
          darkgray: "#d4d4d8",
          dark: "#f5f5f5",
          secondary: "#ffc21a",
          tertiary: "#ffd75e",
          highlight: "rgba(255, 194, 26, 0.08)",
          textHighlight: "#ffc21a55",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    // Notes with `draft: true` in their properties are not published
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
