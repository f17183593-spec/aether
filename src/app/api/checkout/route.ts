import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateTax } from "@/lib/tax"
import { calculateShipping } from "@/lib/shipping"
import { validateCoupon } from "@/lib/coupon"
import { generateOrderNumber } from "@/lib/utils"
import { sendEmail, orderConfirmationEmail } from "@/lib/email"
import { awardPoints } from "@/lib/loyalty"
import { rateLimitIP } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const { allowed } = rateLimitIP(req, 10, 60000)
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 })

  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { shippingAddress, paymentMethod, couponCode, shippingMethod } = body

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shipping = calculateShipping(shippingAddress?.country || "US", shippingMethod)
    const tax = calculateTax(subtotal, shippingAddress?.country || "US")

    let discount = 0
    if (couponCode) {
      const result = await validateCoupon(couponCode, subtotal)
      if (result.valid && result.discount) discount = result.discount
    }

    const total = subtotal + shipping.cost + tax - discount
    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        subtotal,
        shippingCost: shipping.cost,
        tax,
        discount,
        total,
        paymentStatus: "PENDING",
        status: "PENDING",
        paymentMethod,
        shippingAddress: JSON.stringify(shippingAddress),
        couponCode: couponCode || null,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    })

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Order Confirmed - #${orderNumber}`,
        html: orderConfirmationEmail({
          orderNumber,
          total,
          subtotal,
          shipping: shipping.cost,
          tax,
          discount,
          customerName: user.name || undefined,
          items: cart.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
        }),
      })
    }

    await awardPoints(session.user.id, total, order.id)

    return NextResponse.json({ orderId: order.id, orderNumber }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
