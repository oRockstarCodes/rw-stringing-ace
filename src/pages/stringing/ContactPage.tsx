import { useState, FormEvent } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/data/site";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    toast.success("Message received!", {
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      content: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: Phone,
      title: "Phone",
      content: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/\D/g, "")}`,
    },
    {
      icon: MapPin,
      title: "Location",
      content: (
        <>
          {siteConfig.location.line1}
          <br />
          {siteConfig.location.line2}
          <br />
          {siteConfig.location.line3}
        </>
      ),
    },
    {
      icon: Clock,
      title: "Hours",
      content: siteConfig.hours,
    },
  ];

  return (
    <Layout>
      <PageHero
        badge="Contact"
        title="Get In Touch"
        description="Ready to get your racket professionally strung? Send us a message and we'll respond shortly."
      />

      <section id="contact" className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            <Card className="card-premium lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl">Send a Message</CardTitle>
                <CardDescription>
                  Tell us about your racket, preferred string, and tension — we&apos;ll take it from there.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1.5 bg-background border-border focus-visible:ring-accent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-1.5 bg-background border-border focus-visible:ring-accent"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 bg-background border-border focus-visible:ring-accent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="mt-1.5 bg-background border-border focus-visible:ring-accent resize-none"
                      placeholder="Racket model, string preference, tension, timeline..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full h-11"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {contactItems.map((item) => (
                <Card key={item.title} className="card-premium">
                  <CardContent className="flex items-start gap-4 pt-5">
                    <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.content}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
