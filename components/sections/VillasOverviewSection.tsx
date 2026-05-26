import { FadeIn } from "@/components/motion/FadeIn"
import { VillaCard } from "@/components/sections/VillaCard"
import { villas } from "@/lib/villas"

export function VillasOverviewSection() {
  return (
    <section id="ville" className="bg-[#efe7d8] py-20 sm:py-24 md:py-32">
      <div className="container-premium">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Le ville</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Quattro identita, un unico paesaggio.</h2>
          <p className="mt-6 text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
            Ogni unita mantiene indipendenza, orientamento e spazi esterni propri. La struttura dati e gia pronta per futuri dettagli, modal e planimetrie.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {villas.map((villa, index) => (
            <FadeIn key={villa.id} delay={index * 0.05}>
              <VillaCard villa={villa} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
