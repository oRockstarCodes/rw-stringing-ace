import { JSX } from "preact"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Small pieces shared by the course page and the Labs page: the header (a pink band with
// the course code, then the title) and the "Specs" strip. Styles are in custom.scss.

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

type Children = JSX.Element[] | JSX.Element | string | false | undefined

export const CoursePlate = (props: { code: string; title: string; children?: Children }) => (
  <div class="melon-plate">
    <div class="melon-band melon-ui">
      <span>{props.code}</span>
      <span class="melon-band-meta">{props.children}</span>
    </div>
    <h1 class="melon-course-title">{props.title}</h1>
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
