import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { mockWishlist, WooProduct } from "@/data/mock-data";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const [items, setItems] = useState<WooProduct[]>(mockWishlist);

  const remove = (id: number) => {
    setItems(prev => prev.filter(p => p.id !== id));
    toast.success("Removed from wishlist");
  };

  return (
    <>
      <DashboardHeader title="Wishlist" breadcrumb={["Dashboard", "Wishlist"]} />
      <div className="p-4 lg:p-6 animate-fade-in">
        {items.length === 0 ? (
          <EmptyState icon={Heart} title="Your wishlist is empty" description="Save products you love and come back to them later." actionLabel="Browse Products" onAction={() => {}} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map(product => (
              <div key={product.id} className="bg-card rounded-xl border shadow-card overflow-hidden group hover:shadow-elevated transition-all">
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {product.sale_price && (
                    <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</span>
                  )}
                  <button
                    onClick={() => remove(product.id)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-1.5">
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-semibold truncate">{product.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">${product.price}</span>
                    {product.sale_price && <span className="text-xs text-muted-foreground line-through">${product.regular_price}</span>}
                  </div>
                  <Button size="sm" className="w-full gradient-primary text-primary-foreground mt-2 h-8 text-xs">
                    <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
