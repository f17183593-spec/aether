import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CouponsClient } from "./page-client"

export default async function AdminCouponsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })
  return <CouponsClient coupons={coupons as any} />
}
