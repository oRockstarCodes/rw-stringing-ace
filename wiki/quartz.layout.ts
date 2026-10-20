import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import MelonHome from "./quartz/components/custom/MelonHome"
import MelonBand from "./quartz/components/custom/MelonBand"
import MelonMotion from "./quartz/components/custom/MelonMotion"
import MelonSmoothScroll from "./quartz/components/custom/MelonSmoothScroll"
import MelonOpAmp from "./quartz/components/custom/MelonOpAmp"
import MelonFigures from "./quartz/components/custom/MelonFigures"
import MelonLogic from "./quartz/components/custom/MelonLogic"
import MelonCapInd from "./quartz/components/custom/MelonCapInd"
import MelonCourse3D from "./quartz/components/custom/MelonCourse3D"
import MelonOptics from "./quartz/components/custom/MelonOptics"
import MelonPageTitle from "./quartz/components/custom/MelonPageTitle"
import { hasOwnHeader } from "./quartz/components/custom/MelonFolder"
import { isEditionHome } from "./quartz/components/custom/MelonEditions"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

// Copied into the Quartz engine at build time by scripts/build-wiki.sh.
// Docs: https://quartz.jzhao.xyz/layout

const isHome = (page: { fileData: { slug?: string } }) => page.fileData.slug === "index"

// The sidebar. These functions run in the browser (Quartz serializes them), so each one
// must be self-contained.
const explorerOptions: Parameters<typeof Component.Explorer>[0] = {
  // Courses only: concepts go in a chapter or a course's own concepts/ folder,
  // so the old top-level concepts/ folder is hidden
  filterFn: (node) => node.slugSegment !== "tags" && node.slug !== "concepts/index",
  // The editions (components/MelonEditions.tsx). On a page inside an edition the sidebar
  // shows only that edition's courses, at the top. Elsewhere (the home page) each edition
  // is a folder holding its courses. Either way the courses/ folder level is skipped.
  // Inside each course:
  // - a "Lab reports" item, for courses with labs (the list comes from #melon-data,
  //   see components/MelonMotion.tsx)
  // - for courses with a concepts/ folder, its notes are lifted out of the folder and
  //   the course is split into a "Chapters" and a "Concepts" section. The two headings
  //   are links to the course page and the concepts page (styled in custom.scss).
  mapFn: (node) => {
    // (No named helper functions in here: the bundler wraps those in a __name() call
    // that doesn't exist in the browser.)
    const editions: Record<string, string> = { regular: "Melon Files", ece: "ECE Edition" }
    const here = (document.body.dataset.slug ?? "").split("/")[0]
    if (node.slugSegment === undefined) {
      // the root
      const ed = editions[here] && node.children.find((c) => c.isFolder && c.slugSegment === here)
      if (!ed) return
      const courses = ed.children.find((c) => c.isFolder && c.slugSegment === "courses")
      node.children = [
        ...ed.children.filter((c) => c !== courses),
        ...(courses ? courses.children : []),
        ...node.children.filter((c) => !(c.isFolder && editions[c.slugSegment])),
      ]
      return
    }
    if (node.isFolder && editions[node.slugSegment] && node.slug === `${node.slugSegment}/index`) {
      node.displayName = editions[node.slugSegment]
      const courses = node.children.find((c) => c.isFolder && c.slugSegment === "courses")
      if (courses)
        node.children = [...node.children.filter((c) => c !== courses), ...courses.children]
      return
    }
    if (node.isFolder && node.slugSegment === "courses") node.displayName = "Courses"
    const course = node.isFolder && node.slug.match(/^([^/]+\/courses\/[^/]+)\/index$/)
    if (!course) return
    const added: [string, string][] = []
    const withLabs = (document.getElementById("melon-data")?.dataset.labs ?? "").split(",")
    if (withLabs.includes(course[1]) && !node.children.some((c) => c.slug.endsWith("/labs/index")))
      added.push([`${course[1]}/labs/index`, "Lab reports"])

    const concepts = node.children.find((c) => c.isFolder && c.slugSegment === "concepts")
    if (concepts) {
      node.children = node.children.filter((c) => c !== concepts)
      node.children.push(...concepts.children.filter((c) => !c.slug.endsWith("/index")))
      added.push([`${course[1]}/index`, "Chapters"])
      added.push([`${course[1]}/concepts/index`, "Concepts"])
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
        : /^[^/]+\/courses\/[^/]+\/index$/.test(n.slug)
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

// Concept notes (<edition>/courses/<code>/concepts/...) with at least one embedded image
const hasFigurePanel = (page: QuartzComponentProps) => {
  if (!/^[^/]+\/courses\/[^/]+\/concepts\/(?!index$)/.test(page.fileData.slug ?? "")) return false
  const hasImage = (node: { tagName?: string; children?: unknown[] }): boolean =>
    node.tagName === "img" ||
    (node.children ?? []).some((c) => hasImage(c as { tagName?: string; children?: unknown[] }))
  return hasImage(page.tree as { children?: unknown[] })
}

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  // MelonOpAmp, MelonLogic and MelonCapInd fill in the <div class="melon-opamp">,
  // <div class="melon-logic"> and <div class="melon-capind"> diagrams written in notes, and
  // MelonOptics the <div class="melon-optics"> ray diagrams.
  // MelonCourse3D draws the 3D scene behind each course page's title.
  afterBody: [MelonMotion(), MelonSmoothScroll(),MelonOpAmp(), MelonLogic(), MelonCapInd(), MelonOptics(), MelonCourse3D()],
  // No footer. Quartz requires the slot, so it gets a component that renders nothing.
  footer: (() => null) as QuartzComponent,
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
    MelonPageTitle(),
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
    // An edition's home page (<edition>/) is its folder page, with the edition's hero and
    // course list (components/MelonEditions.tsx)
    Component.ConditionalRender({
      component: MelonHome(),
      condition: (page) => isEditionHome(page.fileData.slug),
    }),
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
    MelonPageTitle(),
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
