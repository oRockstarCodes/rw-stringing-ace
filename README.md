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

## RW Stringing + staff CRM

Marketing site and staff CRM for **RW Stringing Service** — professional badminton racket stringing at Phoenix Badminton Academy (Greater Toronto Area).

### Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, RLS) for the CRM

### Local development

```sh
npm i
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

App runs on [http://localhost:8080](http://localhost:8080).

### Supabase CRM setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the full migration: [`supabase/migrations/001_crm_schema.sql`](supabase/migrations/001_crm_schema.sql).
3. In **Authentication → Users**, create your first staff user (email/password).
4. In **SQL Editor**, run [`supabase/migrations/002_fix_bootstrap_admin.sql`](supabase/migrations/002_fix_bootstrap_admin.sql) (or the function update below), then promote that user to admin:

```sql
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

update public.profiles
set role = 'admin', full_name = 'Rocky Wang'
where id = '<auth-user-uuid>';
```

5. Copy Project URL and anon key into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. Open `/crm/login` and sign in.

#### Roles

| Role | Access |
|------|--------|
| `admin` | Full CRM + staff role management |
| `stringer` | Customers, orders, inventory writes |
| `viewer` | Read-only |

Additional staff: create users in Supabase Auth, then set roles under **CRM → Staff**.

#### Public contact form

Submissions on `/stringing/contact` insert into `inquiries` (anon insert allowed by RLS). Staff review them under **CRM → Inquiries** and can convert to customers.

### Site content

Edit business copy and pricing catalog in:

- [`src/data/site.ts`](src/data/site.ts) — name, email, phone, social, services, FAQs
- [`src/data/strings.ts`](src/data/strings.ts) — public string guide

Phone and social links are hidden when left empty in `siteConfig`.

### Deploy

Build with `npm run build` (output: `dist`, including `dist/wiki`). Hosted on Cloudflare Pages, which falls back to `index.html` for app routes automatically; `public/_redirects` holds the old-URL redirects. `vercel.json` does the same for Vercel. Set the same `VITE_SUPABASE_*` env vars in your host.
