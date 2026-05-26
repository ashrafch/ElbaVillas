"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function DroneVideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="bg-[#172522] py-20 text-white md:py-28">
      <div className="container-premium">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Video drone</p>
            <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Sorvola il progetto e il suo rapporto con il mare.</h2>
            <p className="mt-6 text-lg leading-8 text-white/65">
              La sezione e predisposta per un futuro video drone, Vimeo o YouTube. Oggi mostra un fallback coerente con gli asset placeholder.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden bg-black">
            {playing ? (
              <video src="/videos/drone-elba-placeholder.mp4" poster="/images/hero/elba-villas-hero.svg" controls autoPlay className="h-full w-full object-cover" onError={() => setPlaying(false)} />
            ) : (
              <>
                <Image src="/images/hero/elba-villas-hero.svg" alt="Vista panoramica del progetto e del mare" fill className="object-cover opacity-80" sizes="(min-width: 1024px) 60vw, 100vw" />
                <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full border border-white/40 bg-white/12 text-white backdrop-blur transition hover:scale-105 hover:bg-white hover:text-[#172522]" aria-label="Riproduci video">
                  <Play className="ml-1 size-7 fill-current" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
