import { Root } from "mdast"
import { toString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// Alt text for figures. Notes embed a diagram and caption it on the next line:
//
//   ![[coe-328-full-adder.svg]]
//   *Figure 5.3: A full adder built from two half adders.*
//
// The embed has no alt text, so a screen reader would announce nothing for the image. This
// copies the caption into the image's alt. An embed that sets its own (![[x.svg|alt text]])
// keeps it, and an image with no caption under it is left alone.
// Goes after ObsidianFlavoredMarkdown in quartz.config.ts, which is what turns the embed
// into an image.

export const MelonFigureAlt: QuartzTransformerPlugin = () => ({
  name: "MelonFigureAlt",
  markdownPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "paragraph", (paragraph) => {
          paragraph.children.forEach((node, i) => {
            if (node.type !== "image") return
            const props = ((node.data ??= {}).hProperties ??= {}) as Record<string, unknown>
            if (node.alt || props.alt) return
            // The caption: the first emphasis after the image, with only line breaks between
            const next = paragraph.children
              .slice(i + 1)
              .find((n) => !(n.type === "break" || (n.type === "text" && !n.value.trim())))
            if (next?.type !== "emphasis") return
            // Math is still raw ($...$) at this point, so the dollar signs are dropped
            const caption = toString(next).replace(/\$/g, "").replace(/\s+/g, " ").trim()
            if (!caption) return
            node.alt = caption
            props.alt = caption
          })
        })
      },
    ]
  },
})
