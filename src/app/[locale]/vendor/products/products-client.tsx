"use client"
import { CsvExportButton } from "@/components/shared/CsvExportButton"

export function VendorProductsClient({ products }: {
  products: { id: string; name: string; slug: string; category: string; price: number; stock: number; inStock: boolean; sku: string }[]
}) {
  return (
    <CsvExportButton
      filename="vendor-products"
      headers={["Name", "SKU", "Category", "Price", "Stock", "Status"]}
      rows={products.map((p) => [
        p.name,
        p.sku,
        p.category,
        String(p.price),
        String(p.stock),
        p.inStock ? "Active" : "Hidden",
      ])}
    />
  )
}
