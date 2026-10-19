---
name: rwangqz.ca
description: Two sibling systems under one name: Melon Files, a dusty-pink lab-notebook wiki, and the near-black, gold-accented React site (home and RW Stringing).
colors:
  wiki-paper: "#fbf6f8"
  wiki-rule: "#e6d3dc"
  wiki-gray: "#7d6b74"
  wiki-ink-soft: "#43393e"
  wiki-ink: "#231f20"
  wiki-rose: "#8c4a67"
  wiki-plum: "#6f5666"
  wiki-band: "#ead3de"
  wiki-band-text: "#2a1d24"
  wiki-chip: "#3a2d34"
  wiki-chip-text: "#f4d9e4"
  wiki-night: "#1c181a"
  wiki-night-rose: "#d4a0b7"
  wiki-night-band: "#4a3540"
  site-night: "#0f0f11"
  site-card: "#181819"
  site-border: "#2e2e30"
  site-text: "#f5f5f5"
  site-muted: "#a1a1aa"
  site-gold: "#ffc105"
typography:
  wiki-header:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  wiki-body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  wiki-code:
    fontFamily: "JetBrains Mono, monospace"
  site-display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  site-body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
rounded:
  wiki: "6px"
  site-md: "10px"
  site-lg: "12px"
  site-pill: "9999px"
spacing:
  wiki-grid: "16px"
  site-grid: "48px"
  site-container-pad: "1.5rem"
components:
  wiki-band:
    backgroundColor: "{colors.wiki-band}"
    textColor: "{colors.wiki-band-text}"
    rounded: "{rounded.wiki}"
    padding: "0.5rem 0.95rem"
  wiki-chip:
    backgroundColor: "{colors.wiki-chip}"
    textColor: "{colors.wiki-chip-text}"
    rounded: "{rounded.wiki}"
  button-gold:
    backgroundColor: "{colors.site-gold}"
    textColor: "{colors.site-night}"
    rounded: "{rounded.site-pill}"
  card-premium:
    backgroundColor: "{colors.site-card}"
    textColor: "{colors.site-text}"
    rounded: "{rounded.site-lg}"
---

# Design System: rwangqz.ca

## Overview

**Creative North Star: "The Lab Notebook"** (for Melon Files)

rwangqz.ca runs two visual systems at equal weight. **Melon Files** (`/melon-files/*`, Quartz, `wiki/custom.scss`) is an engineering pad made public: black ink on dusty pink, grid paper behind hubs, form-header bands that say where you are, a ruled pink margin down every note, and section headings that run out into a short trace ending at a via. Each course is drawn the way its subject draws things (circuits, logic, timing). **The React site** (`/`, `/about`, `/projects`, `/stringing/*`, `src/index.css`) is a near-black, gold-accented stage with soft glows and pointer-following spotlights.

The wiki is deliberately precise and quiet: flat surfaces, a 6px radius, depth by tone and rule rather than shadow, and motion reserved for diagrams that teach. The React site is warmer and more theatrical: glow, gradient, and tilt. They share a name and nothing else. Do not leak gold into the wiki or dusty pink into the stringing pages.

**Key Characteristics:**
- Wiki: ink-on-pink, serif body, condensed Archivo headings, grid paper on hubs, flat.
- Site: charcoal ground, one gold accent, Outfit headings, rounded-xl cards with a gold-tinted hover glow.
- Both follow light/dark. The wiki follows the visitor's system setting (dark if none) with a toggle. The React site is dark only.

## Colors

The wiki palette is dusty-rose and plum on a warm off-white (light) or aubergine-black (dark). The site palette is neutral charcoal with a single saturated gold.

### Primary
- **Dusty Rose** (#8c4a67 light, #d4a0b7 dark): links, the current page, selection tint. The wiki's one accent.
- **Signal Gold** (#ffc105, hsl 45 100% 51%): the site's only accent; primary buttons, rings, focus, glows, stat values.

### Secondary
- **Plum** (#6f5666 light, #b494a5 dark): tertiary wiki text and chrome.

### Neutral
- **Notebook Paper** (#fbf6f8) and **Night Plum** (#1c181a): wiki page grounds.
- **Form-Header Pink** (#ead3de, dark #4a3540) with ink text (#2a1d24 / #ecd9e2): the band.
- **Ink Chip** (#3a2d34 on #f4d9e4; dark inverted): small labels such as course codes.
- **Rule Pink** (#e6d3dc) and **Pencil Gray** (#7d6b74): borders and secondary text.
- **Ink** (#231f20 light, #eadbe2 dark): wiki text.
- **Stage Black** (#0f0f11), **Card Charcoal** (#181819), **Hairline** (#2e2e30), **Off-White** (#f5f5f5), **Muted Silver** (#a1a1aa): the site's ground, surface, border, text and secondary text.

### Named Rules
**The Two Palettes Rule.** Dusty rose belongs to Melon Files, gold belongs to the React site. Neither crosses over.
**The One Voice Rule.** Each system has exactly one accent; it is used for links, state and emphasis, not for decoration.

## Typography

**Wiki Display:** Archivo (500/700/800, condensed via `font-stretch` 70–90%)
**Wiki Body:** Source Serif 4, matched to the KaTeX math set in it
**Wiki Code:** JetBrains Mono
**Site Display:** Outfit (500–800), tight -0.02em tracking
**Site Body:** DM Sans

**Character:** The wiki pairs condensed grotesque headings, like stamped form labels, with a bookish serif that sits well beside equations. The site pairs geometric Outfit with friendly DM Sans.

### Hierarchy
- **Wiki Title** (800, clamp(2.2rem, 4.5vw, 3rem), 1.02, stretch 70%): note and hub titles.
- **Wiki H2** (800, 1.55rem, stretch 85%): section headings, followed by the trace motif.
- **Wiki H3** (700, 1.2rem, stretch 90%).
- **Wiki Body** (400, 1.0625rem / 1.7; 1rem on phones): prose capped at 40em.
- **Band** (700, 0.95rem, stretch 80%): crumbs and metadata.
- **Site Headings** (Outfit 600–800, -0.02em): hero and section titles.
- **Site Stat** (Outfit 700, 3xl to 4xl, gold gradient fill).

### Named Rules
**The Measure Rule.** Prose in the wiki stays near 40em. Tables, code, figures and diagrams may use the full width.

## Layout

The wiki is a three-zone Quartz layout (explore sidebar, article, margin) with a 16px grid-paper ground on the home page and course hubs only. Notes use a 2px pink margin line on the left at widths over 800px. Below 800px body text drops to 1rem and chrome collapses to a top bar. The React site uses a centered container (1.5rem padding, 1280px at 2xl), generous vertical sections, and an optional 48px "court pattern" grid.

## Elevation & Depth

**Wiki:** flat. Depth comes from the pink band, tone shifts, the margin rule, and a soft 6px halo ring on emphasis. Shadows are not a structural device.

**Site:** layered glow. Cards sit on a charcoal gradient; on hover a gold-tinted shadow (`0 8px 32px -8px` at 15% gold) and a 360px radial spotlight following the pointer appear.

### Named Rules
**The Flat Wiki Rule.** No drop shadows on wiki surfaces at rest or hover.
**The Glow-On-Response Rule.** On the site, gold glow appears in response to hover or focus, never at rest.

## Shapes

Wiki: a 6px radius (`--melon-radius`), 4px for small elements, circles for the icon and vias. The band has rounded top corners only, like a form header. Site: 12px (`--radius` 0.75rem) for cards, 10px and 8px for controls, and full pills for gold buttons.

## Components

### Band (wiki)
Pale pink strip (dark: plum) holding crumbs on the left and metadata on the right. Archivo 700 condensed, ink text, top corners rounded 6px. Links inside lose underlines; hover underlines.

### Chip (wiki)
Ink-on-pink inverted label (black ink chip in light mode, pink chip in dark), 6px radius. Used for course codes and tags.

### Links (wiki)
Underlined in a 45% rose, 1px thick, offset 0.2em. Hover deepens to full rose and 2px. Links inside drawn UI keep no underline.

### Diagram widgets (wiki)
React components in `wiki/components/` (Melon*.tsx, e.g. MelonCapInd, MelonOpAmp, MelonLogic) draw circuits and plots in the notebook's ink and rose. They are the signature feature.

### Buttons (site)
- **Gold (`btn-gold`):** pill, 135° gold gradient, dark text, 600 weight, soft gold shadow, lifts 1px on hover.
- **Default/outline/ghost:** shadcn variants at 6–8px radius (`rounded-md`), gold focus ring.

### Cards (site)
`card-premium`: 12px radius, charcoal gradient, 1px hairline border; hover shifts the border to 40% gold with a glow. Home cards also tilt (GSAP) with a pointer spotlight.

### Navigation
Wiki: site icon (circular, rotates -20° on hover) plus condensed title, sidebar explorer, search. Site: header with the section links (Services, Pricing, String Guide, About, Contact).

## Do's and Don'ts

### Do:
- **Do** keep each system self-contained: rose and ink for Melon Files, gold on charcoal for the site.
- **Do** use the band for orientation on every wiki page, and the trace after H2s.
- **Do** keep wiki surfaces flat and radii at 6px.
- **Do** honor `prefers-reduced-motion`; diagram motion should teach, not decorate.

### Don't:
- **Don't** use gold in the wiki or dusty pink in the stringing pages.
- **Don't** add drop shadows or glows to wiki surfaces.
- **Don't** put grid paper behind long-form notes; it is for hubs only.
- **Don't** feature the placeholder stringing stats (see PRODUCT.md).
