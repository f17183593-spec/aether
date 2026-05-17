import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AccountClient } from "./page-client"

export default async function AccountPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/auth/login`)

  const [orders, loyalty] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: { include: { product: { select: { name: true, slug: true } } } } },
    }),
    prisma.loyalty.findUnique({ where: { userId: session.user.id } }),
  ])

  return <AccountClient orders={orders as any} loyaltyPoints={loyalty?.points || 0} tier={loyalty?.tier || "BRONZE"} userName={session.user.name || "Account"} />
}
