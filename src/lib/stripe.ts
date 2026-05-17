export async function createPaymentIntent(amount: number, currency: string) {
  return {
    id: `pi_mock_${Date.now()}`,
    amount,
    currency,
    status: "requires_payment_method",
    clientSecret: `pi_mock_secret_${Date.now()}`,
  }
}

export async function confirmPayment(paymentIntentId: string) {
  return { id: paymentIntentId, status: "succeeded" }
}

export async function refundPayment(paymentIntentId: string) {
  return { id: paymentIntentId, status: "succeeded" }
}

export function processStripeWebhook(body: any, signature: string) {
  const event = body
  switch (event.type) {
    case "payment_intent.succeeded":
      return { received: true, status: "succeeded" }
    case "payment_intent.payment_failed":
      return { received: true, status: "failed" }
    default:
      return { received: true, status: "unknown" }
  }
}
