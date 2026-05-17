export type Locale = "en" | "ar"

export type Currency = "USD" | "EUR" | "GBP" | "EGP" | "AED" | "SAR"

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

export type PaymentMethod = "STRIPE" | "PAYPAL" | "FAWRY"

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN"

export type DiscountType = "PERCENTAGE" | "FIXED"

export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "name"
  search?: string
  page?: number
  limit?: number
}

export interface CartItemType {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  stock: number
}

export interface CheckoutFormData {
  email: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  billingSameAsShipping: boolean
  paymentMethod: PaymentMethod
  notes?: string
  couponCode?: string
}

export interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  rate: number
}

export interface LocaleDict {
  nav: {
    home: string
    products: string
    cart: string
    login: string
    register: string
    account: string
    admin: string
    vendor: string
    logout: string
    search: string
  }
  home: {
    hero: { title: string; subtitle: string; cta: string }
    featured: string
    categories: string
    newArrivals: string
    testimonials: string
    newsletter: string
  }
  product: {
    addToCart: string
    outOfStock: string
    reviews: string
    description: string
    attributes: string
    relatedProducts: string
  }
  cart: {
    title: string
    empty: string
    subtotal: string
    checkout: string
    continueShopping: string
  }
  checkout: {
    title: string
    shipping: string
    payment: string
    review: string
    placeOrder: string
    coupon: string
  }
  auth: {
    login: string
    register: string
    email: string
    password: string
    name: string
    forgotPassword: string
    noAccount: string
    hasAccount: string
  }
  admin: {
    dashboard: string
    products: string
    orders: string
    users: string
    coupons: string
    analytics: string
    lowStock: string
  }
  vendor: {
    dashboard: string
    products: string
    orders: string
    earnings: string
    addProduct: string
    editProduct: string
    fulfillOrder: string
    totalSales: string
    activeListings: string
    pendingOrders: string
    revenue: string
  }
  wallet: {
    title: string
    points: string
    tier: string
    pointsHistory: string
    redeemTitle: string
    redeemLabel: string
    redeemButton: string
    pointsToCoupon: string
    noTransactions: string
    couponCreated: string
    conversionRate: string
  }
  notifications: {
    title: string
    noNotifications: string
    newOrder: string
    lowStock: string
    orderShipped: string
    welcome: string
  }
  common: {
    loading: string
    error: string
    success: string
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    search: string
    filter: string
    clear: string
    noResults: string
    viewAll: string
    export: string
  }
}
