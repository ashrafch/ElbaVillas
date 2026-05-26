export type GalleryCategory = "esterni" | "interni" | "vista" | "materiali" | "planimetrie"

export type GalleryItem = {
  id: string
  src: string
  alt: string
  category: GalleryCategory
  title: string
}

export const galleryItems: GalleryItem[] = [
  { id: "coastline", src: "/images/gallery/elba-coastline.svg", alt: "Costa dell'Isola d'Elba vista dall'alto", category: "vista", title: "Linea di costa" },
  { id: "pool", src: "/images/gallery/private-pool.svg", alt: "Piscina privata affacciata sul paesaggio", category: "esterni", title: "Piscina e terrazza" },
  { id: "living", src: "/images/gallery/living-light.svg", alt: "Zona living luminosa con aperture verso l'esterno", category: "interni", title: "Luce interna" },
  { id: "stone", src: "/images/gallery/stone-detail.svg", alt: "Dettaglio di pietra locale e intonaco caldo", category: "materiali", title: "Pietra locale" },
  { id: "plan", src: "/images/gallery/plan-placeholder.svg", alt: "Planimetria preliminare di una villa", category: "planimetrie", title: "Schema distributivo" },
]
