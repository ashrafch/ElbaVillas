import { projectMedia } from "@/lib/project-media"

export type GalleryCategory = "esterni" | "interni" | "vista" | "materiali" | "planimetrie"

export type GalleryItem = {
  id: string
  src: string
  alt: string
  category: GalleryCategory
  title: string
}

export const galleryItems: GalleryItem[] = [
  { id: "coastline", ...projectMedia.coast, category: "vista", title: "La costa dell’Elba" },
  { id: "facade", ...projectMedia.facade, category: "esterni", title: "Facciate e terrazze" },
  { id: "living", src: "/masterplan/living-a.jpg", alt: "Studio 3D del living con cucina a isola e vetrate", category: "interni", title: "Studio del living" },
  { id: "stone", ...projectMedia.pergola, category: "materiali", title: "Pietra e legno" },
  { id: "plan", ...projectMedia.upperFloor, category: "planimetrie", title: "Primo piano arredato" },
]
