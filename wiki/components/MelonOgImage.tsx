import { readFileSync } from "node:fs"
import { SocialImageOptions } from "../../util/og"
import { getFontSpecificationName } from "../../util/theme"
import { joinSegments, QUARTZ } from "../../util/path"
import { editionOf } from "./MelonEditions"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The link-preview image for each page (Plugin.CustomOgImages in quartz.config.ts): the
// page's own title and summary, with where it sits (edition, course) above them and the
// edition's print on the right, in the edition's colors. Rendered with satori, so every
// element with more than one child needs display: flex.

const palettes = {
  regular: { paper: "#1c181a", ring: "#2b2428", ring2: "#3a2f35", ink: "#eadbe2", soft: "#b8a5ae", accent: "#d4a0b7" },
  ece: { paper: "#161a15", ring: "#222a20", ring2: "#2e3a2a", ink: "#e0eada", soft: "#a9b8a2", accent: "#a6d27c" },
}

const icons: Record<string, string> = {}
const iconFor = (file: string) => {
  if (!(file in icons)) {
    try {
      const data = readFileSync(joinSegments(QUARTZ, file))
      icons[file] = `data:image/png;base64,${data.toString("base64")}`
    } catch {
      icons[file] = ""
    }
  }
  return icons[file]
}

export const melonOgImage: SocialImageOptions["imageStructure"] = ({ cfg, title, description, fileData }) => {
  const slug = fileData.slug ?? ""
  const parts = slug.split("/")
  const edition = editionOf(slug)
  const colors = palettes[edition?.key === "ece" ? "ece" : "regular"]
  const icon = iconFor(edition?.icon ?? "static/icon.png")

  // Where the page sits: the edition, then the course code (<edition>/courses/<code>/...)
  const where = [edition?.title ?? "Melon Files"]
  if (edition && parts[1] === "courses" && parts.length >= 4) {
    where.push(fileData.frontmatter?.code ?? parts[2].replace("-", " ").toUpperCase())
  }

  // (not on a page whose title already says it, like the home pages)
  if (where.length === 1 && where[0] === title) where.pop()

  const headerFont =getFontSpecificationName(cfg.theme.typography.header)
  const bodyFont = getFontSpecificationName(cfg.theme.typography.body)

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: colors.paper,
        fontFamily: bodyFont,
        overflow: "hidden",
      }}
    >
      {/* The edition's print, in rings, off the right edge */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: -170,
          top: 15,
          width: 600,
          height: 600,
          borderRadius: 300,
          backgroundColor: colors.ring,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 440,
            height: 440,
            borderRadius: 220,
            backgroundColor: colors.ring2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon && <img src={icon} width={300} height={300} style={{ borderRadius: 150 }} />}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 760,
          height: "100%",
          padding: "64px 0 56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: colors.accent,
          }}
        >
          {where.join("  ·  ")}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: headerFont,
            fontWeight: 800,
            fontSize: title.length > 40 ? 56 : title.length > 22 ? 68 : 84,
            lineHeight: 1.08,
            color: colors.ink,
          }}
        >
          {title.length > 70 ? title.slice(0, title.lastIndexOf(" ", 68)) + "…" : title}
        </div>

        {/* The summary is kept short by plugins/MelonSummary.ts */}
        <div style={{ display: "flex", flex: 1, marginTop: 28, fontSize: 28, lineHeight: 1.4, color: colors.soft }}>
          {description}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: colors.soft }}>{cfg.baseUrl}</div>
      </div>
    </div>
  )
}
