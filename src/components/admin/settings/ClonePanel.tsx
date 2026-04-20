import { useRef } from "react";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";
import { StoreSettings } from "@/types/store-settings";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ClonePanel() {
  const { settings, replace, reset } = useStoreSettings();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `store-settings-${settings.site.storeName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported");
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as StoreSettings;
        if (!parsed.site || !parsed.homepage) throw new Error("Invalid settings file");
        replace(parsed);
        toast.success("Settings imported — storefront updated");
      } catch (err) {
        toast.error("Invalid settings file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <section className="bg-card rounded-xl border p-6 shadow-card space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1">Template / clone mode</h3>
            <p className="text-sm text-muted-foreground">Export your full store configuration as a portable template. Import to spin up a new store with identical structure.</p>
          </div>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleExport} className="h-auto py-4 flex-col gap-2">
            <Download className="h-5 w-5" />
            <div className="text-center">
              <p className="text-sm font-semibold">Export settings</p>
              <p className="text-xs text-muted-foreground font-normal">Download as JSON</p>
            </div>
          </Button>
          <Button variant="outline" onClick={() => inputRef.current?.click()} className="h-auto py-4 flex-col gap-2">
            <Upload className="h-5 w-5" />
            <div className="text-center">
              <p className="text-sm font-semibold">Import settings</p>
              <p className="text-xs text-muted-foreground font-normal">Upload a JSON template</p>
            </div>
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }} />
      </section>

      <section className="bg-card rounded-xl border p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1 text-destructive">Danger zone</h3>
          <p className="text-sm text-muted-foreground">Reset all settings to factory defaults. Cannot be undone.</p>
        </div>
        <Separator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <RefreshCw className="h-4 w-4 mr-2" /> Reset to defaults
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all store settings?</AlertDialogTitle>
              <AlertDialogDescription>This will erase your branding, homepage content, policies, contact info, reviews, and presets. Export first if you want a backup.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { reset(); toast.success("Reset to defaults"); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Reset everything</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border p-6 space-y-2">
        <h3 className="text-base font-semibold">Multi-tenant ready</h3>
        <p className="text-sm text-muted-foreground">All branding, content, and layout settings are database-driven (currently mock-stored). Connect Lovable Cloud to power true multi-store SaaS deployment with per-tenant settings, secure file storage, and real role enforcement.</p>
      </section>
    </div>
  );
}
