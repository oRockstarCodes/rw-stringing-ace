import readingTime from "reading-time"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { editionOf } from "./MelonEditions"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The pink band above every note: where you are (Melon Files / COE 328 / Ch 6) on the
// left, reading time on the right. It replaces Quartz's breadcrumbs and "min read" line.
// Styles are in custom.scss (.melon-band).

type Crumb = { label: string; href?: string }

const MelonBand: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug! as FullSlug
  const parts = slug.split("/")
  const crumbs: Crumb[] = [
    { label: "Melon Files", href: resolveRelative(slug, "index" as FullSlug) },
  ]

  // Inside an edition: its name, then the course (<edition>/courses/<code>/...)
  const edition = editionOf(slug)
  if (edition) {
    crumbs.push({
      label: edition.short,
      href: resolveRelative(slug, `${edition.key}/index` as FullSlug),
    })
  }

  if (edition && parts[1] === "courses" && parts.length >= 4) {
    const courseSlug = `${edition.key}/courses/${parts[2]}/index` as FullSlug
    const course = allFiles.find((f) => f.slug === courseSlug)
    const fm = (course?.frontmatter ?? {}) as Record<string, unknown>
    crumbs.push({
      label: String(fm.code ?? parts[2].toUpperCase().replace("-", " ")),
      href: resolveRelative(slug, courseSlug),
    })

    const rest = parts.slice(3)
    const last = rest[rest.length - 1]
    const chapter = last.match(/^ch(\d+)/i)
    if (rest[0] === "concepts") crumbs.push({ label: last === "index" ? "Concepts" : "Concept" })
    else if (rest[0] === "labs") crumbs.push({ label: "Labs" })
    else if (chapter) crumbs.push({ label: `Ch ${Number(chapter[1])}` })
  } else if (slug !== "index" && !edition) {
    crumbs.push({ label: String(fileData.frontmatter?.title ?? slug) })
  }

  const text = fileData.text
  const minutes = text ? Math.max(1, Math.ceil(readingTime(text).minutes)) : 0

  return (
    <div class="melon-band melon-pagebar melon-ui">
      <nav class="melon-crumbs" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <>
            {i > 0 && (
              <span class="melon-crumb-sep" aria-hidden="true">
                /
              </span>
            )}
            {c.href ? (
              <a href={c.href} class="internal">
                {c.label}
              </a>
            ) : (
              <span>{c.label}</span>
            )}
          </>
        ))}
      </nav>
      {minutes > 0 && <span class="melon-band-meta">{minutes} min read</span>}
    </div>
  )
}

export default (() => MelonBand) satisfies QuartzComponentConstructor
