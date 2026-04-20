import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RepeaterField } from "./RepeaterField";
import { SocialLink } from "@/types/store-settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PLATFORMS = ["instagram", "twitter", "facebook", "tiktok", "youtube", "linkedin", "pinterest"];

export function ContactPanel() {
  const { settings, update } = useStoreSettings();
  const c = settings.contact;
  const set = (patch: Partial<typeof c>) => update("contact", { ...c, ...patch });

  return (
    <div className="space-y-8">
      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Contact info</h3>
          <p className="text-sm text-muted-foreground">Shown on the public /contact page.</p>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Hero text</Label>
          <Textarea rows={2} value={c.heroText} onChange={e => set({ heroText: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Textarea rows={2} value={c.address} onChange={e => set({ address: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Phone</Label><Input value={c.phone} onChange={e => set({ phone: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={c.email} onChange={e => set({ email: e.target.value })} /></div>
        </div>
        <div className="space-y-2">
          <Label>Map embed URL</Label>
          <Input value={c.mapEmbedUrl} onChange={e => set({ mapEmbedUrl: e.target.value })} placeholder="Google Maps embed URL" />
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold mb-1">Contact form</h3>
            <p className="text-sm text-muted-foreground">Display a contact form on the public page.</p>
          </div>
          <Switch checked={c.formEnabled} onCheckedChange={v => set({ formEnabled: v })} />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Form recipient email</Label>
          <Input type="email" value={c.formRecipient} onChange={e => set({ formRecipient: e.target.value })} disabled={!c.formEnabled} />
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Social links</h3>
          <p className="text-sm text-muted-foreground">Shown in header / footer.</p>
        </div>
        <Separator />
        <RepeaterField<SocialLink>
          items={c.socialLinks}
          onChange={v => set({ socialLinks: v })}
          newItem={() => ({ id: `s-${Date.now()}`, platform: "instagram", url: "" })}
          addLabel="Add social link"
          renderItem={(s, upd) => (
            <div className="grid sm:grid-cols-[140px_1fr] gap-3 pr-8">
              <Select value={s.platform} onValueChange={v => upd({ platform: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="https://..." value={s.url} onChange={e => upd({ url: e.target.value })} />
            </div>
          )}
        />
      </section>
    </div>
  );
}
