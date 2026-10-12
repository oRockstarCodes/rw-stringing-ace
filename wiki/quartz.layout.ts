import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import MelonHome from "./quartz/components/custom/MelonHome"
import MelonMotion from "./quartz/components/custom/MelonMotion"
import MelonSoon from "./quartz/components/custom/MelonSoon"
import { hasOwnHeader, isCoursePage } from "./quartz/components/custom/MelonFolder"
import { QuartzComponentProps } from "./quartz/components/types"
import { simplifySlug } from "./quartz/util/path"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/layout

const isHome = (page: { fileData: { slug?: string } }) => page.fileData.slug === "index"

// True when the page links to another note, or another note links to it. Links from
// course index notes don't count: their outline isn't shown on the site, and they link
// every chapter. Tags don't count either.
const hasNoteLinks = (page: QuartzComponentProps) => {
  const slug = page.fileData.slug!
  const outgoing = (page.fileData.links ?? []).filter((l) => !l.startsWith("tags/"))
  if (outgoing.length > 0) return true
  const self = simplifySlug(slug)
  return page.allFiles.some(
    (f) => f.slug !== slug && !isCoursePage(f.slug) && (f.links ?? []).includes(self),
  )
}

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
    // "Coming soon" on chapters that are still an empty template
    MelonSoon(),
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
      // Runs in the browser (Quartz serializes it), so it must be self-contained.
      // "courses" -> "Courses", and a "Lab reports" item after the chapters of each
      // course with labs (the list comes from #melon-data, see components/MelonMotion.tsx)
      mapFn: (node) => {
        if (node.slug === "courses/index") node.displayName = "Courses"
        const course = node.isFolder && node.slug.match(/^courses\/([^/]+)\/index$/)
        if (!course) return
        const withLabs = (document.getElementById("melon-data")?.dataset.labs ?? "").split(",")
        if (!withLabs.includes(course[1]) || node.children.some((c) => c.slug.endsWith("/labs/index")))
          return
        const slug = `courses/${course[1]}/labs/index`
        const Node = node.constructor as new (segments: string[], data: object) => typeof node
        node.children.push(new Node(slug.split("/"), { slug, title: "Lab reports", filePath: slug }))
      },
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
    // Only when the page is linked to other notes (otherwise the graph is empty)
    Component.ConditionalRender({ component: Component.Graph(), condition: hasNoteLinks }),
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
      // Runs in the browser (Quartz serializes it), so it must be self-contained.
      // "courses" -> "Courses", and a "Lab reports" item after the chapters of each
      // course with labs (the list comes from #melon-data, see components/MelonMotion.tsx)
      mapFn: (node) => {
        if (node.slug === "courses/index") node.displayName = "Courses"
        const course = node.isFolder && node.slug.match(/^courses\/([^/]+)\/index$/)
        if (!course) return
        const withLabs = (document.getElementById("melon-data")?.dataset.labs ?? "").split(",")
        if (!withLabs.includes(course[1]) || node.children.some((c) => c.slug.endsWith("/labs/index")))
          return
        const slug = `courses/${course[1]}/labs/index`
        const Node = node.constructor as new (segments: string[], data: object) => typeof node
        node.children.push(new Node(slug.split("/"), { slug, title: "Lab reports", filePath: slug }))
      },
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
