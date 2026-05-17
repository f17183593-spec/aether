import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const search = searchParams.get("search")
  const sort = searchParams.get("sort")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")

  const where: any = { inStock: true }

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } })
    if (cat) where.categoryId = cat.id
  }
  if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
  if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  const orderBy: any = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    rating: { rating: "desc" },
    name: { name: "asc" },
    newest: { createdAt: "desc" },
  }[sort || "newest"] || { createdAt: "desc" }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products: products.map((p) => ({ ...p, images: JSON.parse(p.images) })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
