import { ArrowDown, ArrowRight } from "lucide-react"

import { VideoBackground } from "@/components/motion/VideoBackground"
import { RevealText } from "@/components/motion/RevealText"

const details = ["4 ville esclusive", "Isola d'Elba", "Vista mare", "Disponibilità limitata"]

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#172522] text-white">
      <VideoBackground
        src="/videos/elba-hero.mp4"
        poster="/images/hero/elba-villas-hero.svg"
      />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-[#172522]/85" />

      {/* Decorative horizontal rule */}
      <div className="absolute inset-x-6 top-28 hidden h-px bg-white/20 md:block" />

      {/* Decorative vertical line */}
      <div className="absolute bottom-32 left-1/2 hidden h-24 w-px -translate-x-1/2 bg-white/25 md:block" />

      <div className="container-premium relative flex min-h-[100svh] flex-col items-center justify-center pb-36 pt-28 text-center sm:pb-40 lg:pb-36 lg:pt-32 [@media(max-height:560px)]:pb-8 [@media(max-height:560px)]:pt-20">
        <div className="mx-auto max-w-5xl -translate-y-4 sm:-translate-y-6 lg:-translate-y-8 [@media(max-height:560px)]:translate-y-0">
          <p className="mb-5 text-[0.68rem] uppercase tracking-[0.3em] text-white/60 sm:text-xs sm:tracking-[0.36em]">
            Nuove residenze private · Isola d&apos;Elba
          </p>
          <h1 className="mx-auto max-w-5xl overflow-visible font-heading text-[clamp(3.1rem,8.2vw,6.7rem)] font-medium leading-[0.98] text-balance [@media(max-height:560px)]:max-w-4xl [@media(max-height:560px)]:text-[clamp(2.7rem,5.6vw,4.5rem)]">
            <RevealText>Ville contemporanee immerse nella luce dell&apos;Isola d&apos;Elba</RevealText>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/72 sm:mt-7 sm:text-lg sm:leading-8 [@media(max-height:560px)]:mt-4 [@media(max-height:560px)]:text-base">
            Un progetto residenziale esclusivo tra mare, natura e architettura mediterranea.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center [@media(max-height:560px)]:mt-6">
            <a
              href="#progetto"
              className="inline-flex h-12 items-center justify-center gap-2 bg-white px-5 text-xs uppercase tracking-[0.14em] text-[#172522] transition hover:bg-[#efe3cf] sm:px-6 sm:text-sm sm:tracking-[0.18em]"
            >
              Scopri il progetto <ArrowRight className="size-4" />
            </a>
            <a
              href="#contatti"
              className="inline-flex h-12 items-center justify-center border border-white/35 px-5 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#172522] sm:px-6 sm:text-sm sm:tracking-[0.18em]"
            >
              Richiedi brochure
            </a>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="hero-details-short absolute bottom-6 left-1/2 grid w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 grid-cols-2 gap-px border-y border-white/15 bg-white/10 sm:grid-cols-4 lg:bottom-12 [@media(max-height:560px)]:hidden">
          {details.map((detail) => (
            <div
              key={detail}
              className="hero-detail-cell bg-[#172522]/30 px-3 py-3 text-center text-[0.62rem] uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm sm:px-4 sm:py-4 sm:text-xs sm:tracking-[0.18em]"
            >
              {detail}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-32 left-6 hidden flex-col items-center gap-3 md:flex lg:bottom-28">
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/35 [writing-mode:vertical-lr]">Scorri</span>
          <ArrowDown className="size-4 animate-bounce text-white/35" />
        </div>
      </div>
    </section>
  )
}
