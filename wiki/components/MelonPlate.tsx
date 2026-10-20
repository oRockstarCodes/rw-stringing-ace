import { JSX } from "preact"
import type { MotifChapter } from "./MelonMotif"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Small pieces shared by the course page and the Labs page: the header (a pink band with
// the course code, then the title) and the "Specs" strip. Styles are in custom.scss.

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

type Children = JSX.Element[] | JSX.Element | string | false | undefined

// With a scene (the course page), the title sits on a stage over a 3D drawing of the course
// (MelonCourse3D.tsx) and its letters rise in like the home page title. Each chapter is a
// part of the drawing: its link is drawn here, and the script pins it to that part.
export const CoursePlate = (props: {
  code: string
  title: string
  scene?: string
  parts?: MotifChapter[]
  children?: Children
}) => (
  <div class="melon-plate" data-scene={props.scene}>
    <div class="melon-band melon-ui">
      <span>{props.code}</span>
      <span class="melon-band-meta">{props.children}</span>
    </div>
    {props.scene ? (
      <div class="melon-plate-stage">
        <canvas class="melon-plate-gl" aria-hidden="true"></canvas>
        <h1 class="melon-course-title" aria-label={props.title}>
          {props.title.split(/\s+/).map((word, w, all) => {
            const before = all.slice(0, w).join("").length
            return (
              <span class="melon-word" aria-hidden="true">
                {word.split("").map((ch, i) => (
                  <span class="melon-letter" style={`--i:${before + i}`}>
                    {ch}
                  </span>
                ))}
              </span>
            )
          })}
        </h1>
        {props.parts && props.parts.length > 0 && (
          <nav class="melon-plate-parts melon-ui" aria-label="Chapters">
            {props.parts.map((c) => (
              <a href={c.href} class="internal melon-plate-link" aria-label={`Chapter ${c.n}: ${c.name}`}>
                <span class="melon-plate-link-n">{c.n}</span>
                <span class="melon-plate-link-name">{c.name}</span>
              </a>
            ))}
          </nav>
        )}
      </div>
    ) : (
      <h1 class="melon-course-title">{props.title}</h1>
    )}
  </div>
)

// Rows with no value are left out
export const Specs = (props: { rows: [string, string | undefined][] }) => (
  <section class="melon-specs" aria-label="Specs">
    <dl>
      {props.rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
    </dl>
  </section>
)
