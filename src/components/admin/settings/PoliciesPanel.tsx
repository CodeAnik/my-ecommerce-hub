import { useState } from "react";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "./RichTextEditor";
import { PolicyPages } from "@/types/store-settings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const PAGES: { key: keyof PolicyPages; label: string }[] = [
  { key: "terms", label: "Terms & Conditions" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "returns", label: "Return Policy" },
  { key: "shipping", label: "Shipping Policy" },
];

export function PoliciesPanel() {
  const { settings, update } = useStoreSettings();
  const [active, setActive] = useState<keyof PolicyPages>("terms");
  const setHtml = (key: keyof PolicyPages, html: string) => update("policies", { ...settings.policies, [key]: html });

  return (
    <div className="bg-card rounded-xl border p-6 shadow-card space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold mb-1">Policy pages</h3>
          <p className="text-sm text-muted-foreground">Edit the rich content shown on each storefront policy page.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("Auto-saved")}>
          <Save className="h-4 w-4 mr-2" /> All changes auto-save
        </Button>
      </div>
      <Tabs value={active} onValueChange={v => setActive(v as keyof PolicyPages)}>
        <TabsList className="w-full justify-start flex-wrap h-auto">
          {PAGES.map(p => <TabsTrigger key={p.key} value={p.key}>{p.label}</TabsTrigger>)}
        </TabsList>
        {PAGES.map(p => (
          <TabsContent key={p.key} value={p.key} className="mt-4">
            <RichTextEditor value={settings.policies[p.key]} onChange={html => setHtml(p.key, html)} />
            <p className="text-xs text-muted-foreground mt-2">Public URL: <code className="px-1.5 py-0.5 rounded bg-muted">/{p.key}</code></p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
