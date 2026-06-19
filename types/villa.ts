export type VillaStatus = "available" | "reserved" | "coming-soon" | "sold"

export type Villa = {
  id: string
  name: string
  description: string
  image: string
  surface: string
  bedrooms: number
  bathrooms: number
  outdoor: string
  pool: boolean
  status: VillaStatus
  highlights: string[]
  featured?: boolean  // shown in VillasOverviewSection editorial cards
  priceLabel?: string // e.g. "Da €850.000" — show when ready
}
