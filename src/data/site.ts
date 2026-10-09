export const siteConfig = {
  name: "RW Stringing Service",
  tagline: "Professional Badminton Stringing",
  description:
    "Expert badminton racket stringing with calibrated tension, premium strings, and personalized recommendations for players of every level.",
  email: "contact@rwstringing.com",
  phone: "(555) 123-4567",
  location: {
    line1: "Phoenix Badminton Academy",
    line2: "Greater Vancouver Area",
    line3: "British Columbia, Canada",
  },
  hours: "Mon–Sat: 10am – 8pm · Sun: By appointment",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  stats: [
    { value: "5,000+", label: "Rackets Strung" },
    { value: "10+", label: "Years Experience" },
    { value: "±0.5 lbs", label: "Tension Accuracy" },
    { value: "24hr", label: "Typical Turnaround" },
  ],
};

export const navLinks = [
  { label: "Services", href: "/stringing#services", isHash: true },
  { label: "Pricing", href: "/stringing/pricing" },
  { label: "String Guide", href: "/stringing/strings" },
  { label: "About", href: "/stringing/about" },
  { label: "Contact", href: "/stringing/contact" },
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
    title: "Drop Off or Book",
    description: "Bring your racket in or message us with your preferred string, tension, and timeline.",
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

export const testimonials = [
  {
    quote:
      "Best stringing in the area. My BG80 at 27 lbs feels exactly the same every time — huge for tournament prep.",
    author: "Alex T.",
    role: "Competitive Singles Player",
    rating: 5,
  },
  {
    quote:
      "Rocky helped me pick the right string for my play style. The hybrid setup gave me more power without losing control.",
    author: "Michelle L.",
    role: "Club Doubles Player",
    rating: 5,
  },
  {
    quote:
      "Fast turnaround and fair pricing. Phoenix team discount is a nice bonus. I won't go anywhere else.",
    author: "David K.",
    role: "Recreational Player",
    rating: 5,
  },
];

export const faqs = [
  {
    question: "How long does stringing take?",
    answer:
      "Most rackets are ready within 24 hours. Same-day service may be available — contact us to check availability.",
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
    question: "What is Phoenix Team pricing?",
    answer:
      "Phoenix Badminton Academy team members receive discounted rates on all strings. Show your team ID when dropping off your racket.",
  },
  {
    question: "How often should I restring?",
    answer:
      "A common rule: restring as many times per year as you play per week. Competitive players may restring every 2–4 weeks; casual players every 2–3 months.",
  },
];
