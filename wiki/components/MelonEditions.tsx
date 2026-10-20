// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The Melon Files come in editions, each a top-level folder in content/ with its own home
// page (<key>/index.md) and its courses in <key>/courses/<code>/. The site's home page
// (content/index.md) is the door to the editions.
//
// The ECE Edition is green: its palette is in custom.scss (body[data-slug^="ece/"]), its
// icon is static/icon-ece.png and its home page draws a circuit board instead of the
// wire web (components/MelonHome.tsx).

export type Edition = {
  key: string
  // On its home page and its door on the site's home page
  title: string
  // In the band above each note and in the sidebar
  short: string
  blurb: string
  icon: string
  // The 3D backdrop on its home page: the wire-web head or the circuit-board head
  scene: "web" | "pcb"
  stamp?: string
}

// In the order of the doors on the home page
export const EDITIONS: Edition[] = [
  {
    key: "regular",
    title: "Melon Files",
    short: "Regular edition",
    blurb: "The regular edition, for mechanical engineering courses.",
    icon: "static/icon.png",
    scene: "web",
  },
  {
    key: "ece",
    title: "ECE Edition",
    short: "ECE edition",
    blurb: "Electrical and computer engineering: circuits, digital logic, Java and devices.",
    icon: "static/icon-ece.png",
    scene: "pcb",
    stamp: "ECE EDITION",
  },
]

export const editionOf = (slug?: string) =>
  EDITIONS.find((e) => (slug ?? "").startsWith(e.key + "/"))

// <edition>/index
export const isEditionHome = (slug?: string) => EDITIONS.some((e) => slug === `${e.key}/index`)

// <edition>/courses/<code>/index
export const isCourseIndex = (slug?: string) => /^[^/]+\/courses\/[^/]+\/index$/.test(slug ?? "")
