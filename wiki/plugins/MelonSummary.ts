import { Root } from "mdast"
import { toString } from "mdast-util-to-string"
import { QuartzTransformerPlugin } from "../types"
import { EDITIONS } from "../../components/custom/MelonEditions"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// The summary in a page's link preview (its og:description and the image from
// components/MelonOgImage.tsx). Quartz would use the page's first words, which are
// usually a heading and a readings callout; this takes the first real paragraph instead.
// A note can set its own with `socialDescription:` in its properties.

const LIMIT = 180
const HOME = "Engineering course notes, in two editions: the regular edition and the ECE Edition."

const shorten = (text: string) => {
  if (text.length <= LIMIT) return text
  const cut = text.slice(0, LIMIT)
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…"
}

export const MelonSummary: QuartzTransformerPlugin = () => ({
  name: "MelonSummary",
  markdownPlugins() {
    return [
      () => (tree: Root, file) => {
        const fm = file.data.frontmatter
        if (!fm || fm.socialDescription) return
        // Only paragraphs at the top level: callouts, lists and tables are skipped
        for (const node of tree.children) {
          if (node.type !== "paragraph") continue
          const text = toString(node).replace(/\s+/g, " ").trim()
          if (text.length < 40) continue
          fm.socialDescription = shorten(text)
          return
        }
        // The home pages are drawn by components, with no text of their own
        const slug = file.data.slug
        if (slug === "index") fm.socialDescription = HOME
        const edition = EDITIONS.find((e) => slug === `${e.key}/index`)
        if (edition) fm.socialDescription = edition.blurb
      },
    ]
  },
})
