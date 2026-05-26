import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { RevealText } from "@/components/motion/RevealText"

const details = ["4 ville esclusive", "Isola d'Elba", "Vista mare", "Disponibilita limitata"]

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#172522] text-white">
      <Image src="/images/hero/elba-villas-hero.svg" alt="Ville contemporanee immerse nella luce dell'Isola d'Elba" fill priority className="object-cover opacity-80" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-[#172522]/72" />
      <div className="container-premium relative flex min-h-screen flex-col justify-end pb-10 pt-32">
        <div className="max-w-4xl pb-12">
          <p className="mb-5 text-xs uppercase tracking-[0.32em] text-white/70">Nuove residenze private</p>
          <h1 className="overflow-hidden font-heading text-5xl font-medium leading-[0.95] text-balance sm:text-7xl lg:text-8xl">
            <RevealText>Ville contemporanee immerse nella luce dell&apos;Isola d&apos;Elba</RevealText>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
            Un progetto residenziale esclusivo tra mare, natura e architettura mediterranea.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#progetto" className="inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm uppercase tracking-[0.18em] text-[#172522] transition hover:bg-[#efe3cf]">
              Scopri il progetto <ArrowRight className="size-4" />
            </a>
            <a href="#contatti" className="inline-flex h-12 items-center justify-center border border-white/35 px-6 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#172522]">
              Richiedi brochure
            </a>
          </div>
        </div>
        <div className="grid gap-px border-y border-white/15 bg-white/15 sm:grid-cols-4">
          {details.map((detail) => (
            <div key={detail} className="bg-[#172522]/20 px-4 py-4 text-xs uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
              {detail}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
