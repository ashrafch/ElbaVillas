"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Data ─────────────────────────────────────────────────────────────────────
// Update this array as units change status. Add more objects for future villas.
export type VillaStatus = "available" | "reserved" | "sold"

export interface VillaUnit {
  id: string
  type: "A" | "B"
  sqm: number
  status: VillaStatus
  priceLabel?: string // e.g. "Da €850.000" — optional, show when ready
}

const villaUnits: VillaUnit[] = [
  { id: "01", type: "A", sqm: 185, status: "available" },
  { id: "02", type: "A", sqm: 185, status: "available" },
  { id: "03", type: "B", sqm: 215, status: "reserved" },
  { id: "04", type: "B", sqm: 215, status: "available" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<VillaStatus, { label: string; color: string; dotColor: string }> = {
  available: { label: "Disponibile",  color: "text-[#7dba96]",  dotColor: "bg-[#7dba96]" },
  reserved:  { label: "Prenotata",    color: "text-[#c9975a]",  dotColor: "bg-[#c9975a]" },
  sold:      { label: "Venduta",      color: "text-white/30",   dotColor: "bg-white/20"  },
}

const ease = [0.22, 1, 0.36, 1] as const

// ── Animated integer counter ──────────────────────────────────────────────────
function AnimatedCount({ target, inView }: { target: number; inView: boolean }) {
  const s = useSpring(0, { stiffness: 80, damping: 20 })
  const display = useTransform(s, (v) => Math.round(v).toString())
  useEffect(() => { if (inView) s.set(target) }, [inView, s, target])
  return <motion.span>{display}</motion.span>
}

// ── Villa tile ────────────────────────────────────────────────────────────────
function VillaTile({ unit, delay, inView }: { unit: VillaUnit; delay: number; inView: boolean }) {
  const st = STATUS_MAP[unit.status]
  const isAvailable = unit.status === "available"

  return (
    <motion.a
      href={isAvailable ? "#contatti" : undefined}
      role={isAvailable ? "link" : "presentation"}
      tabIndex={isAvailable ? 0 : -1}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-sm border p-4 transition-all duration-300 sm:p-5",
        "border-white/8 bg-white/[0.03]",
        isAvailable
          ? "cursor-pointer hover:border-white/18 hover:bg-white/[0.07]"
          : "cursor-default opacity-70",
      )}
    >
      {/* Top row: id + status dot */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.52rem] uppercase tracking-[0.24em] text-white/35">
            Villa
          </p>
          <p className="mt-0.5 font-heading text-2xl font-medium leading-none text-white">
            {unit.id}
          </p>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className={cn("size-1.5 rounded-full", st.dotColor)} />
          <span className={cn("text-[0.55rem] uppercase tracking-[0.16em]", st.color)}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Bottom: specs */}
      <div className="mt-4">
        <p className="text-[0.62rem] text-white/45">
          Tipo {unit.type} · {unit.sqm} m²
        </p>
        {unit.priceLabel && (
          <p className="mt-0.5 text-[0.62rem] text-white/55">{unit.priceLabel}</p>
        )}
      </div>

      {/* Hover CTA — available only, desktop */}
      {isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f1f1c]/85 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="text-[0.62rem] uppercase tracking-[0.2em] text-white/80">
            Richiedi informazioni →
          </span>
        </div>
      )}
    </motion.a>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function AvailabilitySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const available = villaUnits.filter((u) => u.status === "available").length
  const reserved  = villaUnits.filter((u) => u.status === "reserved").length
  const total     = villaUnits.length

  return (
    <section ref={ref} id="disponibilita" className="bg-[#0f1f1c] py-20 sm:py-24 md:py-28">
      <div className="container-premium">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
          >
            <p className="text-xs uppercase tracking-[0.28em] text-white/35">
              Disponibilità · Esclusivo
            </p>
            <h2 className="mt-4 font-heading text-4xl font-medium text-white md:text-5xl">
              Scegli la tua villa.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/50">
              Un numero limitato di residenze. Verifica la disponibilità e prenota un appuntamento.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.55, ease }}
            className="flex shrink-0 items-center gap-8 lg:gap-10"
          >
            <div className="text-center">
              <p className="font-heading text-4xl font-medium text-[#7dba96]">
                <AnimatedCount target={available} inView={inView} />
              </p>
              <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-white/35">
                Disponibili
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="font-heading text-4xl font-medium text-[#c9975a]">
                <AnimatedCount target={reserved} inView={inView} />
              </p>
              <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-white/35">
                Prenotate
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="font-heading text-4xl font-medium text-white/60">
                <AnimatedCount target={total} inView={inView} />
              </p>
              <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-white/35">
                Totali
              </p>
            </div>
          </motion.div>
        </div>

        {/* Villa grid — 2 cols mobile, 3 sm, 4 lg, 5 xl+ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {villaUnits.map((unit, i) => (
            <VillaTile
              key={unit.id}
              unit={unit}
              delay={0.25 + i * 0.08}
              inView={inView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5, ease }}
          className="mt-10 flex items-center justify-between border-t border-white/8 pt-8"
        >
          <p className="text-xs text-white/35">
            Le prenotazioni sono vincolate alla firma del contratto preliminare.
          </p>
          <a
            href="#contatti"
            className="text-xs uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
          >
            Contattaci →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
