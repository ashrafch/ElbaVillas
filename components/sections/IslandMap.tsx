"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export type MapPoi = {
  id: string
  label: string
  x: number // island-space coordinate (viewBox 0..1000)
  y: number // island-space coordinate (viewBox 0..640)
}

// Stylised but recognisable silhouette of the Isola d'Elba:
// wide western massif (Monte Capanne), northern Portoferraio promontory,
// south-eastern Capoliveri / Calamita peninsula.
const ELBA =
  "M 62 332 C 78 268 120 232 168 220 C 215 200 268 192 322 196 C 372 200 408 232 446 256 " +
  "C 470 230 498 140 548 126 C 580 117 596 168 628 192 C 706 196 792 190 872 218 " +
  "C 912 232 940 252 928 288 C 918 320 900 344 866 354 C 856 392 852 470 822 530 " +
  "C 808 556 780 548 766 510 C 752 470 726 446 690 442 C 656 438 642 430 612 424 " +
  "C 560 414 512 410 470 396 C 446 416 430 470 392 492 C 326 520 252 512 192 484 " +
  "C 138 458 96 414 74 376 C 64 360 58 346 62 332 Z"

const VIEW_W = 1000
const VIEW_H = 640
const CX = 500
const CY = 336

// Where the development sits — discreet, at the island's central waist.
const MARKER = { x: 450, y: 300 }

const ease = [0.22, 1, 0.36, 1] as const

// Transform that scales the coastline about the island centroid — used to
// build the bathymetric (sea-depth) contour halo.
function contour(s: number) {
  return `translate(${(CX * (1 - s)).toFixed(1)} ${(CY * (1 - s)).toFixed(1)}) scale(${s})`
}

export function IslandMap({
  pois,
  active,
}: {
  pois: MapPoi[]
  active: string | null
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const activePoi = pois.find((p) => p.id === active) ?? null

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Mappa stilizzata dell'Isola d'Elba con i punti di interesse"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {/* ── Bathymetric contour halo (static, faint) ───────────────────── */}
      {[1.085, 1.165, 1.255].map((s, i) => (
        <path
          key={s}
          d={ELBA}
          transform={contour(s)}
          fill="none"
          stroke="#2f6754"
          strokeWidth={1}
          strokeOpacity={0.16 - i * 0.04}
        />
      ))}

      {/* ── Island-shaped sonar pulse (the "live" signal) ──────────────── */}
      <motion.path
        d={ELBA}
        fill="none"
        stroke="#2f6754"
        strokeWidth={1.6}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 0 }}
        animate={inView ? { scale: [1, 1.3], opacity: [0.4, 0] } : {}}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeOut" }}
      />

      {/* ── Landmass ───────────────────────────────────────────────────── */}
      <motion.path
        d={ELBA}
        fill="#c8bb98"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, ease }}
      />
      <motion.path
        d={ELBA}
        fill="none"
        stroke="#172522"
        strokeOpacity={0.78}
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />

      {/* ── Monte Capanne relief (west massif) ─────────────────────────── */}
      <g stroke="#172522" strokeOpacity={0.16} fill="none" strokeWidth={1}>
        <ellipse cx={232} cy={332} rx={86} ry={62} />
        <ellipse cx={232} cy={330} rx={52} ry={37} />
        <ellipse cx={232} cy={328} rx={23} ry={15} />
      </g>
      <path d="M232 312 l10 18 h-20 z" fill="#172522" fillOpacity={0.45} />

      {/* ── Connector line: reserved area → active POI ─────────────────── */}
      {activePoi && (
        <motion.line
          key={activePoi.id}
          x1={MARKER.x}
          y1={MARKER.y}
          x2={activePoi.x}
          y2={activePoi.y}
          stroke="#2f6754"
          strokeWidth={2}
          strokeDasharray="7 7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 0.45, ease }}
        />
      )}

      {/* ── POI markers ────────────────────────────────────────────────── */}
      {pois.map((poi) => {
        const isActive = active === poi.id
        return (
          <g key={poi.id}>
            <motion.circle
              cx={poi.x}
              cy={poi.y}
              r={16}
              fill="#2f6754"
              animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 0.18 : 0 }}
              transition={{ duration: 0.3, ease }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.circle
              cx={poi.x}
              cy={poi.y}
              fill={isActive ? "#2f6754" : "#172522"}
              animate={{ r: isActive ? 9 : 6 }}
              transition={{ duration: 0.3, ease }}
            />
            <circle cx={poi.x} cy={poi.y} r={3} fill="#efe7d8" />
            <motion.text
              x={poi.x}
              y={poi.y - 18}
              textAnchor="middle"
              fontSize={17}
              letterSpacing={2.5}
              fill="#172522"
              style={{ textTransform: "uppercase" }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {poi.label}
            </motion.text>
          </g>
        )
      })}

      {/* ── Reserved-area marker ───────────────────────────────────────── */}
      <motion.circle
        cx={MARKER.x}
        cy={MARKER.y}
        r={6}
        fill="none"
        stroke="#172522"
        strokeWidth={1.5}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: [0.6, 2.6], opacity: [0.55, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle cx={MARKER.x} cy={MARKER.y} r={5} fill="#172522" />
      <g transform={`translate(${MARKER.x + 14} ${MARKER.y - 11})`}>
        <rect width={168} height={24} fill="#172522" rx={1} />
        <text x={12} y={16} fontSize={12.5} letterSpacing={2.5} fill="#ffffff" style={{ textTransform: "uppercase" }}>
          Area riservata
        </text>
      </g>

      {/* ── Compass rose (top-right) ───────────────────────────────────── */}
      <g transform="translate(905 92)" stroke="#172522" strokeOpacity={0.4} fill="none">
        <circle r={26} strokeWidth={1} />
        <line x1={0} y1={-26} x2={0} y2={26} strokeWidth={1} />
        <line x1={-26} y1={0} x2={26} y2={0} strokeWidth={1} />
        <path d="M0 -26 L5 -6 L0 -12 L-5 -6 Z" fill="#172522" fillOpacity={0.55} stroke="none" />
      </g>
      <text x={905} y={48} textAnchor="middle" fontSize={13} fill="#172522" fillOpacity={0.55} letterSpacing={2}>
        N
      </text>

      {/* ── Cartographic ticks ─────────────────────────────────────────── */}
      <text x={64} y={596} fontSize={13} fill="#172522" fillOpacity={0.4} letterSpacing={2}>
        42°47′N · 10°14′E
      </text>
      <g stroke="#172522" strokeOpacity={0.4} strokeWidth={1}>
        <line x1={840} y1={592} x2={930} y2={592} />
        <line x1={840} y1={587} x2={840} y2={597} />
        <line x1={930} y1={587} x2={930} y2={597} />
      </g>
      <text x={885} y={584} textAnchor="middle" fontSize={12} fill="#172522" fillOpacity={0.4} letterSpacing={2}>
        5 km
      </text>
    </svg>
  )
}
