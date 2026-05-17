"use client"
import { ProductFilters } from "@/components/product/product-filters"

export function ProductsPageClient({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[]
}) {
  return <ProductFilters categories={categories} />
}
