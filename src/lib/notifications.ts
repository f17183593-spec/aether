import { prisma } from "./prisma"

export type NotificationType = "new_order" | "low_stock" | "order_shipped" | "welcome"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

export async function getNotificationsForUser(userId: string, role: string): Promise<AppNotification[]> {
  const notifications: AppNotification[] = []

  if (role === "ADMIN" || role === "VENDOR") {
    const pendingOrders = await prisma.order.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
    })
    for (const order of pendingOrders) {
      notifications.push({
        id: `order-${order.id}`,
        type: "new_order",
        title: "New Order",
        message: `Order #${order.orderNumber} is pending`,
        link: `/${role === "ADMIN" ? "admin" : "vendor"}/orders`,
        read: false,
        createdAt: order.createdAt,
      })
    }

    if (role === "ADMIN") {
      const lowStock = await prisma.product.findMany({
        where: { inStock: true, stock: { lte: 5 } },
        orderBy: { stock: "asc" },
        take: 5,
      })
      for (const product of lowStock) {
        notifications.push({
          id: `stock-${product.id}`,
          type: "low_stock",
          title: "Low Stock",
          message: `${product.name} has only ${product.stock} left`,
          link: "/admin/products",
          read: false,
          createdAt: new Date(),
        })
      }
    }

    const shippedOrders = await prisma.order.findMany({
      where: { status: "SHIPPED", updatedAt: { gte: new Date(Date.now() - 86400000) } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    })
    for (const order of shippedOrders) {
      notifications.push({
        id: `shipped-${order.id}`,
        type: "order_shipped",
        title: "Order Shipped",
        message: `Order #${order.orderNumber} was shipped`,
        link: `/${role === "ADMIN" ? "admin" : "vendor"}/orders`,
        read: false,
        createdAt: order.updatedAt,
      })
    }
  }

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
