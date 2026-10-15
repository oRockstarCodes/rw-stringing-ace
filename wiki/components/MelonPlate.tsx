import { JSX } from "preact"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The header of a course page and its Labs page: the course code, large and carved
// (roughened by the #melon-carve filter in MelonMotion.tsx), on a block of paper pink.
// Styles and its press-in animation are in custom.scss.

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

export const CoursePlate = (props: { code: string; title: string; children?: JSX.Element[] | JSX.Element }) => (
  <div class="melon-plate">
    <p class="melon-plate-code">{props.code}</p>
    <h1 class="melon-course-title">{props.title}</h1>
    <p class="melon-course-meta">{props.children}</p>
  </div>
)
