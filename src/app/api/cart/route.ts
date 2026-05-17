import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimitIP } from "@/lib/rate-limit"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ items: [] })

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json(cart?.items || [])
}

export async function POST(req: Request) {
  const { allowed } = rateLimitIP(req, 60, 60000)
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId, quantity } = await req.json()

  let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } })
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    })
  }

  return NextResponse.json({ success: true })
}
