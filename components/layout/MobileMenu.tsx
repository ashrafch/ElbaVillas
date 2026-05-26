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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu principale"
          className="fixed inset-0 z-[80] overflow-y-auto bg-[#14231f] px-5 py-5 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/12 pb-5">
            <span className="font-heading text-2xl leading-none">{siteConfig.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="border border-white/15 bg-white/8 text-white hover:bg-white hover:text-[#14231f]"
              aria-label="Chiudi menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
          <nav className="mt-10 flex flex-col divide-y divide-white/10">
            {siteConfig.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-16 items-center justify-between font-heading text-3xl leading-none text-white transition hover:text-[#e8dcc8] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/35"
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                <span className="h-px w-10 bg-white/22" />
              </a>
            ))}
          </nav>
          <a
            href="#contatti"
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center bg-[#e8dcc8] px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-[#14231f] transition hover:bg-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/35"
            onClick={() => setOpen(false)}
          >
            Richiedi informazioni
          </a>
          <div className="mt-8 border-t border-white/10 pt-5 text-sm leading-6 text-white/62">
            {siteConfig.claim}
          </div>
        </div>
      ) : null}
    </div>
  )
}
