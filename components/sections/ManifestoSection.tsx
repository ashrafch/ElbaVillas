"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const LINES = [
  { text: "Non si costruisce sul mare.", italic: false, delay: 0 },
  { text: "Si costruisce con il mare.",  italic: true,  delay: 0.18 },
]

function RevealLine({
  text,
  italic,
  delay,
  inView,
}: {
  text: string
  italic: boolean
  delay: number
  inView: boolean
}) {
  const words = text.split(" ")
  return (
    <span className={`block${italic ? " text-white/52" : ""}`}>
      {words.map((word, i) => (
        <span key={i} className="mr-[0.26em] inline-block overflow-hidden last:mr-0">
          <motion.span
            className={`inline-block origin-bottom${italic ? " italic pr-[0.1em]" : ""}`}
            initial={{ y: "105%", opacity: 0, scale: 0.86 }}
            animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.075,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15%" })

  return (
    <section ref={ref} className="relative bg-[#172522]">
      {/* Content area */}
      <div className="container-premium pt-20 pb-14 lg:pt-28 lg:pb-20">
        <div className="mx-auto max-w-5xl">
          <p
            className="font-heading text-[clamp(2.6rem,6.5vw,6rem)] leading-[1.08] tracking-[-0.025em] text-white"
            aria-label="Non si costruisce sul mare. Si costruisce con il mare."
          >
            {LINES.map((line) => (
              <RevealLine key={line.text} inView={inView} {...line} />
            ))}
          </p>

          <motion.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.85 }}
          >
            <div className="h-px w-8 bg-white/18" />
            <span className="text-[0.57rem] uppercase tracking-[0.32em] text-white/25">
              Elba Luce Villas · Isola d&apos;Elba
            </span>
          </motion.div>
        </div>
      </div>

      {/* Gradient fade into cream — removes hard jump before marquee */}
      <div className="h-14 bg-gradient-to-b from-[#172522] to-[#efe7d8]" />
    </section>
  )
}
