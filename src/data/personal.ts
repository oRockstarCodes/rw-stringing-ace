// Content for the personal side of rwangqz.ca. Edit freely.

export const me = {
  name: "Rocky Wang",
  handle: "rwangqz",
  tagline: "Computer Engineering student at Toronto Metropolitan University.",
  intro:
    "I build things, run a few small businesses, and keep my course notes in public. This site is the hub for all of it.",
  location: "Toronto, Ontario",
  links: [
    { label: "GitHub", href: "https://github.com/oRockstarCodes" },
  ],
};

export type NavItem = { label: string; href: string; external?: boolean };

// `external: true` = plain <a> link, needed for /melon-files since it's a separate (Quartz) build.
export const personalNav: NavItem[] = [
  { label: "Melon Files", href: "/melon-files/", external: true },
  { label: "Projects", href: "/projects" },
  { label: "Stringing", href: "/stringing" },
  { label: "About", href: "/about" },
];

// The courses in the Melon Files, read from each course's index.md in the vault at build
// time, so the home page lists a new course as soon as its folder exists.
const courseNotes = import.meta.glob<string>("../../wiki/content/*/courses/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const courses = Object.entries(courseNotes)
  .filter(([, text]) => !/^draft:\s*true\s*$/m.test(text))
  .map(([file, text]) => {
    const [, edition, slug] = file.match(/content\/([^/]+)\/courses\/([^/]+)\/index\.md$/) ?? [];
    const title = text.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] ?? slug;
    // "COE 328: Digital Systems" -> code "COE 328", name "Digital Systems"
    const [code, name] = title.includes(": ") ? title.split(/: (.+)/) : [slug.toUpperCase(), title];
    return { code, name, href: `/melon-files/${edition}/courses/${slug}/` };
  })
  .sort((a, b) => a.code.localeCompare(b.code));

export const ventures = [
  { name: "RW Stringing Service", href: "/stringing", description: "Badminton racket stringing (on a break)" },
  { name: "Mist Window Cleaning", href: "https://mistwindowcleaning.ca", description: "Residential & commercial window cleaning, Toronto & GTA" },
  { name: "Alpha Prep Tutoring", description: "Freelance tutoring" },
];

export type Project = {
  title: string;
  role?: string;
  period: string;
  status: "In progress" | "Complete";
  description: string;
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Floating Offshore Wind Challenge",
    role: "VP Finance, Engineers for a Sustainable World (ESW) at TMU",
    period: "2026 – 2027",
    status: "In progress",
    description:
      "ESW at TMU's entry in the floating offshore wind student competition. I run the team budget and funding applications.",
    tags: ["Renewable energy", "Team", "Finance"],
  },
  {
    title: "rwangqz.ca",
    period: "2026",
    status: "In progress",
    description:
      "This site: a React + Vite hub with a Quartz-built course wiki written in Obsidian, deployed on Cloudflare Pages.",
    tags: ["React", "TypeScript", "Quartz"],
    href: "https://github.com/oRockstarCodes/rw-stringing-ace",
  },
];
