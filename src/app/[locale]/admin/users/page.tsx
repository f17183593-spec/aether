import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminUsersClient } from "./page-client"

export default async function AdminUsersPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return <AdminUsersClient users={users as any} />
}
