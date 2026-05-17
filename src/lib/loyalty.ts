import { prisma } from "./prisma"

const POINTS_PER_DOLLAR = 10
const REDEEM_RATE = 100
const TIER_THRESHOLDS = [
  { tier: "PLATINUM", minPoints: 10000 },
  { tier: "GOLD", minPoints: 5000 },
  { tier: "SILVER", minPoints: 1000 },
  { tier: "BRONZE", minPoints: 0 },
]

export async function getTier(points: number): Promise<string> {
  const threshold = TIER_THRESHOLDS.find((t) => points >= t.minPoints)
  return threshold?.tier ?? "BRONZE"
}

export async function awardPoints(userId: string, amount: number, orderId?: string) {
  const earned = Math.floor(amount / POINTS_PER_DOLLAR)
  if (earned <= 0) return

  const loyalty = await prisma.loyalty.upsert({
    where: { userId },
    update: { points: { increment: earned } },
    create: { userId, points: earned, tier: "BRONZE" },
  })

  const newTier = await getTier(loyalty.points)
  if (newTier !== loyalty.tier) {
    await prisma.loyalty.update({ where: { userId }, data: { tier: newTier } })
  }

  await prisma.loyaltyTransaction.create({
    data: {
      points: earned,
      type: "EARNED",
      description: `Points earned from order #${orderId || "N/A"}`,
      orderId,
      loyaltyId: loyalty.id,
    },
  })
}

export async function redeemPointsForCoupon(userId: string, pointsToRedeem: number): Promise<{ success: boolean; coupon?: { code: string; discountValue: number }; error?: string }> {
  if (pointsToRedeem < REDEEM_RATE) {
    return { success: false, error: `Minimum redemption is ${REDEEM_RATE} points` }
  }

  const loyalty = await prisma.loyalty.findUnique({ where: { userId } })
  if (!loyalty || loyalty.points < pointsToRedeem) {
    return { success: false, error: "Insufficient points" }
  }

  const discountValue = Math.floor(pointsToRedeem / REDEEM_RATE)
  const code = `LOYALTY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  const coupon = await prisma.coupon.create({
    data: {
      code,
      description: `Redeemed from loyalty points (${pointsToRedeem} pts)`,
      discountType: "FIXED",
      discountValue,
      isActive: true,
      maxUses: 1,
    },
  })

  await prisma.loyalty.update({
    where: { userId },
    data: { points: { decrement: pointsToRedeem } },
  })

  await prisma.loyaltyTransaction.create({
    data: {
      points: -pointsToRedeem,
      type: "REDEEMED",
      description: `Redeemed ${pointsToRedeem} points for coupon ${code} ($${discountValue} off)`,
      loyaltyId: loyalty.id,
    },
  })

  return { success: true, coupon: { code: coupon.code, discountValue } }
}

export async function getLoyaltyWithTransactions(userId: string) {
  const loyalty = await prisma.loyalty.findUnique({
    where: { userId },
    include: {
      transactions: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  })
  if (!loyalty) return null
  return {
    ...loyalty,
    tier: await getTier(loyalty.points),
  }
}
