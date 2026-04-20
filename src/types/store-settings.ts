/**
 * Store Settings — single source of truth for branding, content, and storefront.
 * Production-ready shape: swap the storage adapter (lib/storage-adapter.ts) for a real DB
 * without changing any consumer code.
 */

export type ButtonPreset = "rounded" | "sharp" | "pill";
export type FontPreset = "jakarta" | "inter" | "playfair" | "poppins";
export type HeaderLayout = "centered" | "left" | "split";
export type FooterLayout = "columns" | "minimal";

export interface BrandColors {
  /** HSL triplet string e.g. "230 80% 56%" */
  primary: string;
  secondary: string;
  accent: string;
}

export interface SiteSettings {
  storeName: string;
  storeTagline: string;
  logoUrl: string;        // base64 or URL
  faviconUrl: string;
  colors: BrandColors;
  buttonPreset: ButtonPreset;
  font: FontPreset;
  headerLayout: HeaderLayout;
  footerLayout: FooterLayout;
  footerCopyright: string;
}

export interface CtaButton {
  text: string;
  link: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  enabled: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  featured: boolean;
}

export interface HomepageSettings {
  hero: {
    heading: string;
    subheading: string;
    primaryCta: CtaButton;
    secondaryCta: CtaButton;
    image: string;
    mobileImage: string;
  };
  promoBanners: PromoBanner[];
  featuredCategories: string[];     // category names
  featuredProductIds: number[];
  sections: {
    bestSellers: boolean;
    newArrivals: boolean;
    testimonials: boolean;
  };
  newsletter: {
    enabled: boolean;
    heading: string;
    subheading: string;
    buttonText: string;
  };
}

export interface PolicyPages {
  terms: string;        // HTML
  privacy: string;
  returns: string;
  shipping: string;
}

export interface SocialLink {
  id: string;
  platform: string;     // "twitter" | "facebook" | "instagram" | etc.
  url: string;
}

export interface ContactSettings {
  heroText: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  formEnabled: boolean;
  formRecipient: string;
  socialLinks: SocialLink[];
}

export interface Review {
  id: string;
  productId: number;
  productName: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
}

export interface ReviewSettings {
  enabled: boolean;
  reviews: Review[];
  testimonials: Testimonial[];
}

export interface BrandingPreset {
  id: string;
  name: string;
  createdAt: string;
  site: SiteSettings;
  homepage: HomepageSettings;
}

export interface StoreSettings {
  site: SiteSettings;
  homepage: HomepageSettings;
  policies: PolicyPages;
  contact: ContactSettings;
  reviews: ReviewSettings;
  presets: BrandingPreset[];
  version: number;
}
