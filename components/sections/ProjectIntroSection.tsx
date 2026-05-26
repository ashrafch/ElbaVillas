import { Check } from "lucide-react"

import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxImage } from "@/components/motion/ParallaxImage"

const points = ["Architettura integrata nel paesaggio", "Privacy tra le unita", "Materiali naturali e durevoli", "Vista, luce e orientamento", "Spazi esterni realmente vivibili"]

export function ProjectIntroSection() {
  return (
    <section id="progetto" className="bg-background py-24 md:py-32">
      <div className="container-premium grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Il progetto</p>
          <h2 className="mt-5 font-heading text-4xl font-medium leading-tight text-balance md:text-6xl">
            Una presenza discreta, disegnata per appartenere all&apos;isola.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Le ville nascono come volumi essenziali, aperti alla luce e protetti dalla vegetazione. Pietra, intonaci caldi e grandi aperture costruiscono un rapporto misurato tra interno ed esterno, senza sovraccaricare il paesaggio.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                <Check className="mt-0.5 size-4 text-accent" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.1} direction="left">
          <ParallaxImage src="/images/architecture/architecture-elba.svg" alt="Architettura mediterranea integrata nel paesaggio" className="relative aspect-[4/5] overflow-hidden rounded-sm" />
        </FadeIn>
      </div>
    </section>
  )
}
