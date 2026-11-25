"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import { useMotionPreference } from "./use-motion-preference"

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ParallaxImage({ src, alt, className, priority }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useMotionPreference()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18])

  return (
    <div ref={ref} className={className}>
      <motion.div className="absolute inset-0 scale-105" style={{ y: reducedMotion ? 0 : y }}>
        <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </motion.div>
    </div>
  )
}
