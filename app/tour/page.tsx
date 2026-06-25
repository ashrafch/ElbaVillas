import type { Metadata } from "next"

import { VirtualTour } from "@/components/tour/VirtualTour"

export const metadata: Metadata = {
  title: "Giro virtuale dell'Isola d'Elba",
  description:
    "Un tour virtuale tra borghi, porti e spiagge dell'Isola d'Elba: mappe interattive e Street View dei luoghi reali attorno a Elba Luce Villas.",
  alternates: { canonical: "/tour" },
}

export default function TourPage() {
  return <VirtualTour />
}
