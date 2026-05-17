const taxRates: Record<string, number> = {
  US: 0.08,
  GB: 0.2,
  DE: 0.19,
  FR: 0.2,
  EG: 0.14,
  AE: 0.05,
  SA: 0.15,
}

export function calculateTax(subtotal: number, countryCode: string): number {
  const rate = taxRates[countryCode] ?? 0
  return Math.round(subtotal * rate * 100) / 100
}

export function getTaxRate(countryCode: string): number {
  return taxRates[countryCode] ?? 0
}

export function getTaxLabel(countryCode: string): string {
  const rate = getTaxRate(countryCode)
  if (rate === 0) return "No Tax"
  return `VAT (${(rate * 100).toFixed(0)}%)`
}
