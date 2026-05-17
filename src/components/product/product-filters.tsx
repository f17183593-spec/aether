"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name" },
]

const ratingOptions = [4, 3, 2, 1]

export function ProductFilters({ categories }: { categories?: { id: string; name: string; slug: string }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [showFilters, setShowFilters] = useState(false)
  const debouncedSearch = useDebounce(search, 400)

  const currentCategory = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || ""
  const currentMinPrice = searchParams.get("minPrice") || ""
  const currentMaxPrice = searchParams.get("maxPrice") || ""
  const currentRating = searchParams.get("rating") || ""

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) params.set("search", debouncedSearch)
    else params.delete("search")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }, [debouncedSearch])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("?")
    setSearch("")
  }

  const hasActiveFilters = currentCategory || currentSort || currentMinPrice || currentMaxPrice || currentRating || search

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aether-500 transition-all"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="glass rounded-2xl p-5 space-y-5">
          {categories && categories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam("category", "")}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-xl transition-all",
                    !currentCategory ? "bg-aether-500/20 text-aether-300" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam("category", cat.slug)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-xl transition-all",
                      currentCategory === cat.slug ? "bg-aether-500/20 text-aether-300" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Price Range</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentMinPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aether-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={currentMaxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aether-500"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Minimum Rating</p>
            <div className="flex gap-2">
              {ratingOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => updateParam("rating", currentRating === String(r) ? "" : String(r))}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-xl transition-all",
                    currentRating === String(r) ? "bg-aether-500/20 text-aether-300" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  )}
                >
                  {r}+ ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Sort By</p>
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-aether-500"
            >
              <option value="">Default</option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
              <X className="w-3 h-3" /> Clear all filters
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
