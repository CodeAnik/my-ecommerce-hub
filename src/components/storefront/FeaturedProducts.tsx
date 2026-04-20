import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { mockStoreProducts } from "@/data/mock-data";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  title?: string;
  productIds?: number[];
  source?: "featured" | "best" | "new";
}

export function FeaturedProducts({ title = "Featured products", productIds, source = "featured" }: FeaturedProductsProps) {
  const { settings } = useStoreSettings();
  let products = mockStoreProducts;
  if (productIds) products = mockStoreProducts.filter(p => productIds.includes(p.id));
  else if (source === "featured") products = mockStoreProducts.filter(p => settings.homepage.featuredProductIds.includes(p.id));
  else if (source === "best") products = [...mockStoreProducts].sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0)).slice(0, 4);
  else if (source === "new") products = [...mockStoreProducts].sort((a, b) => (b.date_created || "").localeCompare(a.date_created || "")).slice(0, 4);

  if (!products.length) return null;

  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        <Button variant="ghost" size="sm">View all →</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {products.slice(0, 8).map(p => {
          const onSale = p.sale_price && p.regular_price && p.sale_price !== p.regular_price;
          return (
            <article key={p.id} className="group bg-card rounded-2xl overflow-hidden border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
              <div className="aspect-square bg-muted overflow-hidden relative">
                <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {onSale && <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground px-2 py-0.5 rounded">Sale</span>}
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-xs text-muted-foreground">{p.category}</p>
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5em]">{p.name}</h3>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span>{p.rating}</span>
                </div>
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-sm font-bold">${p.price}</span>
                  {onSale && <span className="text-xs text-muted-foreground line-through">${p.regular_price}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
