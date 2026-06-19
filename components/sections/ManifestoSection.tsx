"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const LINES = [
  { text: "Non si costruisce sul mare.", italic: false, delay: 0 },
  { text: "Si costruisce con il mare.", italic: true,  delay: 0.14 },
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
    <span className={`block${italic ? " text-[#172522]/55" : ""}`}>
      {words.map((word, i) => (
        <span key={i} className="mr-[0.28em] inline-block overflow-hidden last:mr-0">
          <motion.span
            className={`inline-block${italic ? " italic pr-[0.1em]" : ""}`}
            initial={{ y: "108%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 1.15,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.08,
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
  const inView = useInView(ref, { once: true, margin: "-18%" })

  return (
    <section ref={ref} className="relative bg-[#efe7d8] py-28 lg:py-44">
      <div className="absolute inset-x-0 top-0 h-px bg-[#172522]/10" />

      <div className="container-premium">
        <div className="mx-auto max-w-5xl">
          <p
            className="font-heading text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.1] tracking-[-0.025em] text-[#172522]"
            aria-label="Non si costruisce sul mare. Si costruisce con il mare."
          >
            {LINES.map((line) => (
              <RevealLine key={line.text} inView={inView} {...line} />
            ))}
          </p>

          <motion.div
            className="mt-10 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.9 }}
          >
            <div className="h-px w-10 bg-[#172522]/20" />
            <span className="text-[0.58rem] uppercase tracking-[0.32em] text-[#172522]/35">
              Elba Luce Villas · Isola d&apos;Elba
            </span>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-[#172522]/10" />
    </section>
  )
}
