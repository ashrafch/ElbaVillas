"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"

interface CountUpProps {
  to: number
  decimals?: number
  className?: string
  /** Spring stiffness — lower = slower count. Default 70. */
  stiffness?: number
}

/**
 * Number that counts up from 0 to `to` the first time it scrolls into view.
 * Self-observing: drop it anywhere, no parent wiring needed.
 * Honours prefers-reduced-motion by rendering the final value immediately.
 */
export function CountUp({ to, decimals = 0, className, stiffness = 70 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion()

  const mv = useSpring(0, { stiffness, damping: 24, mass: 1 })
  const text = useTransform(mv, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString(),
  )

  useEffect(() => {
    if (!reduced && inView) mv.set(to)
  }, [inView, to, mv, reduced])

  if (reduced) {
    return (
      <span ref={ref} className={className}>
        {decimals > 0 ? to.toFixed(decimals) : to}
      </span>
    )
  }

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}
