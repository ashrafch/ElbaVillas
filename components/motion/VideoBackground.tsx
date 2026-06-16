"use client"

import { useReducedMotion } from "framer-motion"

interface VideoBackgroundProps {
  src: string
  poster?: string
  className?: string
}

export function VideoBackground({ src, poster, className = "" }: VideoBackgroundProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced && poster) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover ${className}`} />
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay={!prefersReduced}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  )
}
