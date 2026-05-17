"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Currency } from "@/types"
import { detectCurrencyFromLocale } from "@/lib/currency"

interface CurrencyStore {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "aetheris-currency" }
  )
)
