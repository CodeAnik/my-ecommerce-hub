import { useParams, Navigate } from "react-router-dom";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { PolicyPages } from "@/types/store-settings";

const TITLES: Record<keyof PolicyPages, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  returns: "Return Policy",
  shipping: "Shipping Policy",
};

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useStoreSettings();
  const key = slug as keyof PolicyPages;
  if (!key || !(key in settings.policies)) return <Navigate to="/" replace />;

  return (
    <article className="container max-w-3xl mx-auto px-4 py-12 md:py-16">
      <header className="mb-8 pb-6 border-b">
        <p className="text-sm text-muted-foreground mb-2">Legal</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{TITLES[key]}</h1>
      </header>
      <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: settings.policies[key] }} />
    </article>
  );
}
