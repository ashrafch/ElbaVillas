import { FadeIn } from "@/components/motion/FadeIn"
import { cn } from "@/lib/utils"

type Status = "done" | "current" | "upcoming"

interface Milestone {
  date: string
  label: string
  description: string
  status: Status
}

const milestones: Milestone[] = [
  {
    date: "Q3 2024",
    label: "Progetto approvato",
    description: "Permessi edilizi e valutazione d'impatto ambientale ottenuti",
    status: "done",
  },
  {
    date: "Q1 2025",
    label: "Cantiere avviato",
    description: "Fondamenta, struttura portante e opere di sbancamento",
    status: "done",
  },
  {
    date: "Q3 2025",
    label: "Struttura completata",
    description: "Coperture, partizioni interne e facciate in pietra locale",
    status: "current",
  },
  {
    date: "Q2 2026",
    label: "Finiture e giardini",
    description: "Pavimentazioni, piscine private e aree esterne progettate",
    status: "upcoming",
  },
  {
    date: "Q4 2026",
    label: "Consegna chiavi",
    description: "Collaudo finale e consegna alle prime famiglie",
    status: "upcoming",
  },
]

function Dot({ status }: { status: Status }) {
  if (status === "upcoming") {
    return (
      <div className="size-3 rounded-full border border-[#172522]/25 bg-transparent" />
    )
  }
  if (status === "current") {
    return (
      <div className="relative flex size-3 items-center justify-center">
        <div className="timeline-pulse absolute size-6 rounded-full bg-[#172522]/18" />
        <div className="relative size-3 rounded-full bg-[#172522]" />
      </div>
    )
  }
  return <div className="size-3 rounded-full bg-[#172522]" />
}

export function TimelineSection() {
  return (
    <section id="avanzamento" className="bg-[#efe7d8] py-20 sm:py-24 md:py-28">
      <div className="container-premium">

        <FadeIn className="mb-14 text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-[#172522]/45">
            Avanzamento lavori
          </p>
          <h2 className="mt-4 font-heading text-4xl font-medium text-[#172522] md:text-5xl">
            Il progetto prende forma.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#172522]/60">
            Ogni fase è documentata e verificabile. La consegna è prevista per fine 2026.
          </p>
        </FadeIn>

        {/* ── Desktop: timeline orizzontale ── */}
        <FadeIn delay={0.12} className="hidden lg:block">
          <div className="flex flex-col">

            {/* Date + label sopra */}
            <div className="grid grid-cols-5">
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center px-3 text-center"
                >
                  <span className={cn(
                    "text-[0.55rem] uppercase tracking-[0.22em]",
                    m.status === "upcoming" ? "text-[#172522]/30" : "text-[#172522]/50",
                  )}>
                    {m.date}
                  </span>
                  <span className={cn(
                    "mt-1.5 text-[0.75rem] font-medium leading-snug",
                    m.status === "upcoming" ? "text-[#172522]/35" : "text-[#172522]",
                  )}>
                    {m.label}
                  </span>
                  {m.status === "current" && (
                    <span className="mt-1 text-[0.5rem] uppercase tracking-[0.2em] text-[#172522]/45">
                      in corso
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Dot + linea */}
            <div className="relative my-7 grid grid-cols-5">
              <div className="absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 bg-[#172522]/12" />
              {milestones.map((m) => (
                <div key={`dot-${m.label}`} className="flex justify-center">
                  <Dot status={m.status} />
                </div>
              ))}
            </div>

            {/* Descrizione sotto */}
            <div className="grid grid-cols-5">
              {milestones.map((m) => (
                <p
                  key={`desc-${m.label}`}
                  className={cn(
                    "px-3 text-center text-[0.68rem] leading-5",
                    m.status === "upcoming" ? "text-[#172522]/28" : "text-[#172522]/55",
                  )}
                >
                  {m.description}
                </p>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Mobile: timeline verticale ── */}
        <FadeIn delay={0.12} className="lg:hidden">
          <div className="relative flex flex-col">
            <div className="absolute left-[5px] bottom-2 top-2 w-px bg-[#172522]/12" />
            {milestones.map((m) => (
              <div key={m.label} className="flex items-start gap-5 pb-9 last:pb-0">
                <div className="relative z-10 mt-0.5 shrink-0">
                  <Dot status={m.status} />
                </div>
                <div>
                  <span className={cn(
                    "text-[0.55rem] uppercase tracking-[0.22em]",
                    m.status === "upcoming" ? "text-[#172522]/30" : "text-[#172522]/50",
                  )}>
                    {m.date}
                    {m.status === "current" && (
                      <span className="ml-2 text-[#172522]/40">· in corso</span>
                    )}
                  </span>
                  <p className={cn(
                    "mt-0.5 text-sm font-medium leading-snug",
                    m.status === "upcoming" ? "text-[#172522]/38" : "text-[#172522]",
                  )}>
                    {m.label}
                  </p>
                  <p className={cn(
                    "mt-1 text-xs leading-5",
                    m.status === "upcoming" ? "text-[#172522]/28" : "text-[#172522]/55",
                  )}>
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
