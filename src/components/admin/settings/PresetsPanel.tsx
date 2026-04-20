import { useState } from "react";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Layers, Copy, Trash2, Check, Plus } from "lucide-react";
import { toast } from "sonner";

export function PresetsPanel() {
  const { settings, savePreset, applyPreset, duplicatePreset, deletePreset } = useStoreSettings();
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) { toast.error("Give the preset a name"); return; }
    savePreset(name.trim());
    setName("");
    toast.success("Preset saved");
  };

  return (
    <div className="space-y-8">
      <section className="bg-card rounded-xl border p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">Save current branding as preset</h3>
          <p className="text-sm text-muted-foreground">Snapshot your site settings + homepage. Reuse for new stores.</p>
        </div>
        <Separator />
        <div className="flex gap-2">
          <Input placeholder="Preset name (e.g. Minimal Spring)" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSave()} />
          <Button onClick={handleSave}><Plus className="h-4 w-4 mr-2" /> Save preset</Button>
        </div>
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">Saved presets</h3>
          <p className="text-sm text-muted-foreground">{settings.presets.length} preset{settings.presets.length === 1 ? "" : "s"} saved.</p>
        </div>
        <Separator />
        {settings.presets.length === 0 && <p className="text-sm italic text-muted-foreground py-4 text-center">No presets yet — save one above to get started.</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          {settings.presets.map(p => (
            <div key={p.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, hsl(${p.site.colors.primary}), hsl(${p.site.colors.accent}))` }}>
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.site.storeName} · {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                <Button size="sm" variant="default" onClick={() => { applyPreset(p.id); toast.success(`Applied "${p.name}"`); }}>
                  <Check className="h-3.5 w-3.5 mr-1" /> Apply
                </Button>
                <Button size="sm" variant="outline" onClick={() => { duplicatePreset(p.id); toast.success("Duplicated"); }}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Duplicate
                </Button>
                <Button size="sm" variant="outline" onClick={() => { deletePreset(p.id); toast.success("Deleted"); }} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
