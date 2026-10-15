import { JSX } from "preact"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The picture at the top of a course page: the course drawn the way its subject draws
// things, with the chapters as its parts. Every chapter is a real link, so on a phone
// each motif simply becomes a single column.
//
//   class      a UML class (COE 318: software)       chapters are methods
//   chip       an IC package (COE 328: logic)        chapters are pins
//   schematic  a ladder diagram (ELE 302: circuits)  chapters are components
//   band       an energy band diagram (PCS 224)      chapters are energy levels
//   list       a plain numbered list (any other course)
//
// The motif comes from the course's `motif` property if it has one, otherwise from the
// table below. A new course shows the plain list until it's added here.
// Styles are in custom.scss.

export type MotifKind = "class" | "chip" | "schematic" | "band" | "list"

export type MotifChapter = { href: string; n: number; name: string }

const KINDS: MotifKind[] = ["class", "chip", "schematic", "band", "list"]

const BY_COURSE: Record<string, MotifKind> = {
  "coe-318": "class",
  "coe-328": "chip",
  "ele-302": "schematic",
  "pcs-224": "band",
}

// folder is "courses/coe-328/"
export const motifFor = (folder: string, fm: Record<string, unknown>): MotifKind => {
  const own = String(fm.motif ?? "").toLowerCase() as MotifKind
  if (KINDS.includes(own)) return own
  const course = folder.replace(/^courses\//, "").replace(/\/$/, "")
  return BY_COURSE[course] ?? "list"
}

const words = (s: string) =>
  s
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)

const capital = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()

// "Software Systems" -> "SoftwareSystems", "Classes and Objects" -> "classesAndObjects"
const pascal = (s: string) => words(s).map(capital).join("")
const camel = (s: string) => {
  const w = words(s)
  return w.map((x, i) => (i === 0 ? x.toLowerCase() : capital(x))).join("")
}

type Props = {
  kind: MotifKind
  code: string
  name: string
  chapters: MotifChapter[]
  term?: string
  status?: string
  labs: number
}

const Empty = () => <p class="melon-empty">No chapters written yet.</p>

const Class = (p: Props) => (
  <div class="melon-motif melon-uml">
    <div class="melon-uml-head">{pascal(p.name)}</div>
    <ul class="melon-uml-fields">
      <li>
        <span class="melon-vis">-</span> code: String = "{p.code}"
      </li>
      {p.term && (
        <li>
          <span class="melon-vis">-</span> term: String = "{p.term}"
        </li>
      )}
      {p.labs > 0 && (
        <li>
          <span class="melon-vis">-</span> labs: int = {p.labs}
        </li>
      )}
    </ul>
    {p.chapters.length === 0 ? (
      <div class="melon-uml-empty">
        <Empty />
      </div>
    ) : (
      <ol class="melon-uml-methods melon-ui">
        {p.chapters.map((c) => (
          <li>
            <a href={c.href} class="internal melon-method">
              <span class="melon-vis">+</span> {camel(c.name)}()
              <span class="melon-method-n"> // ch {c.n}</span>
            </a>
          </li>
        ))}
      </ol>
    )}
  </div>
)

const Pin = ({ c }: { c: MotifChapter }) => (
  <li>
    <a href={c.href} class="internal melon-pin">
      <span class="melon-leg" aria-hidden="true"></span>
      <span class="melon-pin-n">{c.n}</span>
      <span class="melon-pin-name">{c.name}</span>
    </a>
  </li>
)

const Chip = (p: Props) => {
  const half = Math.ceil(p.chapters.length / 2)
  const [first, ...rest] = p.code.split(" ")
  return (
    <div class="melon-motif melon-chip melon-ui">
      <div class="melon-chip-body">
        <span class="melon-chip-code">
          {first}
          {rest.length > 0 && <br />}
          {rest.join(" ")}
        </span>
        <span class="melon-chip-name">{p.name}</span>
      </div>
      <ol class="melon-pins melon-pins-left">
        {p.chapters.slice(0, half).map((c) => (
          <Pin c={c} />
        ))}
      </ol>
      <ol class="melon-pins melon-pins-right" start={half + 1}>
        {p.chapters.slice(half).map((c) => (
          <Pin c={c} />
        ))}
      </ol>
      {p.chapters.length === 0 && (
        <div class="melon-chip-empty">
          <Empty />
        </div>
      )}
    </div>
  )
}

// One part per chapter, cycling resistor, capacitor, inductor, source. The label is the
// part's reference designator, like R5 or C8.
const PARTS: { letter: string; symbol: JSX.Element }[] = [
  {
    letter: "R",
    symbol: (
      <svg viewBox="0 0 48 20" aria-hidden="true">
        <polyline points="0,10 8,10 11,3 17,17 23,3 29,17 35,3 38,10 48,10" />
      </svg>
    ),
  },
  {
    letter: "C",
    symbol: (
      <svg viewBox="0 0 48 20" aria-hidden="true">
        <polyline points="0,10 20,10" />
        <line x1="20" y1="2" x2="20" y2="18" />
        <line x1="28" y1="2" x2="28" y2="18" />
        <polyline points="28,10 48,10" />
      </svg>
    ),
  },
  {
    letter: "L",
    symbol: (
      <svg viewBox="0 0 48 20" aria-hidden="true">
        <polyline points="0,14 8,14" />
        <path d="M8 14 a6 7 0 0 1 12 0 a6 7 0 0 1 12 0 a6 7 0 0 1 12 0" />
        <polyline points="40,14 48,14" />
      </svg>
    ),
  },
  {
    letter: "V",
    symbol: (
      <svg viewBox="0 0 48 20" aria-hidden="true">
        <polyline points="0,10 14,10" />
        <circle cx="24" cy="10" r="9" />
        <polyline points="34,10 48,10" />
        <polyline points="20,10 28,10" />
        <polyline points="24,6 24,14" />
      </svg>
    ),
  },
]

// Parts sit in parallel between two rails: a left rail with a node at each rung, and a
// right rail that ends in ground. Every wire touches the part and the rails it joins.
const Schematic = (p: Props) => (
  <div class="melon-motif melon-ladder-wrap melon-ui">
    {p.chapters.length === 0 ? (
      <Empty />
    ) : (
      <div class="melon-ladder">
        <ol class="melon-rungs">
          {p.chapters.map((c, i) => {
            const part = PARTS[i % PARTS.length]
            return (
              <li>
                <a href={c.href} class="internal melon-rung">
                  <span class="melon-node" aria-hidden="true"></span>
                  <span class="melon-wire" aria-hidden="true"></span>
                  <span class="melon-part">{part.symbol}</span>
                  <span class="melon-wire" aria-hidden="true"></span>
                  <span class="melon-rung-label">
                    <span class="melon-ref">
                      {part.letter}
                      {c.n}
                    </span>
                    <span class="melon-rung-name">{c.name}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
        <div class="melon-ground" aria-hidden="true">
          <svg viewBox="0 0 24 16">
            <line x1="12" y1="0" x2="12" y2="6" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="7" y1="10" x2="17" y2="10" />
            <line x1="10" y1="14" x2="14" y2="14" />
          </svg>
        </div>
      </div>
    )}
  </div>
)

const Band = (p: Props) => {
  const mid = Math.ceil(p.chapters.length / 2)
  return (
    <div class="melon-motif melon-bands melon-ui">
      <div class="melon-band-edge">
        <span class="melon-edge-label">Ec</span> conduction band
      </div>
      {p.chapters.length === 0 ? (
        <div class="melon-levels-empty">
          <Empty />
        </div>
      ) : (
        <ol class="melon-levels">
          {p.chapters.map((c, i) => (
            <>
              {i === mid && (
                <li class="melon-fermi" aria-hidden="true">
                  <span class="melon-edge-label">Ef</span>
                </li>
              )}
              <li>
                <a href={c.href} class="internal melon-level">
                  <span class="melon-level-n">{c.n}</span>
                  <span class="melon-level-name">{c.name}</span>
                </a>
              </li>
            </>
          ))}
        </ol>
      )}
      <div class="melon-band-edge">
        <span class="melon-edge-label">Ev</span> valence band
      </div>
    </div>
  )
}

const List = (p: Props) => (
  <div class="melon-motif melon-ui">
    {p.chapters.length === 0 ? (
      <Empty />
    ) : (
      <ol class="melon-toc">
        {p.chapters.map((c) => (
          <li>
            <a href={c.href} class="internal melon-toc-row">
              <span class="melon-toc-num">{c.n}</span>
              <span class="melon-toc-name">{c.name}</span>
            </a>
          </li>
        ))}
      </ol>
    )}
  </div>
)

export const CourseMotif = (p: Props) => {
  switch (p.kind) {
    case "class":
      return <Class {...p} />
    case "chip":
      return <Chip {...p} />
    case "schematic":
      return <Schematic {...p} />
    case "band":
      return <Band {...p} />
    default:
      return <List {...p} />
  }
}
