# ÆTHERIS — Project Map

## TECH_STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.6 |
| **Language** | TypeScript | ^5 |
| **Styling** | Tailwind CSS v4 + PostCSS | ^4 |
| **Database** | SQLite (dev) / PostgreSQL (prod) via Prisma | ^7.8.0 |
| **Auth** | NextAuth.js v5 | ^5.0.0-beta.31 |
| **State** | Zustand (persist middleware) | ^5.0.13 |
| **Forms** | React Hook Form + Zod | ^7.76 / ^4.4 |
| **Animation** | Framer Motion | ^12.38 |
| **Charts** | Recharts | ^3.8.1 |
| **Icons** | Lucide React | ^1.16 |
| **Payments** | Stripe, PayPal, Fawry (mocked) | stripe@^22 |
| **Email** | Resend API / Nodemailer | — |
| **i18n** | Custom (next-intl-ready middleware) | — |

## SYSTEM_FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Navbar  │ │ Bento    │ │ Product  │ │ Admin Dashboard│  │
│  │ Footer  │ │ Grid     │ │ Pages    │ │ (role-gated)   │  │
│  │ Cart    │ │ Landing  │ │ Filters  │ │ Recharts       │  │
│  │ Slideover│ │ Page     │ │ Detail   │ │ CRUD Tables    │  │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └───────┬────────┘  │
│       │           │            │               │           │
│  ┌────┴───────────┴────────────┴───────────────┴────────┐  │
│  │              zustand stores (cart, currency)          │  │
│  │              SessionProvider (NextAuth)               │  │
│  │              Framer Motion (AnimatePresence)          │  │
│  └────────────────────────┬─────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│              NEXT.JS APP ROUTER                            │
│  ┌────────────────────────┴─────────────────────────────┐  │
│  │              MIDDLEWARE (i18n redirect)               │  │
│  │  en/ar locale detection + rewrite                    │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                │
│  ┌────────────────────────┴─────────────────────────────┐  │
│  │              SERVER COMPONENTS (RSC)                 │  │
│  │  Layouts │ Pages │ generateMetadata │ sitemap.ts     │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                │
│  ┌────────────────────────┴─────────────────────────────┐  │
│  │              API ROUTES                               │  │
│  │  ┌──────────┐ ┌───────┐ ┌─────────┐ ┌────────────┐  │  │
│  │  │ /api/auth │ │ /api  │ │ /api    │ │ /api/admin │  │  │
│  │  │ NextAuth │ │products│ │ /checkout│ │ /users     │  │  │
│  │  │ register │ │ /cart  │ │ payments│ │ CRUD       │  │  │
│  │  └────┬─────┘ └───┬───┘ └────┬────┘ └──────┬─────┘  │  │
│  └────────┼───────────┼─────────┼──────────────┼────────┘  │
└───────────┼───────────┼─────────┼──────────────┼────────────┘
            │           │         │              │
┌───────────┴───────────┴─────────┴──────────────┴────────────┐
│                    SERVICE LAYER                             │
│  ┌────────┐ ┌─────────┐ ┌───────┐ ┌────────┐ ┌──────────┐  │
│  │  auth  │ │ currency│ │ tax   │ │shipping│ │  coupon  │  │
│  │ (bcrypt)│ │ convert  │ │ calc  │ │ rates  │ │validate  │  │
│  └────────┘ └─────────┘ └───────┘ └────────┘ └──────────┘  │
│  ┌────────┐ ┌─────────┐ ┌───────┐ ┌────────┐ ┌──────────┐  │
│  │ stripe │ │ paypal  │ │ fawry │ │ email  │ │analytics │  │
│  │ (mock) │ │ (mock)  │ │ (mock)│ │Resend  │ │ queries  │  │
│  └────────┘ └─────────┘ └───────┘ └────────┘ └──────────┘  │
└─────────────────────────┬──────────────────────────────────┘
                          │
┌─────────────────────────┴──────────────────────────────────┐
│                    DATA LAYER (Prisma ORM)                   │
│  Models: User, Account, Session, VerificationToken          │
│          Category, Product, Review, Cart, CartItem          │
│          Order, OrderItem, Shipment, Address                │
│          Coupon, WishlistItem, Loyalty, LoyaltyTransaction  │
│          AnalyticsEvent, PageView                           │
│  DB: SQLite (dev) → PostgreSQL (prod)                       │
└─────────────────────────────────────────────────────────────┘
```

## FOLDER STRUCTURE

```
aetheris/
├── prisma/
│   ├── schema.prisma          # 15 models + indexes
│   └── seed.ts                # Demo data (admin, products, coupons)
├── public/
│   └── locales/
│       ├── en.json            # English translations (106 keys)
│       └── ar.json            # Arabic translations (106 keys)
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 + glassmorphism tokens
│   │   ├── layout.tsx         # Root layout (HTML shell)
│   │   ├── page.tsx           # Root page (i18n redirect target)
│   │   ├── sitemap.ts         # Auto-generated XML sitemap
│   │   ├── [locale]/
│   │   │   ├── layout.tsx     # Locale-aware layout (Nav, Footer, Cart, WhatsApp)
│   │   │   ├── page.tsx       # Home page (Bento + Featured + Newsletter)
│   │   │   ├── account/       # User account + loyalty wallet
│   │   │   │   └── loyalty/   # Wallet dashboard (points, tier, redeem, history)
│   │   │   ├── admin/         # Admin dashboard (charts, CRUD tables)
│   │   │   ├── auth/          # Login + Register
│   │   │   ├── checkout/      # Multi-step checkout
│   │   │   ├── vendor/        # Vendor dashboard (stats, charts, products, orders)
│   │   │   │   ├── dashboard-client.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── products-client.tsx
│   │   │   │   └── orders/
│   │   │   │       ├── page.tsx
│   │   │   │       └── orders-client.tsx
│   │   │   └── products/      # Listing + [slug] detail pages
│   │   └── api/
│   │       ├── auth/          # NextAuth route handler + register
│   │       ├── admin/users/   # Admin user listing
│   │       ├── cart/          # Cart CRUD
│   │       ├── checkout/      # Order creation + email + loyalty
│   │       ├── loyalty/
│   │       │   └── redeem/    # Points-to-coupon redemption
│   │       ├── notifications/ # Role-scoped notification feed
│   │       ├── payments/      # Stripe intent + webhook
│   │       └── products/      # Product listing with filters
│   ├── components/
│   │   ├── admin/             # Dashboard client (AreaChart, PieChart, CategoryBar)
│   │   ├── bento/             # BentoGrid (hero, features, testimonials)
│   │   ├── cart/              # CartSlideover (animated drawer)
│   │   ├── layout/            # Navbar, Footer, Providers, NotificationBell
│   │   ├── product/           # ProductCard, ProductFilters
│   │   ├── shared/            # Newsletter, WhatsAppWidget, CsvExportButton
│   │   └── ui/                # Button, Badge, Input, Card, Skeleton, Toaster
│   ├── hooks/                 # useDebounce, useLocale, useCurrency (zustand)
│   ├── lib/                   # auth, prisma, stripe, paypal, fawry, tax,
│   │                          # shipping, coupon, currency, email, analytics,
│   │                          # loyalty, notifications, csv-export, utils, i18n
│   ├── store/                 # cart-store (zustand + persist)
│   ├── types/                 # Locale, Currency, CartItem, UserRole, etc.
│   └── middleware.ts          # i18n locale auto-detection
├── next.config.ts             # Security headers, image domains
├── tailwind.config.ts         # (v4 uses CSS config in globals.css)
└── .env.example               # All env vars documented
```

## DESIGN SYSTEM

| Token | Value | Usage |
|-------|-------|-------|
| `glass` | `bg-white/3 + backdrop-blur-20` | Navbar, cards, modals |
| `glass-card` | `gradient + blur-40 + border-white/6` | Main cards |
| `gradient-text` | `from-aether-500 to-pink-500` | Headings, prices |
| `--color-surface` | `#0a0a0f` | Page background |
| `--color-aether-500` | `#a855f7` | Primary purple accent |

## COMPLETED FEATURES

### Loyalty & Digital Wallet System
- **Point allocation**: `awardPoints()` service automatically calculates points (10 pts per $1) on successful checkout — called from `POST /api/checkout`
- **Tier system**: BRONZE (0), SILVER (1k), GOLD (5k), PLATINUM (10k) with tier upgrade on point accrual
- **Transaction history**: `LoyaltyTransaction` records for every earn/redeem event with descriptions and timestamps
- **Loyalty Wallet page** (`/account/loyalty`): Glassmorphic dashboard showing point balance, tier badge, conversion rate, redemption form, and scrollable transaction history
- **Points-to-coupon redemption**: `POST /api/loyalty/redeem` endpoint validates points, creates a Coupon record (FIXED discount, single-use), deducts points, and records a REDEEMED transaction
- **Wallet link**: Account page now links to `/account/loyalty` with point preview

### Live Notification Hub
- **NotificationBell component**: Client-side bell icon in navbar with unread count badge; fetches from `GET /api/notifications`
- **Notification types**: `new_order`, `low_stock`, `order_shipped` — dynamically generated from DB queries for ADMIN/VENDOR roles
- **Glassmorphic dropdown**: Animated dropdown with per-type icons (Package, AlertTriangle, Truck), message preview, date, and click-through links to relevant management pages
- **Notifications API**: `GET /api/notifications` returns role-scoped notifications (pending orders for both, low stock for admin, recent shipped orders)

### Transactional Emails
- **Improved order confirmation template**: Full-width dark theme with gradient ÆTHERIS header, itemized table, subtotal/shipping/tax/discount breakdown, total, and personalized greeting
- **Resend integration**: Production-ready via `RESEND_API_KEY` env var with graceful fallback to silent success in dev
- **Dedicated `sendEmail()` service**: Clean payload interface with Resend API call, mock-mode passthrough

### Advanced Analytics & Reporting Hub
- **Dashboard enhancement**: Stat cards now include Conversion Rate percentage and Category count alongside revenue/orders/users/products
- **Revenue trend chart**: AreaChart with gradient fill for both Admin (purple) and Vendor (emerald) dashboards
- **Orders by status pie chart**: Donut chart with consistent color coding across both dashboards
- **Category performance bar chart**: Admin dashboard shows bar chart of product count per category with average price overlay
- **Conversion rate**: Calculated as `totalOrders / totalPageViews * 100` from `PageView` table
- **Vendor analytics**: Dedicated `getVendorStats()` with revenue trend + orders-by-status charts; vendor dashboard renders `VendorDashboardClient` with AreaChart and PieChart
- **CSV Export**: Zero-dependency `exportToCSV()` utility generates downloadable CSV from any dataset
- **CsvExportButton component**: Reusable button wrapping export logic; integrated into admin dashboard (metric snapshot), vendor products (name/SKU/category/price/stock/status), and vendor orders (order#/customer/total/status/payment/date)
- **Products/Orders client wrappers**: `VendorProductsClient` and `VendorOrdersClient` receive typed data from server component for CSV export integration

### Home Page (Luxury Front-Page)
- **Hero Section**: Full Bento Grid layout with glassmorphic cards, gradient overlays, blur orbs, and staggered Framer Motion animations
- **i18n (en/ar)**: All hero text, section headings (categories, featured, newsletter), CTA buttons, and feature cards use locale dictionary
- **Categories Grid**: 6-category glass card grid with hover effects and locale-aware links
- **Featured Products**: 8-product feed using `ProductCard` with explicit prop mapping to `ProductCardProps` — no Prisma relation spreads
- **Newsletter**: Animated signup section with gradient glass card background
- **Currency Sync**: Navbar currency selector (USD/EUR/GBP/EGP/AED/SAR) persists via Zustand, echoed across all price displays

### Vendor Dashboard
- **Full scaffold**: Role-gated layout for VENDOR + ADMIN; overview with stat cards, revenue trend chart, orders by status pie chart, recent orders, low stock alerts, quick links
- **Products page**: Full table with CSV export, search, edit/duplicate/delete actions, add product button
- **Orders page**: Fulfillment table with CSV export, customer info, status badges, ship action
- **Vendor analytics**: `getVendorStats()` service for vendor-specific metrics with Revenue AreaChart and Orders PieChart via `VendorDashboardClient`
- **Navbar vendor link**: VENDOR-role users see vendor link and are directed to `/vendor` dashboard
- **i18n**: Full vendor section in both en.json and ar.json (11 keys)

### Checkout & Cart
- **Multi-step checkout**: Shipping → Payment → Review with animated step transitions
- **Real order submission**: `placeOrder` calls `POST /api/checkout` with full payload (address, payment method, coupon, shipping method) — creates order in DB, sends email, awards loyalty points
- **Order summary**: Subtotal, shipping, tax, discount, and total with currency conversion
- **Cart Slideover**: Animated right-drawer with +/- quantity controls, item removal, subtotal display, and checkout link
- **Empty state**: Graceful empty cart message with continue shopping CTA
- **Rate limiting**: Checkout API protected by IP-based rate limiter (10 req/min)

### Admin Dashboard
- **Role-gated**: All admin pages check `session.user.role === "ADMIN"` and redirect unauthorized users
- **Stat cards**: Total Revenue, Orders, Users, Products with gradient icon backgrounds
- **Revenue chart**: AreaChart with gradient fill showing last 30 days of revenue
- **Orders by status pie chart**: Donut chart with color-coded segments
- **Low stock alerts**: Products with stock ≤ 5 flagged with warning badges
- **Quick links**: Grid of navigation cards to Products, Orders, Users, Analytics pages
- **CRUD tables**: Products (with stock/status badges), Orders (with customer details/payment status), Users (with role badges)

### Core Infrastructure
- **Full TypeScript strict mode** — `tsc --noEmit` passes with zero errors
- **Prisma v7 generation**: Fixed stale `.prisma/client` resolution; created `@prisma/client/default.d.ts` bridge
- **Layout**: RTL/LTR direction switching via `isRTL()`; locale-aware font families (Inter / Noto Kufi Arabic)
- **Navbar**: Glassmorphic fixed navbar with search, currency, language toggle, notification bell, cart badge, auth status
- **Cart Slideover**: Animated drawer with quantity controls, price conversion, and checkout link
- **Footer**: 4-column grid with shop/support/connect links and copyright
- **WhatsApp Widget**: Floating action button for customer support
- **Middleware**: i18n auto-detection with locale rewrite

### Production Readiness
- **next.config.ts**: `reactStrictMode: true`, `poweredByHeader: false`, `compress: true`, `generateEtags: true`
- **Image optimization**: `deviceSizes` (640–1536), `imageSizes` (16–384), `minimumCacheTTL: 86400`, remote patterns configured
- **Security headers**: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin, X-XSS-Protection
- **Layout architecture**: Root layout provides HTML shell with `suppressHydrationWarning`; locale layout overrides `<html lang={locale} dir={dir}>` for proper i18n SEO
- **Viewport/theme-color**: `width=device-width, initial-scale=1`, theme color `#0a0a0f`
- **Font rendering**: Google Fonts with `display=swap` to prevent FOIT; `preconnect` hints in root layout head
- **Prisma singleton**: Global cached client prevents connection leaks during hot reloads; fresh client per request in production
- **Hydration safety**: All client components (`NotificationBell`, `CsvExportButton`, wallet rows) use `useEffect`/`useState` for dynamic data — zero SSR/CSR mismatches

## VERSION 1.0 — FEATURE COMPLETENESS
All planned engines are implemented and passing `tsc --noEmit` at zero errors:
- ✅ Luxury Storefront (Bento Grid, Products, i18n, Multi-currency)
- ✅ Auth & Accounts (NextAuth v5, Roles, Session)
- ✅ Cart & Checkout (Zustand, Multi-step, Order creation)
- ✅ Loyalty & Wallet (Points, Tiers, Coupon redemption, History)
- ✅ Notifications & Emails (Bell, Role-scoped feed, Resend templates)
- ✅ Analytics & CSV Export (Revenue trends, Conversion rate, Category perf, Download)
- ✅ Admin Dashboard (Stats, Charts, CRUD, Low stock alerts)
- ✅ Vendor Dashboard (Stats, Charts, Products, Orders, CSV)
- ✅ Production Configuration (Security, Images, Compression, Layout)

## KNOWN ISSUES (Fixed)

- **register/page.tsx**: Removed server-only imports (`bcryptjs`, `prisma`) from `"use client"` component — these crashed in the browser
- **Root layout**: Replaced boilerplate Next.js metadata with ÆTHERIS branding
- **Admin redirects**: Changed hardcoded `"/en/auth/login"` to use locale parameter
- **ProductCard**: Removed empty `id: ""` from `CartItemType.addItem()` call
- **API rate limiting**: Added `RateLimiter` utility to all API routes
- **Prisma client type resolution**: Deleted stale `.prisma/client` in `C:\Users\Fady\node_modules\` preventing TS from finding 18 model delegates
- **DatasourceUrl (Prisma v7)**: Removed `datasourceUrl` from `PrismaClientOptions` — Prisma v7 uses `DATABASE_URL` env var instead
- **Product card prop spreading**: Fixed `page.tsx`, `products/page.tsx`, and `products/[slug]/page.tsx` to explicitly map to `ProductCardProps` (home page, listing, related products) — no Prisma relation spreads
- **Framer Motion Easing type**: Cast `ease` arrays as `Easing` to satisfy strict type checks
- **Github icon**: Replaced `lucide-react` `Github` with inline SVG (icon removed in latest lucide)
- **Pie chart label**: Fixed `PieLabelRenderProps` typing mismatch in dashboard chart
- **Analytics query**: Replaced `groupBy` on `DateTime createdAt` with `findMany` to avoid Prisma type constraint issues
- **Checkout flow**: Connected client `placeOrder` to `POST /api/checkout` with proper loading state, error handling, and cart cleanup — removed stale client-side `validateCoupon` call (was server-only)
- **Checkout form data**: Explicitly typed `formData` state instead of inferred `any`
- **Product detail `as any` cast**: Removed `as any` on server component; properly typed `ProductPageData.related` as explicit `ProductCardProps`-compatible array
