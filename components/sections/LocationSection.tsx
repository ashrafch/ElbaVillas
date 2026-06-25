"use client"

import { useState } from "react"
import { Anchor, Footprints, Sailboat, Trees } from "lucide-react"

import { cn } from "@/lib/utils"
import { IslandMap, type MapPoi } from "@/components/sections/IslandMap"

function WavesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M3 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    </svg>
  )
}

type Poi = MapPoi & {
  icon: React.ComponentType<React.ComponentProps<"svg">>
  text: string
}

// x/y are island-space coordinates (viewBox 0..1000 × 0..640) placed at
// plausible real locations on Elba: Monte Capanne, Portoferraio, the southern
// beaches and the Capoliveri peninsula.
const pois: Poi[] = [
  { id: "nature", icon: Trees,     label: "Natura",            text: "Macchia mediterranea, Monte Capanne e panorami aperti.",  x: 235, y: 320 },
  { id: "ports",  icon: Anchor,    label: "Porti",             text: "Portoferraio, collegamenti stagionali e servizi nautici.", x: 548, y: 175 },
  { id: "beach",  icon: WavesIcon, label: "Spiagge e calette", text: "Le baie del versante sud e percorsi costieri vicini.",      x: 360, y: 460 },
  { id: "life",   icon: Sailboat,  label: "Lifestyle",         text: "Capoliveri, borghi, ristorazione e tempi lenti.",          x: 800, y: 470 },
]

export function LocationSection() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="location" className="bg-background py-20 sm:py-24 md:py-32">
      <div className="container-premium grid gap-12 lg:grid-cols-[1fr_0.9fr]">
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

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contatti"
              className="inline-flex min-h-12 w-full items-center justify-center bg-primary px-5 py-3 text-center text-xs uppercase tracking-[0.13em] text-primary-foreground transition hover:bg-primary/90 sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.18em]"
            >
              Ricevi la posizione e il dossier completo
            </a>
            <a
              href="/tour"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 border border-primary/30 px-5 py-3 text-center text-xs uppercase tracking-[0.13em] text-primary transition hover:border-primary hover:bg-primary/[0.04] sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.18em]"
            >
              <Footprints className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              Inizia il giro virtuale
            </a>
          </div>
        </div>

        {/* ── Nautical-chart island map ─────────────────────────────────── */}
        <div className="relative min-h-[380px] overflow-hidden bg-[#d9d0bd] sm:min-h-[440px]">
          {/* Dotted survey grid */}
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage: "radial-gradient(rgba(23,37,34,0.16) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          {/* Inner frame */}
          <div className="absolute inset-6 border border-[#172522]/20" />

          <IslandMap pois={pois} active={active} />

          {/* Caption */}
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.55rem] uppercase tracking-[0.32em] text-[#172522]/45">
            Isola d&apos;Elba · Mar Tirreno
          </span>
        </div>
      </div>
    </section>
  )
}
