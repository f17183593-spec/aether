import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getNotificationsForUser } from "@/lib/notifications"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ notifications: [] })
    }
    const notifications = await getNotificationsForUser(session.user.id, session.user.role || "CUSTOMER")
    return NextResponse.json({ notifications })
  } catch {
    return NextResponse.json({ notifications: [] })
  }
}
