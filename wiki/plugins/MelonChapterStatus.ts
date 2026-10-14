import fs from "fs"
import path from "path"
import { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import { QuartzFilterPlugin, QuartzTransformerPlugin } from "../types"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// Chapters that are still an empty template are hidden from the site until something
// is written in them: MelonChapterStatus marks them (file.data.melonEmpty) and turns
// links to them on other pages (e.g. a course's schedule) into plain text, and
// HideEmptyChapters keeps them from being published at all.
// A chapter counts as empty when nothing is left after removing the template's
// headings, placeholder lines, the "Readings:" line, empty $$ blocks, and empty bullets.

declare module "vfile" {
  interface DataMap {
    melonEmpty: boolean
  }
}

// Placeholder lines from templates/chapter.md
const PLACEHOLDERS = [
  "What this chapter covers, in a few lines.",
  "Your own examples, not from assignments.",
]

export const isEmptyChapter = (markdown: string) => {
  const rest = markdown
    .replace(/^---\n[\s\S]*?\n---\n?/, "") // frontmatter
    .replace(/<!--[\s\S]*?-->/g, "") // comments
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "")
    .filter((l) => !/^#{1,6}\s/.test(l)) // headings
    .filter((l) => !/^\*\*Readings:?\*\*/i.test(l)) // "**Readings:** ..." line
    .filter((l) => l !== "$$") // empty display-math block
    .filter((l) => !/^[-*+]$/.test(l)) // empty bullet
    .filter((l) => !PLACEHOLDERS.includes(l))
  return rest.length === 0
}

const readChapter = (file: string) =>
  isEmptyChapter(fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"))

// Slugs of every empty chapter (courses/<code>/<chapter>), read straight from the content
// folder, since a page can link to a chapter that hasn't been processed yet
const findEmptyChapters = (contentDir: string) => {
  const empty = new Set<string>()
  const coursesDir = path.join(contentDir, "courses")
  if (!fs.existsSync(coursesDir)) return empty
  for (const course of fs.readdirSync(coursesDir, { withFileTypes: true })) {
    if (!course.isDirectory()) continue
    const dir = path.join(coursesDir, course.name)
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md") || name === "index.md") continue
      if (readChapter(path.join(dir, name))) {
        empty.add(`courses/${course.name}/${name.slice(0, -3)}`)
      }
    }
  }
  return empty
}

export const MelonChapterStatus: QuartzTransformerPlugin = () => ({
  name: "MelonChapterStatus",
  markdownPlugins() {
    return [
      () => (_tree, file) => {
        // Chapters are the notes directly in a course folder
        if (!/^courses\/[^/]+\/(?!index$)[^/]+$/.test(file.data.slug ?? "")) return
        file.data.melonEmpty = isEmptyChapter(String(file.value).replace(/\r\n/g, "\n"))
      },
    ]
  },
  htmlPlugins(ctx) {
    const empty = findEmptyChapters(ctx.argv.directory)
    return [
      () => (tree: Root, file) => {
        if (empty.size === 0) return
        // Runs after CrawlLinks, which stores each internal link's target in data-slug
        visit(tree, "element", (node: Element) => {
          const slug = node.tagName === "a" ? node.properties?.["data-slug"] : undefined
          if (typeof slug !== "string" || !empty.has(slug)) return
          node.tagName = "span"
          node.properties = { className: ["melon-unwritten"] }
        })
        file.data.links = file.data.links?.filter((l) => !empty.has(l))
      },
    ]
  },
})

export const HideEmptyChapters: QuartzFilterPlugin = () => ({
  name: "HideEmptyChapters",
  shouldPublish(_ctx, [_tree, vfile]) {
    return !vfile.data.melonEmpty
  },
})
