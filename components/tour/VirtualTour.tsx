"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Footprints, MapPin, Navigation } from "lucide-react"

import { cn } from "@/lib/utils"

type Stop = {
  id: string
  name: string
  tag: string
  blurb: string
  lat: number
  lng: number
  zoom: number
}

// Real Isola d'Elba locations with real coordinates and descriptions.
const STOPS: Stop[] = [
  {
    id: "portoferraio",
    name: "Portoferraio",
    tag: "Capoluogo · Porto mediceo",
    blurb:
      "Il porto storico dell'isola, fondato da Cosimo I de' Medici nel 1548. Forti medicei a strapiombo sul mare, vicoli ripidi e la residenza dove Napoleone visse parte del suo esilio.",
    lat: 42.8092,
    lng: 10.33,
    zoom: 15,
  },
  {
    id: "sansone",
    name: "Spiaggia di Sansone",
    tag: "Spiaggia · Costa nord",
    blurb:
      "Ghiaia bianca e acqua trasparente dai toni del turchese, racchiusa da alte scogliere chiare. Una delle cale più fotografate del versante settentrionale.",
    lat: 42.8133,
    lng: 10.2719,
    zoom: 16,
  },
  {
    id: "capanne",
    name: "Monte Capanne",
    tag: "Natura · 1.019 m",
    blurb:
      "La vetta più alta dell'Arcipelago Toscano. Una cabinovia da Marciana sale tra granito e macchia mediterranea fino a un panorama che spazia su tutto il Tirreno.",
    lat: 42.7669,
    lng: 10.1903,
    zoom: 14,
  },
  {
    id: "fetovaia",
    name: "Spiaggia di Fetovaia",
    tag: "Spiaggia · Costa sud-ovest",
    blurb:
      "Una mezzaluna di sabbia dorata protetta dal promontorio delle Tombe. Acque calme e basse, tra le baie più amate dell'intera isola.",
    lat: 42.735,
    lng: 10.15,
    zoom: 16,
  },
  {
    id: "capoliveri",
    name: "Capoliveri",
    tag: "Borgo · Sud-est",
    blurb:
      "Borgo medievale arroccato sul promontorio del Calamita. Vicoli stretti, botteghe, enogastronomia e tramonti aperti sul golfo.",
    lat: 42.743,
    lng: 10.376,
    zoom: 16,
  },
  {
    id: "portoazzurro",
    name: "Porto Azzurro",
    tag: "Borgo di mare · Est",
    blurb:
      "Un golfo riparato dominato dal Forte San Giacomo. Lungomare, piazze vivaci e barche all'ancora nel cuore del versante orientale.",
    lat: 42.7589,
    lng: 10.3936,
    zoom: 16,
  },
]

const ease = [0.22, 1, 0.36, 1] as const

const fmt = (n: number, pos: string, neg: string) =>
  `${Math.abs(n).toFixed(4)}°${n >= 0 ? pos : neg}`

function embedSrc(s: Stop) {
  return `https://maps.google.com/maps?q=${s.lat},${s.lng}&z=${s.zoom}&hl=it&output=embed`
}
function streetViewHref(s: Stop) {
  return `https://www.google.com/maps?layer=c&cbll=${s.lat},${s.lng}`
}
function mapsHref(s: Stop) {
  return `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`
}

export function VirtualTour() {
  const [activeId, setActiveId] = useState(STOPS[0].id)
  const [loaded, setLoaded] = useState(false)

  const index = STOPS.findIndex((s) => s.id === activeId)
  const stop = STOPS[index]

  useEffect(() => {
    setLoaded(false)
  }, [activeId])

  const go = (dir: 1 | -1) => {
    const next = (index + dir + STOPS.length) % STOPS.length
    setActiveId(STOPS[next].id)
  }

  return (
    <div className="min-h-[100svh] bg-[#0d1e1a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d1e1a]/85 backdrop-blur-xl">
        <div className="container-premium flex h-16 items-center justify-between">
          <a href="/" className="font-heading text-xl tracking-wide">
            Elba Luce Villas
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Torna alla landing
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container-premium pt-14 pb-8 sm:pt-20">
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-white/30" />
          <span className="text-[0.68rem] uppercase tracking-[0.3em] text-white/55">
            Giro virtuale · Isola d&apos;Elba
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.02em]">
          Cammina sull&apos;isola, prima ancora di arrivarci.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
          Sei tappe reali tra borghi, porti e spiagge. Esplora ogni luogo sulla mappa
          interattiva, poi entra in Street View per percorrere vie e calette come se fossi lì.
        </p>
      </section>

      {/* Tour */}
      <section className="container-premium pb-20">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* Stop rail */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            {/* Mobile: horizontal chips */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
              {STOPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "shrink-0 whitespace-nowrap border px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.16em] transition",
                    s.id === activeId
                      ? "border-white bg-white text-[#0d1e1a]"
                      : "border-white/20 text-white/60",
                  )}
                >
                  {String(i + 1).padStart(2, "0")} · {s.name}
                </button>
              ))}
            </div>

            {/* Desktop: vertical list */}
            <ol className="hidden flex-col lg:flex">
              {STOPS.map((s, i) => {
                const isActive = s.id === activeId
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        "group relative w-full border-l py-4 pl-5 pr-3 text-left transition-colors duration-300",
                        isActive ? "border-white bg-white/[0.05]" : "border-white/15 hover:border-white/40",
                      )}
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={cn(
                            "font-heading text-sm tabular-nums transition-colors",
                            isActive ? "text-white" : "text-white/35",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span
                            className={cn(
                              "block font-heading text-xl leading-tight transition-colors",
                              isActive ? "text-white" : "text-white/70",
                            )}
                          >
                            {s.name}
                          </span>
                          <span className="mt-0.5 block text-[0.62rem] uppercase tracking-[0.16em] text-white/35">
                            {s.tag}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Map + info */}
          <div>
            {/* Interactive map */}
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-[#0b1713] sm:aspect-[16/10] lg:aspect-[16/9]">
              <AnimatePresence>
                {!loaded && (
                  <motion.div
                    key="loader"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b1713]"
                  >
                    <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.24em] text-white/40">
                      <span className="size-2 animate-ping rounded-full bg-[#7dba96]" />
                      Carico la mappa…
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <iframe
                key={stop.id}
                title={`Mappa interattiva di ${stop.name}, Isola d'Elba`}
                src={embedSrc(stop)}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full"
              />

              {/* Caption overlay */}
              <div className="pointer-events-none absolute left-0 top-0 m-4 flex items-center gap-2 bg-[#0d1e1a]/85 px-3 py-2 backdrop-blur-sm">
                <MapPin className="size-3.5 text-[#7dba96]" />
                <span className="text-[0.62rem] uppercase tracking-[0.18em] text-white/80">
                  {stop.name}
                </span>
                <span className="text-[0.58rem] tabular-nums text-white/40">
                  {fmt(stop.lat, "N", "S")} · {fmt(stop.lng, "E", "O")}
                </span>
              </div>
            </div>

            {/* Info panel */}
            <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/40">
                    Tappa {index + 1} di {STOPS.length} · {stop.tag}
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-medium sm:text-4xl">{stop.name}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">{stop.blurb}</p>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex items-center justify-center gap-2 self-start border border-white/25 px-5 py-3 text-[0.7rem] uppercase tracking-[0.18em] text-white/80 transition hover:border-white hover:text-white sm:self-end"
              >
                Prossima tappa
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Real-asset actions */}
            <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
              <a
                href={streetViewHref(stop)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2.5 bg-white px-6 text-[0.7rem] uppercase tracking-[0.18em] text-[#0d1e1a] transition hover:bg-[#efe3cf]"
              >
                <Footprints className="size-4" />
                Cammina in Street View
              </a>
              <a
                href={mapsHref(stop)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2.5 border border-white/25 px-6 text-[0.7rem] uppercase tracking-[0.18em] text-white/80 transition hover:border-white hover:text-white"
              >
                <Navigation className="size-4" />
                Apri in Google Maps
              </a>
            </div>

            <p className="mt-6 text-[0.62rem] leading-relaxed text-white/30">
              Mappe e Street View © Google. Le immagini stradali e satellitari sono fornite da
              Google Maps e si aprono nel servizio ufficiale.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
