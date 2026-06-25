"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Bath, BedDouble, Maximize2, Waves } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import type { Villa } from "@/types/villa"

const statusConfig: Record<Villa["status"], { label: string; cls: string }> = {
  available:    { label: "Disponibile",  cls: "bg-white/90 text-[#172522]"       },
  reserved:     { label: "Riservata",    cls: "bg-[#172522]/90 text-white"        },
  "coming-soon":{ label: "Prossimamente",cls: "bg-[#efe7d8]/95 text-[#172522]"   },
  sold:         { label: "Venduta",      cls: "bg-white/30 text-[#172522]"        },
}

export function VillaCard({ villa }: { villa: Villa }) {
  const { label, cls } = statusConfig[villa.status]

  return (
    <motion.article
      className="group overflow-hidden bg-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="relative aspect-[5/6] overflow-hidden">
        <Image
          src={villa.image}
          alt={villa.name}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
        />
        {/* Gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        {/* Diagonal light sweep on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -inset-y-8 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent transition-[left] duration-[900ms] ease-out group-hover:left-full" />
        </div>

        {/* Status badge */}
        <Badge
          className={`absolute left-4 top-4 rounded-none border-0 text-[0.62rem] uppercase tracking-[0.12em] ${cls}`}
        >
          {label}
        </Badge>

        {/* Pool indicator */}
        {villa.pool && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 border border-white/25 bg-black/30 px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/80 backdrop-blur-sm">
            <Waves className="size-3" />
            Piscina
          </div>
        )}

        {/* Name + description over image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-3xl text-white">{villa.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/68">{villa.description}</p>

          {/* Quick specs */}
          <div className="mt-4 flex items-center gap-4 border-t border-white/15 pt-4 text-[0.68rem] text-white/55">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="size-3" />
              {villa.surface}
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-3" />
              {villa.bedrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="size-3" />
              {villa.bathrooms}
            </span>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between border border-border/70 border-t-0 px-5 py-4">
        <p className="text-xs text-muted-foreground">{villa.outdoor}</p>
        <a
          href="#disponibilita"
          className="group/cta inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-primary transition hover:text-accent"
        >
          Disponibilità
          <ArrowUpRight className="size-3.5 transition group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </a>
      </div>
    </motion.article>
  )
}
