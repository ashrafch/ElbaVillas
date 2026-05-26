"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

export function RevealText({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <span className={className}>
      <motion.span
        className="block"
        initial={reducedMotion ? false : { y: "110%", opacity: 0 }}
        animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
