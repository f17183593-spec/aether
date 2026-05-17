"use client"
import { CsvExportButton } from "@/components/shared/CsvExportButton"

export function VendorOrdersClient({ orders }: {
  orders: { orderNumber: string; customerName: string; customerEmail: string; total: number; status: string; paymentStatus: string; createdAt: string }[]
}) {
  return (
    <CsvExportButton
      filename="vendor-orders"
      headers={["Order #", "Customer", "Email", "Total", "Status", "Payment", "Date"]}
      rows={orders.map((o) => [
        o.orderNumber,
        o.customerName,
        o.customerEmail,
        String(o.total),
        o.status,
        o.paymentStatus,
        o.createdAt.split("T")[0],
      ])}
    />
  )
}
