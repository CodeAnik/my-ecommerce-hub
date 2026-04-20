import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const { settings } = useStoreSettings();
  if (!settings.homepage.sections.testimonials) return null;
  const items = settings.reviews.testimonials.filter(t => t.featured);
  if (!items.length) return null;
  return (
    <section className="container max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What customers say</h2>
        <p className="text-muted-foreground mt-2">Real reviews from real shoppers.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {items.slice(0, 3).map(t => (
          <figure key={t.id} className="bg-card border rounded-2xl p-6 shadow-card space-y-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed">"{t.quote}"</blockquote>
            <figcaption className="pt-2 border-t">
              <p className="text-sm font-semibold">{t.author}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
