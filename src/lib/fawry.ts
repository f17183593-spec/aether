export async function initiatePayment(
  amount: number,
  orderNumber: string,
  customerEmail: string
) {
  const mockRefNumber = `FAWRY_${Date.now()}`
  return {
    referenceNumber: mockRefNumber,
    paymentUrl: `/api/payments/fawry/redirect?ref=${mockRefNumber}`,
    amount,
    status: "PENDING",
  }
}

export async function checkPaymentStatus(referenceNumber: string) {
  return {
    referenceNumber,
    status: "PAID",
    amount: 0,
  }
}
