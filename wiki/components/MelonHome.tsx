import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, joinSegments, pathToRoot, resolveRelative } from "../../util/path"
import { isChapterOf } from "./MelonFolder"
import { plural } from "./MelonPlate"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Home page masthead (the site's print, the title, the "ECE Edition" stamp) and the list
// of courses, built from the notes in courses/<code>/.
// Nothing here needs editing when a course is added: each courses/<code>/index.md
// becomes a row, using its `code`, `term`, and `status` properties.

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

  return (
    <section class="melon-home">
      <div class="melon-masthead">
        <img
          class="melon-print"
          src={joinSegments(pathToRoot(here), "static/icon.png")}
          alt=""
          width="256"
          height="256"
        />
        <div class="melon-masthead-text">
          <h1 class="melon-title">Melon Files</h1>
          <p class="melon-tagline">
            Linked notes from every course I take, chapter by chapter: formulas, worked examples,
            and the ideas behind them.
          </p>
        </div>
        {/* "ECE Edition" rubber stamp: text around the ring, a resistor in the middle,
            roughened by an SVG filter to look printed. The whole site is the ECE Edition
            for now. Styles and the press-in animation are in custom.scss. */}
        <span class="melon-stamp" role="img" aria-label="ECE Edition">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="melon-stamp-ring" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
              <filter id="melon-ink" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
                <feDisplacementMap in="SourceGraphic" scale="2.4" />
              </filter>
            </defs>
            <g filter="url(#melon-ink)">
              <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="3.5" />
              <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" stroke-width="1.6" />
              <text fill="currentColor">
                <textPath href="#melon-stamp-ring" textLength="268" lengthAdjust="spacing">
                  ECE EDITION • ECE EDITION •
                </textPath>
              </text>
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
      </div>

      <h2 class="melon-section-title">Courses</h2>
      <ul class="melon-contents">
        {courses.map((c) => (
          <li>
            <a href={resolveRelative(here, c.slug)} class="internal melon-row">
              <span class="melon-row-code">{c.code}</span>
              <span class="melon-row-name">{c.name}</span>
              <span class="melon-row-meta">
                <span>
                  {plural(c.chapters, "chapter")}
                  {c.labs > 0 && `, ${plural(c.labs, "lab")}`}
                </span>
                {c.term && (
                  <span>
                    {c.term}
                    {c.status && `, ${c.status}`}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default (() => MelonHome) satisfies QuartzComponentConstructor
