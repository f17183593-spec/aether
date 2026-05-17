import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getDictionary, isRTL } from "@/lib/i18n"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { VendorProductsClient } from "./products-client"
import type { Locale } from "@/types"

export default async function VendorProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  const dict = getDictionary(locale as Locale)

  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{dict.vendor.products}</h1>
        <div className="flex items-center gap-2">
          <VendorProductsClient products={products.map((p) => ({
            id: p.id, name: p.name, slug: p.slug,
            category: p.category?.name || "",
            price: p.price, stock: p.stock,
            inStock: p.inStock, sku: p.sku,
          }))} />
          <Link href={`/${locale}/vendor/products/new`}>
            <Button size="sm"><Plus className="w-4 h-4" /> {dict.vendor.addProduct}</Button>
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Product</th>
                <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                <th className="text-left p-4 text-gray-400 font-medium">Stock</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{product.name}</p>
                  </td>
                  <td className="p-4 text-gray-400">{product.category?.name || "-"}</td>
                  <td className="p-4">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <Badge variant={product.stock <= product.lowStockThreshold ? "warning" : "success"}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={product.inStock ? "success" : "danger"}>
                      {product.inStock ? "Active" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
