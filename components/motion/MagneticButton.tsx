"use client"

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

export function MagneticButton({ children, className, ...props }: ComponentProps<typeof Button>) {
  const reducedMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 })

  return (
    <motion.span
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.span>
  )
}
