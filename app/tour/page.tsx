import type { Metadata } from "next"

import { VirtualTour } from "@/components/tour/VirtualTour"

export const metadata: Metadata = {
  title: "I dintorni delle residenze",
  description:
    "Spiagge, cale, borghi e natura che circondano Elba Luce Villas: il contesto quotidiano del progetto, in immagini reali dell'Isola d'Elba.",
  alternates: { canonical: "/tour" },
}

export default function TourPage() {
  return <VirtualTour />
}
