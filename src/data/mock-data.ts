/**
 * WooCommerce-compatible mock data layer.
 * Replace these with actual WooCommerce REST API calls or
 * WordPress wp_localize_script data when integrating into WP theme/plugin.
 */

export type UserRole = 'administrator' | 'editor' | 'shop_manager' | 'customer';

export interface WooCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  display_name: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  date_created: string;
  billing: WooAddress;
  shipping: WooAddress;
  store_credit: number;
  reward_points: number;
}

export interface WooAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export type OrderStatus = 'processing' | 'completed' | 'cancelled' | 'failed' | 'pending' | 'refunded' | 'on-hold';

export interface WooOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  sku: string;
}

export interface WooOrder {
  id: number;
  number: string;
  status: OrderStatus;
  date_created: string;
  date_completed: string | null;
  total: string;
  subtotal: string;
  shipping_total: string;
  tax_total: string;
  discount_total: string;
  payment_method_title: string;
  line_items: WooOrderItem[];
  billing: WooAddress;
  shipping: WooAddress;
  customer_note: string;
  tracking_number?: string;
  timeline: { date: string; status: string; note: string }[];
  customer_id?: number;
  customer_name?: string;
}

export interface WooDownload {
  id: string;
  name: string;
  file: string;
  downloads_remaining: string;
  access_expires: string | null;
  product_id: number;
  product_name: string;
  download_url: string;
  file_size: string;
}

export interface WooProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  image: string;
  rating: number;
  category: string;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number;
  sku?: string;
  status?: 'publish' | 'draft' | 'pending';
  total_sales?: number;
  date_created?: string;
}

/** Role-based permissions */
export const rolePermissions: Record<UserRole, string[]> = {
  administrator: ['manage_store', 'manage_orders', 'manage_products', 'manage_customers', 'view_analytics', 'manage_settings', 'manage_users'],
  editor: ['manage_orders', 'manage_products', 'view_analytics'],
  shop_manager: ['manage_orders', 'manage_products', 'manage_customers', 'view_analytics'],
  customer: ['view_orders', 'view_downloads', 'manage_addresses', 'manage_account', 'view_wishlist'],
};

// ─── Mock Users ────────────────────────────────────────────
const baseAddress: WooAddress = {
  first_name: "Sarah", last_name: "Mitchell", company: "Mitchell Design Co.",
  address_1: "742 Evergreen Terrace", address_2: "Suite 200",
  city: "Portland", state: "OR", postcode: "97201", country: "US", phone: "+1 (555) 234-5678",
};

export const mockCustomer: WooCustomer = {
  id: 1, first_name: "Sarah", last_name: "Mitchell", email: "sarah.mitchell@example.com",
  display_name: "Sarah Mitchell", phone: "+1 (555) 234-5678", avatar_url: "", role: "customer",
  date_created: "2024-03-15T10:30:00", store_credit: 45.50, reward_points: 1250,
  billing: baseAddress, shipping: { ...baseAddress, company: "", address_2: "" },
};

export const mockAdmin: WooCustomer = {
  id: 100, first_name: "James", last_name: "Carter", email: "james@mystore.com",
  display_name: "James Carter", phone: "+1 (555) 100-0001", avatar_url: "", role: "administrator",
  date_created: "2023-01-01T00:00:00", store_credit: 0, reward_points: 0,
  billing: { ...baseAddress, first_name: "James", last_name: "Carter", company: "MyStore Inc." },
  shipping: { ...baseAddress, first_name: "James", last_name: "Carter", company: "" },
};

export const mockEditor: WooCustomer = {
  id: 101, first_name: "Emily", last_name: "Chen", email: "emily@mystore.com",
  display_name: "Emily Chen", phone: "+1 (555) 100-0002", avatar_url: "", role: "editor",
  date_created: "2024-06-01T00:00:00", store_credit: 0, reward_points: 0,
  billing: { ...baseAddress, first_name: "Emily", last_name: "Chen" },
  shipping: { ...baseAddress, first_name: "Emily", last_name: "Chen" },
};

export const mockShopManager: WooCustomer = {
  id: 102, first_name: "David", last_name: "Park", email: "david@mystore.com",
  display_name: "David Park", phone: "+1 (555) 100-0003", avatar_url: "", role: "shop_manager",
  date_created: "2024-02-01T00:00:00", store_credit: 0, reward_points: 0,
  billing: { ...baseAddress, first_name: "David", last_name: "Park" },
  shipping: { ...baseAddress, first_name: "David", last_name: "Park" },
};

// ─── Product Images ────────────────────────────────────────
const productImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop",
];

// ─── Admin Store Products ──────────────────────────────────
export const mockStoreProducts: WooProduct[] = [
  { id: 1, name: "Premium Wireless Headphones", price: "129.99", regular_price: "149.99", sale_price: "129.99", image: productImages[1], rating: 4.7, category: "Electronics", stock_status: "instock", stock_quantity: 45, sku: "WH-1000", status: "publish", total_sales: 312, date_created: "2025-06-15" },
  { id: 2, name: "USB-C Charging Cable", price: "19.99", regular_price: "19.99", sale_price: "", image: productImages[2], rating: 4.3, category: "Accessories", stock_status: "instock", stock_quantity: 230, sku: "CC-200", status: "publish", total_sales: 1024, date_created: "2025-03-10" },
  { id: 3, name: "Smart Watch Pro", price: "299.00", regular_price: "349.00", sale_price: "299.00", image: productImages[0], rating: 4.8, category: "Electronics", stock_status: "instock", stock_quantity: 18, sku: "SW-PRO", status: "publish", total_sales: 189, date_created: "2025-09-01" },
  { id: 4, name: "Watch Band - Leather", price: "29.99", regular_price: "29.99", sale_price: "", image: productImages[3], rating: 4.1, category: "Accessories", stock_status: "outofstock", stock_quantity: 0, sku: "WB-L01", status: "publish", total_sales: 87, date_created: "2025-07-20" },
  { id: 5, name: "Portable Bluetooth Speaker", price: "69.99", regular_price: "79.99", sale_price: "69.99", image: productImages[4], rating: 4.5, category: "Electronics", stock_status: "instock", stock_quantity: 63, sku: "PBS-300", status: "publish", total_sales: 256, date_created: "2025-05-12" },
  { id: 6, name: "Running Shoes Elite", price: "89.99", regular_price: "119.99", sale_price: "89.99", image: productImages[5], rating: 4.6, category: "Footwear", stock_status: "onbackorder", stock_quantity: 0, sku: "RS-EL1", status: "publish", total_sales: 445, date_created: "2025-01-08" },
  { id: 7, name: "Mechanical Keyboard RGB", price: "189.00", regular_price: "189.00", sale_price: "", image: productImages[0], rating: 4.9, category: "Electronics", stock_status: "instock", stock_quantity: 32, sku: "MK-RGB", status: "publish", total_sales: 178, date_created: "2025-11-03" },
  { id: 8, name: "Ergonomic Mouse", price: "79.00", regular_price: "79.00", sale_price: "", image: productImages[3], rating: 4.4, category: "Electronics", stock_status: "instock", stock_quantity: 54, sku: "EM-01", status: "draft", total_sales: 92, date_created: "2026-01-15" },
  { id: 9, name: "Desk Mat XL", price: "39.99", regular_price: "39.99", sale_price: "", image: productImages[4], rating: 4.2, category: "Accessories", stock_status: "instock", stock_quantity: 120, sku: "DM-XL", status: "publish", total_sales: 334, date_created: "2025-08-22" },
  { id: 10, name: "Noise Cancelling Earbuds", price: "89.50", regular_price: "109.00", sale_price: "89.50", image: productImages[1], rating: 4.6, category: "Electronics", stock_status: "instock", stock_quantity: 78, sku: "NCE-100", status: "pending", total_sales: 156, date_created: "2026-02-10" },
];

// ─── Customer Orders (existing) ────────────────────────────
export const mockOrders: WooOrder[] = [
  {
    id: 1042, number: "#1042", status: "completed", date_created: "2026-03-28T14:30:00", date_completed: "2026-04-01T10:00:00",
    total: "189.99", subtotal: "169.99", shipping_total: "12.00", tax_total: "8.00", discount_total: "0.00",
    payment_method_title: "Credit Card (Visa ****4242)", customer_note: "", tracking_number: "1Z999AA10123456784",
    billing: mockCustomer.billing, shipping: mockCustomer.shipping, customer_id: 1, customer_name: "Sarah Mitchell",
    line_items: [
      { id: 1, name: "Premium Wireless Headphones", quantity: 1, price: 129.99, image: productImages[1], sku: "WH-1000" },
      { id: 2, name: "USB-C Charging Cable", quantity: 2, price: 19.99, image: productImages[2], sku: "CC-200" },
    ],
    timeline: [
      { date: "2026-04-01T10:00:00", status: "Delivered", note: "Package delivered to front door" },
      { date: "2026-03-30T08:00:00", status: "Out for Delivery", note: "Package is out for delivery" },
      { date: "2026-03-29T15:00:00", status: "In Transit", note: "Package arrived at local facility" },
      { date: "2026-03-28T16:00:00", status: "Shipped", note: "Package picked up by carrier" },
      { date: "2026-03-28T14:30:00", status: "Order Placed", note: "Order confirmed and payment received" },
    ],
  },
  {
    id: 1041, number: "#1041", status: "processing", date_created: "2026-04-05T09:15:00", date_completed: null,
    total: "349.00", subtotal: "329.00", shipping_total: "15.00", tax_total: "5.00", discount_total: "0.00",
    payment_method_title: "PayPal", customer_note: "Please gift wrap if possible",
    billing: mockCustomer.billing, shipping: mockCustomer.shipping, customer_id: 1, customer_name: "Sarah Mitchell",
    line_items: [
      { id: 3, name: "Smart Watch Pro", quantity: 1, price: 299.00, image: productImages[0], sku: "SW-PRO" },
      { id: 4, name: "Watch Band - Leather", quantity: 1, price: 29.99, image: productImages[3], sku: "WB-L01" },
    ],
    timeline: [
      { date: "2026-04-05T11:00:00", status: "Processing", note: "Order is being prepared" },
      { date: "2026-04-05T09:15:00", status: "Order Placed", note: "Order confirmed" },
    ],
  },
  {
    id: 1040, number: "#1040", status: "on-hold", date_created: "2026-04-03T18:45:00", date_completed: null,
    total: "79.99", subtotal: "69.99", shipping_total: "5.00", tax_total: "5.00", discount_total: "0.00",
    payment_method_title: "Bank Transfer", customer_note: "",
    billing: mockCustomer.billing, shipping: mockCustomer.shipping, customer_id: 2, customer_name: "Alex Johnson",
    line_items: [{ id: 5, name: "Portable Bluetooth Speaker", quantity: 1, price: 69.99, image: productImages[4], sku: "PBS-300" }],
    timeline: [{ date: "2026-04-03T18:45:00", status: "On Hold", note: "Awaiting bank transfer confirmation" }],
  },
  {
    id: 1039, number: "#1039", status: "cancelled", date_created: "2026-03-20T11:00:00", date_completed: null,
    total: "59.99", subtotal: "49.99", shipping_total: "5.00", tax_total: "5.00", discount_total: "0.00",
    payment_method_title: "Credit Card", customer_note: "",
    billing: mockCustomer.billing, shipping: mockCustomer.shipping, customer_id: 3, customer_name: "Maria Garcia",
    line_items: [{ id: 6, name: "Running Shoes Elite", quantity: 1, price: 49.99, image: productImages[5], sku: "RS-EL1" }],
    timeline: [
      { date: "2026-03-21T09:00:00", status: "Cancelled", note: "Order cancelled by customer" },
      { date: "2026-03-20T11:00:00", status: "Order Placed", note: "Order confirmed" },
    ],
  },
  {
    id: 1038, number: "#1038", status: "refunded", date_created: "2026-03-10T14:00:00", date_completed: "2026-03-12T10:00:00",
    total: "124.50", subtotal: "114.50", shipping_total: "5.00", tax_total: "5.00", discount_total: "0.00",
    payment_method_title: "Credit Card (Visa ****4242)", customer_note: "",
    billing: mockCustomer.billing, shipping: mockCustomer.shipping, customer_id: 1, customer_name: "Sarah Mitchell",
    line_items: [
      { id: 7, name: "Noise Cancelling Earbuds", quantity: 1, price: 89.50, image: productImages[1], sku: "NCE-100" },
      { id: 8, name: "Earbuds Carry Case", quantity: 1, price: 24.99, image: productImages[2], sku: "ECC-01" },
    ],
    timeline: [
      { date: "2026-03-15T12:00:00", status: "Refunded", note: "Full refund processed" },
      { date: "2026-03-14T09:00:00", status: "Return Received", note: "Return received at warehouse" },
      { date: "2026-03-12T10:00:00", status: "Delivered", note: "Package delivered" },
      { date: "2026-03-10T14:00:00", status: "Order Placed", note: "Order confirmed" },
    ],
  },
  {
    id: 1037, number: "#1037", status: "pending", date_created: "2026-04-07T08:00:00", date_completed: null,
    total: "449.00", subtotal: "430.00", shipping_total: "10.00", tax_total: "9.00", discount_total: "0.00",
    payment_method_title: "Credit Card", customer_note: "",
    billing: mockCustomer.billing, shipping: mockCustomer.shipping, customer_id: 4, customer_name: "Tom Wilson",
    line_items: [
      { id: 9, name: "Mechanical Keyboard RGB", quantity: 1, price: 189.00, image: productImages[0], sku: "MK-RGB" },
      { id: 10, name: "Ergonomic Mouse", quantity: 1, price: 79.00, image: productImages[3], sku: "EM-01" },
      { id: 11, name: "Desk Mat XL", quantity: 1, price: 39.99, image: productImages[4], sku: "DM-XL" },
    ],
    timeline: [{ date: "2026-04-07T08:00:00", status: "Pending", note: "Awaiting payment confirmation" }],
  },
  // Extra admin-visible orders from other customers
  {
    id: 1036, number: "#1036", status: "completed", date_created: "2026-04-06T12:00:00", date_completed: "2026-04-07T16:00:00",
    total: "259.98", subtotal: "239.98", shipping_total: "12.00", tax_total: "8.00", discount_total: "0.00",
    payment_method_title: "Credit Card", customer_note: "",
    billing: { ...baseAddress, first_name: "Lisa", last_name: "Wong" }, shipping: { ...baseAddress, first_name: "Lisa", last_name: "Wong" },
    customer_id: 5, customer_name: "Lisa Wong",
    line_items: [
      { id: 12, name: "Smart Watch Pro", quantity: 1, price: 299.00, image: productImages[0], sku: "SW-PRO" },
    ],
    timeline: [
      { date: "2026-04-07T16:00:00", status: "Completed", note: "Delivered" },
      { date: "2026-04-06T12:00:00", status: "Order Placed", note: "Order confirmed" },
    ],
  },
  {
    id: 1035, number: "#1035", status: "processing", date_created: "2026-04-07T10:30:00", date_completed: null,
    total: "159.98", subtotal: "149.98", shipping_total: "5.00", tax_total: "5.00", discount_total: "0.00",
    payment_method_title: "PayPal", customer_note: "",
    billing: { ...baseAddress, first_name: "John", last_name: "Smith" }, shipping: { ...baseAddress, first_name: "John", last_name: "Smith" },
    customer_id: 6, customer_name: "John Smith",
    line_items: [
      { id: 13, name: "Portable Bluetooth Speaker", quantity: 2, price: 69.99, image: productImages[4], sku: "PBS-300" },
    ],
    timeline: [
      { date: "2026-04-07T11:00:00", status: "Processing", note: "Order being prepared" },
      { date: "2026-04-07T10:30:00", status: "Order Placed", note: "Order confirmed" },
    ],
  },
];

// ─── Admin Analytics Data ──────────────────────────────────
export const mockRevenueData = [
  { month: "Oct", revenue: 18200, orders: 142 },
  { month: "Nov", revenue: 24800, orders: 198 },
  { month: "Dec", revenue: 31200, orders: 267 },
  { month: "Jan", revenue: 22100, orders: 178 },
  { month: "Feb", revenue: 26500, orders: 212 },
  { month: "Mar", revenue: 29800, orders: 238 },
  { month: "Apr", revenue: 8400, orders: 68 },
];

export const mockCategoryData = [
  { name: "Electronics", value: 45, revenue: 67800 },
  { name: "Accessories", value: 28, revenue: 34200 },
  { name: "Footwear", value: 15, revenue: 18900 },
  { name: "Home Office", value: 12, revenue: 15100 },
];

export const mockTopCustomers = [
  { id: 1, name: "Sarah Mitchell", email: "sarah@example.com", orders: 12, total_spent: "2,847.50", last_order: "2026-04-05" },
  { id: 5, name: "Lisa Wong", email: "lisa@example.com", orders: 8, total_spent: "1,920.00", last_order: "2026-04-06" },
  { id: 6, name: "John Smith", email: "john@example.com", orders: 15, total_spent: "3,120.75", last_order: "2026-04-07" },
  { id: 2, name: "Alex Johnson", email: "alex@example.com", orders: 6, total_spent: "890.00", last_order: "2026-04-03" },
  { id: 3, name: "Maria Garcia", email: "maria@example.com", orders: 4, total_spent: "560.25", last_order: "2026-03-20" },
];

// ─── Customer-specific data ────────────────────────────────
export const mockDownloads: WooDownload[] = [
  { id: "dl-1", name: "Product Manual - Smart Watch Pro", file: "smart-watch-pro-manual.pdf", downloads_remaining: "Unlimited", access_expires: null, product_id: 3, product_name: "Smart Watch Pro", download_url: "#", file_size: "4.2 MB" },
  { id: "dl-2", name: "Warranty Certificate", file: "warranty-cert-1042.pdf", downloads_remaining: "3", access_expires: "2027-03-28", product_id: 1, product_name: "Premium Wireless Headphones", download_url: "#", file_size: "1.1 MB" },
];

export const mockWishlist: WooProduct[] = [
  { id: 101, name: "Minimalist Desk Lamp", price: "79.99", regular_price: "99.99", sale_price: "79.99", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=300&h=300&fit=crop", rating: 4.5, category: "Home Office" },
  { id: 102, name: "Wireless Charging Pad", price: "34.99", regular_price: "34.99", sale_price: "", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop", rating: 4.2, category: "Accessories" },
  { id: 103, name: "Premium Notebook Set", price: "24.99", regular_price: "29.99", sale_price: "24.99", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=300&fit=crop", rating: 4.8, category: "Stationery" },
  { id: 104, name: "Eco Travel Mug", price: "28.00", regular_price: "28.00", sale_price: "", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop", rating: 4.6, category: "Lifestyle" },
];

export const mockRecommended: WooProduct[] = [
  { id: 201, name: "Laptop Stand Pro", price: "59.99", regular_price: "69.99", sale_price: "59.99", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop", rating: 4.7, category: "Home Office" },
  { id: 202, name: "USB Hub 7-Port", price: "39.99", regular_price: "39.99", sale_price: "", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop", rating: 4.3, category: "Accessories" },
  { id: 203, name: "Webcam HD 1080p", price: "89.00", regular_price: "109.00", sale_price: "89.00", image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=300&h=300&fit=crop", rating: 4.5, category: "Electronics" },
  { id: 204, name: "Cable Management Kit", price: "19.99", regular_price: "19.99", sale_price: "", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop", rating: 4.1, category: "Accessories" },
];

export const mockRecentlyViewed: WooProduct[] = [
  { id: 301, name: "Ergonomic Chair Pro", price: "399.00", regular_price: "499.00", sale_price: "399.00", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&h=300&fit=crop", rating: 4.9, category: "Furniture" },
  { id: 302, name: "Monitor Light Bar", price: "45.99", regular_price: "45.99", sale_price: "", image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=300&h=300&fit=crop", rating: 4.4, category: "Lighting" },
  { id: 303, name: "Desk Organizer Set", price: "32.00", regular_price: "32.00", sale_price: "", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=300&fit=crop", rating: 4.2, category: "Organization" },
];

export const mockFAQs = [
  { question: "How do I track my order?", answer: "You can track your order from the Orders page. Click on any order to see the full tracking timeline and tracking number." },
  { question: "What is your return policy?", answer: "We offer a 30-day return policy for most items. Items must be in original condition and packaging." },
  { question: "How do I change my shipping address?", answer: "Go to the Addresses page from the sidebar and click Edit on your shipping address." },
  { question: "How do I apply a coupon code?", answer: "Coupon codes can be applied at checkout. Enter your code in the discount field and click Apply." },
  { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page, or go to Account Details and change your password from there." },
  { question: "Do you offer international shipping?", answer: "Yes! We ship to most countries worldwide. Shipping rates vary by destination." },
];
