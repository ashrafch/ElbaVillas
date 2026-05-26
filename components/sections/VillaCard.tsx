import { ArrowUpRight, Bath, BedDouble, Waves } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import type { Villa } from "@/types/villa"

const statusLabels = {
  available: "Disponibile",
  reserved: "Riservata",
  "coming-soon": "Coming soon",
}

export function VillaCard({ villa }: { villa: Villa }) {
  return (
    <article className="group overflow-hidden bg-card">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={villa.image} alt={villa.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-90" />
        <Badge className="absolute left-4 top-4 rounded-none bg-white/90 text-[#172522] hover:bg-white">{statusLabels[villa.status]}</Badge>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-heading text-3xl">{villa.name}</h3>
          <p className="mt-2 text-sm leading-6 text-white/75">{villa.description}</p>
        </div>
      </div>
      <div className="border border-border/80 border-t-0 p-5">
        <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
          <span>{villa.surface}</span>
          <span className="inline-flex items-center gap-1"><BedDouble className="size-4" /> {villa.bedrooms}</span>
          <span className="inline-flex items-center gap-1"><Bath className="size-4" /> {villa.bathrooms}</span>
        </div>
        <p className="mt-4 text-sm text-foreground/75">{villa.outdoor}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Waves className="size-4" /> {villa.pool ? "Piscina" : "Pool optional"}
          </span>
          <a href="#contatti" className="inline-flex items-center gap-1 text-sm text-primary transition hover:text-accent">
            Esplora <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </article>
  )
}
