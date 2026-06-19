"use client"

import { motion, useReducedMotion } from "framer-motion"

interface SplitRevealProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  italic?: boolean
}

export function SplitReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.055,
  italic = false,
}: SplitRevealProps) {
  const reducedMotion = useReducedMotion()
  const words = children.split(" ")

  if (reducedMotion) {
    return (
      <span className={className} aria-label={children}>
        {children}
      </span>
    )
  }

  return (
    <span className={className} aria-label={children} role="text">
      {words.map((word, i) => (
        <span key={i} className={`inline-block overflow-hidden leading-[1.15]${italic ? " pr-[0.1em]" : ""}`}>
          <motion.span
            className={`inline-block${italic ? " italic" : ""}`}
            initial={{ y: "115%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.0,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}
