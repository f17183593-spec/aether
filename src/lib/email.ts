interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "mock") {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ÆTHERIS <orders@aetheris.com>",
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      })
      return res.ok
    } catch {
      return false
    }
  }
  return true
}

export function orderConfirmationEmail(order: {
  orderNumber: string
  total: number
  items: { name: string; quantity: number; price: number }[]
  customerName?: string
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
}): string {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:12px 8px;border-bottom:1px solid #2a2a3a;">${item.name}</td><td style="padding:12px 8px;border-bottom:1px solid #2a2a3a;text-align:center;">x${item.quantity}</td><td style="padding:12px 8px;border-bottom:1px solid #2a2a3a;text-align:right;">$${item.price.toFixed(2)}</td></tr>`
    )
    .join("")
  const subtotal = order.subtotal ?? order.items.reduce((s, i) => s + i.price * i.quantity, 0)
  return `
    <div style="background:#0a0a0f;color:#e4e4e7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;margin:0;background:linear-gradient(135deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ÆTHERIS</h1>
      </div>
      <div style="background:#1a1a26;border-radius:16px;padding:32px;border:1px solid #2a2a3a;">
        <h2 style="color:#fff;margin:0 0 4px;font-size:20px;">Order Confirmed</h2>
        ${order.customerName ? `<p style="color:#a1a1aa;margin:0 0 16px;font-size:14px;">Hi ${order.customerName},</p>` : ""}
        <p style="color:#a1a1aa;font-size:14px;">Your order <strong style="color:#fff;">#${order.orderNumber}</strong> has been confirmed and is being processed.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px;">${itemsHtml}</table>
        <div style="border-top:1px solid #2a2a3a;margin-top:12px;padding-top:12px;font-size:14px;">
          ${order.discount ? `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#a1a1aa;">Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>` : ""}
          ${order.shipping ? `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#a1a1aa;">Shipping</span><span>$${order.shipping.toFixed(2)}</span></div>` : ""}
          ${order.tax ? `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#a1a1aa;">Tax</span><span>$${order.tax.toFixed(2)}</span></div>` : ""}
          ${order.discount ? `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#a1a1aa;">Discount</span><span style="color:#10b981;">-$${order.discount.toFixed(2)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:1px solid #2a2a3a;margin-top:4px;font-size:16px;color:#fff;font-weight:700;">
            <span>Total</span><span>$${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:24px;font-size:12px;color:#52525b;">
        <p>ÆTHERIS — Where Luxury Meets the Future</p>
      </div>
    </div>
  `
}

export function shippingUpdateEmail(orderNumber: string, status: string): string {
  return `
    <div style="background:#0a0a0f;color:#fff;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
      <h1 style="font-size:24px;background:linear-gradient(135deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ÆTHERIS</h1>
      <h2 style="color:#fff;margin-top:20px;">Order Update</h2>
      <p style="color:#a1a1aa;">Order #${orderNumber} is now: <strong>${status}</strong></p>
    </div>
  `
}
