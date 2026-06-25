"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

type Stop = {
  id: string
  name: string
  tag: string
  blurb: string
  value: string // why it matters / investment angle
  image: string
  credit: { author: string; license: string; source: string }
  lat: number
  lng: number
}

// Real Isola d'Elba locations with real, freely-licensed photography
// (Wikimedia Commons) — see `credit` for the required attribution.
const STOPS: Stop[] = [
  {
    id: "portoferraio",
    name: "Portoferraio",
    tag: "Capoluogo · Porto mediceo",
    blurb:
      "Il porto storico dell'isola, fondato da Cosimo I de' Medici nel 1548. Forti a strapiombo sul mare, vicoli ripidi e la residenza dove visse Napoleone.",
    value: "Il cuore dei servizi e dei collegamenti: l'accesso più comodo all'isola tutto l'anno.",
    image: "/images/tour/portoferraio.jpg",
    credit: { author: "Geak", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Portoferraio-Panorama.jpg" },
    lat: 42.8092,
    lng: 10.33,
  },
  {
    id: "sansone",
    name: "Spiaggia di Sansone",
    tag: "Spiaggia · Costa nord",
    blurb:
      "Ghiaia bianca e acqua trasparente dai toni del turchese, racchiusa da alte scogliere chiare. Una delle cale più fotografate dell'isola.",
    value: "Mare cristallino a pochi minuti d'auto: il lusso quotidiano di un'acqua da cartolina.",
    image: "/images/tour/sansone.jpg",
    credit: { author: "Carlo Pelagalli", license: "CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Spiaggia_di_Sansone,_Elba_-_panoramio.jpg" },
    lat: 42.8133,
    lng: 10.2719,
  },
  {
    id: "capanne",
    name: "Monte Capanne",
    tag: "Natura · 1.019 m",
    blurb:
      "La vetta più alta dell'Arcipelago Toscano. Una cabinovia sale tra granito e macchia mediterranea fino a un panorama che spazia su tutto il Tirreno.",
    value: "Natura protetta e sentieri: un paesaggio che resta intatto e valorizza nel tempo.",
    image: "/images/tour/capanne.jpg",
    credit: { author: "Ferpint", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Monte_Capanne_(Elba_Island).JPG" },
    lat: 42.7669,
    lng: 10.1903,
  },
  {
    id: "fetovaia",
    name: "Spiaggia di Fetovaia",
    tag: "Spiaggia · Costa sud-ovest",
    blurb:
      "Una mezzaluna di sabbia dorata protetta dal promontorio delle Tombe. Acque calme e basse, tra le baie più amate dell'isola.",
    value: "Un'icona balneare dell'Elba: forte richiamo turistico e potenziale di locazione.",
    image: "/images/tour/fetovaia.jpg",
    credit: { author: "philiTizzani", license: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Fetovaia01.jpg" },
    lat: 42.735,
    lng: 10.15,
  },
  {
    id: "capoliveri",
    name: "Capoliveri",
    tag: "Borgo · Sud-est",
    blurb:
      "Borgo medievale arroccato sul promontorio del Calamita. Vicoli stretti, botteghe, enogastronomia e tramonti aperti sul golfo.",
    value: "Vita di borgo ed esperienze tutto l'anno: domanda costante oltre la sola estate.",
    image: "/images/tour/capoliveri.jpg",
    credit: { author: "Gregory Zeier", license: "CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:Capoliveri_Elbe_Elba.JPG" },
    lat: 42.743,
    lng: 10.376,
  },
  {
    id: "portoazzurro",
    name: "Porto Azzurro",
    tag: "Borgo di mare · Est",
    blurb:
      "Un golfo riparato dominato dal Forte San Giacomo. Lungomare, piazze vivaci e barche all'ancora nel cuore del versante orientale.",
    value: "Borgo di mare vivo e servito: ristoranti, nautica e passeggio sul porto.",
    image: "/images/tour/portoazzurro.jpg",
    credit: { author: "Wolfgang Sauber", license: "CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Elba_-_Porto_Azzurro_-_Piazza_am_Hafen.jpg" },
    lat: 42.7589,
    lng: 10.3936,
  },
]

const ease = [0.22, 1, 0.36, 1] as const

const fmt = (n: number, pos: string, neg: string) =>
  `${Math.abs(n).toFixed(4)}°${n >= 0 ? pos : neg}`

export function VirtualTour() {
  const [activeId, setActiveId] = useState(STOPS[0].id)
  const index = STOPS.findIndex((s) => s.id === activeId)
  const stop = STOPS[index]

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
            I luoghi dell&apos;Isola d&apos;Elba
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.02em]">
          Un paradiso da vivere, un investimento che ha senso.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
          Sei luoghi reali che raccontano l&apos;Elba: mare cristallino, natura protetta e borghi
          autentici. Lo scenario in cui nascono le residenze Elba Luce — e le ragioni per cui
          valgono nel tempo.
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

          {/* Scene + info */}
          <div>
            {/* Scene image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-[#0b1713] sm:aspect-[16/9]">
              <AnimatePresence>
                <motion.img
                  key={stop.id}
                  src={stop.image}
                  alt={`${stop.name}, Isola d'Elba`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease }}
                  className="tour-kenburns absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Legibility gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d1e1a]/70 via-transparent to-[#0d1e1a]/15" />

              {/* Caption */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                <div className="flex items-center gap-2 bg-[#0d1e1a]/70 px-3 py-2 backdrop-blur-sm">
                  <MapPin className="size-3.5 text-[#7dba96]" />
                  <span className="text-[0.62rem] uppercase tracking-[0.18em] text-white/85">
                    {stop.name}
                  </span>
                  <span className="text-[0.58rem] tabular-nums text-white/45">
                    {fmt(stop.lat, "N", "S")} · {fmt(stop.lng, "E", "O")}
                  </span>
                </div>
                <span className="text-[0.55rem] uppercase tracking-[0.28em] text-white/40">
                  {String(index + 1).padStart(2, "0")} / {String(STOPS.length).padStart(2, "0")}
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
                  <p className="mt-4 flex max-w-xl items-start gap-2.5 text-sm leading-7 text-[#a9d4bc]">
                    <Sparkles className="mt-1 size-3.5 shrink-0" />
                    <span>{stop.value}</span>
                  </p>
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

            {/* CTAs — toward the investment story */}
            <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
              <a
                href="/#contatti"
                className="inline-flex h-12 items-center justify-center gap-2.5 bg-white px-6 text-[0.7rem] uppercase tracking-[0.18em] text-[#0d1e1a] transition hover:bg-[#efe3cf]"
              >
                Richiedi informazioni
              </a>
              <a
                href="/#investimento"
                className="inline-flex h-12 items-center justify-center gap-2.5 border border-white/25 px-6 text-[0.7rem] uppercase tracking-[0.18em] text-white/80 transition hover:border-white hover:text-white"
              >
                Scopri l&apos;investimento
              </a>
            </div>

            <p className="mt-6 text-[0.62rem] leading-relaxed text-white/30">
              Foto:{" "}
              <a
                href={stop.credit.source}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 transition hover:text-white/60"
              >
                {stop.credit.author}
              </a>{" "}
              · {stop.credit.license} · Wikimedia Commons. Le coordinate indicano la posizione
              reale di ciascuna tappa.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
