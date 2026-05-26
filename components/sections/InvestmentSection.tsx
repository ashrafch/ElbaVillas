import { ArrowUpRight } from "lucide-react"

const items = ["Proprieta esclusiva in un contesto a offerta limitata", "Forte appeal turistico dell'Isola d'Elba", "Uso personale con potenziale locazione di qualita", "Valore legato a posizione, progetto e scarsita"]

export function InvestmentSection() {
  return (
    <section id="investimento" className="bg-[#efe7d8] py-20 sm:py-24 md:py-32">
      <div className="container-premium grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Investimento</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Una scelta patrimoniale da valutare con misura.</h2>
        </div>
        <div>
          <p className="text-center text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8 lg:text-left">
            Il progetto parla a chi desidera una casa privata in una destinazione riconoscibile e a chi valuta un bene con potenziale uso misto. La comunicazione resta prudente: nessuna promessa di rendimento, solo elementi concreti da approfondire nel dossier.
          </p>
          <div className="mt-8 grid gap-3">
            {items.map((item) => (
              <div key={item} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#172522]/15 py-4 text-sm leading-6">
                <span>{item}</span>
                <ArrowUpRight className="size-4 shrink-0 text-primary/50" />
              </div>
            ))}
          </div>
          <a href="#contatti" className="mt-9 inline-flex min-h-12 w-full items-center justify-center bg-primary px-5 py-3 text-center text-xs uppercase tracking-[0.13em] text-primary-foreground transition hover:bg-primary/90 sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.18em]">
            Richiedi il dossier riservato
          </a>
        </div>
      </div>
    </section>
  )
}
