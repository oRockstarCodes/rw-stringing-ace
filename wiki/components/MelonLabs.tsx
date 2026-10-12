import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import {
  FilePath,
  FullSlug,
  joinSegments,
  pathToRoot,
  resolveRelative,
  slugifyFilePath,
} from "../../util/path"
import type { Lab } from "../../plugins/custom/MelonLabsData"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// A course's Labs page (courses/<code>/labs/, emitted by plugins/MelonLabsPage.ts).
// The labs come from the course's labs/ folder (read by plugins/MelonLabsData.ts).
// Clicking a lab opens it in the panel below the cards: PDFs in an embedded viewer,
// source code with syntax highlighting.

export const isLabsPage = (slug?: string) => /^courses\/[^/]+\/labs\/index$/.test(slug ?? "")

// A report is a lab with only PDFs; anything with code or project files is a project
export const isReport = (lab: Lab) => lab.code.length === 0 && lab.pdfs.length > 0
const schematicCount = (lab: Lab) => lab.downloads.filter((d) => /.bdf$/i.test(d.path)).length

// "2 reports", "3 projects", "2 reports · 1 project"
export const labsSummary = (labs: Lab[]) => {
  const reports = labs.filter(isReport).length
  const projects = labs.length - reports
  return [
    reports > 0 && `${reports} ${reports === 1 ? "report" : "reports"}`,
    projects > 0 && `${projects} ${projects === 1 ? "project" : "projects"}`,
  ]
    .filter(Boolean)
    .join(" · ")
}

const LANG_LABELS: Record<string, string> = {
  java: "JAVA",
  vhdl: "VHDL",
  verilog: "V",
  "system-verilog": "SV",
  c: "C",
  cpp: "C++",
  python: "PY",
  matlab: "M",
  asm: "ASM",
  tcl: "TCL",
}

// Label on the card's icon: the language of its code, else PDF, else BDF (Quartus
// schematics), else ZIP
const kindOf = (lab: Lab) =>
  lab.code.length > 0
    ? (LANG_LABELS[lab.code[0].lang] ?? lab.code[0].lang.toUpperCase())
    : lab.pdfs.length > 0
      ? "PDF"
      : schematicCount(lab) > 0
        ? "BDF"
        : "ZIP"

export const MelonLabs = ({ labs, here }: { labs: Lab[]; here: FullSlug }) => {
  const urlOf = (p: string) => joinSegments(pathToRoot(here), slugifyFilePath(p as FilePath))

  return (
    <section class="melon-labs">
      <ul class="melon-lab-list">
        {labs.map((lab, i) => {
          const first = lab.pdfs[0] ?? lab.code[0] ?? lab.downloads[0]
          return (
            <li style={`--i: ${i}`}>
              <a
                href={urlOf(first.path)}
                class="melon-lab"
                data-lab={lab.id}
                data-pdf-only={lab.code.length === 0 && lab.pdfs.length > 0 ? "" : undefined}
                target="_blank"
                rel="noopener"
                data-router-ignore
              >
                <span class="melon-lab-icon" aria-hidden="true">
                  {kindOf(lab)}
                </span>
                <span class="melon-lab-text">
                  <span class="melon-lab-name">{lab.name}</span>
                  <span class="melon-lab-meta">
                    {lab.code.length > 0
                      ? `${lab.code.length} source ${lab.code.length === 1 ? "file" : "files"}`
                      : lab.pdfs.length > 0
                        ? "Report"
                        : schematicCount(lab) > 0
                          ? `${schematicCount(lab)} ${schematicCount(lab) === 1 ? "schematic" : "schematics"}`
                          : "Download"}
                    {lab.code.length > 0 && lab.pdfs.length > 0 && " + report"}
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      {labs.map((lab) => (
        <div class="melon-lab-panel" data-lab-panel={lab.id} hidden>
          <div class="melon-viewer-bar">
            <span class="melon-viewer-title">{lab.name}</span>
            <span class="melon-viewer-actions">
              {lab.downloads.map((d) => (
                <a href={urlOf(d.path)} download data-router-ignore>
                  {d.name}
                </a>
              ))}
              {lab.pdfs.length + lab.code.length > 0 && (
                <a class="melon-viewer-open" href="#" target="_blank" rel="noopener" data-router-ignore>
                  Open ↗
                </a>
              )}
              <button class="melon-viewer-close" type="button" aria-label="Close lab">
                ✕
              </button>
            </span>
          </div>

          {lab.pdfs.length + lab.code.length > 1 && (
            <div class="melon-tabs" role="tablist">
              {[...lab.pdfs, ...lab.code].map((f, i) => (
                <button
                  type="button"
                  role="tab"
                  class={`melon-tab${i === 0 ? " active" : ""}`}
                  data-file={i}
                  title={f.path.split("/").slice(3).join("/")}
                >
                  {f.name.split("/").pop()}
                </button>
              ))}
            </div>
          )}

          {lab.pdfs.map((f, i) => (
            <div class="melon-lab-file" data-file={i} data-url={urlOf(f.path)} hidden={i !== 0}>
              <iframe class="melon-viewer-frame" data-src={urlOf(f.path)} title={f.name}></iframe>
              <a
                class="melon-pdf-fallback"
                href={urlOf(f.path)}
                target="_blank"
                rel="noopener"
                data-router-ignore
              >
                Open {f.name} ↗
              </a>
            </div>
          ))}
          {lab.code.map((f, i) => (
            <div
              class="melon-lab-file melon-code"
              data-file={lab.pdfs.length + i}
              data-url={urlOf(f.path)}
              hidden={lab.pdfs.length + i !== 0}
            >
              <p class="melon-code-path">{f.name}</p>
              <div dangerouslySetInnerHTML={{ __html: f.html }} />
            </div>
          ))}
          {lab.pdfs.length + lab.code.length === 0 && (
            <p class="melon-empty">
              {schematicCount(lab) > 0
                ? "Block diagram schematics (.bdf) only open in Quartus. Download them or the whole project above."
                : "Nothing to preview. Use the download buttons above."}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

// Opens a lab in its panel (one at a time), switches files with the tabs, and only
// loads a PDF when it is shown. On phones, PDF-only labs open the PDF directly,
// since phone browsers can't show a PDF inside a page.
export const labsScript = `
document.addEventListener("nav", () => {
  const root = document.querySelector(".melon-labs")
  if (!root) return
  const small = window.matchMedia("(max-width: 800px)")

  const showFile = (panel, index) => {
    panel.querySelectorAll(".melon-tab").forEach((t) => t.classList.toggle("active", t.dataset.file === String(index)))
    panel.querySelectorAll(".melon-lab-file").forEach((f) => {
      const on = f.dataset.file === String(index)
      f.hidden = !on
      if (!on) return
      const frame = f.querySelector("iframe[data-src]")
      if (frame && !frame.getAttribute("src")) frame.src = frame.dataset.src
      panel.querySelector(".melon-viewer-open").href = f.dataset.url
    })
  }

  const close = () => {
    root.querySelectorAll(".melon-lab-panel").forEach((p) => (p.hidden = true))
    root.querySelectorAll("a[data-lab].active").forEach((a) => a.classList.remove("active"))
  }

  const onClick = (e) => {
    if (e.target.closest(".melon-viewer-close")) return close()

    const tab = e.target.closest(".melon-tab")
    if (tab) return showFile(tab.closest(".melon-lab-panel"), tab.dataset.file)

    const card = e.target.closest("a[data-lab]")
    if (!card || e.ctrlKey || e.metaKey || e.shiftKey) return
    if (small.matches && card.hasAttribute("data-pdf-only")) return
    e.preventDefault()
    const panel = root.querySelector('[data-lab-panel="' + card.dataset.lab + '"]')
    if (!panel.hidden) return close()
    close()
    card.classList.add("active")
    panel.hidden = false
    showFile(panel, panel.querySelector(".melon-tab.active")?.dataset.file ?? 0)
    panel.classList.remove("melon-swap")
    void panel.offsetWidth
    panel.classList.add("melon-swap")
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
  root.addEventListener("click", onClick)
  window.addCleanup(() => root.removeEventListener("click", onClick))
})
`

// Body of the Labs page: header, link back to the course, then the labs
export default (() => {
  const LabsPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const here = fileData.slug! as FullSlug
    const labs = fileData.melonLabs ?? []
    const course = fileData.melonCourse
    return (
      <div class="popover-hint melon-course">
        <p class="melon-eyebrow">
          <span class="melon-dot" aria-hidden="true"></span>
          {course?.code}
        </p>
        <h1 class="melon-course-title">Labs</h1>
        <p class="melon-course-meta">
          {course && (
            <a href={resolveRelative(here, course.slug as FullSlug)} class="internal">
              ← {course.name}
            </a>
          )}
          <span>{labsSummary(labs)}</span>
        </p>
        <MelonLabs labs={labs} here={here} />
      </div>
    )
  }
  LabsPage.afterDOMLoaded = labsScript
  return LabsPage
}) satisfies QuartzComponentConstructor
