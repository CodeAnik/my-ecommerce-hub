/**
 * WooCommerce-compatible mock data layer.
 * Replace these with actual WooCommerce REST API calls or
 * WordPress wp_localize_script data when integrating into WP theme/plugin.
 */

export interface WooCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  display_name: string;
  phone: string;
  avatar_url: string;
  role: string;
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
}

// Mock customer
export const mockCustomer: WooCustomer = {
  id: 1,
  first_name: "Sarah",
  last_name: "Mitchell",
  email: "sarah.mitchell@example.com",
  display_name: "Sarah Mitchell",
  phone: "+1 (555) 234-5678",
  avatar_url: "",
  role: "customer",
  date_created: "2024-03-15T10:30:00",
  store_credit: 45.50,
  reward_points: 1250,
  billing: {
    first_name: "Sarah",
    last_name: "Mitchell",
    company: "Mitchell Design Co.",
    address_1: "742 Evergreen Terrace",
    address_2: "Suite 200",
    city: "Portland",
    state: "OR",
    postcode: "97201",
    country: "US",
    phone: "+1 (555) 234-5678",
  },
  shipping: {
    first_name: "Sarah",
    last_name: "Mitchell",
    company: "",
    address_1: "742 Evergreen Terrace",
    address_2: "",
    city: "Portland",
    state: "OR",
    postcode: "97201",
    country: "US",
    phone: "+1 (555) 234-5678",
  },
};

const productImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop",
];

export const mockOrders: WooOrder[] = [
  {
    id: 1042,
    number: "#1042",
    status: "completed",
    date_created: "2026-03-28T14:30:00",
    date_completed: "2026-04-01T10:00:00",
    total: "189.99",
    subtotal: "169.99",
    shipping_total: "12.00",
    tax_total: "8.00",
    discount_total: "0.00",
    payment_method_title: "Credit Card (Visa ****4242)",
    customer_note: "",
    tracking_number: "1Z999AA10123456784",
    billing: mockCustomer.billing,
    shipping: mockCustomer.shipping,
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
    id: 1041,
    number: "#1041",
    status: "processing",
    date_created: "2026-04-05T09:15:00",
    date_completed: null,
    total: "349.00",
    subtotal: "329.00",
    shipping_total: "15.00",
    tax_total: "5.00",
    discount_total: "0.00",
    payment_method_title: "PayPal",
    customer_note: "Please gift wrap if possible",
    billing: mockCustomer.billing,
    shipping: mockCustomer.shipping,
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
    id: 1040,
    number: "#1040",
    status: "on-hold",
    date_created: "2026-04-03T18:45:00",
    date_completed: null,
    total: "79.99",
    subtotal: "69.99",
    shipping_total: "5.00",
    tax_total: "5.00",
    discount_total: "0.00",
    payment_method_title: "Bank Transfer",
    customer_note: "",
    billing: mockCustomer.billing,
    shipping: mockCustomer.shipping,
    line_items: [
      { id: 5, name: "Portable Bluetooth Speaker", quantity: 1, price: 69.99, image: productImages[4], sku: "PBS-300" },
    ],
    timeline: [
      { date: "2026-04-03T18:45:00", status: "On Hold", note: "Awaiting bank transfer confirmation" },
    ],
  },
  {
    id: 1039,
    number: "#1039",
    status: "cancelled",
    date_created: "2026-03-20T11:00:00",
    date_completed: null,
    total: "59.99",
    subtotal: "49.99",
    shipping_total: "5.00",
    tax_total: "5.00",
    discount_total: "0.00",
    payment_method_title: "Credit Card",
    customer_note: "",
    billing: mockCustomer.billing,
    shipping: mockCustomer.shipping,
    line_items: [
      { id: 6, name: "Running Shoes Elite", quantity: 1, price: 49.99, image: productImages[5], sku: "RS-EL1" },
    ],
    timeline: [
      { date: "2026-03-21T09:00:00", status: "Cancelled", note: "Order cancelled by customer" },
      { date: "2026-03-20T11:00:00", status: "Order Placed", note: "Order confirmed" },
    ],
  },
  {
    id: 1038,
    number: "#1038",
    status: "refunded",
    date_created: "2026-03-10T14:00:00",
    date_completed: "2026-03-12T10:00:00",
    total: "124.50",
    subtotal: "114.50",
    shipping_total: "5.00",
    tax_total: "5.00",
    discount_total: "0.00",
    payment_method_title: "Credit Card (Visa ****4242)",
    customer_note: "",
    billing: mockCustomer.billing,
    shipping: mockCustomer.shipping,
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
    id: 1037,
    number: "#1037",
    status: "pending",
    date_created: "2026-04-07T08:00:00",
    date_completed: null,
    total: "449.00",
    subtotal: "430.00",
    shipping_total: "10.00",
    tax_total: "9.00",
    discount_total: "0.00",
    payment_method_title: "Credit Card",
    customer_note: "",
    billing: mockCustomer.billing,
    shipping: mockCustomer.shipping,
    line_items: [
      { id: 9, name: "Mechanical Keyboard RGB", quantity: 1, price: 189.00, image: productImages[0], sku: "MK-RGB" },
      { id: 10, name: "Ergonomic Mouse", quantity: 1, price: 79.00, image: productImages[3], sku: "EM-01" },
      { id: 11, name: "Desk Mat XL", quantity: 1, price: 39.99, image: productImages[4], sku: "DM-XL" },
    ],
    timeline: [
      { date: "2026-04-07T08:00:00", status: "Pending", note: "Awaiting payment confirmation" },
    ],
  },
];

export const mockDownloads: WooDownload[] = [
  {
    id: "dl-1",
    name: "Product Manual - Smart Watch Pro",
    file: "smart-watch-pro-manual.pdf",
    downloads_remaining: "Unlimited",
    access_expires: null,
    product_id: 3,
    product_name: "Smart Watch Pro",
    download_url: "#",
    file_size: "4.2 MB",
  },
  {
    id: "dl-2",
    name: "Warranty Certificate",
    file: "warranty-cert-1042.pdf",
    downloads_remaining: "3",
    access_expires: "2027-03-28",
    product_id: 1,
    product_name: "Premium Wireless Headphones",
    download_url: "#",
    file_size: "1.1 MB",
  },
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
