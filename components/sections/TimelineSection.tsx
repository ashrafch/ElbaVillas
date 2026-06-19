"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

type Status = "done" | "current" | "upcoming"

interface Milestone {
  date: string
  label: string
  description: string
  status: Status
}

const milestones: Milestone[] = [
  {
    date: "Q3 2024",
    label: "Progetto approvato",
    description: "Permessi edilizi e valutazione d'impatto ambientale ottenuti",
    status: "done",
  },
  {
    date: "Q1 2025",
    label: "Cantiere avviato",
    description: "Fondamenta, struttura portante e opere di sbancamento",
    status: "done",
  },
  {
    date: "Q3 2025",
    label: "Struttura completata",
    description: "Coperture, partizioni interne e facciate in pietra locale",
    status: "current",
  },
  {
    date: "Q2 2026",
    label: "Finiture e giardini",
    description: "Pavimentazioni, piscine private e aree esterne progettate",
    status: "upcoming",
  },
  {
    date: "Q4 2026",
    label: "Consegna chiavi",
    description: "Collaudo finale e consegna alle prime famiglie",
    status: "upcoming",
  },
]

// Each dot lives at column center: 10%, 30%, 50%, 70%, 90%
// Progress = from 10% to 50% (current dot) = 50% of the line's own width
const DOT_POSITIONS = [10, 30, 50, 70, 90] // % from container left
const PROGRESS_PCT = "50%"

const ease = [0.22, 1, 0.36, 1] as const
const spring = { type: "spring", stiffness: 300, damping: 24 } as const

function DesktopDot({
  status,
  delay,
  inView,
}: {
  status: Status
  delay: number
  inView: boolean
}) {
  if (status === "upcoming") {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay, duration: 0.45, ease }}
        className="size-[10px] rounded-full border border-[#172522]/28 bg-transparent"
      />
    )
  }
  if (status === "current") {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 10, height: 10 }}>
        {inView && (
          <motion.div
            className="absolute rounded-full bg-[#172522]/12"
            style={{ width: 32, height: 32, top: -11, left: -11 }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ delay: delay + 0.6, duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1, boxShadow: "0 0 0 4px rgba(23,37,34,.1)" } : {}}
          transition={{ delay, ...spring }}
          className="relative size-[10px] rounded-full bg-[#172522]"
        />
      </div>
    )
  }
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={inView ? { scale: 1 } : {}}
      transition={{ delay, ...spring }}
      className="size-[10px] rounded-full bg-[#172522]"
    />
  )
}

function MobileDot({ status, delay, inView }: { status: Status; delay: number; inView: boolean }) {
  if (status === "done") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay, ...spring }}
        className="size-[10px] rounded-full bg-[#172522]"
      />
    )
  }
  if (status === "current") {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 10, height: 10 }}>
        {inView && (
          <motion.div
            className="absolute rounded-full bg-[#172522]/12"
            style={{ width: 28, height: 28, top: -9, left: -9 }}
            animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ delay: delay + 0.5, duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1, boxShadow: "0 0 0 4px rgba(23,37,34,.1)" } : {}}
          transition={{ delay, ...spring }}
          className="relative size-[10px] rounded-full bg-[#172522]"
        />
      </div>
    )
  }
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay, duration: 0.4, ease }}
      className="size-[10px] rounded-full border border-[#172522]/28"
    />
  )
}

export function TimelineSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} id="avanzamento" className="bg-[#efe7d8] py-20 sm:py-24 md:py-28">
      <div className="container-premium">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="mb-16 text-center lg:text-left"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-[#172522]/45">
            Avanzamento lavori
          </p>
          <h2 className="mt-4 font-heading text-4xl font-medium text-[#172522] md:text-5xl">
            Il progetto prende forma.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#172522]/60">
            Ogni fase è documentata e verificabile. La consegna è prevista per fine 2026.
          </p>
        </motion.div>

        {/* ── Desktop: single grid, 3 explicit rows ── */}
        <div
          className="hidden lg:grid"
          style={{ gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "auto 56px auto" }}
        >
          {/* Row 1 — Labels */}
          {milestones.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14 + i * 0.09, duration: 0.5, ease }}
              className="flex flex-col items-center px-3 pb-5 text-center"
              style={{ gridColumn: i + 1, gridRow: 1 }}
            >
              <span className={cn(
                "text-[0.55rem] uppercase tracking-[0.22em]",
                m.status === "upcoming" ? "text-[#172522]/28" : "text-[#172522]/50",
              )}>
                {m.date}
              </span>
              <span className={cn(
                "mt-1.5 text-[0.75rem] font-medium leading-snug",
                m.status === "current" ? "text-[#172522] font-semibold" :
                m.status === "upcoming" ? "text-[#172522]/32" : "text-[#172522]",
              )}>
                {m.label}
              </span>
              {m.status === "current" && (
                <motion.span
                  animate={inView ? { opacity: [0.45, 1, 0.45] } : { opacity: 0 }}
                  transition={{ delay: 1.2, duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-1.5 text-[0.48rem] uppercase tracking-[0.2em] text-[#172522]/65"
                >
                  in corso
                </motion.span>
              )}
            </motion.div>
          ))}

          {/* Row 2 — Line + dots (spans all 5 columns) */}
          <div
            className="relative"
            style={{ gridColumn: "1 / -1", gridRow: 2 }}
          >
            {/* Base line */}
            <motion.div
              className="absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 bg-[#172522]/10"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.9, ease }}
            />

            {/* Progress fill */}
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 overflow-hidden">
              <motion.div
                className="h-full bg-[#172522]/38"
                initial={{ width: "0%" }}
                animate={inView ? { width: PROGRESS_PCT } : {}}
                transition={{ duration: 1.15, delay: 0.12, ease }}
              />
            </div>

            {/* Dots — absolutely positioned at exact column centers */}
            {milestones.map((m, i) => (
              <div
                key={`dot-${m.label}`}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${DOT_POSITIONS[i]}%` }}
              >
                <DesktopDot status={m.status} delay={0.38 + i * 0.1} inView={inView} />
              </div>
            ))}
          </div>

          {/* Row 3 — Descriptions */}
          {milestones.map((m, i) => (
            <motion.p
              key={`desc-${m.label}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.65 + i * 0.09, duration: 0.55, ease }}
              className={cn(
                "px-3 pt-5 text-center text-[0.68rem] leading-5",
                m.status === "upcoming" ? "text-[#172522]/25" : "text-[#172522]/55",
              )}
              style={{ gridColumn: i + 1, gridRow: 3 }}
            >
              {m.description}
            </motion.p>
          ))}
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="relative lg:hidden">
          <motion.div
            className="absolute left-[5px] top-2 bottom-2 w-px bg-[#172522]/12"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 1.0, ease }}
          />

          {milestones.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.18 + i * 0.12, duration: 0.5, ease }}
              className="flex items-start gap-5 pb-9 last:pb-0"
            >
              <div className="relative z-10 mt-0.5 shrink-0" style={{ width: 10, height: 10 }}>
                <MobileDot status={m.status} delay={0.28 + i * 0.12} inView={inView} />
              </div>
              <div>
                <span className={cn(
                  "text-[0.55rem] uppercase tracking-[0.22em]",
                  m.status === "upcoming" ? "text-[#172522]/28" : "text-[#172522]/50",
                )}>
                  {m.date}
                  {m.status === "current" && (
                    <motion.span
                      animate={inView ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0 }}
                      transition={{ delay: 1, duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="ml-2 text-[#172522]/55"
                    >
                      · in corso
                    </motion.span>
                  )}
                </span>
                <p className={cn(
                  "mt-0.5 text-sm font-medium leading-snug",
                  m.status === "current" ? "text-[#172522] font-semibold" :
                  m.status === "upcoming" ? "text-[#172522]/35" : "text-[#172522]",
                )}>
                  {m.label}
                </p>
                <p className={cn(
                  "mt-1 text-xs leading-5",
                  m.status === "upcoming" ? "text-[#172522]/25" : "text-[#172522]/55",
                )}>
                  {m.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
