import { FadeIn } from "@/components/motion/FadeIn"

const figures = [
  { value: "4", label: "Ville esclusive", sub: "unità indipendenti" },
  { value: "210", unit: "m²", label: "Superficie massima", sub: "spazi interni" },
  { value: "4", label: "Piscine private", sub: "una per villa" },
  { value: "2026", label: "Anno di consegna", sub: "prenotazioni aperte" },
]

export function KeyFiguresSection() {
  return (
    <section className="border-y border-[#172522]/10 bg-[#efe7d8]">
      <div className="container-premium">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#172522]/10 md:grid-cols-4 md:divide-y-0">
          {figures.map((fig, i) => (
            <FadeIn key={fig.label} delay={i * 0.08} className="px-6 py-10 text-center sm:px-8 sm:py-14">
              <p className="font-heading text-5xl font-medium text-[#172522] sm:text-6xl md:text-7xl">
                {fig.value}
                {fig.unit && <span className="font-heading text-3xl sm:text-4xl">{fig.unit}</span>}
              </p>
              <p className="mt-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#172522]/80 sm:text-xs">{fig.label}</p>
              <p className="mt-1 text-xs text-[#172522]/45">{fig.sub}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
