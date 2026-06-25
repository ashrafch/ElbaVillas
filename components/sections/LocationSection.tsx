"use client"

import { useRef, useState } from "react"
import { Anchor, MapPin, Sailboat, Trees } from "lucide-react"
import { motion, useInView } from "framer-motion"

import { cn } from "@/lib/utils"

function WavesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M3 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    </svg>
  )
}

type Poi = {
  id: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
  label: string
  text: string
  x: number // position on the map, %
  y: number
}

const pois: Poi[] = [
  { id: "nature", icon: Trees,     label: "Natura",            text: "Macchia mediterranea, trekking e panorami aperti.",        x: 31, y: 28 },
  { id: "ports",  icon: Anchor,    label: "Porti",             text: "Collegamenti stagionali e servizi nautici dell'isola.",    x: 74, y: 40 },
  { id: "beach",  icon: WavesIcon, label: "Spiagge e calette", text: "Accesso al mare e percorsi costieri nelle vicinanze.",      x: 27, y: 70 },
  { id: "life",   icon: Sailboat,  label: "Lifestyle",         text: "Barca, borghi, ristorazione e tempi lenti.",               x: 71, y: 71 },
]

const ISLAND_PATH =
  "M20,52 C18,44 25,40 33,39 C40,38 45,33 53,34 C61,35 65,40 73,40 C82,40 88,45 85,53 C82,60 73,61 67,63 C59,65 55,62 47,63 C39,64 33,67 28,62 C23,58 22,57 20,52 Z"

const ease = [0.22, 1, 0.36, 1] as const

export function LocationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [active, setActive] = useState<string | null>(null)
  const activePoi = pois.find((p) => p.id === active) ?? null

  return (
    <section id="location" className="bg-background py-20 sm:py-24 md:py-32">
      <div ref={ref} className="container-premium grid gap-12 lg:grid-cols-[1fr_0.9fr]">
        {/* ── Copy + interactive POI list ───────────────────────────────── */}
        <div className="text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Location</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Elba, senza fretta.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">
            Il valore della posizione non è solo nella distanza dal mare, ma nella qualità del tempo:
            luce, silenzio, borghi raggiungibili e un paesaggio che rimane protagonista.
          </p>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
            {pois.map((poi) => {
              const isActive = active === poi.id
              return (
                <button
                  key={poi.id}
                  type="button"
                  onMouseEnter={() => setActive(poi.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(poi.id)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "group relative overflow-hidden border-l pl-5 pr-3 py-3 text-left transition-colors duration-300",
                    isActive ? "border-accent bg-accent/[0.04]" : "border-border",
                  )}
                  aria-label={poi.label}
                >
                  {/* Accent bar that fills on hover */}
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-full w-px bg-accent transition-transform duration-500 origin-top",
                      isActive ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  <poi.icon
                    className={cn(
                      "size-5 transition-colors duration-300",
                      isActive ? "text-accent" : "text-accent/70",
                    )}
                  />
                  <h3 className="mt-4 font-heading text-2xl">{poi.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{poi.text}</p>
                </button>
              )
            })}
          </div>

          <a
            href="#contatti"
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center bg-primary px-5 py-3 text-center text-xs uppercase tracking-[0.13em] text-primary-foreground transition hover:bg-primary/90 sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.18em]"
          >
            Ricevi la posizione e il dossier completo
          </a>
        </div>

        {/* ── Living radar map ───────────────────────────────────────────── */}
        <div className="relative min-h-[360px] overflow-hidden bg-[#d9d0bd] sm:min-h-[420px]">
          {/* Dotted survey grid */}
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(23,37,34,0.16) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Inner frame */}
          <div className="absolute inset-8 border border-[#172522]/20" />

          {/* Island outline + connector — SVG in 0..100 space */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d={ISLAND_PATH}
              fill="rgba(47,103,84,0.06)"
              stroke="rgba(23,37,34,0.22)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            {activePoi && (
              <motion.line
                x1="50"
                y1="50"
                x2={activePoi.x}
                y2={activePoi.y}
                stroke="#2f6754"
                strokeWidth="0.4"
                strokeDasharray="1.6 1.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.75 }}
                transition={{ duration: 0.4, ease }}
              />
            )}
          </svg>

          {/* Sonar rings emanating from the centre marker */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2f6754]/35"
              initial={{ scale: 0.35, opacity: 0 }}
              animate={inView ? { scale: [0.35, 2.6], opacity: [0.55, 0] } : {}}
              transition={{ duration: 4.2, repeat: Infinity, delay: i * 1.4, ease: "easeOut" }}
            />
          ))}

          {/* Slow-orbiting marker (a boat circling the island) */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: "52%", height: "52%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-[#172522]/45" />
          </motion.div>

          {/* POI dots */}
          {pois.map((poi) => {
            const isActive = active === poi.id
            return (
              <div
                key={poi.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
              >
                <motion.span
                  className="block size-2 rounded-full bg-[#2f6754]"
                  animate={{
                    scale: isActive ? 2 : 1,
                    boxShadow: isActive
                      ? "0 0 0 6px rgba(47,103,84,0.16)"
                      : "0 0 0 0 rgba(47,103,84,0)",
                  }}
                  transition={{ duration: 0.3, ease }}
                />
                <span
                  className={cn(
                    "absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[0.55rem] uppercase tracking-[0.18em] text-[#172522] transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  {poi.label}
                </span>
              </div>
            )
          })}

          {/* Centre marker */}
          <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 bg-[#172522] px-4 py-3 text-white">
            <MapPin className="size-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Area riservata</span>
          </div>
        </div>
      </div>
    </section>
  )
}
