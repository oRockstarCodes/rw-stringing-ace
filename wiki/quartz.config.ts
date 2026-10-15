import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import MelonFolder from "./quartz/components/custom/MelonFolder"
import { LAB_JUNK_DIRS, MelonLabsData } from "./quartz/plugins/custom/MelonLabsData"
import { MelonLabsPage } from "./quartz/plugins/custom/MelonLabsPage"
import { HideEmptyChapters, MelonChapterStatus } from "./quartz/plugins/custom/MelonChapterStatus"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/configuration

const byFileName = (a: QuartzPluginData, b: QuartzPluginData) =>
  (a.slug ?? "").localeCompare(b.slug ?? "", undefined, { numeric: true, sensitivity: "base" })

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Melon Files",
    pageTitleSuffix: " · Rocky Wang",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
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
      // Headings: Anybody, a grotesque with a width axis. Course codes use it extra-condensed
      // (the narrow widths are loaded in components/MelonMotion.tsx). Body: a serif, so text matches
      // the KaTeX math set in it.
      typography: {
        header: { name: "Anybody", weights: [500, 700, 800, 900] },
        body: { name: "Source Serif 4", weights: [400, 600], includeItalic: true },
        code: "JetBrains Mono",
      },
      // From the site icon, a relief print: black ink carved on pink paper.
      // light = the reading sheet, dark = ink, secondary = press pink (links, active page),
      // tertiary = plum. The paper pink of the course plates is --melon-paper in custom.scss.
      colors: {
        lightMode: {
          light: "#fff8fb",
          lightgray: "#ebd3de",
          gray: "#7a6670",
          darkgray: "#3b3237",
          dark: "#231f20",
          secondary: "#b02f74",
          tertiary: "#74506a",
          highlight: "rgba(176, 47, 116, 0.07)",
          textHighlight: "#f4d9e4",
        },
        darkMode: {
          light: "#231f20",
          lightgray: "#40353a",
          gray: "#a8959f",
          darkgray: "#e8d5de",
          dark: "#f4d9e4",
          secondary: "#f3a9cf",
          tertiary: "#d6b3c6",
          highlight: "rgba(243, 169, 207, 0.10)",
          textHighlight: "#f3a9cf44",
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
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
