export async function createOrder(amount: number, currency: string) {
  return {
    id: `PAYPAL_MOCK_${Date.now()}`,
    status: "CREATED",
    amount,
    currency,
  }
}

export async function captureOrder(orderId: string) {
  return { id: orderId, status: "COMPLETED" }
}

export async function refundOrder(captureId: string) {
  return { id: captureId, status: "COMPLETED" }
}
