"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useRef, useState } from "react"

export function DroneVideoSection() {
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted((m) => !m)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#0d1e1a]">
      {/* Full-bleed cinematic video */}
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <video
          ref={videoRef}
          src="/videos/elba-drone.mp4"
          poster="/images/hero/elba-villas-hero.svg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover opacity-70"
        />

        {/* Directional gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1e1a]/85 via-[#0d1e1a]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e1a]/70 via-transparent to-transparent" />

        {/* Overlay copy */}
        <div className="absolute inset-0 flex items-end">
          <div className="container-premium pb-8 text-white sm:pb-12 md:pb-16">
            <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45 sm:text-xs">Video drone</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
              Sorvola il progetto e il suo rapporto con il mare.
            </h2>
          </div>
        </div>

        {/* Mute / unmute */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute right-4 top-4 flex size-10 items-center justify-center border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-[#172522] sm:right-6 sm:top-6 sm:size-12"
          aria-label={muted ? "Attiva audio" : "Disattiva audio"}
        >
          {muted ? <VolumeX className="size-4 sm:size-5" /> : <Volume2 className="size-4 sm:size-5" />}
        </button>
      </div>

      {/* Subtitle strip */}
      <div className="bg-[#172522] py-6 sm:py-8">
        <div className="container-premium">
          <p className="max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            Una vista panoramica pensata per mostrare distanze, orientamenti e relazione tra architettura, mare e vegetazione.
          </p>
        </div>
      </div>
    </section>
  )
}
