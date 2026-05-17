import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { redeemPointsForCoupon } from "@/lib/loyalty"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const points = Number(body.points)

    if (!Number.isInteger(points) || points < 100) {
      return NextResponse.json({ success: false, error: "Minimum 100 points required" }, { status: 400 })
    }

    const result = await redeemPointsForCoupon(session.user.id, points)
    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch {
    return NextResponse.json({ success: false, error: "Redemption failed" }, { status: 500 })
  }
}
