"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { villas } from "@/lib/villas"
import type { VillaStatus } from "@/types/villa"

// ── Status display map ────────────────────────────────────────────────────────
const STATUS_MAP: Record<VillaStatus, { label: string; color: string; dotColor: string; interactive: boolean }> = {
  available:    { label: "Disponibile", color: "text-[#7dba96]", dotColor: "bg-[#7dba96]",  interactive: true  },
  reserved:     { label: "Prenotata",   color: "text-[#c9975a]", dotColor: "bg-[#c9975a]",  interactive: false },
  "coming-soon":{ label: "In arrivo",   color: "text-white/38",  dotColor: "bg-white/22",   interactive: false },
  sold:         { label: "Venduta",     color: "text-white/28",  dotColor: "bg-white/18",   interactive: false },
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
function VillaTile({
  villa,
  index,
  delay,
  inView,
}: {
  villa: (typeof villas)[number]
  index: number
  delay: number
  inView: boolean
}) {
  const st = STATUS_MAP[villa.status]
  // Short display name: "Villa Azzurra" → "Azzurra"
  const shortName = villa.name.replace(/^Villa\s+/i, "")

  return (
    <motion.a
      href={st.interactive ? "#contatti" : undefined}
      role={st.interactive ? "link" : "presentation"}
      tabIndex={st.interactive ? 0 : -1}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-sm border p-4 transition-all duration-300 sm:p-5",
        "border-white/8 bg-white/[0.03]",
        st.interactive
          ? "cursor-pointer hover:border-white/18 hover:bg-white/[0.07]"
          : "cursor-default",
        (villa.status === "sold" || villa.status === "coming-soon") && "opacity-60",
      )}
    >
      {/* Top: index number + status */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.5rem] uppercase tracking-[0.24em] text-white/30">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mt-1 font-heading text-lg font-medium leading-tight text-white">
            {shortName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className={cn("size-1.5 rounded-full", st.dotColor)} />
          <span className={cn("text-[0.52rem] uppercase tracking-[0.15em]", st.color)}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Bottom: specs */}
      <div className="mt-3 flex items-center gap-2 text-[0.6rem] text-white/40">
        <span>{villa.surface}</span>
        <span className="text-white/20">·</span>
        <span>{villa.bedrooms} cam.</span>
        {villa.pool && (
          <>
            <span className="text-white/20">·</span>
            <span>Piscina</span>
          </>
        )}
      </div>

      {/* Price — shown when set */}
      {villa.priceLabel && (
        <p className="mt-1 text-[0.6rem] text-white/50">{villa.priceLabel}</p>
      )}

      {/* Hover CTA overlay — available only */}
      {st.interactive && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f1f1c]/85 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/80">
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

  const available   = villas.filter((v) => v.status === "available").length
  const reserved    = villas.filter((v) => v.status === "reserved").length
  const comingSoon  = villas.filter((v) => v.status === "coming-soon").length
  const total       = villas.length

  return (
    <section ref={ref} id="disponibilita" className="bg-[#0f1f1c] py-20 sm:py-24 md:py-28">
      <div className="container-premium">

        {/* Header row */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
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
            <p className="mt-3 max-w-md text-sm leading-7 text-white/50">
              Un numero limitato di residenze. Verifica la disponibilità e prenota un appuntamento.
            </p>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.55, ease }}
            className="flex shrink-0 flex-wrap items-center gap-6 lg:gap-10"
          >
            <div className="text-center">
              <p className="font-heading text-4xl font-medium text-[#7dba96]">
                <AnimatedCount target={available} inView={inView} />
              </p>
              <p className="mt-1 text-[0.52rem] uppercase tracking-[0.2em] text-white/35">
                Disponibili
              </p>
            </div>
            {reserved > 0 && (
              <>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="font-heading text-4xl font-medium text-[#c9975a]">
                    <AnimatedCount target={reserved} inView={inView} />
                  </p>
                  <p className="mt-1 text-[0.52rem] uppercase tracking-[0.2em] text-white/35">
                    Prenotate
                  </p>
                </div>
              </>
            )}
            {comingSoon > 0 && (
              <>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="font-heading text-4xl font-medium text-white/45">
                    <AnimatedCount target={comingSoon} inView={inView} />
                  </p>
                  <p className="mt-1 text-[0.52rem] uppercase tracking-[0.2em] text-white/35">
                    In arrivo
                  </p>
                </div>
              </>
            )}
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="font-heading text-4xl font-medium text-white/55">
                <AnimatedCount target={total} inView={inView} />
              </p>
              <p className="mt-1 text-[0.52rem] uppercase tracking-[0.2em] text-white/35">
                Totali
              </p>
            </div>
          </motion.div>
        </div>

        {/* Villa grid — 2 cols mobile → 3 sm → 4 lg → 5 xl → 6 2xl */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {villas.map((villa, i) => (
            <VillaTile
              key={villa.id}
              villa={villa}
              index={i}
              delay={0.25 + i * 0.07}
              inView={inView}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5, ease }}
          className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs text-white/30">
            Le prenotazioni sono vincolate alla firma del contratto preliminare.
          </p>
          <a
            href="#contatti"
            className="text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
          >
            Prenota un appuntamento →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
