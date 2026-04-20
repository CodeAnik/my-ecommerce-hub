import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { StoreSettings, BrandingPreset } from "@/types/store-settings";
import { storageAdapter } from "@/lib/storage-adapter";
import { defaultStoreSettings } from "@/data/default-settings";

interface StoreSettingsContextType {
  settings: StoreSettings;
  /** Patch top-level slice of settings (deep-merge handled by caller via spread) */
  update: <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => void;
  /** Fully replace settings (used by preset apply / import) */
  replace: (next: StoreSettings) => void;
  /** Reset to factory defaults */
  reset: () => void;
  /** Save current site+homepage as a named preset */
  savePreset: (name: string) => void;
  applyPreset: (id: string) => void;
  duplicatePreset: (id: string) => void;
  deletePreset: (id: string) => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

const FONT_FAMILY: Record<string, string> = {
  jakarta: "'Plus Jakarta Sans', system-ui, sans-serif",
  inter: "'Inter', system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  poppins: "'Poppins', system-ui, sans-serif",
};

const FONT_GOOGLE: Record<string, string> = {
  jakarta: "Plus+Jakarta+Sans:wght@300;400;500;600;700;800",
  inter: "Inter:wght@300;400;500;600;700;800",
  playfair: "Playfair+Display:wght@400;500;600;700;800",
  poppins: "Poppins:wght@300;400;500;600;700;800",
};

const RADIUS: Record<string, string> = {
  rounded: "0.75rem",
  sharp: "0.125rem",
  pill: "9999px",
};

function applyTheme(s: StoreSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--primary", s.site.colors.primary);
  root.style.setProperty("--ring", s.site.colors.primary);
  root.style.setProperty("--accent", s.site.colors.accent);
  root.style.setProperty("--secondary", s.site.colors.secondary);
  root.style.setProperty("--radius", RADIUS[s.site.buttonPreset] || "0.75rem");
  root.style.setProperty("--font-body", FONT_FAMILY[s.site.font] || FONT_FAMILY.jakarta);
  document.body.style.fontFamily = FONT_FAMILY[s.site.font] || FONT_FAMILY.jakarta;

  // Inject Google Font link if missing
  const fontKey = s.site.font;
  const linkId = `font-${fontKey}`;
  if (FONT_GOOGLE[fontKey] && !document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${FONT_GOOGLE[fontKey]}&display=swap`;
    document.head.appendChild(link);
  }

  // Favicon
  if (s.site.faviconUrl) {
    let fav = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!fav) {
      fav = document.createElement("link");
      fav.rel = "icon";
      document.head.appendChild(fav);
    }
    fav.href = s.site.faviconUrl;
  }

  // Document title
  if (s.site.storeName) document.title = s.site.storeName;
}

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => storageAdapter.read());

  // Apply theme on mount + every change
  useEffect(() => {
    applyTheme(settings);
    storageAdapter.write(settings);
  }, [settings]);

  const update = useCallback(<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const replace = useCallback((next: StoreSettings) => setSettings(next), []);

  const reset = useCallback(() => {
    storageAdapter.reset();
    setSettings(defaultStoreSettings);
  }, []);

  const savePreset = useCallback((name: string) => {
    setSettings(prev => {
      const preset: BrandingPreset = {
        id: `preset-${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
        site: prev.site,
        homepage: prev.homepage,
      };
      return { ...prev, presets: [...prev.presets, preset] };
    });
  }, []);

  const applyPreset = useCallback((id: string) => {
    setSettings(prev => {
      const p = prev.presets.find(x => x.id === id);
      if (!p) return prev;
      return { ...prev, site: p.site, homepage: p.homepage };
    });
  }, []);

  const duplicatePreset = useCallback((id: string) => {
    setSettings(prev => {
      const p = prev.presets.find(x => x.id === id);
      if (!p) return prev;
      const copy: BrandingPreset = { ...p, id: `preset-${Date.now()}`, name: `${p.name} (Copy)`, createdAt: new Date().toISOString() };
      return { ...prev, presets: [...prev.presets, copy] };
    });
  }, []);

  const deletePreset = useCallback((id: string) => {
    setSettings(prev => ({ ...prev, presets: prev.presets.filter(x => x.id !== id) }));
  }, []);

  const value = useMemo(() => ({ settings, update, replace, reset, savePreset, applyPreset, duplicatePreset, deletePreset }),
    [settings, update, replace, reset, savePreset, applyPreset, duplicatePreset, deletePreset]);

  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
};

export const useStoreSettings = () => {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) throw new Error("useStoreSettings must be used within StoreSettingsProvider");
  return ctx;
};
