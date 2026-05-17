import { NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/stripe"
import { rateLimitIP } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const { allowed } = rateLimitIP(req, 20, 60000)
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 })

  const { amount, currency } = await req.json()
  const intent = await createPaymentIntent(amount, currency || "usd")
  return NextResponse.json(intent)
}
