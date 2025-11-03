import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const stringPricing = [
  { brand: "Yonex", model: "BG 65", teamPrice: "CA$20.00", regularPrice: "CA$22.00", category: "yonex", popular: true },
  { brand: "Yonex", model: "BG 65 Titanium", teamPrice: "CA$22.00", regularPrice: "CA$24.00", category: "yonex" },
  { brand: "Yonex", model: "BG 66 Ultimax", teamPrice: "CA$23.00", regularPrice: "CA$25.00", category: "yonex", popular: true },
  { brand: "Yonex", model: "BG 80", teamPrice: "CA$24.00", regularPrice: "CA$25.00", category: "yonex", popular: true },
  { brand: "Yonex", model: "BG 80 Power", teamPrice: "CA$25.00", regularPrice: "CA$26.00", category: "yonex"},
  { brand: "Yonex", model: "Exbolt 63", teamPrice: "CA$26.00", regularPrice: "CA$28.00", category: "yonex" },
  { brand: "Yonex", model: "Exbolt 65", teamPrice: "CA$26.00", regularPrice: "CA$28.00", category: "yonex" },
  { brand: "Yonex", model: "Exbolt 68", teamPrice: "CA$26.00", regularPrice: "CA$28.00", category: "yonex" },
  { brand: "Yonex", model: "Aerobite", teamPrice: "CA$26.00", regularPrice: "CA$28.00", category: "yonex" },
  { brand: "Yonex", model: "Aerobite Boost", teamPrice: "CA$27.00", regularPrice: "CA$29.00", category: "yonex" },
  { brand: "GXS", model: "S63", teamPrice: "CA$22.00", regularPrice: "CA$24.00", category: "gxs" },
  { brand: "GXS", model: "K66", teamPrice: "CA$20.00", regularPrice: "CA$22.00", category: "gxs" },
  { brand: "GXS", model: "Z68", teamPrice: "CA$18.00", regularPrice: "CA$20.00", category: "gxs" },
  { brand: "Own", model: "String", teamPrice: "CA$14.00", regularPrice: "CA$16.00", category: "own" },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-gradient-to-b from-zinc-900 via-zinc-850 to-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_70%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
                Our Pricing
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
              Professional stringing services with competitive rates and special pricing for Phoenix Team members
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-zinc-800 via-zinc-750 to-zinc-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.12),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
                Premium Quality
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent pb-2">
              String Pricing
            </h2>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Professional stringing with premium quality strings for peak performance
            </p>
            <div className="mt-8 flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-3 bg-zinc-800/70 px-4 py-2 rounded-lg border border-zinc-700">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50"></div>
                <span className="text-red-500 font-medium">Phoenix Team Price</span>
              </div>
              <div className="flex items-center gap-3 bg-zinc-800/70 px-4 py-2 rounded-lg border border-zinc-700">
                <div className="w-3 h-3 rounded-full border-2 border-zinc-100"></div>
                <span className="text-zinc-100 font-medium">Regular Price</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-zinc-300 text-sm">
                <span className="text-red-500 font-semibold">Phoenix Badminton Academy Team Members</span> receive exclusive pricing on all strings
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="bg-zinc-800/90 backdrop-blur border-2 border-zinc-700 shadow-2xl shadow-yellow-400/10 overflow-hidden">
              <CardHeader className="border-b border-zinc-700 bg-gradient-to-r from-zinc-800 via-zinc-750 to-zinc-800 pb-6">
                <CardTitle className="text-3xl text-yellow-400 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
                  String Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-zinc-700 bg-zinc-800/50">
                        <th className="text-left py-4 px-6 font-bold text-zinc-200 uppercase tracking-wide text-sm">String</th>
                        <th className="text-right py-4 px-6 font-bold text-red-500 uppercase tracking-wide text-sm">Phoenix Team</th>
                        <th className="text-right py-4 px-6 font-bold text-zinc-100 uppercase tracking-wide text-sm">Regular</th>
                      </tr>
                    </thead>
                    <tbody className="bg-zinc-850">
                      {stringPricing.map((string, index) => (
                        <tr
                          key={index}
                          className="border-b border-zinc-700/50 hover:bg-zinc-750 transition-all duration-300 group"
                        >
                          <td className="py-4 px-6 text-zinc-100 font-semibold group-hover:text-yellow-400 transition-colors">
                            {string.category === "own" ? (
                              <span className="text-yellow-400">Own String</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>
                                  <span className="text-yellow-400/80 font-normal">{string.brand}</span> {string.model}
                                </span>
                                {string.popular && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 py-0.5 rounded-full">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-bold">Popular</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right text-red-500 font-bold text-lg">
                            {string.teamPrice}
                          </td>
                          <td className="py-4 px-6 text-right text-zinc-100 font-medium">
                            {string.regularPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;