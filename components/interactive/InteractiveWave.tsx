"use client"

import { useEffect, useRef } from "react"

interface Ripple {
  x: number
  strength: number
  createdAt: number // seconds from performance.now()
}

function getWaveY(x: number, tSec: number, ripples: Ripple[], now: number): number {
  // Three overlapping sine harmonics — natural ocean surface
  const base =
    18 * Math.sin(0.012 * x + 0.75 * tSec) +
    10 * Math.sin(0.022 * x - 0.45 * tSec + 1.3) +
     6 * Math.sin(0.037 * x + 1.1  * tSec + 2.9)

  // Mouse ripples: Gaussian-enveloped sine that decays and spreads
  const rippleContrib = ripples.reduce((sum, r) => {
    const age = now - r.createdAt
    if (age > 4) return sum
    const decay    = Math.exp(-age / 1.4)
    const spread   = 55 + age * 90            // widens as it propagates
    const envelope = Math.exp(-((x - r.x) ** 2) / (2 * spread ** 2))
    const wave     = Math.sin(Math.PI * 1.9 * age - 0.5)
    return sum + r.strength * decay * envelope * wave
  }, 0)

  return base + rippleContrib
}

export function InteractiveWave() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const ripplesRef = useRef<Ripple[]>([])
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

    const t0 = performance.now()

    const draw = () => {
      const tSec = (performance.now() - t0) / 1000
      const now  = performance.now() / 1000
      ctx.clearRect(0, 0, cssW, cssH)

      // Clean stale ripples
      ripplesRef.current = ripplesRef.current.filter(r => now - r.createdAt < 4)

      const cy = cssH * 0.52 // center baseline slightly below mid

      // Build path points
      const pts: [number, number][] = []
      for (let x = 0; x <= cssW; x += 1.5) {
        pts.push([x, cy + getWaveY(x, tSec, ripplesRef.current, now)])
      }

      // ── Fill below main wave (sea gradient) ─────────────────────────────
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (const [x, y] of pts) ctx.lineTo(x, y)
      ctx.lineTo(cssW, cssH)
      ctx.lineTo(0, cssH)
      ctx.closePath()
      const fillGrad = ctx.createLinearGradient(0, cy - 30, 0, cssH)
      fillGrad.addColorStop(0, "rgba(255,255,255,0.045)")
      fillGrad.addColorStop(1, "rgba(255,255,255,0.008)")
      ctx.fillStyle = fillGrad
      ctx.fill()

      // ── Deep background wave (secondary harmonic, lower opacity) ─────────
      ctx.beginPath()
      for (let x = 0; x <= cssW; x += 2) {
        const y = cy + 22 + getWaveY(x, tSec - 0.4, [], now) * 0.55
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = "rgba(255,255,255,0.045)"
      ctx.lineWidth   = 1
      ctx.stroke()

      // ── Main wave line ────────────────────────────────────────────────────
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (const [x, y] of pts) ctx.lineTo(x, y)
      ctx.strokeStyle = "rgba(255,255,255,0.20)"
      ctx.lineWidth   = 1.5
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left
    if (Math.abs(x - lastXRef.current) > 10) {
      ripplesRef.current.push({ x, strength: 28, createdAt: performance.now() / 1000 })
      if (ripplesRef.current.length > 12) ripplesRef.current.shift()
      lastXRef.current = x
    }
  }

  const handleMouseLeave = () => { lastXRef.current = -999 }

  return (
    <section aria-hidden className="relative bg-[#0b1713]">
      <canvas
        ref={canvasRef}
        className="block h-[170px] w-full cursor-none touch-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {/* Ultra-subtle geo label */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="select-none text-[0.5rem] uppercase tracking-[0.35em] text-white/14">
          Isola d&apos;Elba · Mar Tirreno · 42° 46′ N
        </span>
      </div>
    </section>
  )
}
