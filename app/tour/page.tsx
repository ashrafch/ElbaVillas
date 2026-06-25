import type { Metadata } from "next"

import { VirtualTour } from "@/components/tour/VirtualTour"

export const metadata: Metadata = {
  title: "I luoghi dell'Isola d'Elba",
  description:
    "Borghi, porti e spiagge dell'Isola d'Elba in immagini reali: lo scenario in cui nascono le residenze Elba Luce Villas.",
  alternates: { canonical: "/tour" },
}

export default function TourPage() {
  return <VirtualTour />
}
