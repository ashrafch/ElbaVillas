"use client"

import { useReducedMotion } from "framer-motion"

interface MarqueeTextProps {
  items: string[]
  className?: string
  itemClassName?: string
  speed?: number
}

export function MarqueeText({ items, className = "", itemClassName = "", speed = 50 }: MarqueeTextProps) {
  const prefersReduced = useReducedMotion()
  const repeated = [...items, ...items]

  if (prefersReduced) {
    return (
      <div className={`flex flex-wrap items-center gap-x-8 ${className}`} aria-hidden="true">
        {items.map((item, i) => (
          <span key={i} className={itemClassName}>{item}</span>
        ))}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {repeated.map((item, i) => (
          <span key={i} className={`inline-flex shrink-0 items-center gap-8 px-8 ${itemClassName}`}>
            {item}
            <span className="opacity-30">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
