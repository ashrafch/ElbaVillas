import type { Villa } from "@/types/villa"

export const villas: Villa[] = [
  {
    id: "villa-azzurra",
    name: "Villa Azzurra",
    description:
      "Una residenza aperta verso il mare, con volumi essenziali e terrazze pensate per vivere la luce nelle diverse ore del giorno.",
    image: "/images/villas/villa-azzurra.svg",
    surface: "180 m2",
    bedrooms: 3,
    bathrooms: 3,
    outdoor: "Giardino privato e terrazza panoramica",
    pool: true,
    status: "available",
    highlights: ["Vista mare", "Piscina privata", "Grandi aperture", "Privacy naturale", "Materiali locali"],
  },
  {
    id: "villa-ginestra",
    name: "Villa Ginestra",
    description:
      "Spazi interni fluidi e aree esterne protette dalla vegetazione mediterranea, ideali per soggiorni lunghi e riservati.",
    image: "/images/villas/villa-ginestra.svg",
    surface: "165 m2",
    bedrooms: 3,
    bathrooms: 2,
    outdoor: "Patio ombreggiato, giardino e solarium",
    pool: true,
    status: "available",
    highlights: ["Patio abitabile", "Piscina privata", "Zona giorno luminosa", "Verde mediterraneo"],
  },
  {
    id: "villa-maestrale",
    name: "Villa Maestrale",
    description:
      "La villa piu raccolta del complesso, disegnata per offrire indipendenza, viste diagonali e un contatto diretto con la pietra.",
    image: "/images/villas/villa-maestrale.svg",
    surface: "150 m2",
    bedrooms: 2,
    bathrooms: 2,
    outdoor: "Terrazza vista mare e corte privata",
    pool: false,
    status: "reserved",
    highlights: ["Corte privata", "Vista aperta", "Pietra locale", "Manutenzione contenuta"],
  },
  {
    id: "villa-tramonto",
    name: "Villa Tramonto",
    description:
      "Posizionata per valorizzare le ore serali, unisce suite generose, cucina conviviale e un esterno scenografico ma discreto.",
    image: "/images/villas/villa-tramonto.svg",
    surface: "210 m2",
    bedrooms: 4,
    bathrooms: 4,
    outdoor: "Grande terrazza, piscina e giardino terrazzato",
    pool: true,
    status: "coming-soon",
    highlights: ["Tramonti", "Suite indipendente", "Piscina a sfioro", "Ampia terrazza"],
  },
]
