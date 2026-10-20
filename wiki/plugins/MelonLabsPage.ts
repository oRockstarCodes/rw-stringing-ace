import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import LabsPageBody from "../../components/custom/MelonLabs"
import { write } from "../emitters/helpers"

// Copied into quartz/plugins/custom/ at build time by scripts/build-wiki.sh.
// Emits a Labs page (<edition>/courses/<code>/labs/) for every course that has labs.
// The labs themselves are read by MelonLabsData.ts; no note is needed in labs/.

declare module "vfile" {
  interface DataMap {
    melonCourse: { slug: string; code: string; name: string }
  }
}

export const MelonLabsPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: LabsPageBody(),
  }
  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "MelonLabsPage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...afterBody, ...left, ...right, Footer]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      for (const [, courseFile] of content) {
        const labs = courseFile.data.melonLabs
        if (!labs?.length) continue

        const fm = (courseFile.data.frontmatter ?? {}) as Record<string, unknown>
        const title = String(fm.title ?? courseFile.data.slug)
        const code = String(fm.code ?? title.split(":")[0])
        const name = title.includes(":") ? title.slice(title.indexOf(":") + 1).trim() : title
        const slug = courseFile.data.slug!.replace(/index$/, "labs/index") as FullSlug

        const [tree, file] = defaultProcessedContent({
          slug,
          frontmatter: { title: `${code}: Labs`, tags: [] },
          description: `Lab reports and projects for ${title}.`,
          melonLabs: labs,
          melonCourse: { slug: courseFile.data.slug!, code, name },
        })
        const externalResources = pageResources(pathToRoot(slug), resources)
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }
        yield write({
          ctx,
          content: renderPage(cfg, slug, componentData, opts, externalResources),
          slug,
          ext: ".html",
        })
      }
    },
  }
}
