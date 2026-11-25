import { MasterplanExplorer } from "@/components/masterplan/MasterplanExplorer"
import { villas } from "@/lib/villas"

export function HeroSection() {
  return <MasterplanExplorer plots={villas.map(({ id, name }) => ({ id, name }))} />
}
