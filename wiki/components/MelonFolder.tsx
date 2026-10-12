import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import FolderContent from "../pages/FolderContent"
import { QuartzPluginData } from "../../plugins/vfile"
import { FullSlug, resolveRelative } from "../../util/path"
import { isLabsPage, isReport, labsSummary } from "./MelonLabs"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Body of folder pages. A course folder (courses/<code>/) shows a course header,
// its chapters as cards, a card linking to its Labs page (when it has labs; see
// MelonLabs.tsx), and any notes in courses/<code>/concepts/ as a list. The text of its
// index.md (the outline) is not shown.
// Every other folder falls back to Quartz's normal listing.

export const isCoursePage = (slug?: string) => /^courses\/[^/]+\/index$/.test(slug ?? "")

// Folder pages that draw their own header instead of Quartz's title + date
export const hasOwnHeader = (slug?: string) => isCoursePage(slug) || isLabsPage(slug)

// Chapters are the notes directly in a course folder. Subfolders (e.g. concepts/) are not chapters.
export const isChapterOf = (folder: string, slug?: string) => {
  const s = slug ?? ""
  return s.startsWith(folder) && !s.endsWith("/index") && !s.slice(folder.length).includes("/")
}

// "2. Classes and Objects" / "Ch 3: Network Theorems" -> "Classes and Objects" / "Network Theorems"
const chapterName = (title: string) => title.replace(/^\s*(ch(apter)?\.?\s*)?\d+\s*[:.\-–]\s*/i, "")

const chapterNumber = (slug: string, fallback: number) => {
  const m = slug.match(/\/ch(\d+)/i)
  return m ? Number(m[1]) : fallback
}

type Options = { sort?: (a: QuartzPluginData, b: QuartzPluginData) => number }

export default ((opts?: Options) => {
  const Listing = FolderContent({ sort: opts?.sort })

  const MelonFolder: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props
    if (!isCoursePage(fileData.slug)) return <Listing {...props} />

    const here = fileData.slug! as FullSlug
    const folder = here.replace(/index$/, "")
    const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
    const title = String(fm.title ?? folder)
    const code = String(fm.code ?? title.split(":")[0])
    const name = title.includes(":") ? title.slice(title.indexOf(":") + 1).trim() : title

    const byName = (a: QuartzPluginData, b: QuartzPluginData) =>
      (a.slug ?? "").localeCompare(b.slug ?? "", undefined, { numeric: true, sensitivity: "base" })
    const chapters = allFiles.filter((f) => isChapterOf(folder, f.slug)).sort(byName)
    const concepts = allFiles
      .filter((f) => {
        const s = f.slug ?? ""
        return s.startsWith(folder + "concepts/") && !s.endsWith("/index")
      })
      .sort((a, b) => String(a.frontmatter?.title).localeCompare(String(b.frontmatter?.title)))
    const labs = fileData.melonLabs ?? []

    return (
      <div class="popover-hint melon-course">
        <p class="melon-eyebrow">
          <span class="melon-dot" aria-hidden="true"></span>
          {code}
        </p>
        <h1 class="melon-course-title">{name}</h1>
        <p class="melon-course-meta">
          {fm.term && <span>{String(fm.term)}</span>}
          {fm.status && <span class="melon-card-status">{String(fm.status)}</span>}
          <span>
            {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
          </span>
          {labs.length > 0 && (
            <span>
              {labs.length} {labs.length === 1 ? "lab" : "labs"}
            </span>
          )}
        </p>

        {chapters.length === 0 ? (
          <p class="melon-empty">No chapters yet.</p>
        ) : (
          <ol class="melon-chapters">
            {chapters.map((f, i) => {
              const n = chapterNumber(f.slug!, i + 1)
              const num = <span class="melon-chapter-num">{String(n).padStart(2, "0")}</span>
              const name = (
                <span class="melon-card-name">
                  {chapterName(String(f.frontmatter?.title ?? f.slug))}
                </span>
              )
              // Chapters that are still an empty template aren't linked yet
              if (f.melonEmpty) {
                return (
                  <li style={`--i: ${i}`}>
                    <div class="melon-card melon-card-soon" aria-disabled="true">
                      {num}
                      {name}
                      <span class="melon-soon-tag">Coming soon</span>
                    </div>
                  </li>
                )
              }
              return (
                <li style={`--i: ${i}`}>
                  <a href={resolveRelative(here, f.slug! as FullSlug)} class="internal melon-card">
                    {num}
                    {name}
                    <span class="melon-card-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        )}

        {labs.length > 0 && (
          <>
            <h2 class="melon-section-title">Labs</h2>
            <ul class="melon-courses">
              <li style={`--i: ${chapters.length}`}>
                <a
                  href={resolveRelative(here, (folder + "labs/index") as FullSlug)}
                  class="internal melon-card"
                >
                  <span class="melon-card-code">LABS</span>
                  <span class="melon-card-name">
                    {labs.every(isReport)
                      ? "Lab reports"
                      : !labs.some(isReport)
                        ? "Lab projects"
                        : "Lab reports & projects"}
                  </span>
                  <span class="melon-card-meta">
                    <span>{labsSummary(labs)}</span>
                  </span>
                  <span class="melon-card-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            </ul>
          </>
        )}

        {concepts.length > 0 && (
          <>
            <h2 class="melon-section-title">Concepts</h2>
            <ul class="melon-concepts">
              {concepts.map((f) => (
                <li>
                  <a href={resolveRelative(here, f.slug! as FullSlug)} class="internal tag-link">
                    {String(f.frontmatter?.title ?? f.slug)}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }

  MelonFolder.css = Listing.css
  MelonFolder.beforeDOMLoaded = Listing.beforeDOMLoaded
  MelonFolder.afterDOMLoaded = Listing.afterDOMLoaded
  return MelonFolder
}) satisfies QuartzComponentConstructor<Options | undefined>
