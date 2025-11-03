import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Zap, Shield, Activity, Star } from "lucide-react";

const stringDatabase = [
  {
    brand: "Yonex",
    model: "BG 65",
    category: "yonex",
    teamPrice: "CA$20.00",
    regularPrice: "CA$22.00",
    gauge: "0.70mm",
    type: "Multifilament",
    popular: true,
    description: "The most popular badminton string in the world. Offers excellent durability and repulsion power with consistent performance.",
    characteristics: {
      durability: 85,
      repulsion: 75,
      control: 80,
      sound: 70
    },
    bestFor: ["Beginners", "Intermediate Players", "All-round Play"],
    playStyle: "Balanced performance for players seeking reliability and consistent feel"
  },
  {
    brand: "Yonex",
    model: "BG 65 Titanium",
    category: "yonex",
    teamPrice: "CA$22.00",
    regularPrice: "CA$24.00",
    gauge: "0.70mm",
    type: "Multifilament with Titanium",
    description: "Enhanced version of BG 65 with titanium coating for improved durability and sharper feel. Maintains the reliable performance with added resilience.",
    characteristics: {
      durability: 88,
      repulsion: 78,
      control: 82,
      sound: 75
    },
    bestFor: ["Intermediate Players", "Frequent Players", "Power Hitters"],
    playStyle: "For players who want BG 65 reliability with extra durability and sharper feedback"
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
    description: "Thinner gauge string offering exceptional repulsion and quick shuttle release. Popular among advanced players for its explosive power and sharp feel.",
    characteristics: {
      durability: 70,
      repulsion: 92,
      control: 85,
      sound: 88
    },
    bestFor: ["Advanced Players", "Attacking Players", "Speed Play"],
    playStyle: "Lightning-fast response for aggressive players seeking maximum repulsion and crisp feel"
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
    description: "Premium string combining thin gauge with excellent durability. Offers superior repulsion and sharp hitting sound preferred by professionals.",
    characteristics: {
      durability: 82,
      repulsion: 90,
      control: 88,
      sound: 92
    },
    bestFor: ["Advanced Players", "Competitive Players", "Touch Players"],
    playStyle: "Professional-grade performance with excellent feel and control for precise shot-making"
  },
  {
    brand: "Yonex",
    model: "BG 80 Power",
    category: "yonex",
    teamPrice: "CA$25.00",
    regularPrice: "CA$26.00",
    gauge: "0.68mm",
    type: "High Polymer Nylon Multifilament",
    description: "Power-oriented version of BG 80 with enhanced oval core for explosive repulsion. Delivers maximum power while maintaining the sharp feel.",
    characteristics: {
      durability: 80,
      repulsion: 95,
      control: 86,
      sound: 90
    },
    bestFor: ["Power Players", "Smash-focused Players", "Singles Players"],
    playStyle: "Maximum explosive power for aggressive attacking play with sharp shuttle feedback"
  },
  {
    brand: "Yonex",
    model: "Exbolt 63",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.63mm",
    type: "High Polymer Nylon Multifilament",
    description: "Ultra-thin string designed for maximum repulsion and lightning-fast shuttle speed. Delivers explosive power with extremely sharp feel.",
    characteristics: {
      durability: 65,
      repulsion: 98,
      control: 88,
      sound: 95
    },
    bestFor: ["Advanced Players", "Attack-oriented Players", "Speed Seekers"],
    playStyle: "Ultimate repulsion for players who prioritize explosive power and lightning-fast shuttle release"
  },
  {
    brand: "Yonex",
    model: "Exbolt 65",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.65mm",
    type: "High Polymer Nylon Multifilament",
    description: "Balanced version of Exbolt series offering excellent repulsion with slightly improved durability. Perfect middle ground between power and longevity.",
    characteristics: {
      durability: 72,
      repulsion: 95,
      control: 87,
      sound: 93
    },
    bestFor: ["Advanced Players", "All-round Attackers", "Tournament Players"],
    playStyle: "High-level performance balancing explosive power with reasonable durability"
  },
  {
    brand: "Yonex",
    model: "Exbolt 68",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.68mm",
    type: "High Polymer Nylon Multifilament",
    description: "Most durable option in Exbolt series while maintaining excellent repulsion. Ideal for players wanting premium performance with extended string life.",
    characteristics: {
      durability: 78,
      repulsion: 92,
      control: 86,
      sound: 90
    },
    bestFor: ["Frequent Players", "Intermediate to Advanced", "Value Seekers"],
    playStyle: "Premium performance with enhanced durability for regular competitive play"
  },
  {
    brand: "Yonex",
    model: "Aerobite",
    category: "yonex",
    teamPrice: "CA$26.00",
    regularPrice: "CA$28.00",
    gauge: "0.67mm / 0.61mm",
    type: "Hybrid - Oval/Round",
    description: "Revolutionary hybrid string combining oval mains for power with round crosses for control. Delivers exceptional bite on the shuttle for spin generation.",
    characteristics: {
      durability: 75,
      repulsion: 90,
      control: 93,
      sound: 88
    },
    bestFor: ["Control Players", "Spin Players", "Deception Specialists"],
    playStyle: "Exceptional shuttle control and spin potential for players emphasizing placement and touch"
  },
  {
    brand: "Yonex",
    model: "Aerobite Boost",
    category: "yonex",
    teamPrice: "CA$27.00",
    regularPrice: "CA$29.00",
    gauge: "0.67mm / 0.61mm",
    type: "Hybrid - Oval/Round",
    description: "Enhanced Aerobite with improved repulsion and sharper feel. Maintains excellent control while adding more explosive power to shots.",
    characteristics: {
      durability: 73,
      repulsion: 93,
      control: 92,
      sound: 90
    },
    bestFor: ["Advanced Players", "Spin + Power", "Tournament Level"],
    playStyle: "Premium control and spin with boosted power for complete shot versatility"
  },
  {
    brand: "GXS",
    model: "S63",
    category: "gxs",
    teamPrice: "CA$22.00",
    regularPrice: "CA$24.00",
    gauge: "0.63mm",
    type: "Multifilament Nylon",
    description: "Ultra-thin premium alternative offering explosive repulsion at excellent value. Popular choice for players seeking high performance without premium pricing.",
    characteristics: {
      durability: 68,
      repulsion: 96,
      control: 86,
      sound: 92
    },
    bestFor: ["Advanced Players", "Budget-conscious", "Power Players"],
    playStyle: "Explosive power and sharp feel at outstanding value for frequent string changes"
  },
  {
    brand: "GXS",
    model: "K66",
    category: "gxs",
    teamPrice: "CA$20.00",
    regularPrice: "CA$22.00",
    gauge: "0.66mm",
    type: "Multifilament Nylon",
    description: "Balanced all-around string providing reliable performance and good durability. Excellent entry-level option for consistent play.",
    characteristics: {
      durability: 80,
      repulsion: 78,
      control: 82,
      sound: 75
    },
    bestFor: ["Beginners", "Intermediate Players", "Recreational Play"],
    playStyle: "Reliable all-around performance for developing players and regular recreational use"
  },
  {
    brand: "GXS",
    model: "Z68",
    category: "gxs",
    teamPrice: "CA$18.00",
    regularPrice: "CA$20.00",
    gauge: "0.68mm",
    type: "Multifilament Nylon",
    description: "Most economical option emphasizing maximum durability. Ideal for beginners or high-frequency recreational players prioritizing longevity.",
    characteristics: {
      durability: 90,
      repulsion: 70,
      control: 78,
      sound: 68
    },
    bestFor: ["Beginners", "Recreational Players", "High-frequency Users"],
    playStyle: "Maximum durability for learning and high-volume recreational play at best value"
  },
  {
    brand: "Own",
    model: "String",
    category: "own",
    teamPrice: "CA$14.00",
    regularPrice: "CA$16.00",
    gauge: "Varies",
    type: "Customer Provided",
    description: "Bring your own string for professional installation. Service includes precision stringing with calibrated tension and post-string inspection.",
    characteristics: {
      durability: 0,
      repulsion: 0,
      control: 0,
      sound: 0
    },
    bestFor: ["Any Player", "Specific String Preferences", "Bulk String Owners"],
    playStyle: "Professional stringing service for players with specific string requirements or bulk purchases"
  }
];

const CharacteristicBar = ({ label, value, icon: Icon, color }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-yellow-400" />
        <span className="text-zinc-300">{label}</span>
      </div>
      <span className="text-zinc-100 font-semibold">{value > 0 ? `${value}%` : 'N/A'}</span>
    </div>
    {value > 0 && (
      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    )}
  </div>
);

const StringCard = ({ string }) => (
  <Card className="bg-gradient-to-br from-black to-zinc-700 border-2 border-zinc-700 hover:border-yellow-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/15 relative">
    {string.popular && (
      <div className="absolute -top-3 -right-3 z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-yellow-400/50">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold">Popular</span>
        </div>
      </div>
    )}
    <CardHeader>
      <div className="flex items-start justify-between mb-2">
        <div>
          <CardTitle className="text-2xl text-zinc-50 mb-1">
            {string.category === "own" ? (
              <span className="text-yellow-400">Own String</span>
            ) : (
              <>
                <span className="text-yellow-400/80 font-normal text-lg">{string.brand}</span>
                <br />
                {string.model}
              </>
            )}
          </CardTitle>
          {string.category !== "own" && (
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                {string.gauge}
              </Badge>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                {string.type}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400 mb-1">Phoenix Team</div>
          <div className="text-xl font-bold text-red-500">{string.teamPrice}</div>
          <div className="text-sm text-zinc-400 mt-2">Regular</div>
          <div className="text-lg font-semibold text-zinc-100">{string.regularPrice}</div>
        </div>
      </div>
      <CardDescription className="text-zinc-300 text-base leading-relaxed">
        {string.description}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {string.category !== "own" && (
        <>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Performance Characteristics</h4>
            <CharacteristicBar 
              label="Durability" 
              value={string.characteristics.durability} 
              icon={Shield}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <CharacteristicBar 
              label="Repulsion Power" 
              value={string.characteristics.repulsion} 
              icon={Zap}
              color="bg-gradient-to-r from-yellow-400 to-yellow-500"
            />
            <CharacteristicBar 
              label="Control" 
              value={string.characteristics.control} 
              icon={Target}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <CharacteristicBar 
              label="Sound & Feel" 
              value={string.characteristics.sound} 
              icon={Activity}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">Best For</h4>
            <div className="flex flex-wrap gap-2">
              {string.bestFor.map((audience, idx) => (
                <Badge key={idx} className="bg-yellow-400/15 text-yellow-400 border border-yellow-400/30">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-700">
            <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-2">Play Style</h4>
            <p className="text-zinc-300 text-sm leading-relaxed">{string.playStyle}</p>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

export default function StringDetails() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredStrings = activeTab === "all" 
    ? stringDatabase 
    : stringDatabase.filter(s => s.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-850 to-zinc-800">
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_70%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
                String Guide
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Complete String Guide
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
              Explore detailed specifications and performance characteristics of every string we offer
            </p>
          </div>
        </div>
      </section>

      {/* Tabs and Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-zinc-800 border-2 border-zinc-700 p-1">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black"
                >
                  All Strings
                </TabsTrigger>
                <TabsTrigger 
                  value="yonex"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black"
                >
                  Yonex
                </TabsTrigger>
                <TabsTrigger 
                  value="gxs"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black"
                >
                  GXS
                </TabsTrigger>
                <TabsTrigger 
                  value="own"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black"
                >
                  Own String
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {filteredStrings.map((string, index) => (
                  <StringCard key={index} string={string} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}