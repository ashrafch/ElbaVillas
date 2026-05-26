import { Check } from "lucide-react"

import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxImage } from "@/components/motion/ParallaxImage"

const points = ["Architettura integrata nel paesaggio", "Privacy tra le unita", "Materiali naturali e durevoli", "Vista, luce e orientamento", "Spazi esterni realmente vivibili"]

export function ProjectIntroSection() {
  return (
    <section id="progetto" className="bg-background py-20 sm:py-24 md:py-32">
      <div className="container-premium">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Il progetto</p>
          <h2 className="mt-5 font-heading text-4xl font-medium leading-tight text-balance md:text-6xl">
            Una presenza discreta, disegnata per appartenere all&apos;isola.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Le ville nascono come volumi essenziali, aperti alla luce e protetti dalla vegetazione. Pietra, intonaci caldi e grandi aperture costruiscono un rapporto misurato tra interno ed esterno, senza sovraccaricare il paesaggio.
          </p>
        </FadeIn>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <FadeIn direction="right">
            <div className="grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-3 border-t border-border pt-4 text-sm leading-6 text-foreground/80">
                <Check className="mt-0.5 size-4 text-accent" />
                <span>{point}</span>
              </div>
            ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1} direction="left">
            <div className="relative mx-auto max-w-[560px]">
              <ParallaxImage src="/images/architecture/architecture-elba.svg" alt="Architettura mediterranea integrata nel paesaggio" className="relative aspect-[4/5] overflow-hidden rounded-sm" />
              <div className="absolute -bottom-6 -left-4 hidden w-2/5 border border-background bg-[#172522] p-3 shadow-xl sm:block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ParallaxImage src="/images/gallery/stone-detail.svg" alt="Dettaglio materico di pietra locale" className="relative h-full overflow-hidden" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
