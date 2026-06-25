"use client"

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

import { MagneticButton } from "@/components/interactive/MagneticButton"
import { SplitReveal } from "@/components/motion/SplitReveal"
import { VideoBackground } from "@/components/motion/VideoBackground"

const stats = ["9 ville esclusive", "Isola d'Elba", "Vista mare", "Disponibilità limitata"]

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

export function HeroSection() {
  const reducedMotion = useReducedMotion()

  // ── Mouse parallax ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const cfg  = { stiffness: 40, damping: 26 }
  const sX   = useSpring(rawX, cfg)
  const sY   = useSpring(rawY, cfg)

  // Layer 0 — background gradients: move opposite, largest travel (furthest plane)
  const bgX  = useTransform(sX, v => v * -0.70)
  const bgY  = useTransform(sY, v => v * -0.70)
  // Layer 1 — mid decoration (vertical accent, coordinates): medium travel
  const mdX  = useTransform(sX, v => v * -0.30)
  const mdY  = useTransform(sY, v => v * -0.30)
  // Layer 2 — text content: follows cursor (closest plane)
  const txX  = useTransform(sX, v => v * 0.45)
  const txY  = useTransform(sY, v => v * 0.45)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 55)
    rawY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 36)
  }

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-[#0d1e1a] text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0) }}
    >
      <VideoBackground
        src="/videos/elba-hero.mp4"
        poster="/images/hero/elba-villas-hero.svg"
        className="opacity-60"
      />

      {/* Multi-layer cinematic gradient — moves opposite to cursor (depth) */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-3%] bg-gradient-to-b from-black/60 via-black/10 to-[#0d1e1a]/90" />
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-3%] bg-gradient-to-r from-[#0d1e1a]/50 via-transparent to-transparent" />

      {/* Thin architectural frame — top */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-white/15"
        initial={reducedMotion ? false : { scaleX: 0, transformOrigin: "left" }}
        animate={reducedMotion ? undefined : { scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      {/* Thin vertical accent — left side (mid parallax layer) */}
      <motion.div
        style={{ x: mdX, y: mdY }}
        className="absolute left-6 top-28 hidden md:block lg:left-10"
      >
        <motion.div
          className="h-32 w-px bg-white/20"
          initial={reducedMotion ? false : { scaleY: 0, transformOrigin: "top" }}
          animate={reducedMotion ? undefined : { scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        />
      </motion.div>

      {/* Coordinates — left micro-detail (mid parallax layer) */}
      <motion.div style={{ x: mdX, y: mdY }} className="absolute left-6 bottom-48 hidden md:flex lg:left-10 lg:bottom-52">
      <FadeUp
        delay={1.2}
        className="flex flex-col items-center gap-3"
      >
        <span className="[writing-mode:vertical-lr] rotate-180 text-[0.58rem] uppercase tracking-[0.3em] text-white/30">
          42° 46′ N · 10° 11′ E
        </span>
        <div className="h-10 w-px bg-white/20" />
      </FadeUp>
      </motion.div>

      <div className="container-premium relative flex min-h-[100svh] flex-col justify-between pb-0 pt-24">

        {/* Main content — vertically centered, floats toward cursor */}
        <motion.div
          style={{ x: txX, y: txY }}
          className="flex flex-1 flex-col items-start justify-center pb-32 pt-8 sm:items-center sm:text-center lg:pb-40"
        >

          {/* Eyebrow */}
          <FadeUp delay={0.15} className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-white/35 sm:w-12" />
              <span className="text-[0.62rem] uppercase tracking-[0.36em] text-white/55 sm:text-[0.68rem]">
                Nuove residenze private · Isola d'Elba
              </span>
              <div className="hidden h-px w-8 bg-white/35 sm:block sm:w-12" />
            </div>
          </FadeUp>

          {/* Headline — editorial three-line with italic centre */}
          <h1 className="mx-auto max-w-5xl text-left text-[clamp(2.8rem,7.2vw,6.2rem)] font-medium leading-[0.97] tracking-[-0.02em] sm:text-center [@media(max-height:560px)]:text-[clamp(2.2rem,5vw,4rem)]">
            <span className="block overflow-hidden">
              <SplitReveal delay={0.3} stagger={0.06} className="font-heading text-white">
                Ville contemporanee
              </SplitReveal>
            </span>
            <span className="block overflow-hidden">
              <SplitReveal
                delay={0.52}
                stagger={0.065}
                italic
                className="font-heading text-white/82"
              >
                immerse nella luce
              </SplitReveal>
            </span>
            <span className="block overflow-hidden">
              <SplitReveal delay={0.74} stagger={0.06} className="font-heading text-white">
                dell&apos;Isola d&apos;Elba
              </SplitReveal>
            </span>
          </h1>

          {/* Subtitle */}
          <FadeUp delay={1.05} className="mx-auto mt-7 max-w-xl sm:mt-8">
            <p className="text-left text-base leading-[1.85] text-white/58 sm:text-center sm:text-lg">
              Un progetto residenziale esclusivo tra mare,<br className="hidden sm:block" /> natura e architettura mediterranea.
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={1.22} className="mt-9 sm:mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              {/* Primary — magnetic */}
              <MagneticButton>
                <a
                  href="#progetto"
                  className="group relative inline-flex h-12 items-center gap-3 overflow-hidden bg-white px-6 text-[0.7rem] uppercase tracking-[0.18em] text-[#172522] transition-colors duration-300 hover:bg-[#ede7d9] sm:px-8"
                >
                  <span>Scopri il progetto</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </MagneticButton>

              {/* Secondary — refined text link, magnetic */}
              <MagneticButton strength={0.22}>
                <a
                  href="#contatti"
                  className="group inline-flex h-12 items-center gap-2 px-2 text-[0.7rem] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white sm:px-0"
                >
                  <span className="relative">
                    Richiedi brochure
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-white/50 transition-all duration-300 group-hover:w-full" />
                  </span>
                </a>
              </MagneticButton>
            </div>
          </FadeUp>
        </motion.div>

        {/* Bottom stats bar — pinned */}
        <FadeUp
          delay={1.4}
          className="hero-details-short w-full [@media(max-height:560px)]:hidden"
        >
          <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat}
                className="bg-[#0d1e1a]/55 px-4 py-4 text-center text-[0.6rem] uppercase tracking-[0.18em] text-white/55 backdrop-blur-sm sm:px-5 sm:py-5 sm:text-xs sm:tracking-[0.2em]"
              >
                {stat}
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      {/* Scroll cue — bottom right */}
      <FadeUp
        delay={1.5}
        className="absolute right-6 bottom-24 hidden flex-col items-center gap-2 md:flex lg:right-10 lg:bottom-28 [@media(max-height:560px)]:hidden"
      >
        <motion.div
          className="h-8 w-px bg-white/30"
          animate={reducedMotion ? undefined : { scaleY: [1, 0.4, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[0.58rem] uppercase tracking-[0.3em] text-white/30">scroll</span>
      </FadeUp>
    </section>
  )
}
