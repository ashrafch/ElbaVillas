"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { FadeIn } from "@/components/motion/FadeIn"
import { VillaCard } from "@/components/sections/VillaCard"
import { cn } from "@/lib/utils"
import { villas } from "@/lib/villas"

const PREVIEW = 3 // cards shown on mobile before "show all"

export function VillasOverviewSection() {
  const [showAll, setShowAll] = useState(false)

  const total = villas.length
  const available = villas.filter((v) => v.status === "available").length
  const preview = villas.slice(0, PREVIEW)
  const rest = villas.slice(PREVIEW)

  return (
    <section id="ville" className="bg-[#efe7d8] py-20 sm:py-24 md:py-32">
      <div className="container-premium">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Le ville</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">
            Nove ville, un&apos;unica isola.
          </h2>
          <p className="mt-6 text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
            Ogni residenza ha identità, orientamento e spazi esterni propri. Una collezione pensata
            per offrire scelta senza rinunciare alla privacy.
          </p>

          {/* Live availability indicator */}
          <div className="mt-7 inline-flex items-center gap-2.5 border border-[#172522]/12 bg-white/40 px-4 py-2">
            <span className="relative flex size-2">
              <span className="timeline-pulse absolute inline-flex size-full rounded-full bg-[#2f6754]" />
              <span className="relative inline-flex size-2 rounded-full bg-[#2f6754]" />
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[#172522]/70">
              {available} disponibili · {total} ville in totale
            </span>
          </div>
        </FadeIn>

        {/* Preview cards — always visible */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((villa, index) => (
            <FadeIn key={villa.id} delay={index * 0.06}>
              <VillaCard villa={villa} />
            </FadeIn>
          ))}
        </div>

        {/* Remaining cards — collapsible on mobile, always shown on sm+ */}
        <div
          className={cn(
            "grid gap-6 overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-out sm:!mt-6 sm:!max-h-none sm:!opacity-100 sm:grid-cols-2 lg:grid-cols-3",
            showAll ? "mt-6 max-h-[6000px] opacity-100" : "mt-0 max-h-0 opacity-0",
          )}
        >
          {rest.map((villa, index) => (
            <FadeIn key={villa.id} delay={(index % 3) * 0.06}>
              <VillaCard villa={villa} />
            </FadeIn>
          ))}
        </div>

        {/* Mobile-only expand / collapse control */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:hidden">
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[#172522]/40">
            {showAll ? total : PREVIEW} di {total} ville
          </span>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="group inline-flex items-center gap-2.5 border border-[#172522]/30 bg-[#172522] px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#172522]/90"
            aria-expanded={showAll}
          >
            {showAll ? "Mostra meno" : `Scopri tutte le ${total} ville`}
            <ChevronDown
              className={cn("size-4 transition-transform duration-300", showAll && "rotate-180")}
            />
          </button>
        </div>

        {/* Bridge to availability section */}
        <FadeIn delay={0.15} className="mt-10 flex justify-end">
          <a
            href="#disponibilita"
            className="text-xs uppercase tracking-[0.2em] text-[#172522]/45 transition hover:text-[#172522]"
          >
            Verifica la disponibilità →
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
