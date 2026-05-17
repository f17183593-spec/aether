import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product/product-card"
import { ProductsPageClient } from "./page-client"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
    sort?: string
    search?: string
    page?: string
  }>
}

async function getProducts(searchParams: Awaited<ProductsPageProps["searchParams"]>) {
  const where: any = { inStock: true }

  if (searchParams.category) {
    const cat = await prisma.category.findUnique({ where: { slug: searchParams.category } })
    if (cat) where.categoryId = cat.id
  }
  if (searchParams.minPrice) where.price = { ...where.price, gte: parseFloat(searchParams.minPrice) }
  if (searchParams.maxPrice) where.price = { ...where.price, lte: parseFloat(searchParams.maxPrice) }
  if (searchParams.rating) where.rating = { gte: parseInt(searchParams.rating) }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ]
  }

  const orderBy: any = (() => {
    switch (searchParams.sort) {
      case "price_asc": return { price: "asc" as const }
      case "price_desc": return { price: "desc" as const }
      case "rating": return { rating: "desc" as const }
      case "name": return { name: "asc" as const }
      default: return { createdAt: "desc" as const }
    }
  })()

  const page = parseInt(searchParams.page || "1")
  const limit = 12
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: { select: { name: true } } },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products.map((p) => ({
      id: p.id, name: p.name, slug: p.slug, price: p.price, compareAtPrice: p.compareAtPrice,
      images: JSON.parse(p.images), rating: p.rating, reviewCount: p.reviewCount,
      inStock: p.inStock, stock: p.stock, category: p.category.name,
    })),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  }
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } })
}

export async function generateMetadata() {
  return {
    title: "Products — ÆTHERIS",
    description: "Explore our curated collection of premium products.",
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const [data, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">All Products</h1>
        <p className="text-sm text-gray-500">{data.total} products</p>
      </div>
      <ProductsPageClient categories={categories} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.products.map((product, i) => (
          <ProductCard key={product.id} {...product} index={i} />
        ))}
      </div>
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={`?page=${page}`}
              className={`px-4 py-2 text-sm rounded-xl transition-all ${
                page === data.currentPage
                  ? "bg-aether-500/20 text-aether-300"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {page}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
