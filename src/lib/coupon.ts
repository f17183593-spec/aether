import { prisma } from "./prisma"

export async function validateCoupon(code: string, orderAmount: number): Promise<{ valid: boolean; discount?: number; error?: string }> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
  if (!coupon) return { valid: false, error: "Invalid coupon code" }
  if (!coupon.isActive) return { valid: false, error: "Coupon is inactive" }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) return { valid: false, error: "Coupon has expired" }
  if (coupon.startsAt && new Date() < coupon.startsAt) return { valid: false, error: "Coupon is not yet active" }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { valid: false, error: "Coupon usage limit reached" }
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) return { valid: false, error: `Minimum order amount is $${coupon.minOrderAmount}` }

  let discount = 0
  if (coupon.discountType === "PERCENTAGE") {
    discount = (orderAmount * coupon.discountValue) / 100
  } else {
    discount = coupon.discountValue
  }

  return { valid: true, discount: Math.min(discount, orderAmount) }
}
