import { Link } from "react-router-dom";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { settings } = useStoreSettings();
  const h = settings.homepage.hero;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-background">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-5 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">{h.heading}</h1>
          <p className="text-lg text-muted-foreground max-w-md">{h.subheading}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {h.primaryCta.text && (
              <Button size="lg" asChild className="gradient-primary text-primary-foreground shadow-glow">
                <Link to={h.primaryCta.link}>{h.primaryCta.text} <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            )}
            {h.secondaryCta.text && (
              <Button size="lg" variant="outline" asChild>
                <Link to={h.secondaryCta.link}>{h.secondaryCta.text}</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <picture>
            <source media="(max-width: 640px)" srcSet={h.mobileImage || h.image} />
            <img src={h.image} alt="" loading="eager" className="w-full aspect-video md:aspect-[4/3] object-cover rounded-2xl shadow-elevated" />
          </picture>
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-60" />
        </div>
      </div>
    </section>
  );
}
