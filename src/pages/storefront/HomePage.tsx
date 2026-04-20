import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { HeroSection } from "@/components/storefront/HeroSection";
import { PromoBanners } from "@/components/storefront/PromoBanners";
import { CategoriesGrid } from "@/components/storefront/CategoriesGrid";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { TestimonialsSection } from "@/components/storefront/TestimonialsSection";
import { NewsletterSection } from "@/components/storefront/NewsletterSection";

export default function HomePage() {
  const { settings } = useStoreSettings();
  const { sections } = settings.homepage;
  return (
    <>
      <HeroSection />
      <PromoBanners />
      <CategoriesGrid />
      <FeaturedProducts title="Featured" source="featured" />
      {sections.bestSellers && <FeaturedProducts title="Best sellers" source="best" />}
      {sections.newArrivals && <FeaturedProducts title="New arrivals" source="new" />}
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
