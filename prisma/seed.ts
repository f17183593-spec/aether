import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@aetheris.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@aetheris.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Demo customer
  const customerPassword = await hash("customer123", 12)
  const customer = await prisma.user.upsert({
    where: { email: "customer@aetheris.com" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "customer@aetheris.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  })

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "electronics" }, update: {}, create: { name: "Electronics", slug: "electronics", description: "Cutting-edge gadgets and devices" } }),
    prisma.category.upsert({ where: { slug: "fashion" }, update: {}, create: { name: "Fashion", slug: "fashion", description: "Premium apparel and accessories" } }),
    prisma.category.upsert({ where: { slug: "home-living" }, update: {}, create: { name: "Home & Living", slug: "home-living", description: "Luxury home goods and decor" } }),
    prisma.category.upsert({ where: { slug: "beauty" }, update: {}, create: { name: "Beauty", slug: "beauty", description: "Premium skincare and cosmetics" } }),
    prisma.category.upsert({ where: { slug: "accessories" }, update: {}, create: { name: "Accessories", slug: "accessories", description: "Fine accessories and jewelry" } }),
    prisma.category.upsert({ where: { slug: "wellness" }, update: {}, create: { name: "Wellness", slug: "wellness", description: "Health and wellness products" } }),
  ])

  // Products
  const productData = [
    { name: "Aether Pulse", slug: "aether-pulse", price: 299, compareAtPrice: 399, sku: "ATH-001", stock: 45, category: "electronics", featured: true, description: "Next-generation smart wellness device with real-time biometric monitoring, AI-powered insights, and seamless connectivity. Track your health metrics with surgical precision.", attributes: { Color: "Obsidian Black", Battery: "14 days", Water: "IP68", Material: "Titanium Grade 5" } },
    { name: "Nebula Series", slug: "nebula-series", price: 189, compareAtPrice: 249, sku: "ATH-002", stock: 30, category: "beauty", featured: true, description: "A captivating signature fragrance that blends rare oud, amber, and bergamot. Created exclusively for ÆTHERIS by master perfumers in Grasse, France.", attributes: { Volume: "100ml", Notes: "Oud, Amber, Bergamot", Type: "Eau de Parfum", Longevity: "8-10 hours" } },
    { name: "Quantum Knit", slug: "quantum-knit", price: 459, sku: "ATH-003", stock: 20, category: "fashion", featured: true, description: "Hand-knitted from the finest Mongolian cashmere with thermo-regulating technology. Each piece requires 72 hours of artisan craftsmanship.", attributes: { Material: "Mongolian Cashmere", Fit: "Regular", Care: "Dry Clean Only", Origin: "Italy" } },
    { name: "Lunar Timepiece", slug: "lunar-timepiece", price: 1299, compareAtPrice: 1599, sku: "ATH-004", stock: 10, category: "accessories", featured: true, description: "A masterpiece of horology with a celestial-inspired dial, Swiss automatic movement, and a meteorite face. Limited edition of 500 pieces.", attributes: { Movement: "Swiss Automatic", Case: "Stainless Steel 316L", Crystal: "Sapphire", Water: "100m" } },
    { name: "Crystal Sound", slug: "crystal-sound", price: 349, compareAtPrice: 449, sku: "ATH-005", stock: 25, category: "electronics", featured: false, description: "Hi-res wireless earbuds with adaptive noise cancellation, spatial audio, and 40 hours of battery life. Engineered by audio specialists from Bowers & Wilkins.", attributes: { Driver: "11mm Beryllium", Battery: "40 hours", Codec: "LDAC, aptX HD", ANC: "Adaptive" } },
    { name: "Velvet Noir", slug: "velvet-noir", price: 129, sku: "ATH-006", stock: 60, category: "beauty", featured: false, description: "Ultra-rich moisturizing cream with diamond dust and 24k gold particles. Developed by Nobel Prize-nominated dermatologists.", attributes: { Volume: "50ml", Key: "Diamond Dust, 24k Gold", Skin: "All Types", SPF: "30" } },
    { name: "Artisan Desk", slug: "artisan-desk", price: 899, compareAtPrice: 1199, sku: "ATH-007", stock: 8, category: "home-living", featured: true, description: "Handcrafted walnut desk with integrated wireless charging, cable management system, and motorized height adjustment.", attributes: { Material: "Walnut", Finish: "Matte Lacquer", Size: "160x80cm", Height: "72-120cm" } },
    { name: "Pulse Ring", slug: "pulse-ring", price: 199, sku: "ATH-008", stock: 35, category: "accessories", featured: false, description: "Smart ring with continuous health monitoring, sleep tracking, and stress detection. Crafted from ceramic with a sapphire crystal face.", attributes: { Material: "Ceramic", Battery: "7 days", Sensors: "HR, SpO2, Temp", Water: "50m" } },
    { name: "Aether Globe", slug: "aether-globe", price: 249, sku: "ATH-009", stock: 15, category: "home-living", featured: false, description: "Illuminated smart globe with real-time Earth visualization, weather patterns, and ambient lighting. A stunning centerpiece for any modern home.", attributes: { Diameter: "30cm", Lighting: "LED RGB", Connectivity: "WiFi, Bluetooth", Material: "Hand-blown Glass" } },
    { name: "Zen Mat", slug: "zen-mat", price: 89, sku: "ATH-010", stock: 100, category: "wellness", featured: false, description: "Premium yoga mat with alignment guides, antimicrobial surface, and eco-friendly natural rubber. Used by Olympic athletes.", attributes: { Material: "Natural Rubber", Thickness: "6mm", Size: "183x68cm", Eco: "Biodegradable" } },
  ]

  for (const data of productData) {
    const cat = categories.find((c) => c.slug === data.category)
    if (!cat) continue
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        sku: data.sku,
        stock: data.stock,
        featured: data.featured,
        description: data.description,
        images: "[]",
        attributes: JSON.stringify(data.attributes || {}),
        rating: Math.floor(Math.random() * 2) + 4,
        reviewCount: Math.floor(Math.random() * 50) + 10,
        categoryId: cat.id,
        lowStockThreshold: 5,
      },
    })
  }

  // Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME20" },
    update: {},
    create: { code: "WELCOME20", description: "20% off for new customers", discountType: "PERCENTAGE", discountValue: 20, minOrderAmount: 50, maxUses: 100, isActive: true },
  })
  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: { code: "FREESHIP", description: "Free shipping on orders over $100", discountType: "FIXED", discountValue: 10, minOrderAmount: 100, maxUses: 200, isActive: true },
  })
  await prisma.coupon.upsert({
    where: { code: "VIP50" },
    update: {},
    create: { code: "VIP50", description: "$50 off for VIP members", discountType: "FIXED", discountValue: 50, minOrderAmount: 200, maxUses: 50, isActive: true },
  })

  // Loyalty for customer
  await prisma.loyalty.upsert({
    where: { userId: customer.id },
    update: { points: 250, tier: "SILVER" },
    create: { userId: customer.id, points: 250, tier: "SILVER" },
  })

  console.log("✅ ÆTHERIS database seeded!")
  console.log("   Admin: admin@aetheris.com / admin123")
  console.log("   Customer: customer@aetheris.com / customer123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
