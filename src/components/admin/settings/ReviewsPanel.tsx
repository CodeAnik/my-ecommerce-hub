import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Star, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RepeaterField } from "./RepeaterField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Testimonial } from "@/types/store-settings";

export function ReviewsPanel() {
  const { settings, update } = useStoreSettings();
  const r = settings.reviews;
  const set = (patch: Partial<typeof r>) => update("reviews", { ...r, ...patch });

  const updateReview = (id: string, patch: Partial<typeof r.reviews[number]>) => {
    set({ reviews: r.reviews.map(x => x.id === id ? { ...x, ...patch } : x) });
  };

  return (
    <div className="space-y-8">
      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold mb-1">Storefront reviews</h3>
            <p className="text-sm text-muted-foreground">Enable a public reviews page.</p>
          </div>
          <Switch checked={r.enabled} onCheckedChange={v => set({ enabled: v })} />
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-3">
        <div>
          <h3 className="text-base font-semibold mb-1">Moderation queue</h3>
          <p className="text-sm text-muted-foreground">Approve, reject, or feature customer reviews.</p>
        </div>
        <Separator />
        {r.reviews.length === 0 && <p className="text-sm italic text-muted-foreground">No reviews yet.</p>}
        {r.reviews.map(rv => (
          <div key={rv.id} className="p-4 rounded-lg border bg-muted/30 space-y-2">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{rv.author}</p>
                  <Badge variant={rv.status === "approved" ? "default" : rv.status === "rejected" ? "destructive" : "secondary"} className="text-[10px]">{rv.status}</Badge>
                  {rv.featured && <Badge variant="outline" className="text-[10px] gap-1"><Star className="h-3 w-3 fill-current" /> Featured</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{rv.productName} · {new Date(rv.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < rv.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm">{rv.comment}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant={rv.status === "approved" ? "default" : "outline"} onClick={() => updateReview(rv.id, { status: "approved" })}>
                <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
              </Button>
              <Button size="sm" variant={rv.status === "rejected" ? "destructive" : "outline"} onClick={() => updateReview(rv.id, { status: "rejected" })}>
                <X className="h-3.5 w-3.5 mr-1.5" /> Reject
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateReview(rv.id, { featured: !rv.featured })}>
                <Star className={`h-3.5 w-3.5 mr-1.5 ${rv.featured ? "fill-current" : ""}`} /> {rv.featured ? "Unfeature" : "Feature"}
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Homepage testimonials</h3>
          <p className="text-sm text-muted-foreground">Custom testimonials for the homepage section.</p>
        </div>
        <Separator />
        <RepeaterField<Testimonial>
          items={r.testimonials}
          onChange={v => set({ testimonials: v })}
          newItem={() => ({ id: `t-${Date.now()}`, author: "", role: "Verified Customer", quote: "", avatar: "", rating: 5, featured: true })}
          addLabel="Add testimonial"
          renderItem={(t, upd) => (
            <div className="space-y-3 pr-8">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Author</Label><Input value={t.author} onChange={e => upd({ author: e.target.value })} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Role</Label><Input value={t.role} onChange={e => upd({ role: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Quote</Label><Textarea rows={2} value={t.quote} onChange={e => upd({ quote: e.target.value })} /></div>
              <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                <div className="space-y-1.5"><Label className="text-xs">Rating (1-5)</Label><Input type="number" min={1} max={5} value={t.rating} onChange={e => upd({ rating: Math.min(5, Math.max(1, +e.target.value)) })} /></div>
                <div className="flex items-center gap-2 pb-2"><Switch checked={t.featured} onCheckedChange={v => upd({ featured: v })} /><span className="text-xs text-muted-foreground">Featured</span></div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
}
