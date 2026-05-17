import { prisma } from "./prisma"

export async function trackEvent(
  event: string,
  properties: Record<string, any> = {},
  options?: { sessionId?: string; userId?: string; ip?: string; userAgent?: string; page?: string }
) {
  await prisma.analyticsEvent.create({
    data: {
      event,
      properties: JSON.stringify(properties),
      ...options,
    },
  })
}

export async function trackPageView(
  path: string,
  options?: { title?: string; referrer?: string; sessionId?: string; userId?: string }
) {
  await prisma.pageView.create({
    data: { path, ...options },
  })
}

export async function getDashboardStats() {
  const [totalUsers, totalOrders, totalRevenue, totalProducts] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.product.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  })

  const revenueByDay = paidOrders.reverse().map((o) => ({
    date: o.createdAt.toISOString().split("T")[0],
    revenue: o.total,
  }))

  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  })

  const lowStockProducts = await prisma.product.findMany({
    where: { inStock: true, stock: { lte: 5 } },
    select: { id: true, name: true, slug: true, stock: true, lowStockThreshold: true },
    orderBy: { stock: "asc" },
    take: 10,
  })

  const totalPageViews = await prisma.pageView.count()
  const conversionRate = totalPageViews > 0 ? (totalOrders / totalPageViews) * 100 : 0

  const categoryPerformance = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { products: true } },
      products: {
        select: { price: true },
        where: { inStock: true },
      },
    },
  })

  const categories = categoryPerformance.map((cat) => ({
    name: cat.name,
    productCount: cat._count.products,
    avgPrice: cat.products.length > 0
      ? cat.products.reduce((s, p) => s + p.price, 0) / cat.products.length
      : 0,
  }))

  return {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalProducts,
    recentOrders,
    revenueByDay,
    ordersByStatus: ordersByStatus.map((r) => ({ status: r.status, count: r._count })),
    lowStockProducts,
    conversionRate,
    categories,
  }
}

export async function getVendorStats() {
  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()
  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  })
  const pendingCount = await prisma.order.count({ where: { status: "PENDING" } })

  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  })

  const revenueByDay = paidOrders.reverse().map((o) => ({
    date: o.createdAt.toISOString().split("T")[0],
    revenue: o.total,
  }))

  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  })

  const categories = await prisma.category.findMany({
    select: {
      name: true,
      _count: { select: { products: true } },
    },
  })

  return {
    totalProducts,
    totalOrders,
    totalRevenue: revenue._sum.total ?? 0,
    pendingCount,
    revenueByDay,
    ordersByStatus: ordersByStatus.map((r) => ({ status: r.status, count: r._count })),
    categories: categories.map((c) => ({ name: c.name, count: c._count.products })),
  }
}
