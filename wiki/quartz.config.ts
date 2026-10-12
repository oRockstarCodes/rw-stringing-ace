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
      // From the site icon (a two-tone print): pink paper and black ink.
      // secondary = pink accent, tertiary = dusty plum. Gradients and animations are in custom.scss.
      colors: {
        lightMode: {
          light: "#fbf3f7",
          lightgray: "#ead6e0",
          gray: "#7a6670",
          darkgray: "#3d3439",
          dark: "#2e2b2d",
          secondary: "#b02f74",
          tertiary: "#74506a",
          highlight: "rgba(176, 47, 116, 0.08)",
          textHighlight: "#f3d2e5",
        },
        darkMode: {
          light: "#1c181a",
          lightgray: "#3a3136",
          gray: "#9a8a93",
          darkgray: "#e6d6de",
          dark: "#fbeef4",
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
