import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxImage } from "@/components/motion/ParallaxImage"

const features = [
  ["01", "Pietra locale", "Basamenti e dettagli dialogano con la materia dell'isola."],
  ["02", "Interno-esterno", "Soglie ampie collegano living, terrazze e verde privato."],
  ["03", "Luce naturale", "Orientamenti e aperture studiati per massimizzare comfort visivo e termico."],
]

export function ArchitectureSection() {
  return (
    <section className="bg-[#f7f1e7] py-24 md:py-32">
      <div className="container-premium grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Staggered image pair — gentle scroll parallax */}
        <FadeIn direction="right" className="relative hidden gap-4 sm:grid-cols-2 lg:grid">
          <ParallaxImage
            src="/images/architecture/stone-detail.svg"
            alt="Dettaglio di materiali naturali"
            className="relative aspect-[4/5] overflow-hidden sm:mt-16"
          />
          <ParallaxImage
            src="/images/architecture/architecture-elba.svg"
            alt="Villa contemporanea con terrazza panoramica"
            className="relative aspect-[4/5] overflow-hidden"
          />
        </FadeIn>

        {/* Text + features list */}
        <FadeIn direction="left" delay={0.12}>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Architettura</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Materia, ombra e aperture profonde.</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Il progetto evita il gesto isolato: lavora per quote, schermature e continuità visive. Le terrazze diventano stanze all&apos;aperto, mentre la distanza tra le unità preserva la privacy.
          </p>
          <div className="mt-10 divide-y divide-border">
            {features.map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[56px_1fr] gap-4 py-5">
                <span className="font-heading text-4xl text-primary/30">{number}</span>
                <div>
                  <h3 className="font-heading text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
