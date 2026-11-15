/** Feature switches. Flip to true to turn a feature back on. */
export const features = {
  /** Staff CRM at /crm (needs VITE_SUPABASE_* env vars set on the host). */
  crm: false,
};

export const siteConfig = {
  name: "RW Stringing Service",
  tagline: "Professional Badminton Stringing",
  description:
    "Expert badminton racket stringing with calibrated tension, premium strings, and personalized recommendations for players of every level.",
  url: "https://rwangqz.ca",
  email: "contact@rwangqz.ca",
  /** Set a real number when ready; leave empty to hide phone CTAs and prefer email. */
  phone: "",
  location: {
    line1: "Phoenix Badminton Academy",
    line2: "Greater Toronto Area",
    line3: "Ontario, Canada",
  },
  /** Shown on every stringing page while the service is paused. Set to "" when it reopens. */
  breakNotice:
    "RW Stringing is on a break and is not taking rackets right now. Prices and the string guide stay up for reference.",
  social: {
    /** Leave empty until real profiles are ready — footer only shows set links. */
    instagram: "",
    facebook: "",
  },
};

export const navLinks = [
  { label: "Services", href: "/stringing#services", isHash: true },
  { label: "Pricing", href: "/stringing/pricing" },
  { label: "String Guide", href: "/stringing/strings" },
  { label: "About", href: "/stringing/about" },
];

export const services = [
  {
    icon: "Zap",
    title: "Expert Stringing",
    description:
      "Precision stringing with calibrated tension and a post-string inspection for consistent feel and playability.",
    comingSoon: false,
  },
  {
    icon: "Award",
    title: "Quality Strings",
    description:
      "Curated selection of premium strings — choose by playstyle, gauge, and durability from trusted brands.",
    comingSoon: false,
  },
  {
    icon: "Wrench",
    title: "Grommet Replacement",
    description:
      "Replace worn or damaged grommets with OEM-grade parts and professional installation to protect your frame.",
    comingSoon: false,
  },
  {
    icon: "Sparkles",
    title: "Custom Hybrid Stringing",
    description:
      "Hybrid setups combining complementary mains and crosses to optimize power, spin, and longevity for your game.",
    comingSoon: false,
  },
  {
    icon: "Grip",
    title: "Custom Grip Setup",
    description:
      "Grip fitting, replacement, and layering for improved comfort, tack, and ergonomic control.",
    comingSoon: false,
  },
  {
    icon: "Palette",
    title: "Decals & Paint Retouch",
    description:
      "Cosmetic restoration: decal application and paint touch-ups to refresh scuffs and preserve appearance.",
    comingSoon: true,
  },
  {
    icon: "Stamp",
    title: "Custom Stencils",
    description:
      "Personalized stencils and string art — add logos, initials, or designs for a unique look without harming performance.",
    comingSoon: true,
  },
  {
    icon: "Settings",
    title: "Frame Repair",
    description:
      "Structural repairs, crack reinforcement, and alignment to restore playability and extend racket life where possible.",
    comingSoon: true,
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Drop Off",
    description: "Bring your racket in with your preferred string, tension, and timeline.",
  },
  {
    step: "02",
    title: "Expert Stringing",
    description: "We string on professional machines with calibrated tension meters and quality-checked knots.",
  },
  {
    step: "03",
    title: "Quality Inspection",
    description: "Every racket gets a final inspection — tension verified, grommets checked, and frame wiped down.",
  },
  {
    step: "04",
    title: "Pick Up & Play",
    description: "Collect your racket ready to hit the court. We'll note your setup for easy reorders next time.",
  },
];

export const faqs = [
  {
    question: "How long does stringing take?",
    answer:
      "Most rackets are ready within 24 hours of drop-off.",
  },
  {
    question: "What tension should I use?",
    answer:
      "It depends on your racket, string, and play style. Most players use 22–28 lbs. We'll recommend a tension based on your preferences and experience level.",
  },
  {
    question: "Can I bring my own string?",
    answer:
      "Yes. We offer a labor-only rate for customer-provided string. See our pricing page for details.",
  },
  {
    question: "What is Member pricing?",
    answer:
      "Members receive discounted rates on all strings. Ask about membership when dropping off your racket.",
  },
  {
    question: "How often should I restring?",
    answer:
      "A common rule: restring as many times per year as you play per week. Competitive players may restring every 2–4 weeks; casual players every 2–3 months.",
  },
];
