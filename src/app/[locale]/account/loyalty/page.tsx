import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getLoyaltyWithTransactions } from "@/lib/loyalty"
import { LoyaltyClient } from "./page-client"

export default async function LoyaltyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/auth/login`)

  const loyalty = await getLoyaltyWithTransactions(session.user.id)

  return (
    <LoyaltyClient
      points={loyalty?.points ?? 0}
      tier={loyalty?.tier ?? "BRONZE"}
      transactions={loyalty?.transactions ?? []}
      locale={locale}
    />
  )
}
