import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa privacy placeholder per Elba Luce Villas.",
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        <section className="bg-[#172522] pb-16 pt-32 text-white">
          <div className="container-premium max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Documento preliminare</p>
            <h1 className="mt-5 font-heading text-5xl font-medium md:text-7xl">Privacy Policy</h1>
            <p className="mt-6 text-lg leading-8 text-white/65">
              Testo placeholder da sostituire con informativa approvata prima della pubblicazione commerciale.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container-premium max-w-3xl space-y-8 text-base leading-8 text-muted-foreground">
            <div>
              <h2 className="font-heading text-3xl text-foreground">Titolare e finalita</h2>
              <p className="mt-3">
                I dati inviati tramite il form vengono usati esclusivamente per rispondere alla richiesta di informazioni sul progetto Elba Luce Villas.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-3xl text-foreground">Dati trattati</h2>
              <p className="mt-3">
                Nome, cognome, email, telefono se indicato, interesse, budget indicativo e messaggio libero. In v1 non e previsto salvataggio in database.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-3xl text-foreground">Conservazione</h2>
              <p className="mt-3">
                La conservazione effettiva dipende dal sistema email configurato. Prima del lancio pubblico va definito un periodo coerente con la normativa applicabile.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
