import { ArrowUpRight } from "lucide-react"

import { FadeIn } from "@/components/motion/FadeIn"
import { InvestmentSimulatorModal } from "@/components/sections/InvestmentSimulatorModal"

const stats = [
  { value: "3ª", label: "Isola toscana per estensione" },
  { value: "100%", label: "Vista mare garantita" },
  { value: "Limitata", label: "Offerta residenziale" },
]

const items = [
  "Proprietà esclusiva in un contesto a offerta limitata",
  "Forte appeal turistico dell'Isola d'Elba",
  "Uso personale con potenziale locazione di qualità",
  "Valore legato a posizione, progetto e scarsità",
]

export function InvestmentSection() {
  return (
    <section id="investimento" className="bg-[#172522] py-20 text-white sm:py-24 md:py-32">
      <div className="container-premium">
        {/* Stats band */}
        <FadeIn className="mb-16 grid grid-cols-3 divide-x divide-white/12 border-y border-white/12">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center sm:px-8 sm:py-10">
              <p className="font-heading text-4xl font-medium sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-white/50 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeIn direction="right" className="text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Investimento</p>
            <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">
              Una scelta patrimoniale da valutare con misura.
            </h2>
          </FadeIn>

          <FadeIn direction="left" delay={0.1}>
            <p className="text-center text-base leading-7 text-white/65 sm:text-lg sm:leading-8 lg:text-left">
              Il progetto parla a chi desidera una casa privata in una destinazione riconoscibile e a chi valuta un bene con potenziale uso misto. La comunicazione resta prudente: nessuna promessa di rendimento, solo elementi concreti da approfondire nel dossier.
            </p>
            <div className="mt-8 grid gap-0">
              {items.map((item) => (
                <div key={item} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 py-4 text-sm leading-6 text-white/75">
                  <span>{item}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-white/25" />
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contatti"
                className="inline-flex h-12 items-center justify-center bg-white px-6 text-xs uppercase tracking-[0.18em] text-[#172522] transition hover:bg-[#efe3cf] sm:px-8"
              >
                Richiedi il dossier riservato
              </a>
              <InvestmentSimulatorModal />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
