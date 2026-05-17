import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminOrdersClient } from "./page-client"

export default async function AdminOrdersPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)

  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return <AdminOrdersClient orders={orders as any} />
}
