/**
 * Pluggable storage adapter for store settings.
 * Today: localStorage. Tomorrow: replace `read`/`write` with a fetch to your API
 * (or Supabase) — no consumer code needs to change.
 */

import { StoreSettings } from "@/types/store-settings";
import { defaultStoreSettings } from "@/data/default-settings";

const STORAGE_KEY = "store-settings-v1";

export const storageAdapter = {
  read(): StoreSettings {
    if (typeof window === "undefined") return defaultStoreSettings;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultStoreSettings;
      const parsed = JSON.parse(raw) as StoreSettings;
      // shallow merge to backfill new fields after schema evolution
      return {
        ...defaultStoreSettings,
        ...parsed,
        site: { ...defaultStoreSettings.site, ...(parsed.site || {}), colors: { ...defaultStoreSettings.site.colors, ...(parsed.site?.colors || {}) } },
        homepage: { ...defaultStoreSettings.homepage, ...(parsed.homepage || {}), hero: { ...defaultStoreSettings.homepage.hero, ...(parsed.homepage?.hero || {}) }, sections: { ...defaultStoreSettings.homepage.sections, ...(parsed.homepage?.sections || {}) }, newsletter: { ...defaultStoreSettings.homepage.newsletter, ...(parsed.homepage?.newsletter || {}) } },
        policies: { ...defaultStoreSettings.policies, ...(parsed.policies || {}) },
        contact: { ...defaultStoreSettings.contact, ...(parsed.contact || {}) },
        reviews: { ...defaultStoreSettings.reviews, ...(parsed.reviews || {}) },
      };
    } catch {
      return defaultStoreSettings;
    }
  },
  write(settings: StoreSettings): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to persist store settings", e);
    }
  },
  reset(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
