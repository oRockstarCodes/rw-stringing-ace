import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import MelonFolder from "./quartz/components/custom/MelonFolder"
import { melonOgImage } from "./quartz/components/custom/MelonOgImage"
import { LAB_JUNK_DIRS, MelonLabsData } from "./quartz/plugins/custom/MelonLabsData"
import { MelonLabsPage } from "./quartz/plugins/custom/MelonLabsPage"
import { HideEmptyChapters, MelonChapterStatus } from "./quartz/plugins/custom/MelonChapterStatus"
import { MelonSummary } from "./quartz/plugins/custom/MelonSummary"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/configuration

const byFileName = (a: QuartzPluginData, b: QuartzPluginData) =>
  (a.slug ?? "").localeCompare(b.slug ?? "", undefined, { numeric: true, sensitivity: "base" })

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Melon Files",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: { provider: "google", tagId: "G-XEBVL6SMNV" },
    locale: "en-US",
    baseUrl: "rwangqz.ca/melon-files",
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      ".trash",
      // Build output and IDE folders inside lab projects (Quartus, NetBeans) aren't published
      ...LAB_JUNK_DIRS.map((dir) => `**/labs/**/${dir}`),
      "**/labs/**/*.class",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      // Headings and labels: Archivo, which has a width axis (the narrow widths are loaded
      // in components/MelonMotion.tsx). Body: a serif, so text matches the KaTeX math set
      // in it. Code and part numbers: JetBrains Mono.
      typography: {
        header: { name: "Archivo", weights: [500, 700, 800] },
        body: { name: "Source Serif 4", weights: [400, 600], includeItalic: true },
        code: "JetBrains Mono",
      },
      // From the site icon: black ink on a dusty, faded pink. Quartz follows the visitor's system
      // setting (dark when it has no preference), and the toggle overrides it. light = the page, dark = text, secondary = dusty rose (links,
      // the page you're on), tertiary = plum. The pink bands and the chip are
      // --melon-paper and --melon-chip in custom.scss.
      colors: {
        lightMode: {
          light: "#fbf6f8",
          lightgray: "#e6d3dc",
          gray: "#7d6b74",
          darkgray: "#43393e",
          dark: "#231f20",
          secondary: "#8c4a67",
          tertiary: "#6f5666",
          highlight: "rgba(140, 74, 103, 0.08)",
          textHighlight: "#ecd2de",
        },
        darkMode: {
          light: "#1c181a",
          lightgray: "#3b2f35",
          gray: "#9d8a94",
          darkgray: "#d9c7d0",
          dark: "#eadbe2",
          secondary: "#d4a0b7",
          tertiary: "#b494a5",
          highlight: "rgba(212, 160, 183, 0.10)",
          textHighlight: "rgba(212, 160, 183, 0.30)",
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
      // The link-preview summary: the page's first real paragraph
      MelonSummary(),
      Plugin.Latex({ renderEngine: "katex" }),
      // Each course's labs/ folder, shown on the course page
      MelonLabsData(),
      // Marks chapters that are still an empty template, and unlinks links to them
      MelonChapterStatus(),
    ],
    // Notes with `draft: true` in their properties are not published, and neither are
    // chapters that are still an empty template
    filters: [Plugin.RemoveDrafts(), HideEmptyChapters()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // Folder pages list their notes in file-name order, so chapters named
      // ch01-..., ch02-... appear in sequence. Course folders show chapter cards
      // instead of their index.md text (see components/MelonFolder.tsx).
      Plugin.FolderPage({
        sort: byFileName,
        pageBody: MelonFolder({ sort: byFileName }),
      }),
      // A Labs page (courses/<code>/labs/) for each course with a labs/ folder
      MelonLabsPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      // A link-preview image for each note, showing its title and summary
      // (components/MelonOgImage.tsx). Pages without a note (tags, labs) use static/og-image.png.
      Plugin.CustomOgImages({ imageStructure: melonOgImage }),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
