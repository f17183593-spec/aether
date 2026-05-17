const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit = 30, windowMs = 60000) {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}

export function rateLimitIP(req: Request, limit = 30, windowMs = 60000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "anonymous"
  return rateLimit(`ip:${ip}`, limit, windowMs)
}
