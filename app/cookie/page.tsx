import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy placeholder per Elba Luce Villas.",
}

export default function CookiePage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        <section className="bg-[#172522] pb-16 pt-32 text-white">
          <div className="container-premium max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Documento preliminare</p>
            <h1 className="mt-5 font-heading text-5xl font-medium md:text-7xl">Cookie Policy</h1>
            <p className="mt-6 text-lg leading-8 text-white/65">
              Testo placeholder da completare quando verranno attivati analytics, tracking o strumenti marketing.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container-premium max-w-3xl space-y-8 text-base leading-8 text-muted-foreground">
            <div>
              <h2 className="font-heading text-3xl text-foreground">Cookie tecnici</h2>
              <p className="mt-3">
                Il sito puo usare cookie tecnici necessari al funzionamento della piattaforma e del deploy hosting.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-3xl text-foreground">Analytics</h2>
              <p className="mt-3">
                In questa fase non e stato configurato un sistema analytics nel codice. Se verra aggiunto, questa pagina dovra descriverlo in modo puntuale.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-3xl text-foreground">Consenso</h2>
              <p className="mt-3">
                Se verranno introdotti cookie non tecnici, sara necessario aggiungere un banner consenso conforme.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
