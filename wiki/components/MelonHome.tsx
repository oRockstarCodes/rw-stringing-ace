import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { isChapterOf } from "./MelonFolder"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Home page hero + course cards, built from the notes in courses/<code>/.
// Nothing here needs editing when a course is added: each courses/<code>/index.md
// becomes a card, using its `code`, `term`, and `status` properties.
// The whole site is the ECE Edition for now (the tag next to the title, and under the
// sidebar title in custom.scss).

const MelonHome: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const here = fileData.slug! as FullSlug
  const slugs = allFiles.map((f) => f.slug ?? "")

  const courses = allFiles
    .filter((f) => /^courses\/[^/]+\/index$/.test(f.slug ?? ""))
    .map((f) => {
      const folder = f.slug!.replace(/index$/, "")
      const fm = (f.frontmatter ?? {}) as Record<string, unknown>
      const title = String(fm.title ?? folder)
      const code = String(fm.code ?? title.split(":")[0])
      return {
        slug: f.slug! as FullSlug,
        code,
        name: title.includes(":") ? title.slice(title.indexOf(":") + 1).trim() : title,
        term: fm.term ? String(fm.term) : undefined,
        status: fm.status ? String(fm.status) : undefined,
        chapters: slugs.filter((s) => isChapterOf(folder, s)).length,
        labs: f.melonLabs?.length ?? 0,
      }
    })
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))

  const chapterCount = courses.reduce((n, c) => n + c.chapters, 0)
  const labCount = courses.reduce((n, c) => n + c.labs, 0)

  return (
    <section class="melon-home">
      <div class="melon-hero">
        <p class="melon-eyebrow">
          <span class="melon-dot" aria-hidden="true"></span>
          Rocky Wang · course wiki
        </p>
        <h1 class="melon-title">
          Melon <span>Files</span>
          {/* "ECE Edition" rubber stamp: text around the ring, a resistor in the middle,
              roughened by an SVG filter to look printed. Styles/animation in custom.scss. */}
          <span class="melon-stamp" role="img" aria-label="ECE Edition">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path
                  id="melon-stamp-ring"
                  d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
                />
                <filter id="melon-ink" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
                  <feDisplacementMap in="SourceGraphic" scale="2.4" />
                </filter>
              </defs>
              <g filter="url(#melon-ink)">
                <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="3.5" />
                <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" stroke-width="1.6" />
                <g class="melon-stamp-ring">
                  <text fill="currentColor">
                    <textPath href="#melon-stamp-ring" textLength="268" lengthAdjust="spacing">
                      ECE EDITION • ECE EDITION •
                    </textPath>
                  </text>
                </g>
                <path
                  d="M37 60 h8 l3.5 -8 l7 16 l7 -16 l7 16 l3.5 -8 h8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.6"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </g>
            </svg>
          </span>
        </h1>
        <p class="melon-tagline">
          Linked notes from every course I take, chapter by chapter: formulas, worked examples,
          and the ideas behind them.
        </p>
        <dl class="melon-stats">
          <div>
            <dt>Courses</dt>
            <dd>{courses.length}</dd>
          </div>
          <div>
            <dt>Chapters</dt>
            <dd>{chapterCount}</dd>
          </div>
          {labCount > 0 && (
            <div>
              <dt>Labs</dt>
              <dd>{labCount}</dd>
            </div>
          )}
        </dl>
      </div>

      <h2 class="melon-section-title">Courses</h2>
      <ul class="melon-courses">
        {courses.map((c, i) => (
          <li style={`--i: ${i}`}>
            <a href={resolveRelative(here, c.slug)} class="internal melon-card">
              <span class="melon-card-code">{c.code}</span>
              <span class="melon-card-name">{c.name}</span>
              <span class="melon-card-meta">
                <span>
                  {c.chapters} {c.chapters === 1 ? "chapter" : "chapters"}
                </span>
                {c.labs > 0 && (
                  <span>
                    {c.labs} {c.labs === 1 ? "lab" : "labs"}
                  </span>
                )}
                {c.term && <span>{c.term}</span>}
                {c.status && <span class="melon-card-status">{c.status}</span>}
              </span>
              <span class="melon-card-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default (() => MelonHome) satisfies QuartzComponentConstructor
