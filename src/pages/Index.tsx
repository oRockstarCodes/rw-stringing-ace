import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header/>
      <Hero />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
