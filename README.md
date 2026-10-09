# RW Stringing Ace

Marketing site and staff CRM for **RW Stringing Service** — professional badminton racket stringing at Phoenix Badminton Academy (Greater Toronto Area).

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, RLS) for the CRM

## Local development

```sh
npm i
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

App runs on [http://localhost:8080](http://localhost:8080).

## Supabase CRM setup

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

### Roles

| Role | Access |
|------|--------|
| `admin` | Full CRM + staff role management |
| `stringer` | Customers, orders, inventory writes |
| `viewer` | Read-only |

Additional staff: create users in Supabase Auth, then set roles under **CRM → Staff**.

### Public contact form

Submissions on `/contact` insert into `inquiries` (anon insert allowed by RLS). Staff review them under **CRM → Inquiries** and can convert to customers.

## Site content

Edit business copy and pricing catalog in:

- [`src/data/site.ts`](src/data/site.ts) — name, email, phone, social, services, FAQs
- [`src/data/strings.ts`](src/data/strings.ts) — public string guide

Phone and social links are hidden when left empty in `siteConfig`.

## Deploy

Build with `npm run build` (output: `dist`). Deploy to Vercel or Lovable; SPA rewrites are in `vercel.json` and `public/_redirects`. Set the same `VITE_SUPABASE_*` env vars in your host.
