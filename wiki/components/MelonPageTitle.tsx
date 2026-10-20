import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { joinSegments, pathToRoot } from "../../util/path"
import { classNames } from "../../util/lang"
import { editionOf } from "./MelonEditions"

// The site title at the top of the sidebar (in place of Quartz's PageTitle). Inside an
// edition with a name of its own (the ECE Edition) it carries that name in small print
// under the title and leads to the edition's home page instead of the site's.
const MelonPageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "Melon Files"
  const root = pathToRoot(fileData.slug!)
  const ed = editionOf(fileData.slug)
  const own = ed && ed.title !== title ? ed : undefined
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={own ? joinSegments(root, own.key) + "/" : root}>
        {own ? (
          <span class="melon-title-text">
            {title}
            <small class="melon-title-edition">{own.title}</small>
          </span>
        ) : (
          title
        )}
      </a>
    </h2>
  )
}

MelonPageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
`

export default (() => MelonPageTitle) satisfies QuartzComponentConstructor
