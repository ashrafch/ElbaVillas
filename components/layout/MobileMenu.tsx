"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        aria-label="Apri menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-[80] bg-[#172522]/95 px-6 py-5 text-white backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl">{siteConfig.name}</span>
            <Button type="button" variant="ghost" size="icon" className="text-white hover:bg-white/10" aria-label="Chiudi menu" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </Button>
          </div>
          <nav className="mt-16 flex flex-col gap-6">
            {siteConfig.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-heading text-4xl leading-none text-white/90 transition hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#contatti"
            className="mt-12 inline-flex h-11 items-center border border-white/25 px-5 text-sm uppercase tracking-[0.24em]"
            onClick={() => setOpen(false)}
          >
            Richiedi informazioni
          </a>
        </div>
      ) : null}
    </div>
  )
}
