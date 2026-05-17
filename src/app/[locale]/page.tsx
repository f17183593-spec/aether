import { BentoGrid } from "@/components/bento/bento-grid"
import { ProductCard } from "@/components/product/product-card"
import { NewsletterSection } from "@/components/shared/newsletter"
import { prisma } from "@/lib/prisma"
import { getDictionary, isRTL } from "@/lib/i18n"
import type { Locale } from "@/types"

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true, inStock: true },
    take: 8,
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: JSON.parse(p.images),
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    stock: p.stock,
    category: p.category.name,
  }))
}

async function getCategories() {
  return prisma.category.findMany({
    take: 6,
    orderBy: { name: "asc" },
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)
  const rtl = isRTL(locale as Locale)

  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div className="space-y-32 pb-32">
      {/* Bento Grid Hero Section */}
      <section className="pt-8 lg:pt-16">
        <BentoGrid />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">{dict.home.categories}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <a
                key={cat.id}
                href={`/${locale}/products?category=${cat.slug}`}
                className="glass-card rounded-2xl p-6 text-center hover:border-aether-500/30 transition-all group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="text-3xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">✦</div>
                <p className="text-sm font-medium">{cat.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold">{dict.home.featured}</h2>
          <a
            href={`/${locale}/products`}
            className="text-sm text-aether-400 hover:text-aether-300 transition-colors"
          >
            {dict.home.hero.cta} &rarr;
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              {...product}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  )
}
