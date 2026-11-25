import { Element, ElementContent, Root, RootContent } from "hast"
import { toString } from "hast-util-to-string"
import { QuartzTransformerPlugin } from "../types"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// Hides each worked example's answer behind a "Show answer" toggle, so readers can try
// the problem first. Notes don't change: an example is a heading that starts with
// "Example" (e.g. `#### Example 6.1: Comparing two numbers`) and runs until the next
// heading or horizontal rule. Its first block is the question, plus anything that
// belongs with it (see questionLength); the rest goes in a <details> (styled in custom.scss).
// To mark the split by hand, put `<span class="answer-starts"></span>` on its own line
// where the answer begins; the toggle starts there instead.

const EXAMPLE_HEADING = /^(worked\s+)?example\s+\S/i
const isHeading = (n: RootContent): n is Element =>
  n.type === "element" && /^h[1-6]$/.test(n.tagName)
const classes = (n: Element) => {
  const c = n.properties?.className
  return Array.isArray(c) ? c.map(String) : typeof c === "string" ? c.split(" ") : []
}
const has = (n: Element, test: (el: Element) => boolean): boolean =>
  test(n) || n.children.some((c) => c.type === "element" && has(c, test))
const isMath = (n: Element) =>
  classes(n).some((c) => c === "math-display" || c === "katex-display")
const isMarker = (n: RootContent) =>
  n.type === "element" && has(n, (el) => classes(el).includes("answer-starts"))

// Blocks that go with the question when they come right after it: code, figures
// (an image and its italic caption) and interactive diagrams. Display equations don't:
// in a worked example they're usually the first step of the answer.
const isMedia = (n: Element) => {
  if (["pre", "figure", "img"].includes(n.tagName)) return true
  if (classes(n).some((c) => c.startsWith("melon-"))) return true
  if (n.tagName !== "p") return false
  // A paragraph that is only an image (and its caption)
  const prose = n.children.filter(
    (c) =>
      !(c.type === "text" && !c.value.trim()) &&
      !(c.type === "element" && ["img", "em", "br"].includes(c.tagName)),
  )
  return prose.length === 0 && has(n, (el) => el.tagName === "img")
}
// Quartz wraps each table in a <div class="table-container">
const isTable = (n: Element) =>
  n.tagName === "table" ||
  (classes(n).includes("table-container") && has(n, (el) => el.tagName === "table"))
const text = (n: Element) => toString(n).replace(/\s+/g, " ").trim()
// A short line that asks something: "What does this print?", "Find H(s)."
const ASKS =
  /^(find|determine|calculate|compute|sketch|show|write|explain|classify|draw|design|evaluate|simplify|convert|give|name|identify|predict|list|trace|fill|what|which|how|why|is|does|will)\b/i
const asks = (n: Element) =>
  n.tagName === "p" &&
  text(n).length < 240 &&
  !text(n).endsWith(":") &&
  (text(n).includes("?") || ASKS.test(text(n)))

// How many of an example's blocks make up the question
const questionLength = (blocks: Element[]) => {
  // A callout before the question ("Ties together Examples 7.4 and 7.5") is part of it
  let n = 0
  while (n < blocks.length - 1 && blocks[n].tagName === "blockquote") n++
  const first = blocks[n++]
  // Once the question has been asked, the next line of prose is the answer
  let asked = first.tagName === "p" && text(first).includes("?")
  while (n < blocks.length) {
    const prev = blocks[n - 1]
    const next = blocks[n]
    const intro = prev.tagName === "p" ? text(prev) : ""
    // "...for each of these:" introduces a list that is part of the question
    if (/:$/.test(intro) && (next.tagName === "ul" || next.tagName === "ol")) n++
    // "...for this truth table." The table holds the given data
    else if (isTable(next) && /\b(this|the following|below)\b[^.?]*\btable\b/i.test(intro)) n++
    // Data first, then the question: a table followed by "Find H(s)."
    else if (isTable(next) && /:$/.test(intro) && blocks[n + 1] && asks(blocks[n + 1])) n++
    else if (isMedia(next)) n++
    // Code (or a figure) first, then the question ("What does this print?")
    else if (!asked && prev.tagName !== "p" && asks(next)) {
      asked = true
      n++
    } else break
  }
  return n
}

// Tables that hold both the given inputs and the answers (a latch's S and R rows, with
// its Q row in bold): the question gets a copy with the bold answer rows replaced by "?".
// Only when each answer row is bold all the way across (after its label), and some rows
// aren't: a table with bold cells scattered among explanations stays in the answer.
const bold = (cell: Element) => {
  const kids = cell.children.filter((c) => !(c.type === "text" && !c.value.trim()))
  return kids.length > 0 && kids.every((c) => c.type === "element" && c.tagName === "strong")
}
const elements = (n: Element, tag: string): Element[] =>
  n.children.flatMap((c) =>
    c.type !== "element" ? [] : c.tagName === tag ? [c] : elements(c, tag),
  )
const maskedTable = (table: Element): Element | null => {
  const copy = structuredClone(table)
  const rows = elements(copy, "tr")
    .map((tr) => elements(tr, "td").slice(1))
    .filter((cells) => cells.length > 0)
  const answers = rows.filter((cells) => cells.some(bold))
  if (answers.length === 0 || answers.length === rows.length) return null
  if (!answers.every((cells) => cells.every(bold))) return null
  for (const cells of answers)
    for (const c of cells) {
      c.children = [{ type: "text", value: "?" }]
      c.properties = { ...c.properties, className: ["melon-answer-blank"] }
    }
  return copy
}

const toggle = (answer: ElementContent[]): Element => ({
  type: "element",
  tagName: "details",
  properties: { className: ["melon-answer"] },
  children: [
    {
      type: "element",
      tagName: "summary",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["melon-answer-show"] },
          children: [{ type: "text", value: "Show answer" }],
        },
        {
          type: "element",
          tagName: "span",
          properties: { className: ["melon-answer-hide"] },
          children: [{ type: "text", value: "Hide answer" }],
        },
      ],
    },
    { type: "text", value: "\n" },
    ...answer,
  ],
})

export const MelonExamples: QuartzTransformerPlugin = () => ({
  name: "MelonExamples",
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        const out: RootContent[] = []
        const nodes = tree.children
        let i = 0
        while (i < nodes.length) {
          const node = nodes[i++]
          out.push(node)
          if (!isHeading(node) || !EXAMPLE_HEADING.test(toString(node).trim())) continue
          // The example's nodes, up to the next heading or rule
          const start = i
          while (
            i < nodes.length &&
            !isHeading(nodes[i]) &&
            !(nodes[i].type === "element" && (nodes[i] as Element).tagName === "hr")
          )
            i++
          const body = nodes.slice(start, i)
          const blocks = body.filter((n): n is Element => n.type === "element")
          let split: number
          const marker = body.findIndex(isMarker)
          if (marker >= 0) {
            split = marker
            body.splice(marker, 1)
          } else {
            if (blocks.length < 2) {
              out.push(...body)
              continue
            }
            const first = blocks[questionLength(blocks)]
            split = first ? body.indexOf(first) : -1
          }
          if (split < 0 || !body.slice(split).some((n) => n.type === "element")) {
            out.push(...body)
            continue
          }
          const question = body.slice(0, split)
          const answer = body.slice(split)
          const firstAnswer = answer.find((n): n is Element => n.type === "element")
          const blank = firstAnswer && isTable(firstAnswer) ? maskedTable(firstAnswer) : null
          if (blank) question.push({ type: "text", value: "\n" }, blank)
          out.push(...question, toggle(answer as ElementContent[]))
        }
        tree.children = out
      },
    ]
  },
})
