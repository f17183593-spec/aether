interface ShippingRate {
  name: string
  cost: number
  estimatedDays: string
}

const zoneRates: Record<string, ShippingRate[]> = {
  US: [
    { name: "Standard", cost: 5.99, estimatedDays: "5-8" },
    { name: "Express", cost: 14.99, estimatedDays: "2-3" },
    { name: "Next Day", cost: 24.99, estimatedDays: "1" },
  ],
  GB: [
    { name: "Standard", cost: 4.99, estimatedDays: "3-5" },
    { name: "Express", cost: 12.99, estimatedDays: "1-2" },
  ],
  DEFAULT: [
    { name: "Standard", cost: 9.99, estimatedDays: "7-14" },
    { name: "Express", cost: 24.99, estimatedDays: "3-5" },
  ],
}

export function getShippingRates(countryCode: string): ShippingRate[] {
  return zoneRates[countryCode] ?? zoneRates.DEFAULT
}

export function calculateShipping(
  countryCode: string,
  methodName: string = "Standard"
): ShippingRate {
  const rates = getShippingRates(countryCode)
  return rates.find((r) => r.name === methodName) ?? rates[0]
}
