import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Received! We'll get back to you as soon as possible.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

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
                Get In Touch
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
              Ready to get your racket professionally strung? Reach out to us and we'll get back to you shortly
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-zinc-700 via-zinc-750 to-zinc-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_60%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
                Contact Us
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Ready to enhance your game? Contact us to book your stringing service
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-zinc-800/90 backdrop-blur border-2 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-400">Send Us a Message</CardTitle>
                <CardDescription className="text-zinc-300">
                  Fill out the form and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-zinc-200">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-zinc-900/50 border-zinc-700 text-zinc-100 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-zinc-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-zinc-900/50 border-zinc-700 text-zinc-100 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-zinc-200">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-700 text-zinc-100 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-zinc-200">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="bg-zinc-900/50 border-zinc-700 text-zinc-100 focus:border-yellow-400"
                    />
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold shadow-lg shadow-yellow-400/30"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-zinc-800/90 backdrop-blur border-2 border-zinc-700 hover:border-yellow-400/50 transition-all duration-300">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-zinc-100">Email</h3>
                    <p className="text-zinc-300">contact@rwstringing.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/90 backdrop-blur border-2 border-zinc-700 hover:border-yellow-400/50 transition-all duration-300">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                    <Phone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-zinc-100">Phone</h3>
                    <p className="text-zinc-300">(555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/90 backdrop-blur border-2 border-zinc-700 hover:border-yellow-400/50 transition-all duration-300">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-zinc-100">Location</h3>
                    <p className="text-zinc-300">
                      123 Court Street<br />
                      Sports District<br />
                      City, State 12345
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;