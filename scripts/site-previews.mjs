// Link previews for the main site's pages. The site is a single-page app, so every URL is
// served the same dist/index.html and would share one preview. This writes a copy of it for
// each page below (dist/about.html, dist/stringing/pricing.html, ...), which Cloudflare Pages
// serves at /about, /stringing/pricing, ..., with that page's own title, summary and image.
//
//   node scripts/site-previews.mjs           after vite build (npm run build does this)
//   node scripts/site-previews.mjs --images  redraws public/og/*.png after editing PAGES;
//                                            uses satori and sharp from the wiki's engine
//                                            (.quartz, set up by scripts/build-wiki.sh)
//
// The Melon Files make their own previews (wiki/components/MelonOgImage.tsx).

import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SITE = "https://rwangqz.ca"

// path: the URL; file: where its HTML goes in dist/; label: the small line above the title
const PAGES = [
  {
    path: "/",
    file: "index.html",
    label: "rwangqz.ca",
    title: "Course notes, stringing and side projects",
    description:
      "A Computer Engineering student at Toronto Metropolitan University: course notes in the Melon Files, RW Stringing, and a few small businesses.",
  },
  {
    path: "/about",
    file: "about.html",
    label: "rwangqz.ca",
    title: "About",
    description:
      "Computer Engineering at Toronto Metropolitan University. Runs RW Stringing, Mist Window Cleaning and Alpha Prep Tutoring, and keeps course notes in the Melon Files.",
  },
  {
    path: "/stringing",
    file: "stringing.html",
    label: "RW Stringing Service",
    title: "String Your Racket Like a Pro",
    description:
      "Calibrated tension, premium strings, and expert advice, so every shot feels exactly how you want it.",
    photo: true,
  },
  {
    path: "/stringing/about",
    file: "stringing/about.html",
    label: "RW Stringing Service",
    title: "Built by Players, for Players",
    description:
      "Tournament-quality badminton stringing, whether you're competing or playing for fun.",
    photo: true,
  },
  {
    path: "/stringing/pricing",
    file: "stringing/pricing.html",
    label: "RW Stringing · Pricing",
    title: "Transparent Pricing",
    description: "Professional stringing with competitive rates. Members receive exclusive discounts.",
    photo: true,
  },
  {
    path: "/stringing/strings",
    file: "stringing/strings.html",
    label: "RW Stringing · String Guide",
    title: "Find Your Perfect String",
    description: "Detailed specs and performance characteristics for every string we carry.",
    photo: true,
  },
  {
    path: "/stringing/contact",
    file: "stringing/contact.html",
    label: "RW Stringing · Contact",
    title: "Get In Touch",
    description:
      "Ready to get your racket professionally strung? Send a message and we'll respond shortly.",
    photo: true,
  },
]

const imageName = (page) => (page.path === "/" ? "home" : page.path.slice(1).replaceAll("/", "-"))

const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

// ---------- The HTML for each page ----------

async function writePages() {
  const dist = path.join(ROOT, "dist")
  const template = await fs.readFile(path.join(dist, "index.html"), "utf8")

  for (const page of PAGES) {
    const url = SITE + page.path
    const image = `${SITE}/og/${imageName(page)}.png`
    const title = escape(page.title)
    const description = escape(page.description)
    const tags = {
      title: `<title>${title}</title>`,
      'name="description"': `<meta name="description" content="${description}" />`,
      'rel="canonical"': `<link rel="canonical" href="${url}" />`,
      'property="og:title"': `<meta property="og:title" content="${title}" />`,
      'property="og:description"': `<meta property="og:description" content="${description}" />`,
      'property="og:url"': `<meta property="og:url" content="${url}" />`,
      'property="og:image"': `<meta property="og:image" content="${image}" />`,
      'name="twitter:image"': `<meta name="twitter:image" content="${image}" />`,
      'name="twitter:title"': `<meta name="twitter:title" content="${title}" />`,
      'name="twitter:description"': `<meta name="twitter:description" content="${description}" />`,
      'name="twitter:url"': `<meta name="twitter:url" content="${url}" />`,
    }

    let html = template
    for (const [key, tag] of Object.entries(tags)) {
      const pattern =
        key === "title" ? /<title>[^<]*<\/title>/ : new RegExp(`<(meta|link) [^>]*${key}[^>]*/?>`)
      if (!pattern.test(html)) throw new Error(`index.html has no ${key} tag`)
      html = html.replace(pattern, tag)
    }

    const out = path.join(dist, page.file)
    await fs.mkdir(path.dirname(out), { recursive: true })
    await fs.writeFile(out, html)
  }
  console.log(`Wrote link previews for ${PAGES.length} pages`)
}

// ---------- The images (--images) ----------

// The site's fonts (tailwind.config.ts), as .ttf from Google Fonts
async function font(family, weight) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}`)
  ).text()
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1]
  if (!url) throw new Error(`No .ttf for ${family} ${weight}`)
  return { name: family, weight, style: "normal", data: await (await fetch(url)).arrayBuffer() }
}

// satori takes React-like elements; a div with more than one child needs display: flex
const h = (type, style, ...children) => {
  const kids = children.flat()
  return { type, props: { style: { display: "flex", ...style }, children: kids.length === 1 ? kids[0] : kids } }
}

const INK = "#f5f5f5"
const SOFT = "#a1a1aa"
const GOLD = "#ffc105"
const PAPER = "#0f0f11"

function card(page, photo) {
  return h(
    "div",
    {
      display: "flex",
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: PAPER,
      fontFamily: "DM Sans",
    },
    // The stringing pages carry their hero photo, darkened from the left
    photo
      ? [
          { type: "img", props: { src: photo, width: 1200, height: 630, style: { position: "absolute", objectFit: "cover" } } },
          h("div", {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `linear-gradient(90deg, ${PAPER} 0%, rgba(15,15,17,0.92) 55%, rgba(15,15,17,0.45) 100%)`,
          }),
        ]
      : h("div", {
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 85% 0%, rgba(255,193,5,0.16), transparent), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(255,193,5,0.07), transparent)",
        }),
    h(
      "div",
      { display: "flex", flexDirection: "column", width: 860, height: "100%", padding: "72px 0 64px 80px" },
      h(
        "div",
        { display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: GOLD },
        page.label,
      ),
      h(
        "div",
        {
          display: "flex",
          marginTop: 30,
          fontFamily: "Outfit",
          fontWeight: 800,
          fontSize: page.title.length > 30 ? 72 : 88,
          lineHeight: 1.04,
          color: INK,
        },
        page.title,
      ),
      h("div", { display: "flex", flex: 1, marginTop: 30, fontSize: 30, lineHeight: 1.4, color: SOFT }, page.description),
      h("div", { display: "flex", width: 72, height: 6, borderRadius: 3, backgroundColor: GOLD }),
    ),
  )
}

async function drawImages() {
  const require = createRequire(path.join(ROOT, ".quartz", "package.json"))
  const satori = require("satori").default
  const sharp = require("sharp")

  const fonts = await Promise.all([font("Outfit", 800), font("DM Sans", 400), font("DM Sans", 700)])
  const photo = await sharp(path.join(ROOT, "src/assets/hero-badminton.jpg")).resize(1200, 630).jpeg().toBuffer()
  const photoUri = `data:image/jpeg;base64,${photo.toString("base64")}`

  const outDir = path.join(ROOT, "public", "og")
  await fs.mkdir(outDir, { recursive: true })
  for (const page of PAGES) {
    const svg = await satori(card(page, page.photo && photoUri), { width: 1200, height: 630, fonts })
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${imageName(page)}.png`))
  }
  console.log(`Drew ${PAGES.length} preview images in public/og/`)
}

await (process.argv.includes("--images") ? drawImages() : writePages())
