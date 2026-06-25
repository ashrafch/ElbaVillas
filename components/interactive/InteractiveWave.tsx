"use client"

import { useEffect, useRef, useState } from "react"

const SEA_SRC = "/images/wave/sea.jpg"
const MAX_PIXELS = 70000 // sim grid budget — keeps the per-frame loop cheap
const DAMPING = 0.962
const OFFSET = 1.5 // refraction strength (source px per unit slope)
const MAX_OFFSET = 14

export function InteractiveWave() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let curr = new Float32Array(0)
    let next = new Float32Array(0)
    let src: Uint8ClampedArray = new Uint8ClampedArray(0)
    let out: ImageData | null = null
    let raf = 0
    let visible = false
    let lastGX = -999
    let lastGY = -999
    let ambientT = 0

    const img = new Image()
    let ready = false

    const offscreen = document.createElement("canvas")
    const offctx = offscreen.getContext("2d", { willReadFrequently: true })!

    const buildGrid = () => {
      const cssW = Math.max(1, wrap.clientWidth)
      const cssH = Math.max(1, wrap.clientHeight)
      const k = Math.min(0.62, Math.sqrt(MAX_PIXELS / (cssW * cssH)))
      w = Math.max(64, Math.round(cssW * k))
      h = Math.max(48, Math.round(cssH * k))
      canvas.width = w
      canvas.height = h
      curr = new Float32Array(w * h)
      next = new Float32Array(w * h)
      out = ctx.createImageData(w, h)
      // sample the sea photo into the grid
      offscreen.width = w
      offscreen.height = h
      offctx.drawImage(img, 0, 0, w, h)
      src = offctx.getImageData(0, 0, w, h).data
      // seed output with the calm sea so borders / untouched pixels show it
      if (out) out.data.set(src)
    }

    const drawStatic = () => {
      // reduced-motion / fallback: just the calm sea
      ctx.drawImage(img, 0, 0, w, h)
    }

    const drop = (sx: number, sy: number, radius: number, power: number) => {
      const r = Math.round(radius)
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const px = sx + x
          const py = sy + y
          if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) continue
          const d = Math.sqrt(x * x + y * y)
          if (d > r) continue
          curr[py * w + px] += power * (1 - d / r)
        }
      }
    }

    const render = () => {
      if (!out) return
      const o = out.data
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x
          let xo = (curr[i - 1] - curr[i + 1]) * OFFSET
          let yo = (curr[i - w] - curr[i + w]) * OFFSET
          if (xo > MAX_OFFSET) xo = MAX_OFFSET
          else if (xo < -MAX_OFFSET) xo = -MAX_OFFSET
          if (yo > MAX_OFFSET) yo = MAX_OFFSET
          else if (yo < -MAX_OFFSET) yo = -MAX_OFFSET

          let sx = x + (xo | 0)
          let sy = y + (yo | 0)
          if (sx < 0) sx = 0
          else if (sx >= w) sx = w - 1
          if (sy < 0) sy = 0
          else if (sy >= h) sy = h - 1

          const si = (sy * w + sx) * 4
          const di = i * 4
          // specular sparkle on ripple slopes
          let shade = (xo + yo) * 1.6
          if (shade > 60) shade = 60
          else if (shade < -40) shade = -40
          o[di] = src[si] + shade
          o[di + 1] = src[si + 1] + shade
          o[di + 2] = src[si + 2] + shade
        }
      }
      ctx.putImageData(out, 0, 0)
    }

    const step = () => {
      // propagate the height field
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x
          let v = (curr[i - 1] + curr[i + 1] + curr[i - w] + curr[i + w]) * 0.5 - next[i]
          v *= DAMPING
          next[i] = v
        }
      }
      const tmp = curr
      curr = next
      next = tmp
      render()
    }

    const loop = (t: number) => {
      if (!visible) return
      // ambient drops keep the water alive and hint at interactivity
      if (!reduced && t - ambientT > 2200) {
        ambientT = t
        drop(
          2 + Math.floor((Math.sin(t * 0.0013) * 0.5 + 0.5) * (w - 4)),
          2 + Math.floor((Math.cos(t * 0.0021) * 0.5 + 0.5) * (h - 4)),
          Math.max(2, w * 0.012),
          120,
        )
      }
      step()
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (!ready) return
      if (reduced) {
        drawStatic()
        return
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      if (!ready) return
      buildGrid()
      if (reduced) drawStatic()
    })

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible) start()
        else cancelAnimationFrame(raf)
      },
      { threshold: 0.05 },
    )

    img.onload = () => {
      ready = true
      buildGrid()
      ro.observe(wrap)
      io.observe(wrap)
    }
    img.src = SEA_SRC

    // pointer interaction
    const toGrid = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: Math.round(((clientX - rect.left) / rect.width) * w),
        y: Math.round(((clientY - rect.top) / rect.height) * h),
      }
    }
    const onMove = (e: PointerEvent) => {
      if (reduced || !ready) return
      const { x, y } = toGrid(e.clientX, e.clientY)
      const dx = x - lastGX
      const dy = y - lastGY
      if (dx * dx + dy * dy < 2) return // throttle by distance
      lastGX = x
      lastGY = y
      drop(x, y, Math.max(2, w * 0.01), 70)
      if (!interacted) setInteracted(true)
    }
    const onDown = (e: PointerEvent) => {
      if (reduced || !ready) return
      const { x, y } = toGrid(e.clientX, e.clientY)
      drop(x, y, Math.max(3, w * 0.02), 320)
      if (!interacted) setInteracted(true)
    }

    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerdown", onDown)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerdown", onDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden bg-[#0b1713] select-none"
    >
      <div ref={wrapRef} className="relative h-[210px] w-full sm:h-[260px]">
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-none [image-rendering:auto]"
          style={{ cursor: "crosshair" }}
        />
        {/* blend into the dark sections above and below */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0d1e1a] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#172522] to-transparent" />

        {/* interaction hint */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            interacted ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[0.6rem] uppercase tracking-[0.32em] text-white/55">
            Tocca l&apos;acqua
          </span>
        </div>

        {/* required attribution for the sea photograph */}
        <span className="pointer-events-none absolute bottom-2 right-3 text-[0.5rem] tracking-wide text-white/25">
          mare · Š. Burdulis, CC BY-SA
        </span>
      </div>
    </section>
  )
}
