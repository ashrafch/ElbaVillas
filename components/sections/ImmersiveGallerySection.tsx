"use client"

import Image from "next/image"
import { useState } from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { galleryItems, type GalleryItem } from "@/lib/gallery"

export function ImmersiveGallerySection() {
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  return (
    <section id="gallery" className="bg-background py-20 sm:py-24 md:py-32">
      <div className="container-premium">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="mx-auto max-w-2xl text-center lg:sticky lg:top-28 lg:h-fit lg:text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Gallery</p>
            <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Immagini pensate come un dossier visivo.</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Esterni, interni, viste, materiali e planimetrie sono gia organizzati per accogliere render e fotografie reali.
            </p>
          </div>
          <div className="grid auto-rows-[230px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:auto-rows-[260px]">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`group relative overflow-hidden text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${index === 0 || index === 3 ? "sm:row-span-2" : ""}`}
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 40vw, 100vw" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="block text-xs uppercase tracking-[0.22em] text-white/55">{item.category}</span>
                  <span className="mt-1 block font-heading text-2xl">{item.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-5xl bg-[#172522] p-2 text-white" showCloseButton>
          {selected ? (
            <>
              <DialogTitle className="sr-only">{selected.title}</DialogTitle>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={selected.src} alt={selected.alt} fill className="object-cover" sizes="90vw" />
              </div>
              <p className="px-2 pb-2 text-sm text-white/70">{selected.title}</p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
