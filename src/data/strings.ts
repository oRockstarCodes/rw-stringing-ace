export interface StringCharacteristics {
  durability: number;
  repulsion: number;
  control: number;
  sound: number;
}

export interface StringProduct {
  brand: string;
  model: string;
  category: "yonex" | "gxs" | "own";
  teamPrice: string;
  regularPrice: string;
  gauge: string;
  type: string;
  popular?: boolean;
  description: string;
  characteristics: StringCharacteristics;
  bestFor: string[];
  playStyle: string;
}

export const stringDatabase: StringProduct[] = [
  {
    brand: "Yonex",
    model: "BG 65",
    category: "yonex",
    teamPrice: "CA$20.00",
    regularPrice: "CA$22.00",
    gauge: "0.70mm",
    type: "Multifilament",
    popular: true,
    description:
      "The most popular badminton string in the world. Offers excellent durability and repulsion power with consistent performance.",
    characteristics: { durability: 85, repulsion: 75, control: 80, sound: 70 },
    bestFor: ["Beginners", "Intermediate Players", "All-round Play"],
    playStyle: "Balanced performance for players seeking reliability and consistent feel",
  },
  {
    brand: "Yonex",
    model: "BG 65 Titanium",
    category: "yonex",
    teamPrice: "CA$22.00",
    regularPrice: "CA$24.00",
    gauge: "0.70mm",
    type: "Multifilament with Titanium",
    description:
      "Enhanced version of BG 65 with titanium coating for improved durability and sharper feel.",
    characteristics: { durability: 88, repulsion: 78, control: 82, sound: 75 },
    bestFor: ["Intermediate Players", "Frequent Players", "Power Hitters"],
    playStyle: "BG 65 reliability with extra durability and sharper feedback",
  },
  {
    brand: "Yonex",
    model: "BG 66 Ultimax",
    category: "yonex",
    teamPrice: "CA$23.00",
    regularPrice: "CA$25.00",
    gauge: "0.65mm",
    type: "High Polymer Nylon Multifilament",
    popular: true,
    description:
      "Thinner gauge string offering exceptional repulsion and quick shuttle release. Popular among advanced players.",
    characteristics: { durability: 70, repulsion: 92, control: 85, sound: 88 },
    bestFor: ["Advanced Players", "Attacking Players", "Speed Play"],
    playStyle: "Lightning-fast response for aggressive players seeking maximum repulsion",
  },
  {
    brand: "Yonex",
    model: "BG 80",
    category: "yonex",
    teamPrice: "CA$24.00",
    regularPrice: "CA$25.00",
    gauge: "0.68mm",
    type: "High Polymer Nylon Multifilament",
    popular: true,
    description:
      "Premium string combining thin gauge with excellent durability. Superior repulsion and sharp hitting sound.",
    characteristics: { durability: 82, repulsion: 90, control: 88, sound: 92 },
    bestFor: ["Advanced Players", "Competitive Players", "Touch Players"],
    playStyle: "Professional-grade performance with excellent feel and control",
  },
  {
    brand: "Yonex",
    model: "BG 80 Power",
    category: "yonex",
    teamPrice: "CA$25.00",
    regularPrice: "CA$26.00",
    gauge: "0.68mm",
    type: "High Polymer Nylon Multifilament",
    description:
      "Power-oriented version of BG 80 with enhanced oval core for explosive repulsion.",
    characteristics: { durability: 80, repulsion: 95, control: 86, sound: 90 },
    bestFor: ["Power Players", "Smash-focused Players", "Singles Players"],
    playStyle: "Maximum explosive power for aggressive attacking play",
  },
  {
    brand: "Yonex",
    model: "Exbolt 63",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.63mm",
    type: "High Polymer Nylon Multifilament",
    description:
      "Ultra-thin string designed for maximum repulsion and lightning-fast shuttle speed.",
    characteristics: { durability: 65, repulsion: 98, control: 88, sound: 95 },
    bestFor: ["Advanced Players", "Attack-oriented Players", "Speed Seekers"],
    playStyle: "Ultimate repulsion for players who prioritize explosive power",
  },
  {
    brand: "Yonex",
    model: "Exbolt 65",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.65mm",
    type: "High Polymer Nylon Multifilament",
    description:
      "Balanced Exbolt offering excellent repulsion with slightly improved durability.",
    characteristics: { durability: 72, repulsion: 95, control: 87, sound: 93 },
    bestFor: ["Advanced Players", "All-round Attackers", "Tournament Players"],
    playStyle: "High-level performance balancing explosive power with reasonable durability",
  },
  {
    brand: "Yonex",
    model: "Exbolt 68",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.68mm",
    type: "High Polymer Nylon Multifilament",
    description:
      "Most durable Exbolt option while maintaining excellent repulsion.",
    characteristics: { durability: 78, repulsion: 92, control: 86, sound: 90 },
    bestFor: ["Frequent Players", "Intermediate to Advanced", "Value Seekers"],
    playStyle: "Premium performance with enhanced durability for regular competitive play",
  },
  {
    brand: "Yonex",
    model: "Aerobite",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.67mm / 0.61mm",
    type: "Hybrid - Oval/Round",
    description:
      "Revolutionary hybrid combining oval mains for power with round crosses for control and spin.",
    characteristics: { durability: 75, repulsion: 90, control: 93, sound: 88 },
    bestFor: ["Control Players", "Spin Players", "Deception Specialists"],
    playStyle: "Exceptional shuttle control and spin potential for placement and touch",
  },
  {
    brand: "Yonex",
    model: "Aerobite Boost",
    category: "yonex",
    teamPrice: "CA$27.00",
    regularPrice: "CA$29.00",
    gauge: "0.67mm / 0.61mm",
    type: "Hybrid - Oval/Round",
    description:
      "Enhanced Aerobite with improved repulsion and sharper feel while maintaining excellent control.",
    characteristics: { durability: 73, repulsion: 93, control: 92, sound: 90 },
    bestFor: ["Advanced Players", "Spin + Power", "Tournament Level"],
    playStyle: "Premium control and spin with boosted power for complete shot versatility",
  },
  {
    brand: "GXS",
    model: "S63",
    category: "gxs",
    teamPrice: "CA$22.00",
    regularPrice: "CA$24.00",
    gauge: "0.63mm",
    type: "Multifilament Nylon",
    description:
      "Ultra-thin premium alternative offering explosive repulsion at excellent value.",
    characteristics: { durability: 68, repulsion: 96, control: 86, sound: 92 },
    bestFor: ["Advanced Players", "Budget-conscious", "Power Players"],
    playStyle: "Explosive power and sharp feel at outstanding value",
  },
  {
    brand: "GXS",
    model: "K66",
    category: "gxs",
    teamPrice: "CA$20.00",
    regularPrice: "CA$22.00",
    gauge: "0.66mm",
    type: "Multifilament Nylon",
    description:
      "Balanced all-around string providing reliable performance and good durability.",
    characteristics: { durability: 80, repulsion: 78, control: 82, sound: 75 },
    bestFor: ["Beginners", "Intermediate Players", "Recreational Play"],
    playStyle: "Reliable all-around performance for developing players",
  },
  {
    brand: "GXS",
    model: "Z68",
    category: "gxs",
    teamPrice: "CA$18.00",
    regularPrice: "CA$20.00",
    gauge: "0.68mm",
    type: "Multifilament Nylon",
    description:
      "Most economical option emphasizing maximum durability for beginners and high-frequency players.",
    characteristics: { durability: 90, repulsion: 70, control: 78, sound: 68 },
    bestFor: ["Beginners", "Recreational Players", "High-frequency Users"],
    playStyle: "Maximum durability for learning and high-volume recreational play",
  },
  {
    brand: "Own",
    model: "String",
    category: "own",
    teamPrice: "CA$14.00",
    regularPrice: "CA$16.00",
    gauge: "Varies",
    type: "Customer Provided",
    description:
      "Bring your own string for professional installation with calibrated tension and post-string inspection.",
    characteristics: { durability: 0, repulsion: 0, control: 0, sound: 0 },
    bestFor: ["Any Player", "Specific String Preferences", "Bulk String Owners"],
    playStyle: "Professional stringing for players with specific string requirements",
  },
];
