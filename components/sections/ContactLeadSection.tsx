import { LeadForm } from "@/components/forms/LeadForm"

export function ContactLeadSection() {
  return (
    <section id="contatti" className="bg-background py-24 md:py-32">
      <div className="container-premium grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Contatti</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Ricevi materiali, disponibilita e dettagli del progetto.</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Ti ricontatteremo con informazioni riservate, stato delle unita e prossimi passaggi per brochure o visita.
          </p>
          <div className="mt-10 border-l border-border pl-5 text-sm leading-7 text-muted-foreground">
            Nessun dato viene salvato in database in questa prima versione. Il form invia una email se Resend e configurato, altrimenti simula il successo lato server.
          </div>
        </div>
        <div className="bg-[#efe7d8] p-6 md:p-10">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
