import { prisma } from "@/lib/prisma"

export default async function sitemap() {
  const baseUrl = "https://aetheris.com"

  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    take: 100,
  })

  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const staticPages = ["", "/products", "/cart", "/checkout", "/auth/login", "/auth/register"]

  const enPages = staticPages.map((page) => ({
    url: `${baseUrl}/en${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1 : 0.8,
  }))

  const arPages = staticPages.map((page) => ({
    url: `${baseUrl}/ar${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1 : 0.8,
  }))

  const productPages = products.flatMap((p) => [
    { url: `${baseUrl}/en/products/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/ar/products/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 },
  ])

  const categoryPages = categories.flatMap((c) => [
    { url: `${baseUrl}/en/products?category=${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/ar/products?category=${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
  ])

  return [...enPages, ...arPages, ...productPages, ...categoryPages]
}
