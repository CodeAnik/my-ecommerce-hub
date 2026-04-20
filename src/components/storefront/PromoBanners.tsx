import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Link } from "react-router-dom";

export function PromoBanners() {
  const { settings } = useStoreSettings();
  const banners = settings.homepage.promoBanners.filter(b => b.enabled);
  if (!banners.length) return null;
  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-4">
        {banners.slice(0, 2).map(b => (
          <Link key={b.id} to={b.link} className="group relative overflow-hidden rounded-2xl aspect-[21/9] block">
            {b.image && <img src={b.image} alt={b.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center">
              <p className="text-2xl md:text-3xl font-bold text-background">{b.title}</p>
              <p className="text-sm md:text-base text-background/80 mt-1">{b.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
