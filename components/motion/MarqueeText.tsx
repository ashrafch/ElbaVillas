interface MarqueeTextProps {
  items: string[]
  className?: string
  itemClassName?: string
  speed?: number
}

export function MarqueeText({ items, className = "", itemClassName = "", speed = 50 }: MarqueeTextProps) {
  const repeated = [...items, ...items]

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex whitespace-nowrap motion-reduce:flex-wrap motion-reduce:gap-x-8 motion-reduce:animate-none!"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {repeated.map((item, i) => (
          <span key={i}
            className={`inline-flex shrink-0 items-center gap-8 px-8 motion-reduce:px-0 ${i >= items.length ? "motion-reduce:hidden" : ""} ${itemClassName}`}>
            {item}
            <span className="opacity-30 motion-reduce:hidden">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
