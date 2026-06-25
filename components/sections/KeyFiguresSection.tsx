"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

import { CountUp } from "@/components/motion/CountUp"

const figures = [
  { value: 9, label: "Ville esclusive", sub: "unità indipendenti" },
  { value: 230, unit: "m²", label: "Superficie massima", sub: "spazi interni" },
  { value: 7, label: "Piscine private", sub: "su nove residenze" },
  { value: 2026, label: "Anno di consegna", sub: "prenotazioni aperte" },
]

const ease = [0.22, 1, 0.36, 1] as const

export function KeyFiguresSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="border-y border-[#172522]/10 bg-[#efe7d8]">
      <div ref={ref} className="container-premium">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#172522]/10 md:grid-cols-4 md:divide-y-0">
          {figures.map((fig, i) => (
            <motion.div
              key={fig.label}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
              className="group relative px-6 py-10 text-center sm:px-8 sm:py-14"
            >
              <p className="font-heading text-5xl font-medium tabular-nums text-[#172522] transition-colors duration-500 group-hover:text-[#2f6754] sm:text-6xl md:text-7xl">
                <CountUp to={fig.value} stiffness={fig.value > 100 ? 95 : 60} />
                {fig.unit && (
                  <span className="font-heading text-3xl sm:text-4xl">{fig.unit}</span>
                )}
              </p>
              <p className="mt-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#172522]/80 sm:text-xs">
                {fig.label}
              </p>
              <p className="mt-1 text-xs text-[#172522]/45">{fig.sub}</p>

              {/* Underline that draws itself in, then widens on hover */}
              <motion.span
                className="mx-auto mt-5 block h-px bg-[#2f6754]/40 transition-[width] duration-500 group-hover:!w-12"
                initial={{ width: 0 }}
                animate={inView ? { width: 28 } : {}}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.8, ease }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
