import { FadeIn } from "@/components/motion/FadeIn"
import { VillaCard } from "@/components/sections/VillaCard"
import { villas } from "@/lib/villas"

export function VillasOverviewSection() {
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
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {villas.map((villa, index) => (
            <FadeIn key={villa.id} delay={(index % 3) * 0.06}>
              <VillaCard villa={villa} />
            </FadeIn>
          ))}
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
