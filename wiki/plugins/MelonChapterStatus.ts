import { QuartzTransformerPlugin } from "../types"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// Marks chapters that are still an empty template (file.data.melonEmpty), so the
// site can show them as "Coming soon" (course page cards, sidebar, the chapter page).
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
})
