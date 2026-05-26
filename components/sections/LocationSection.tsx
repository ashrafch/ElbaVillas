import { Anchor, MapPin, Sailboat, Trees } from "lucide-react"

const pois = [
  { icon: WavesIcon, label: "Spiagge e calette", text: "Accesso al mare e percorsi costieri nelle vicinanze." },
  { icon: Trees, label: "Natura", text: "Macchia mediterranea, trekking e panorami aperti." },
  { icon: Anchor, label: "Porti", text: "Collegamenti stagionali e servizi nautici dell'isola." },
  { icon: Sailboat, label: "Lifestyle", text: "Barca, borghi, ristorazione e tempi lenti." },
]

function WavesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M3 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    </svg>
  )
}

export function LocationSection() {
  return (
    <section id="location" className="bg-background py-20 sm:py-24 md:py-32">
      <div className="container-premium grid gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Location</p>
          <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Elba, senza fretta.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">
            Il valore della posizione non e solo nella distanza dal mare, ma nella qualita del tempo: luce, silenzio, borghi raggiungibili e un paesaggio che rimane protagonista.
          </p>
          <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
            {pois.map((poi) => (
              <div key={poi.label} className="border-l border-border pl-5">
                <poi.icon className="size-5 text-accent" />
                <h3 className="mt-4 font-heading text-2xl">{poi.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{poi.text}</p>
              </div>
            ))}
          </div>
          <a href="#contatti" className="mt-10 inline-flex min-h-12 w-full items-center justify-center bg-primary px-5 py-3 text-center text-xs uppercase tracking-[0.13em] text-primary-foreground transition hover:bg-primary/90 sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.18em]">
            Ricevi la posizione e il dossier completo
          </a>
        </div>
        <div className="relative min-h-[360px] overflow-hidden bg-[#d9d0bd] sm:min-h-[420px]">
          <div className="absolute inset-8 border border-[#172522]/20" />
          <div className="absolute left-[18%] top-[18%] h-[58%] w-[54%] rounded-[45%] border border-[#172522]/25" />
          <div className="absolute right-[20%] top-[30%] h-[42%] w-[34%] rounded-[50%] border border-[#2f6754]/35" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 bg-[#172522] px-4 py-3 text-white">
            <MapPin className="size-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Area riservata</span>
          </div>
        </div>
      </div>
    </section>
  )
}
