import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import MelonHome from "./quartz/components/custom/MelonHome"
import MelonMotion from "./quartz/components/custom/MelonMotion"
import { hasOwnHeader } from "./quartz/components/custom/MelonFolder"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/layout

const isHome = (page: { fileData: { slug?: string } }) => page.fileData.slug === "index"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [MelonMotion()],
  footer: Component.Footer({
    links: {
      "← rwangqz.ca": "https://rwangqz.ca",
      Projects: "https://rwangqz.ca/projects",
      Stringing: "https://rwangqz.ca/stringing",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // The home page gets the hero and course cards instead of the usual title block
    Component.ConditionalRender({ component: MelonHome(), condition: isHome }),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => !isHome(page),
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isHome(page),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !isHome(page),
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      // Courses only: concepts go in a chapter or a course's own concepts/ folder,
      // so the old top-level concepts/ folder is hidden
      filterFn: (node) => node.slugSegment !== "tags" && node.slug !== "concepts/index",
      // Sort by file name (not title) so ch01, ch02, ... stay in order, with a
      // course's subfolders (e.g. concepts/) after its chapters
      sortFn: (a, b) => {
        if (a.isFolder !== b.isFolder) return a.isFolder ? 1 : -1
        return a.slugSegment.localeCompare(b.slugSegment, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    // Course pages and Lab Reports draw their own header (components/MelonFolder.tsx)
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !hasOwnHeader(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !hasOwnHeader(page.fileData.slug),
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      // Courses only: concepts go in a chapter or a course's own concepts/ folder,
      // so the old top-level concepts/ folder is hidden
      filterFn: (node) => node.slugSegment !== "tags" && node.slug !== "concepts/index",
      // Sort by file name (not title) so ch01, ch02, ... stay in order, with a
      // course's subfolders (e.g. concepts/) after its chapters
      sortFn: (a, b) => {
        if (a.isFolder !== b.isFolder) return a.isFolder ? 1 : -1
        return a.slugSegment.localeCompare(b.slugSegment, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
}
