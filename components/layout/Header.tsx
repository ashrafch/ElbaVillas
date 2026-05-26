"use client"

import { ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"

import { MobileMenu } from "@/components/layout/MobileMenu"
import { ScrollProgress } from "@/components/motion/ScrollProgress"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = scrolled || hovered

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <ScrollProgress />
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
          active
            ? "border-white/10 bg-[#172522]/86 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <div
          className={cn(
            "container-premium flex items-center justify-between text-white transition-all duration-500",
            active ? "h-18" : "h-20"
          )}
        >
          <a href="#" className="font-heading text-2xl tracking-wide">
            {siteConfig.name}
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {siteConfig.navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-xs uppercase tracking-[0.2em] text-white/80 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#contatti"
            className="hidden h-10 items-center gap-2 border border-white/25 px-4 text-xs uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-[#172522] md:inline-flex"
          >
            Richiedi informazioni
            <ArrowUpRight className="size-4" />
          </a>
          <MobileMenu />
        </div>
      </header>
    </>
  )
}
