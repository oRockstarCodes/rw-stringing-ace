import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// On a chapter that is still an empty template (marked by plugins/MelonChapterStatus.ts),
// shows a "Coming soon" note; custom.scss hides the empty template headings below it.

const MelonSoon: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (!fileData.melonEmpty) return null
  return (
    <div class="melon-soon">
      <span class="melon-soon-tag">Coming soon</span>
      <p>Notes for this chapter haven't been written yet. Check back later.</p>
    </div>
  )
}

export default (() => MelonSoon) satisfies QuartzComponentConstructor
