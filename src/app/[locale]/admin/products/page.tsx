import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminProductsClient } from "./page-client"

export default async function AdminProductsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)

  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return <AdminProductsClient products={products as any} />
}
