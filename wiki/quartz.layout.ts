import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import MelonHome from "./quartz/components/custom/MelonHome"
import MelonBand from "./quartz/components/custom/MelonBand"
import MelonMotion from "./quartz/components/custom/MelonMotion"
import MelonSmoothScroll from "./quartz/components/custom/MelonSmoothScroll"
import MelonOpAmp from "./quartz/components/custom/MelonOpAmp"
import MelonFigures from "./quartz/components/custom/MelonFigures"
import MelonLogic from "./quartz/components/custom/MelonLogic"
import { hasOwnHeader } from "./quartz/components/custom/MelonFolder"
import { QuartzComponentProps } from "./quartz/components/types"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/layout

const isHome = (page: { fileData: { slug?: string } }) => page.fileData.slug === "index"

// The sidebar. These functions run in the browser (Quartz serializes them), so each one
// must be self-contained.
const explorerOptions: Parameters<typeof Component.Explorer>[0] = {
  // Courses only: concepts go in a chapter or a course's own concepts/ folder,
  // so the old top-level concepts/ folder is hidden
  filterFn: (node) => node.slugSegment !== "tags" && node.slug !== "concepts/index",
  // "courses" -> "Courses". Inside each course:
  // - a "Lab reports" item, for courses with labs (the list comes from #melon-data,
  //   see components/MelonMotion.tsx)
  // - for courses with a concepts/ folder, its notes are lifted out of the folder and
  //   the course is split into a "Chapters" and a "Concepts" section. The two headings
  //   are links to the course page and the concepts page (styled in custom.scss).
  mapFn: (node) => {
    if (node.slug === "courses/index") node.displayName = "Courses"
    const course = node.isFolder && node.slug.match(/^courses\/([^/]+)\/index$/)
    if (!course) return
    // (No named helper functions in here: the bundler wraps those in a __name() call
    // that doesn't exist in the browser.)
    const added: [string, string][] = []
    const withLabs = (document.getElementById("melon-data")?.dataset.labs ?? "").split(",")
    if (withLabs.includes(course[1]) && !node.children.some((c) => c.slug.endsWith("/labs/index")))
      added.push([`courses/${course[1]}/labs/index`, "Lab reports"])

    const concepts = node.children.find((c) => c.isFolder && c.slugSegment === "concepts")
    if (concepts) {
      node.children = node.children.filter((c) => c !== concepts)
      node.children.push(...concepts.children.filter((c) => !c.slug.endsWith("/index")))
      added.push([`courses/${course[1]}/index`, "Chapters"])
      added.push([`courses/${course[1]}/concepts/index`, "Concepts"])
    }

    const Node = node.constructor as new (segments: string[], data: object) => typeof node
    for (const [slug, title] of added)
      node.children.push(new Node(slug.split("/"), { slug, title, filePath: slug }))
  },
  // Inside a course: Chapters heading, chapters (by file name, so ch01, ch02, ... stay
  // in order), Lab reports, Concepts heading, concepts (by title), then any subfolders.
  // Elsewhere, notes come before folders.
  sortFn: (a, b) => {
    const [rankA, rankB] = [a, b].map((n) =>
      n.isFolder
        ? 5
        : /^courses\/[^/]+\/index$/.test(n.slug)
          ? 0
          : n.slug.endsWith("/labs/index")
            ? 2
            : n.slug.endsWith("/concepts/index")
              ? 3
              : n.slug.includes("/concepts/")
                ? 4
                : 1,
    )
    if (rankA !== rankB) return rankA - rankB
    const [keyA, keyB] = [a, b].map((n) => (rankA === 4 ? n.displayName : n.slugSegment))
    return keyA.localeCompare(keyB, undefined, { numeric: true, sensitivity: "base" })
  },
}

// Concept notes (courses/<code>/concepts/...) with at least one embedded image
const hasFigurePanel = (page: QuartzComponentProps) => {
  if (!/^courses\/[^/]+\/concepts\/(?!index$)/.test(page.fileData.slug ?? "")) return false
  const hasImage = (node: { tagName?: string; children?: unknown[] }): boolean =>
    node.tagName === "img" ||
    (node.children ?? []).some((c) => hasImage(c as { tagName?: string; children?: unknown[] }))
  return hasImage(page.tree as { children?: unknown[] })
}

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  // MelonOpAmp and MelonLogic fill in the <div class="melon-opamp"> and
  // <div class="melon-logic"> diagrams written in notes
  afterBody: [MelonMotion(), MelonSmoothScroll(),MelonOpAmp(), MelonLogic()],
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
    // The pink band: where you are, and reading time (components/MelonBand.tsx)
    Component.ConditionalRender({ component: MelonBand(), condition: (page) => !isHome(page) }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
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
    Component.Explorer(explorerOptions),
  ],
  right: [
    // Concept pages with diagrams show them here, following along as you read
    // (components/MelonFigures.tsx), above the table of contents
    Component.ConditionalRender({
      component: Component.DesktopOnly(MelonFigures()),
      condition: hasFigurePanel,
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    // Course pages and Lab Reports draw their own header (components/MelonFolder.tsx)
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => !hasOwnHeader(page.fileData.slug),
    }),
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
    Component.Explorer(explorerOptions),
  ],
  right: [],
}
