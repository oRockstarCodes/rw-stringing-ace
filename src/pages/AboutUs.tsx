import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Users, Target, Sparkles } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-zinc-900 via-zinc-850 to-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_70%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
                About Us
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              RW Stringing Service
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
              Your trusted partner for professional badminton stringing services, dedicated to enhancing your game with precision and expertise.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-20 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Experienced professionals dedicated to providing the best stringing service
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center overflow-hidden">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 border-4 border-yellow-400/30 flex items-center justify-center">
                    <Users className="w-20 h-20 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-2">Rocky Wang</h3>
                <p className="text-yellow-400 font-semibold text-xl mb-6">Head Stringer</p>
                
                <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                  With over 10 years of experience, Ryan has strung thousands of rackets and specializes in precision tension control and hybrid string setups.
                </p>

                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Certified professional stringer with 10+ years of experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Specialized in precision tension control and hybrid string configurations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Former competitive badminton player with deep understanding of game mechanics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Passionate about helping players of all levels achieve their best performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-800 via-zinc-850 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_70%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              The principles that guide our service and commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-black to-zinc-700 border-2 border-zinc-700 hover:border-yellow-400/60 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/15">
              <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50 mb-3">Quality First</h3>
              <p className="text-zinc-300">
                We use only premium strings and maintain our equipment to the highest standards, ensuring consistent, professional results.
              </p>
            </div>

            <div className="bg-gradient-to-br from-black to-zinc-700 border-2 border-zinc-700 hover:border-yellow-400/60 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/15">
              <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50 mb-3">Precision</h3>
              <p className="text-zinc-300">
                Every racket is strung with calibrated tension meters and careful attention to detail, guaranteeing accuracy within 0.5 lbs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-black to-zinc-700 border-2 border-zinc-700 hover:border-yellow-400/60 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/15">
              <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50 mb-3">Customer Focus</h3>
              <p className="text-zinc-300">
                Your satisfaction is our priority. We take time to understand your preferences and provide personalized recommendations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-black to-zinc-700 border-2 border-zinc-700 hover:border-yellow-400/60 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/15">
              <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50 mb-3">Innovation</h3>
              <p className="text-zinc-300">
                We stay current with the latest stringing techniques and string technologies to offer you the best possible service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_70%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-zinc-300 mb-8">
              Let us help you take your game to the next level with professional stringing service you can trust.
            </p>
            <a 
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-full shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:scale-105"
            >
              Book Your Stringing Service
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
