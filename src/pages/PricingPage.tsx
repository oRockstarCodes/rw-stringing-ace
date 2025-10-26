import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

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

      {/* Pricing Component */}
      <Pricing />

      <Footer />
    </div>
  );
};

export default PricingPage;
