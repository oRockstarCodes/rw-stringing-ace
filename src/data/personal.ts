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

// `external: true` = plain <a> link, needed for /wiki since it's a separate (Quartz) build.
export const personalNav: NavItem[] = [
  { label: "Melon Files", href: "/wiki/", external: true },
  { label: "Projects", href: "/projects" },
  { label: "Stringing", href: "/stringing" },
  { label: "About", href: "/about" },
];

export const branches = [
  {
    title: "Melon Files",
    href: "/wiki/",
    external: true,
    icon: "BookOpen",
    description: "My course wiki: linked notes from every course I take, with concepts, formulas, and worked examples.",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: "Cpu",
    description: "Engineering and software projects, team work, and things I've built.",
  },
  {
    title: "RW Stringing",
    href: "/stringing",
    icon: "Zap",
    description: "Badminton racket stringing: calibrated tension, premium strings, fast turnaround.",
  },
] as const;

export const ventures = [
  { name: "RW Stringing Service", href: "/stringing", description: "Badminton racket stringing" },
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
