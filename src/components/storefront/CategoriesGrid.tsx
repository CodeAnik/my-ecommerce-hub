import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { mockStoreProducts } from "@/data/mock-data";

export function CategoriesGrid() {
  const { settings } = useStoreSettings();
  const cats = settings.homepage.featuredCategories;
  if (!cats.length) return null;

  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop by category</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map(cat => {
          const sample = mockStoreProducts.find(p => p.category === cat);
          return (
            <a key={cat} href="#" className="group relative aspect-square rounded-2xl overflow-hidden border bg-muted/30">
              {sample && <img src={sample.image} alt={cat} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <p className="absolute bottom-3 left-4 right-4 text-base md:text-lg font-semibold text-background">{cat}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
