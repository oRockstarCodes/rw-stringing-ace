# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: fellow TMU (Toronto Metropolitan University) students, mostly Computer and Electrical Engineering, who use Melon Files to study. They arrive mid-course, often before an exam or lab, looking for a specific concept, formula, or worked example.

Secondary audiences exist (stringing customers in the GTA, people checking out Rocky's projects) but were not confirmed as design priorities.

## Product Purpose
rwangqz.ca is Rocky Wang's personal hub. It holds a personal site (`/`, `/about`, `/projects`), RW Stringing Service (`/stringing/*`), and Melon Files (`/melon-files/*`), a public course wiki. Success is a student finding and understanding the note they need quickly.

## Positioning
Melon Files is the standout. It is a course wiki written by a student in Obsidian, with linked notes, concepts, formulas, worked examples, lab files with syntax-highlighted source, and interactive diagrams (for example the RC, RL and slope diagrams in ELE 302). A generic student portfolio or notes dump does not offer that.

## Operating Context
- Notes are authored by Rocky in an Obsidian vault (`wiki/content/`), built with Quartz, and deployed with the React site on Cloudflare Pages when `main` is pushed.
- Course structure: `courses/<code>/` with `index.md`, chapter notes `chNN-name.md`, optional `concepts/` and `labs/`.
- Everything published is public. `private/` is neither published nor committed.
- Stack: React + Vite + TypeScript + Tailwind + shadcn/Radix for the main site; Quartz (with custom components and SCSS) for the wiki.

## Capabilities and Constraints
- The wiki content in `wiki/content/` is written by Rocky; design work must not add or edit notes unless asked.
- Cloudflare Pages file limit is 25 MB per file.
- The staff CRM at `/crm` is switched off (`features.crm = false`); it needs Supabase env vars.
- Stringing contact is email-first; phone and social links are intentionally empty until real ones exist.
- Other ventures listed on the personal site: Mist Window Cleaning (external site), Alpha Prep Tutoring (no site).

## Brand Commitments
Name: Rocky Wang; handle `rwangqz`; the wiki is called "Melon Files". RW Stringing Service keeps its own name and tagline ("Professional Badminton Stringing").

## Evidence on Hand
- Real course notes and lab files in `wiki/content/courses/`.
- The stringing stats in `src/data/site.ts` (5,000+ rackets strung, 10+ years experience, ±0.5 lbs accuracy, 24hr turnaround) are placeholders. Do not feature them or build around them until real numbers replace them.
- No testimonials, customer logos, or press are on hand. Do not fabricate any.

## Product Principles
1. The wiki comes first. Where the three branches compete, Melon Files wins.
2. Students read under time pressure. Findability and clarity of the note matter more than decoration.
3. Interactive diagrams and worked examples are the signature. Prefer demonstrating a concept over describing it.
4. Never claim what is not real: placeholder stats, empty social links, and phone numbers stay hidden or unfeatured.
5. Rocky authors the content. Tooling and design should make writing in Obsidian easy and leave note text alone.

## Accessibility & Inclusion
No product-specific standard was stated. Notes are dense with math and diagrams, so readable math and keyboard-usable, labelled interactive diagrams are worth preserving.
