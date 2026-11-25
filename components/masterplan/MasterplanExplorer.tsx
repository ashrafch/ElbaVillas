"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Compass, Minus, Plus } from "lucide-react"

import { chapters, interiorViews, type Home } from "@/lib/masterplan"
import { projectMedia } from "@/lib/project-media"

import { MasterplanPoster } from "./MasterplanPoster"
import styles from "./masterplan.module.css"
import { overview, useMasterplanController } from "./use-masterplan-controller"

type Plot = { id: string; name: string }
const plotNumber = (index: number) => String(index + 1).padStart(2, "0")

export function MasterplanExplorer({ plots }: { plots: Plot[] }) {
  const { view, live, stage, dissolve, title, markerButtons, runtime, track, pinned, changeView } = useMasterplanController()

  const atOverview = view.mode === "overview"
  const plot = atOverview ? 1 : view.plot
  const interior = view.mode !== "overview" && view.mode !== "facade"
  const activeHome = interior ? view.home : undefined
  const canOrbit = atOverview || view.mode === "facade" || view.mode === "plan"
  const selectPlot = (index: number, focus = false) => changeView({ mode: "facade", plot: index }, focus)
  const selectHome = (home: Home) => changeView({ mode: interior ? view.mode : "living", plot, home })
  const room = interiorViews.find(({ id }) => id === view.mode)
  const locationLabel = view.mode === "stairs" ? "Scala verso il primo piano" : room && `${room.label} · ${room.level}`
  const label = atOverview ? "Vista aerea delle nove ville affacciate sul mare"
    : interior ? `${locationLabel} · Residenza ${view.home}`
    : "Facciata di una villa bifamiliare con coppi, pietra e logge"

  return (
    <section id="home" ref={track} className={styles.journey} aria-label="Esplora Elba Luce Villas">
      <div ref={pinned} className={styles.hero} data-view={view.mode}>
        <MasterplanPoster view={view} live={live} label={label} />
        <div ref={stage} className={styles.canvas} data-live={live} />
        <div className={styles.referenceCoast} aria-hidden="true">
          <Image src={projectMedia.coast.src} alt="" fill sizes="100vw" unoptimized />
        </div>
        <div ref={dissolve} className={styles.dissolve} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />

        {atOverview && live && plots.map((item, i) => (
          <button key={item.id} ref={(element) => { markerButtons.current[i] = element }}
            type="button" className={styles.marker} onClick={() => selectPlot(i, true)}
            aria-label={`Esplora ${item.name}`} title={item.name}
          >
            {plotNumber(i)}
          </button>
        ))}

        <div className={styles.topBar}>
          {atOverview ? (
            <span className={styles.tag}><Compass size={15} aria-hidden="true" /> Masterplan interattivo</span>
          ) : (
            <button type="button" className={styles.back} onClick={() => changeView(overview, true)}>
              <ChevronLeft size={17} aria-hidden="true" /> Tutte le ville
            </button>
          )}
          <div className={styles.stageLabel}>
            <span className={styles.concept}>Prototipo architettonico</span>
            <div className={styles.storyLine} aria-hidden="true"><span /></div>
          </div>
        </div>

        {live && canOrbit && (
          <div className={styles.zoom} role="group" aria-label="Ingrandimento della vista">
            <button type="button" onClick={() => runtime.current?.zoom(0.82)} aria-label="Ingrandisci"><Plus size={17} /></button>
            <button type="button" onClick={() => runtime.current?.zoom(1.22)} aria-label="Rimpicciolisci"><Minus size={17} /></button>
          </div>
        )}

        <div className={styles.bottom} data-overview={atOverview}>
          <div className={styles.intro}>
            <h1 ref={atOverview ? title : null} tabIndex={atOverview ? -1 : undefined} className={atOverview ? styles.title : "sr-only"}>
              Nove ville,<br /><em>un solo orizzonte.</em>
            </h1>
            {atOverview ? (
              <p className={styles.description}>Residenze bifamiliari tra mare e macchia mediterranea, all’Isola d’Elba.</p>
            ) : (
              <>
                <p className={styles.eyebrow}>Villa {plotNumber(plot)} <span>·</span> {interior ? label : "Facciata"}</p>
                <h2 ref={title} tabIndex={-1} className={styles.title}>{plots[plot].name}</h2>
              </>
            )}
          </div>

          {atOverview ? (
            <div className={styles.overviewControls}>
              <p className={styles.hint}>
                <span className="motion-reduce:hidden">Scorri per entrare o scegli una villa.</span>
                <span className="hidden motion-reduce:inline">Scegli una villa da esplorare.</span>
              </p>
              <div className={styles.plotList} role="group" aria-label="Le nove ville">
                {plots.map((item, i) => (
                  <button key={item.id} type="button" onClick={() => selectPlot(i, true)}
                    aria-label={item.name} title={item.name}
                  >
                    {plotNumber(i)}
                  </button>
                ))}
              </div>
              <div className={styles.panelLinks}>
                <button type="button" className={styles.projectLink} onClick={() => selectPlot(plot, true)}>Inizia la visita</button>
                <a className={styles.projectLink} href="#progetto">Il progetto</a>
              </div>
            </div>
          ) : (
            <div className={styles.villaControls}>
              <div className={styles.villaBar}>
                <div className={styles.homeTabs} role="group" aria-label="Scegli vista o residenza">
                  <button type="button" aria-pressed={view.mode === "facade"} onClick={() => selectPlot(plot)}>Facciata</button>
                  {(["A", "B"] as const).map((home) => (
                    <button key={home} type="button" aria-pressed={activeHome === home} onClick={() => selectHome(home)}>
                      Residenza {home}
                    </button>
                  ))}
                </div>
                <div className={styles.neighbors} role="group" aria-label="Cambia villa">
                  <button type="button" aria-label="Villa precedente" onClick={() => selectPlot((plot + plots.length - 1) % plots.length)}>
                    <ChevronLeft size={17} />
                  </button>
                  <button type="button" aria-label="Villa successiva" onClick={() => selectPlot((plot + 1) % plots.length)}>
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
              {interior && (
                <div className={styles.roomTabs} role="group" aria-label={`Ambienti residenza ${view.home}`}>
                  {interiorViews.map(({ id, label }) => (
                    <button key={id} type="button" aria-pressed={view.mode === id}
                      onClick={() => changeView({ mode: id, plot, home: view.home })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.panelLinks}>
                <a className={styles.projectLink} href={view.mode === "terrace" ? "#progetto" : "#contatti"}>
                  {view.mode === "terrace" ? "Scopri il progetto" : "Richiedi una visita"}
                </a>
                {live && interior && view.mode !== "plan" && <span className={styles.lookHint}>Trascina per guardarti intorno</span>}
              </div>
            </div>
          )}
        </div>
        <span className={styles.seaCredit}>Mare · Š. Burdulis, CC BY-SA</span>
        <span className="sr-only" aria-live="polite">{atOverview ? "Panoramica" : `${plots[plot].name}, ${label}`}</span>
        {view.mode !== "plan" && (
          <span className="sr-only">Tappa {chapters.findIndex(({ mode }) => mode === view.mode) + 1} di {chapters.length}</span>
        )}
      </div>
    </section>
  )
}
