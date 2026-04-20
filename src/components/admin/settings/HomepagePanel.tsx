import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MediaUpload } from "./MediaUpload";
import { RepeaterField } from "./RepeaterField";
import { mockStoreProducts } from "@/data/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { PromoBanner } from "@/types/store-settings";

const ALL_CATEGORIES = Array.from(new Set(mockStoreProducts.map(p => p.category)));

export function HomepagePanel() {
  const { settings, update } = useStoreSettings();
  const h = settings.homepage;
  const set = (patch: Partial<typeof h>) => update("homepage", { ...h, ...patch });
  const setHero = (patch: Partial<typeof h.hero>) => set({ hero: { ...h.hero, ...patch } });

  const toggleCategory = (cat: string) => {
    set({ featuredCategories: h.featuredCategories.includes(cat) ? h.featuredCategories.filter(c => c !== cat) : [...h.featuredCategories, cat] });
  };
  const toggleProduct = (id: number) => {
    set({ featuredProductIds: h.featuredProductIds.includes(id) ? h.featuredProductIds.filter(p => p !== id) : [...h.featuredProductIds, id] });
  };

  return (
    <div className="space-y-8">
      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Hero section</h3>
          <p className="text-sm text-muted-foreground">The first thing visitors see.</p>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input value={h.hero.heading} onChange={e => setHero({ heading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subheading</Label>
            <Textarea rows={2} value={h.hero.subheading} onChange={e => setHero({ subheading: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary CTA text</Label>
              <Input value={h.hero.primaryCta.text} onChange={e => setHero({ primaryCta: { ...h.hero.primaryCta, text: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA link</Label>
              <Input value={h.hero.primaryCta.link} onChange={e => setHero({ primaryCta: { ...h.hero.primaryCta, link: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA text</Label>
              <Input value={h.hero.secondaryCta.text} onChange={e => setHero({ secondaryCta: { ...h.hero.secondaryCta, text: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA link</Label>
              <Input value={h.hero.secondaryCta.link} onChange={e => setHero({ secondaryCta: { ...h.hero.secondaryCta, link: e.target.value } })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <MediaUpload label="Desktop hero image" aspect="video" value={h.hero.image} onChange={v => setHero({ image: v })} maxSizeMB={3} />
            <MediaUpload label="Mobile hero image" aspect="tall" value={h.hero.mobileImage} onChange={v => setHero({ mobileImage: v })} maxSizeMB={3} />
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Promotional banners</h3>
          <p className="text-sm text-muted-foreground">Add up to 3 promo banners on the homepage.</p>
        </div>
        <Separator />
        <RepeaterField<PromoBanner>
          items={h.promoBanners}
          onChange={v => set({ promoBanners: v })}
          newItem={() => ({ id: `pb-${Date.now()}`, title: "New banner", subtitle: "", image: "", link: "/", enabled: true })}
          addLabel="Add promo banner"
          renderItem={(b, upd) => (
            <div className="space-y-3 pr-8">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={b.title} onChange={e => upd({ title: e.target.value })} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Link</Label><Input value={b.link} onChange={e => upd({ link: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Subtitle</Label><Input value={b.subtitle} onChange={e => upd({ subtitle: e.target.value })} /></div>
              <MediaUpload aspect="video" value={b.image} onChange={v => upd({ image: v })} />
              <div className="flex items-center gap-2"><Switch checked={b.enabled} onCheckedChange={v => upd({ enabled: v })} /><span className="text-xs text-muted-foreground">Show on homepage</span></div>
            </div>
          )}
        />
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Featured categories</h3>
          <p className="text-sm text-muted-foreground">Pick which categories appear in the homepage grid.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ALL_CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
              <Checkbox checked={h.featuredCategories.includes(cat)} onCheckedChange={() => toggleCategory(cat)} />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Featured products</h3>
          <p className="text-sm text-muted-foreground">Up to 8 products to feature on the homepage.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
          {mockStoreProducts.map(p => (
            <label key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
              <Checkbox checked={h.featuredProductIds.includes(p.id)} onCheckedChange={() => toggleProduct(p.id)} />
              <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">${p.price}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Sections & newsletter</h3>
          <p className="text-sm text-muted-foreground">Toggle homepage sections and configure the newsletter strip.</p>
        </div>
        <Separator />
        <div className="space-y-2">
          {[
            { key: "bestSellers", label: "Best sellers section" },
            { key: "newArrivals", label: "New arrivals section" },
            { key: "testimonials", label: "Testimonials section" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">{item.label}</span>
              <Switch checked={h.sections[item.key as keyof typeof h.sections]} onCheckedChange={v => set({ sections: { ...h.sections, [item.key]: v } })} />
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Newsletter section</Label>
            <Switch checked={h.newsletter.enabled} onCheckedChange={v => set({ newsletter: { ...h.newsletter, enabled: v } })} />
          </div>
          <Input placeholder="Heading" value={h.newsletter.heading} onChange={e => set({ newsletter: { ...h.newsletter, heading: e.target.value } })} />
          <Input placeholder="Subheading" value={h.newsletter.subheading} onChange={e => set({ newsletter: { ...h.newsletter, subheading: e.target.value } })} />
          <Input placeholder="Button text" value={h.newsletter.buttonText} onChange={e => set({ newsletter: { ...h.newsletter, buttonText: e.target.value } })} />
        </div>
      </section>
    </div>
  );
}
