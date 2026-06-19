import { FadeIn } from "@/components/motion/FadeIn"
import { VillaCard } from "@/components/sections/VillaCard"
import { villas } from "@/lib/villas"

// Featured villas shown in this editorial section.
// Non-featured villas appear only in the AvailabilitySection grid.
const featured = villas.filter((v) => v.featured)

export function VillasOverviewSection() {
  return (
    <section id="ville" className="bg-[#efe7d8] py-20 sm:py-24 md:py-32">
      <div className="container-premium">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Le ville</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">
            Quattro identità, un unico paesaggio.
          </h2>
          <p className="mt-6 text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
            Ogni unità mantiene indipendenza, orientamento e spazi esterni propri.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((villa, index) => (
            <FadeIn key={villa.id} delay={index * 0.05}>
              <VillaCard villa={villa} />
            </FadeIn>
          ))}
        </div>

        {/* Bridge to availability section */}
        <FadeIn delay={0.25} className="mt-10 flex justify-end">
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
