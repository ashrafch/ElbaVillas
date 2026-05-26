import { LeadForm } from "@/components/forms/LeadForm"

export function ContactLeadSection() {
  return (
    <section id="contatti" className="bg-background py-20 sm:py-24 md:py-32">
      <div className="container-premium grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Contatti</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Ricevi materiali, disponibilita e dettagli del progetto.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">
            Ti ricontatteremo con informazioni riservate, stato delle unita e prossimi passaggi per brochure o visita.
          </p>
          <div className="mx-auto mt-10 max-w-md border-y border-border py-5 text-sm leading-7 text-muted-foreground lg:mx-0">
            Le richieste vengono gestite con riservatezza e senza invii automatici promozionali.
          </div>
        </div>
        <div className="bg-[#efe7d8] p-5 sm:p-6 md:p-10">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
