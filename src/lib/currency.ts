import type { Currency, CurrencyInfo } from "@/types"

const currencyData: Record<Currency, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  EGP: { code: "EGP", symbol: "E£", name: "Egyptian Pound", rate: 48.5 },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  SAR: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75 },
}

export function getCurrencyInfo(code: Currency): CurrencyInfo {
  return currencyData[code]
}

export function convertPrice(amount: number, from: Currency, to: Currency): number {
  const usdAmount = amount / currencyData[from].rate
  return Math.round(usdAmount * currencyData[to].rate * 100) / 100
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function detectCurrencyFromLocale(locale: string): Currency {
  const map: Record<string, Currency> = {
    en: "USD",
    ar: "EGP",
  }
  return map[locale] ?? "USD"
}

export function getAvailableCurrencies(): CurrencyInfo[] {
  return Object.values(currencyData)
}
