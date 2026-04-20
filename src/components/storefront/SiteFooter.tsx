import { Link } from "react-router-dom";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram, twitter: Twitter, facebook: Facebook, youtube: Youtube, linkedin: Linkedin,
};

export function SiteFooter() {
  const { settings } = useStoreSettings();
  const { site, contact } = settings;
  const minimal = site.footerLayout === "minimal";

  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container max-w-7xl mx-auto px-4 py-10">
        {!minimal && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <p className="font-semibold text-sm">{site.storeName}</p>
              <p className="text-sm text-muted-foreground">{site.storeTagline}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-semibold">Shop</p>
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground">All products</Link>
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground">New arrivals</Link>
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground">Best sellers</Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-semibold">Company</p>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground">Contact</Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link to="/returns" className="block text-sm text-muted-foreground hover:text-foreground">Returns</Link>
              <Link to="/shipping" className="block text-sm text-muted-foreground hover:text-foreground">Shipping</Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-semibold">Get in touch</p>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t">
          <p className="text-xs text-muted-foreground">{site.footerCopyright}</p>
          <div className="flex items-center gap-1">
            {contact.socialLinks.map(s => {
              const Icon = ICONS[s.platform];
              if (!Icon) return null;
              return <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Icon className="h-4 w-4" /></a>;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
