import { StoreSettings } from "@/types/store-settings";

export const defaultStoreSettings: StoreSettings = {
  version: 1,
  site: {
    storeName: "MyStore",
    storeTagline: "Premium products, delivered with care.",
    logoUrl: "",
    faviconUrl: "",
    colors: {
      primary: "230 80% 56%",
      secondary: "220 14% 96%",
      accent: "260 80% 60%",
    },
    buttonPreset: "rounded",
    font: "jakarta",
    headerLayout: "split",
    footerLayout: "columns",
    footerCopyright: "© 2026 MyStore. All rights reserved.",
  },
  homepage: {
    hero: {
      heading: "Discover products you'll love",
      subheading: "Curated essentials, premium quality, and fast delivery — everything you need in one place.",
      primaryCta: { text: "Shop Now", link: "/" },
      secondaryCta: { text: "Learn More", link: "/contact" },
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop",
      mobileImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
    },
    promoBanners: [
      { id: "pb-1", title: "Spring Sale", subtitle: "Up to 40% off select items", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop", link: "/", enabled: true },
      { id: "pb-2", title: "New Arrivals", subtitle: "Fresh styles just dropped", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop", link: "/", enabled: true },
    ],
    featuredCategories: ["Electronics", "Accessories", "Footwear"],
    featuredProductIds: [1, 3, 5, 7],
    sections: { bestSellers: true, newArrivals: true, testimonials: true },
    newsletter: {
      enabled: true,
      heading: "Join our newsletter",
      subheading: "Get 10% off your first order plus weekly drops.",
      buttonText: "Subscribe",
    },
  },
  policies: {
    terms: "<h2>Terms and Conditions</h2><p>By using our store you agree to our terms. Edit this content from the dashboard.</p>",
    privacy: "<h2>Privacy Policy</h2><p>We respect your privacy. Edit this content from the dashboard.</p>",
    returns: "<h2>Return Policy</h2><p>Returns accepted within 30 days. Edit this content from the dashboard.</p>",
    shipping: "<h2>Shipping Policy</h2><p>Free shipping on orders over $50. Edit this content from the dashboard.</p>",
  },
  contact: {
    heroText: "We'd love to hear from you. Reach out anytime.",
    address: "742 Evergreen Terrace, Portland, OR 97201",
    phone: "+1 (555) 234-5678",
    email: "hello@mystore.com",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22606.16!2d-122.6784!3d45.5152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMwJzU0LjciTiAxMjLCsDQwJzQyLjIiVw!5e0!3m2!1sen!2sus!4v1700000000000",
    formEnabled: true,
    formRecipient: "hello@mystore.com",
    socialLinks: [
      { id: "s1", platform: "instagram", url: "https://instagram.com/mystore" },
      { id: "s2", platform: "twitter", url: "https://twitter.com/mystore" },
      { id: "s3", platform: "facebook", url: "https://facebook.com/mystore" },
    ],
  },
  reviews: {
    enabled: true,
    reviews: [
      { id: "r1", productId: 1, productName: "Premium Wireless Headphones", author: "Jamie L.", rating: 5, comment: "Sound quality is incredible. Best purchase this year.", date: "2026-03-12", status: "approved", featured: true },
      { id: "r2", productId: 3, productName: "Smart Watch Pro", author: "Marco R.", rating: 4, comment: "Battery life is great, fitness tracking is accurate.", date: "2026-03-20", status: "approved", featured: false },
      { id: "r3", productId: 5, productName: "Portable Bluetooth Speaker", author: "Priya S.", rating: 5, comment: "Loud, clear, and waterproof. Love it.", date: "2026-04-01", status: "pending", featured: false },
      { id: "r4", productId: 7, productName: "Mechanical Keyboard RGB", author: "Devon K.", rating: 3, comment: "Decent but a little loud for an office.", date: "2026-04-05", status: "pending", featured: false },
    ],
    testimonials: [
      { id: "t1", author: "Sarah Mitchell", role: "Verified Customer", quote: "Fast shipping and the products are exactly as described. I'll be back!", avatar: "", rating: 5, featured: true },
      { id: "t2", author: "James Carter", role: "Verified Customer", quote: "Customer service handled my exchange in under 24 hours. Impressive.", avatar: "", rating: 5, featured: true },
      { id: "t3", author: "Emily Chen", role: "Verified Customer", quote: "The quality genuinely surprised me at this price point.", avatar: "", rating: 4, featured: false },
    ],
  },
  presets: [],
};
