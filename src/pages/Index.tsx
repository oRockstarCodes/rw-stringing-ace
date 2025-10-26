import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header/>
      <Hero />
      <Services />
      <Footer />
    </div>
  );
};

export default Index;
