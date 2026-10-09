# rwangqz.ca

Personal site for Rocky Wang, with three branches:

| Path | What | Source |
| --- | --- | --- |
| `/`, `/about`, `/projects` | Personal site | `src/pages/`, content in `src/data/personal.ts` |
| `/stringing/*` | RW Stringing Service | `src/pages/stringing/`, content in `src/data/site.ts` |
| `/wiki/*` | Course wiki (Quartz) | Obsidian vault in `wiki/content/` |

## Writing the wiki

Open `wiki/content/` as a vault in Obsidian. Settings (wikilinks, attachments folder, templates folder) are preconfigured.

- `courses/`: one hub page per course (use the **course** template)
- `concepts/`: one page per concept, linked from every course it appears in (use the **concept** template)
- `reference/`: cheat sheets, tool setup
- `attachments/`: images and diagrams
- `templates/`: not published
- `private/`: not published **and not committed** (this repo is public)
- Add `draft: true` to a note's properties to keep it off the site.

Commit and push (e.g. with the Obsidian Git plugin) and Cloudflare Pages rebuilds the site.

## Commands

```sh
npm run dev         # React site at localhost:8080
npm run dev:wiki    # wiki preview at localhost:8080 (Quartz)
npm run build       # full build -> dist/ (React app + dist/wiki)
```

The wiki is built by `scripts/build-wiki.sh`, which clones Quartz (pinned version) into `.quartz/` and applies `wiki/quartz.config.ts`, `wiki/quartz.layout.ts`, and `wiki/custom.scss`.

Cloudflare Pages settings: build command `npm run build`, output directory `dist`. Node version comes from `.node-version`.

---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/92b79da3-583f-46eb-aafd-7828e824839e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/92b79da3-583f-46eb-aafd-7828e824839e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/92b79da3-583f-46eb-aafd-7828e824839e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
