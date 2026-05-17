import { NextResponse } from "next/server"
import { processStripeWebhook } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.json()
  const signature = req.headers.get("stripe-signature") || ""

  const result = processStripeWebhook(body, signature)

  return NextResponse.json(result)
}
