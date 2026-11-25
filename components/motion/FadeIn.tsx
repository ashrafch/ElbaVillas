"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

import { useMotionPreference } from "./use-motion-preference"

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

const offsets = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
}

export function FadeIn({ children, className, delay = 0, direction = "up" }: FadeInProps) {
  const reducedMotion = useMotionPreference()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, ...offsets[direction] }}
      animate={reducedMotion ? { opacity: 1, x: 0, y: 0 } : undefined}
      whileInView={reducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
