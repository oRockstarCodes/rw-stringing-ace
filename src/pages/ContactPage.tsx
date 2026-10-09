import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const [stringInterest, setStringInterest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    racketCount: "1",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stringParam = searchParams.get("string");
    if (stringParam) {
      setStringInterest(decodeURIComponent(stringParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          "Booking is temporarily unavailable. Please email us directly at " + siteConfig.email,
        );
      }

      const racketCount = Number(formData.racketCount);
      if (!Number.isInteger(racketCount) || racketCount < 1) {
        throw new Error("Enter a valid number of rackets (1 or more).");
      }

      const phone = formData.phone.trim();
      if (!phone) {
        throw new Error("Phone number is required.");
      }

      let message = formData.message.trim();
      if (stringInterest) {
        message = message
          ? `${message}\n\nString interest: ${stringInterest}`
          : `String interest: ${stringInterest}`;
      }

      const { error } = await supabase.from("inquiries").insert({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone,
        racket_count: racketCount,
        message: message || "(No message)",
      });

      if (error) throw error;

      toast.success("Message received!", {
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", phone: "", racketCount: "1", message: "" });
    } catch (err) {
      toast.error("Could not send message", {
        description: err instanceof Error ? err.message : "Please try again or email us.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      content: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    ...(siteConfig.phone
      ? [
          {
            icon: Phone,
            title: "Phone",
            content: siteConfig.phone,
            href: `tel:${siteConfig.phone.replace(/\D/g, "")}`,
          },
        ]
      : []),
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
                  Share your details and we&apos;ll follow up shortly.
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="mt-1.5 bg-background border-border focus-visible:ring-accent"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1.5 bg-background border-border focus-visible:ring-accent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="racketCount">Number of rackets</Label>
                      <Input
                        id="racketCount"
                        type="number"
                        min={1}
                        step={1}
                        value={formData.racketCount}
                        onChange={(e) => setFormData({ ...formData, racketCount: e.target.value })}
                        required
                        className="mt-1.5 bg-background border-border focus-visible:ring-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Message (optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="mt-1.5 bg-background border-border focus-visible:ring-accent resize-none"
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
