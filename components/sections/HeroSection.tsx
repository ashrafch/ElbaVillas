import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { RevealText } from "@/components/motion/RevealText"

const details = ["4 ville esclusive", "Isola d'Elba", "Vista mare", "Disponibilita limitata"]

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#172522] text-white">
      <Image src="/images/hero/elba-villas-hero.svg" alt="Ville contemporanee immerse nella luce dell'Isola d'Elba" fill priority className="object-cover opacity-80" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/18 to-[#172522]/76" />
      <div className="absolute inset-x-6 top-28 hidden h-px bg-white/25 md:block" />
      <div className="absolute bottom-28 left-1/2 hidden h-28 w-px -translate-x-1/2 bg-white/25 md:block" />
      <div className="container-premium relative flex min-h-[100svh] flex-col items-center justify-center pb-32 pt-28 text-center sm:pb-36 lg:pb-0 lg:pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 text-[0.68rem] uppercase tracking-[0.3em] text-white/72 sm:text-xs sm:tracking-[0.36em]">Nuove residenze private</p>
          <h1 className="mx-auto max-w-5xl overflow-hidden font-heading text-5xl font-medium leading-[0.95] text-balance sm:text-7xl lg:text-8xl">
            <RevealText>Ville contemporanee immerse nella luce dell&apos;Isola d&apos;Elba</RevealText>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 sm:mt-7 sm:text-lg sm:leading-8">
            Un progetto residenziale esclusivo tra mare, natura e architettura mediterranea.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center">
            <a href="#progetto" className="inline-flex h-12 items-center justify-center gap-2 bg-white px-5 text-xs uppercase tracking-[0.14em] text-[#172522] transition hover:bg-[#efe3cf] sm:px-6 sm:text-sm sm:tracking-[0.18em]">
              Scopri il progetto <ArrowRight className="size-4" />
            </a>
            <a href="#contatti" className="inline-flex h-12 items-center justify-center border border-white/35 px-5 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#172522] sm:px-6 sm:text-sm sm:tracking-[0.18em]">
              Richiedi brochure
            </a>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 grid w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 grid-cols-2 gap-px border-y border-white/15 bg-white/15 sm:grid-cols-4 lg:bottom-10">
          {details.map((detail) => (
            <div key={detail} className="bg-[#172522]/30 px-3 py-3 text-center text-[0.62rem] uppercase tracking-[0.16em] text-white/78 backdrop-blur-sm sm:px-4 sm:py-4 sm:text-xs sm:tracking-[0.18em]">
              {detail}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
