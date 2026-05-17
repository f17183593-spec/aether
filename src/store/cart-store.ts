import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItemType } from "@/types"

interface CartStore {
  items: CartItemType[]
  isOpen: boolean
  addItem: (item: CartItemType) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

const MAX_CART_ITEMS = 99
const MAX_QUANTITY_PER_ITEM = 99

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock, MAX_QUANTITY_PER_ITEM) }
                : i
            ),
          })
        } else {
          const currentTotal = get().getItemCount()
          if (currentTotal + item.quantity > MAX_CART_ITEMS) return
          set({ items: [...get().items, { ...item, quantity: Math.min(item.quantity, item.stock, MAX_QUANTITY_PER_ITEM) }] })
        }
        set({ isOpen: true })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock, MAX_QUANTITY_PER_ITEM) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    { name: "aetheris-cart" }
  )
)
