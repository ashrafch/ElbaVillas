"use client"

import { useEffect, useRef } from "react"

interface Tap {
  x: number
  strength: number
  createdAt: number // seconds
}

// Stokes wave: asymmetric crests, flat troughs — real ocean shape
function waveY(x: number, tSec: number, freq: number, speed: number, amp: number, phase = 0): number {
  const p = freq * x - speed * tSec + phase
  return (
    amp       * Math.sin(p) +
    amp * 0.3 * Math.sin(2 * p) +
    amp * 0.1 * Math.sin(3 * p)
  )
}

export function InteractiveWave() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const tapsRef    = useRef<Tap[]>([])
  const lastXRef   = useRef(-999)
  const animRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let cssW = 0
    let cssH = 0

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1
      cssW = canvas.offsetWidth
      cssH = canvas.offsetHeight
      canvas.width  = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(setSize)
    ro.observe(canvas)
    setSize()

    // Auto-ripples when section enters viewport
    const triggerAutoRipples = () => {
      const now = performance.now() / 1000
      tapsRef.current.push({ x: cssW * 0.28, strength: 26, createdAt: now })
      setTimeout(() => {
        tapsRef.current.push({ x: cssW * 0.68, strength: 22, createdAt: performance.now() / 1000 })
      }, 600)
      setTimeout(() => {
        tapsRef.current.push({ x: cssW * 0.48, strength: 18, createdAt: performance.now() / 1000 })
      }, 1200)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerAutoRipples()
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(canvas)

    const t0 = performance.now()

    const draw = () => {
      const tSec = (performance.now() - t0) / 1000
      const now  = performance.now() / 1000

      // Clean stale taps once per frame
      tapsRef.current = tapsRef.current.filter(t => now - t.createdAt < 5)

      ctx.clearRect(0, 0, cssW, cssH)

      const cy = cssH * 0.52

      // Long ocean swell: low frequency, slow speed
      const F  = 0.0038  // wavenumber — long waves
      const SP = 0.50    // phase speed

      // Build main wave points
      const pts: [number, number][] = []
      for (let x = 0; x <= cssW; x += 2) {
        let y = cy
          + waveY(x, tSec, F, SP, 20)           // primary swell
          + waveY(x, tSec, F * 1.6, SP * 0.75, 8, 1.1)  // secondary system
          + waveY(x, tSec, F * 2.9, SP * 0.45, 4, 2.6)  // chop

        // Tap ripples: concentric, decay+spread
        for (const tap of tapsRef.current) {
          const age      = now - tap.createdAt
          const decay    = Math.exp(-age / 1.8)
          const spread   = 35 + age * 70
          const envelope = Math.exp(-((x - tap.x) ** 2) / (2 * spread ** 2))
          y += tap.strength * decay * envelope * Math.sin(Math.PI * 2.2 * age - 0.4)
        }

        pts.push([x, y])
      }

      // ── Deep background swell (slower, dimmer, offset) ───────────────────
      ctx.beginPath()
      for (let i = 0; i < pts.length; i++) {
        const x = pts[i][0]
        const y = cy + 18 + waveY(x, tSec, F * 0.8, SP * 0.6, 14, 1.9)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.lineTo(cssW, cssH)
      ctx.lineTo(0, cssH)
      ctx.closePath()
      const deepFill = ctx.createLinearGradient(0, cy, 0, cssH)
      deepFill.addColorStop(0,   "rgba(23,100,85,0.07)")
      deepFill.addColorStop(0.5, "rgba(11,23,19,0.18)")
      deepFill.addColorStop(1,   "rgba(7,14,11,0.30)")
      ctx.fillStyle = deepFill
      ctx.fill()

      // ── Sea fill below main wave ─────────────────────────────────────────
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (const [x, y] of pts) ctx.lineTo(x, y)
      ctx.lineTo(cssW, cssH)
      ctx.lineTo(0, cssH)
      ctx.closePath()
      const seaFill = ctx.createLinearGradient(0, cy - 25, 0, cssH)
      seaFill.addColorStop(0,    "rgba(30,120,100,0.10)")
      seaFill.addColorStop(0.35, "rgba(15,50,40,0.22)")
      seaFill.addColorStop(1,    "rgba(7,14,11,0.40)")
      ctx.fillStyle = seaFill
      ctx.fill()

      // ── Main wave line ───────────────────────────────────────────────────
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (const [x, y] of pts) ctx.lineTo(x, y)
      ctx.strokeStyle = "rgba(255,255,255,0.22)"
      ctx.lineWidth   = 1.5
      ctx.stroke()

      // ── Foam flecks at wave crests ───────────────────────────────────────
      for (let i = 3; i < pts.length - 3; i++) {
        const [x, y] = pts[i]
        const yPrev  = pts[i - 2][1]
        const yNext  = pts[i + 2][1]
        if (y < yPrev && y < yNext && y < cy - 11) {
          const prominence = (yPrev + yNext) / 2 - y
          const alpha = Math.min(prominence / 18, 1) * 0.55
          ctx.beginPath()
          ctx.arc(x, y - 1, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      ro.disconnect()
      io.disconnect()
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left
    if (Math.abs(x - lastXRef.current) > 18) {
      tapsRef.current.push({ x, strength: 24, createdAt: performance.now() / 1000 })
      if (tapsRef.current.length > 10) tapsRef.current.shift()
      lastXRef.current = x
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left
    tapsRef.current.push({ x, strength: 38, createdAt: performance.now() / 1000 })
  }

  const handleMouseLeave = () => { lastXRef.current = -999 }

  return (
    <section aria-hidden className="relative bg-[#0b1713]">
      <canvas
        ref={canvasRef}
        className="block h-[190px] w-full cursor-crosshair touch-none"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="select-none text-[0.5rem] uppercase tracking-[0.35em] text-white/14">
          Isola d&apos;Elba · Mar Tirreno · 42° 46′ N
        </span>
      </div>
    </section>
  )
}
