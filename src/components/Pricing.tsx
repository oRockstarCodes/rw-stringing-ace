import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stringPricing = [
  { brand: "Yonex", model: "BG 65", teamPrice: "CA$20.00", regularPrice: "CA$22.00", category: "yonex" },
  { brand: "Yonex", model: "BG 65TI", teamPrice: "CA$22.00", regularPrice: "CA$24.00", category: "yonex" },
  { brand: "Yonex", model: "BG 66 Ultimax", teamPrice: "CA$23.00", regularPrice: "CA$25.00", category: "yonex" },
  { brand: "Yonex", model: "BG 80", teamPrice: "CA$24.00", regularPrice: "CA$25.00", category: "yonex" },
  { brand: "Yonex", model: "Exbolt 65", teamPrice: "CA$26.00", regularPrice: "CA$28.00", category: "yonex" },
  { brand: "Yonex", model: "Aerobite", teamPrice: "CA$27.00", regularPrice: "CA$29.00", category: "yonex" },
  { brand: "GXS", model: "S63", teamPrice: "CA$20.00", regularPrice: "CA$21.00", category: "gxs" },
  { brand: "GXS", model: "K66", teamPrice: "CA$19.00", regularPrice: "CA$20.00", category: "gxs" },
  { brand: "GXS", model: "Z68", teamPrice: "CA$17.00", regularPrice: "CA$18.00", category: "gxs" },
  { brand: "Own", model: "String", teamPrice: "CA$14.00", regularPrice: "CA$16.00", category: "own" },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            String Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional stringing with premium quality strings
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-muted-foreground">Phoenix Team Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-muted-foreground"></div>
              <span className="text-muted-foreground">Regular Price</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-card-foreground">String Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Brand</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
                      <th className="text-right py-3 px-4 font-semibold text-red-600">Phoenix Team Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Regular Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stringPricing.map((string, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground font-medium">{string.brand}</td>
                        <td className="py-3 px-4 text-foreground">{string.model}</td>
                        <td className="py-3 px-4 text-right text-red-600 font-semibold">{string.teamPrice}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{string.regularPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong className="text-foreground">Note:</strong> All prices include professional stringing service with custom tension setup.
                  Bring your own string for our special rate!
                </p>
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book Your Stringing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
