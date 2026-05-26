export type VillaStatus = "available" | "reserved" | "coming-soon"

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
}
