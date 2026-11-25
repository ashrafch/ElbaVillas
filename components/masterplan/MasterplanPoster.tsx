"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

import { posterFor, type MasterplanView } from "@/lib/masterplan"

import styles from "./masterplan.module.css"

export function MasterplanPoster({ view, live, label }: { view: MasterplanView; live: boolean; label: string }) {
  const reducedMotion = useReducedMotion()
  const src = posterFor(view)
  const overview = view.mode === "overview"
  return (
    <div className={styles.poster}>
      <AnimatePresence initial={false}>
        <motion.picture key={src} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.46 }}>
          {overview && <source media="(max-width: 780px)" srcSet="/masterplan/overview-mobile.jpg" />}
          <Image src={src} alt={live ? "" : label} fill sizes="100vw" loading="eager"
            fetchPriority={overview ? "high" : "auto"} unoptimized />
        </motion.picture>
      </AnimatePresence>
    </div>
  )
}
