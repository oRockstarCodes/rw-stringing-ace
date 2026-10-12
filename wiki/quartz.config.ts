import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import MelonFolder from "./quartz/components/custom/MelonFolder"
import { LAB_JUNK_DIRS, MelonLabsData } from "./quartz/plugins/custom/MelonLabsData"
import { MelonLabsPage } from "./quartz/plugins/custom/MelonLabsPage"
import { MelonChapterStatus } from "./quartz/plugins/custom/MelonChapterStatus"

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
      typography: {
        header: { name: "Bricolage Grotesque", weights: [500, 700, 800] },
        body: "DM Sans",
        code: "JetBrains Mono",
      },
      // Watermelon: pink flesh (secondary) and green rind (tertiary).
      // Gradients and animations are in custom.scss.
      colors: {
        lightMode: {
          light: "#fdfaf5",
          lightgray: "#ebe4d8",
          gray: "#998f82",
          darkgray: "#3b3833",
          dark: "#1c2620",
          secondary: "#d1334d",
          tertiary: "#23874f",
          highlight: "rgba(209, 51, 77, 0.08)",
          textHighlight: "#ffd16699",
        },
        darkMode: {
          light: "#0e1310",
          lightgray: "#232c26",
          gray: "#76837a",
          darkgray: "#d3dbd5",
          dark: "#f2f6f3",
          secondary: "#ff6b80",
          tertiary: "#5fd393",
          highlight: "rgba(255, 107, 128, 0.10)",
          textHighlight: "#ff6b8055",
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
      // Marks chapters that are still an empty template ("Coming soon")
      MelonChapterStatus(),
    ],
    // Notes with `draft: true` in their properties are not published
    filters: [Plugin.RemoveDrafts()],
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
