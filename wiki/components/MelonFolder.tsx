import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import FolderContent from "../pages/FolderContent"
import { QuartzPluginData } from "../../plugins/vfile"
import { FullSlug, resolveRelative } from "../../util/path"
import { isLabsPage, isReport, labsSummary } from "./MelonLabs"
import { CoursePlate, plural } from "./MelonPlate"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Body of folder pages. A course folder (courses/<code>/) shows the course plate
// (MelonPlate.tsx), its chapters as a numbered list, and beside them a link to its Labs
// page (when it has labs; see MelonLabs.tsx) and any notes in courses/<code>/concepts/.
// The text of its index.md (the outline) is not shown.
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

    const term = [fm.term, fm.status].filter(Boolean).map(String).join(", ")
    const hasAside = labs.length > 0 || concepts.length > 0

    return (
      <div class="popover-hint melon-course">
        <CoursePlate code={code} title={name}>
          {term && <span>{term}</span>}
          <span>
            {plural(chapters.length, "chapter")}
            {labs.length > 0 && `, ${plural(labs.length, "lab")}`}
          </span>
        </CoursePlate>

        <div class={hasAside ? "melon-course-body has-aside" : "melon-course-body"}>
          <section>
            <h2 class="melon-section-title">Chapters</h2>
            {chapters.length === 0 ? (
              <p class="melon-empty">No chapters written yet.</p>
            ) : (
              <ol class="melon-toc">
                {chapters.map((f, i) => (
                  <li>
                    <a href={resolveRelative(here, f.slug! as FullSlug)} class="internal melon-toc-row">
                      <span class="melon-toc-num">{chapterNumber(f.slug!, i + 1)}</span>
                      <span class="melon-toc-name">
                        {chapterName(String(f.frontmatter?.title ?? f.slug))}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {hasAside && (
            <aside class="melon-course-aside">
              {labs.length > 0 && (
                <>
                  <h2 class="melon-section-title">Labs</h2>
                  <a
                    href={resolveRelative(here, (folder + "labs/index") as FullSlug)}
                    class="internal melon-labs-link"
                  >
                    {labs.every(isReport)
                      ? "Lab reports"
                      : !labs.some(isReport)
                        ? "Lab projects"
                        : "Lab reports and projects"}
                  </a>
                  <p class="melon-aside-note">{labsSummary(labs)}</p>
                </>
              )}
              {concepts.length > 0 && (
                <>
                  <h2 class="melon-section-title">Concepts</h2>
                  <ul class="melon-concepts">
                    {concepts.map((f) => (
                      <li>
                        <a href={resolveRelative(here, f.slug! as FullSlug)} class="internal">
                          {String(f.frontmatter?.title ?? f.slug)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </aside>
          )}
        </div>
      </div>
    )
  }

  MelonFolder.css = Listing.css
  MelonFolder.beforeDOMLoaded = Listing.beforeDOMLoaded
  MelonFolder.afterDOMLoaded = Listing.afterDOMLoaded
  return MelonFolder
}) satisfies QuartzComponentConstructor<Options | undefined>
