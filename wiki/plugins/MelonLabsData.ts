import fs from "fs"
import path from "path"
import { createHighlighter, type Highlighter } from "shiki"
import { QuartzTransformerPlugin } from "../types"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// Reads each course's labs/ folder (<edition>/courses/<code>/labs/) and attaches the labs to
// that course's index page, where components/MelonFolder.tsx shows them.
//
// Each file or folder directly inside labs/ is one lab:
//   labs/lab-1-op-amps.pdf      -> a PDF lab, shown in the embedded viewer
//   labs/Lab1/ (any project)    -> its source files (.java, .vhd, .v, ...) shown with
//                                  syntax highlighting, plus any PDFs and .zip/.qar files
// Build output and IDE folders (Quartus db/, NetBeans build/, ...) are skipped;
// the same folders are in ignorePatterns (quartz.config.ts) and .gitignore.

export const LAB_JUNK_DIRS = [
  "db",
  "incremental_db",
  "output_files",
  "simulation",
  "greybox_tmp",
  "build",
  "dist",
  "nbproject",
  "target",
  ".git",
  ".idea",
  ".vscode",
]

const CODE_LANGS: Record<string, string> = {
  ".java": "java",
  ".vhd": "vhdl",
  ".vhdl": "vhdl",
  ".v": "verilog",
  ".sv": "system-verilog",
  ".c": "c",
  ".h": "c",
  ".cpp": "cpp",
  ".py": "python",
  ".m": "matlab",
  ".asm": "asm",
  ".s": "asm",
  ".tcl": "tcl",
}
const DOWNLOAD_EXTS = [".zip", ".qar", ".bdf", ".jar", ".ms14"]
const MAX_CODE_BYTES = 300_000

export type LabFile = { path: string; name: string }
export type LabCode = LabFile & { lang: string; html: string }
export type Lab = {
  id: string
  name: string
  number?: number
  pdfs: LabFile[]
  code: LabCode[]
  downloads: LabFile[]
}

declare module "vfile" {
  interface DataMap {
    melonLabs: Lab[]
  }
}

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })

// "Lab1" -> "Lab 1", "lab-3_op-amps" -> "Lab 3 op amps", "Lab 1 - Hall Effect" -> "Lab 1 Hall Effect"
const prettyName = (raw: string) => {
  const s = raw
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])(\d)/gi, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

let highlighter: Promise<Highlighter> | undefined
const highlight = async (code: string, lang: string) => {
  highlighter ??= createHighlighter({ themes: ["github-light", "github-dark"], langs: [] })
  const h = await highlighter
  if (!h.getLoadedLanguages().includes(lang)) await h.loadLanguage(lang as never)
  return h.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
}

// All files under dir (relative to it), skipping build/IDE folders
const walk = (dir: string, rel = ""): string[] =>
  fs.readdirSync(path.join(dir, rel), { withFileTypes: true }).flatMap((e) => {
    const r = rel ? `${rel}/${e.name}` : e.name
    if (e.isDirectory()) return LAB_JUNK_DIRS.includes(e.name) ? [] : walk(dir, r)
    return e.isFile() ? [r] : []
  })

async function readLab(labsDir: string, labsRel: string, entry: fs.Dirent): Promise<Lab> {
  const files = entry.isDirectory() ? walk(path.join(labsDir, entry.name)).sort(byName) : [""]
  const lab: Lab = {
    id: entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: prettyName(entry.name),
    number: Number(entry.name.match(/\d+/)?.[0]) || undefined,
    pdfs: [],
    code: [],
    downloads: [],
  }

  for (const f of files) {
    const rel = f ? `${labsRel}/${entry.name}/${f}` : `${labsRel}/${entry.name}`
    const abs = path.join(labsDir, entry.name, f)
    const ext = path.extname(abs).toLowerCase()
    // Show the path inside the project, without the usual src/ prefix
    const name = (f || entry.name).replace(/^(src|rtl|hdl)\//i, "")

    if (ext === ".pdf") lab.pdfs.push({ path: rel, name })
    else if (DOWNLOAD_EXTS.includes(ext)) lab.downloads.push({ path: rel, name })
    else if (CODE_LANGS[ext]) {
      if (fs.statSync(abs).size > MAX_CODE_BYTES) lab.downloads.push({ path: rel, name })
      else {
        const html = await highlight(fs.readFileSync(abs, "utf8"), CODE_LANGS[ext])
        lab.code.push({ path: rel, name, lang: CODE_LANGS[ext], html })
      }
    }
  }
  return lab
}

export const MelonLabsData: QuartzTransformerPlugin = () => ({
  name: "MelonLabsData",
  htmlPlugins(ctx) {
    return [
      () => async (_tree, file) => {
        const m = (file.data.slug ?? "").match(/^([^/]+\/courses\/[^/]+)\/index$/)
        if (!m) return
        const labsRel = `${m[1]}/labs`
        const labsDir = path.join(ctx.argv.directory, labsRel)
        if (!fs.existsSync(labsDir)) return

        const entries = fs
          .readdirSync(labsDir, { withFileTypes: true })
          .filter((e) => !e.name.startsWith(".") && !LAB_JUNK_DIRS.includes(e.name))
          .filter((e) => e.isDirectory() || /\.(pdf|zip|qar)$/i.test(e.name) || CODE_LANGS[path.extname(e.name).toLowerCase()])
          .sort((a, b) => byName(a.name, b.name))

        const labs = await Promise.all(entries.map((e) => readLab(labsDir, labsRel, e)))
        file.data.melonLabs = labs.filter((l) => l.pdfs.length + l.code.length + l.downloads.length > 0)
      },
    ]
  },
})
