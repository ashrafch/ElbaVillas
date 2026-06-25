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
  value: string // why it matters for life around the residences / value
  image: string
  credit: { author: string; license: string; source: string }
  lat?: number
  lng?: number
}

// The surroundings of the residences — real, freely-licensed photography of
// the beaches, coves, villages and nature around the project (Wikimedia
// Commons). See `credit` for the required attribution.
const STOPS: Stop[] = [
  {
    id: "sansone",
    name: "Spiaggia di Sansone",
    tag: "Il mare a pochi minuti",
    blurb:
      "Ghiaia bianca e acqua trasparente racchiusa da scogliere chiare: il mare dell'Elba nella sua versione più limpida, a breve distanza dalle residenze.",
    value: "Accesso al mare come gesto quotidiano — il lusso più semplice e più raro.",
    image: "/images/tour/sansone.jpg",
    credit: { author: "Carlo Pelagalli", license: "CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Spiaggia_di_Sansone,_Elba_-_panoramio.jpg" },
    lat: 42.8133,
    lng: 10.2719,
  },
  {
    id: "fetovaia",
    name: "Cala di Fetovaia",
    tag: "Le cale dei dintorni",
    blurb:
      "Una mezzaluna di sabbia dorata protetta dal promontorio delle Tombe, tra le baie più amate del versante sud-ovest dell'isola.",
    value: "Calette e baie raggiungibili in giornata: ogni weekend un mare diverso.",
    image: "/images/tour/fetovaia.jpg",
    credit: { author: "philiTizzani", license: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Fetovaia01.jpg" },
    lat: 42.735,
    lng: 10.15,
  },
  {
    id: "capoliveri",
    name: "Capoliveri",
    tag: "I borghi vicini",
    blurb:
      "Borgo medievale arroccato sul promontorio del Calamita: vicoli stretti, botteghe, enogastronomia e terrazze aperte sul golfo.",
    value: "Borghi vivi tutto l'anno a breve distanza: vita sociale oltre la stagione estiva.",
    image: "/images/tour/capoliveri.jpg",
    credit: { author: "Gregory Zeier", license: "CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:Capoliveri_Elbe_Elba.JPG" },
    lat: 42.743,
    lng: 10.376,
  },
  {
    id: "capanne",
    name: "Monte Capanne",
    tag: "Natura e sentieri",
    blurb:
      "La vetta più alta dell'arcipelago: sentieri, granito e macchia mediterranea, con una cabinovia che sale al panorama sul Tirreno.",
    value: "Natura protetta intorno a casa: un paesaggio che resta intatto e protegge il valore.",
    image: "/images/tour/capanne.jpg",
    credit: { author: "Ferpint", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Monte_Capanne_(Elba_Island).JPG" },
    lat: 42.7669,
    lng: 10.1903,
  },
  {
    id: "portoferraio",
    name: "Portoferraio",
    tag: "Porti e servizi",
    blurb:
      "Il capoluogo e il suo porto mediceo: traghetti, servizi, ristoranti e storia, a breve distanza dalle residenze.",
    value: "Collegamenti e servizi tutto l'anno: comodità reale, non solo vacanza.",
    image: "/images/tour/portoferraio.jpg",
    credit: { author: "Geak", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Portoferraio-Panorama.jpg" },
    lat: 42.8092,
    lng: 10.33,
  },
  {
    id: "tramonto",
    name: "Tramonti sulla costa ovest",
    tag: "La luce della sera",
    blurb:
      "La costa tra Pomonte e Chiessi, dove il sole cala dritto nel mare: il rito serale dell'isola, a pochi chilometri dal progetto.",
    value: "La luce della sera sul Tirreno: il valore intangibile che si vive ogni giorno.",
    image: "/images/tour/tramonto.jpg",
    credit: { author: "Carlo Pelagalli", license: "CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Tramonto_tra_Pomonte_e_Chiessi_-_panoramio.jpg" },
    lat: 42.783,
    lng: 10.107,
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
            I dintorni delle residenze · Isola d&apos;Elba
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.02em]">
          Tutto il meglio dell&apos;Elba, a pochi passi da casa.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
          Spiagge, cale, borghi e natura che circondano il progetto: il contesto quotidiano delle
          residenze Elba Luce — e una parte concreta del loro valore.
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
                  {stop.lat != null && stop.lng != null && (
                    <span className="text-[0.58rem] tabular-nums text-white/45">
                      {fmt(stop.lat, "N", "S")} · {fmt(stop.lng, "E", "O")}
                    </span>
                  )}
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
