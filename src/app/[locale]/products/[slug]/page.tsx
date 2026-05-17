import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDetailClient } from "./page-client"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return { title: "Product Not Found — ÆTHERIS" }
  return {
    title: `${product.name} — ÆTHERIS`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: [{ url: product.images ? JSON.parse(product.images)[0] : "" }],
    },
  }
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })
  if (!product) return null

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, inStock: true },
    take: 4,
    include: { category: { select: { name: true } } },
  })

  return {
    ...product,
    images: JSON.parse(product.images),
    attributes: JSON.parse(product.attributes),
    related: related.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      price: r.price,
      compareAtPrice: r.compareAtPrice,
      images: JSON.parse(r.images),
      rating: r.rating,
      reviewCount: r.reviewCount,
      inStock: r.inStock,
      stock: r.stock,
      category: r.category.name,
    })),
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
