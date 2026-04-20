import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MediaUpload } from "./MediaUpload";
import { ColorField } from "./ColorField";
import { ButtonPreset, FontPreset, HeaderLayout, FooterLayout } from "@/types/store-settings";

export function SiteSettingsPanel() {
  const { settings, update } = useStoreSettings();
  const s = settings.site;
  const set = (patch: Partial<typeof s>) => update("site", { ...s, ...patch });

  return (
    <div className="space-y-8">
      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Brand identity</h3>
          <p className="text-sm text-muted-foreground">Store name, tagline, logo, favicon.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Store name</Label>
            <Input value={s.storeName} onChange={e => set({ storeName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Store tagline</Label>
            <Input value={s.storeTagline} onChange={e => set({ storeTagline: e.target.value })} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <MediaUpload label="Logo" aspect="wide" value={s.logoUrl} onChange={v => set({ logoUrl: v })} />
          <MediaUpload label="Favicon" aspect="square" value={s.faviconUrl} onChange={v => set({ faviconUrl: v })} maxSizeMB={1} />
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Colors</h3>
          <p className="text-sm text-muted-foreground">Live theme — changes apply instantly across dashboard and storefront.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-3 gap-5">
          <ColorField label="Primary" value={s.colors.primary} onChange={v => set({ colors: { ...s.colors, primary: v } })} />
          <ColorField label="Secondary" value={s.colors.secondary} onChange={v => set({ colors: { ...s.colors, secondary: v } })} />
          <ColorField label="Accent" value={s.colors.accent} onChange={v => set({ colors: { ...s.colors, accent: v } })} />
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Typography & shape</h3>
          <p className="text-sm text-muted-foreground">Pick a font and button style.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Font family</Label>
            <Select value={s.font} onValueChange={(v: FontPreset) => set({ font: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jakarta">Plus Jakarta Sans</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="playfair">Playfair Display</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Button style</Label>
            <Select value={s.buttonPreset} onValueChange={(v: ButtonPreset) => set({ buttonPreset: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="sharp">Sharp</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-5">
        <div>
          <h3 className="text-base font-semibold mb-1">Layout</h3>
          <p className="text-sm text-muted-foreground">Header and footer arrangement.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Header layout</Label>
            <Select value={s.headerLayout} onValueChange={(v: HeaderLayout) => set({ headerLayout: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="split">Split (logo left, nav right)</SelectItem>
                <SelectItem value="centered">Centered (logo center)</SelectItem>
                <SelectItem value="left">Left aligned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Footer layout</Label>
            <Select value={s.footerLayout} onValueChange={(v: FooterLayout) => set({ footerLayout: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="columns">Columns (rich)</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Footer copyright</Label>
          <Input value={s.footerCopyright} onChange={e => set({ footerCopyright: e.target.value })} />
        </div>
      </section>
    </div>
  );
}
