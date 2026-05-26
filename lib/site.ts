import type { SiteConfig } from "@/types/site"

export const siteConfig: SiteConfig = {
  name: "Elba Luce Villas",
  claim: "Residenze contemporanee tra mare, pietra e macchia mediterranea",
  description:
    "Un complesso di ville private pensato per chi cerca un rapporto autentico con la luce dell'Isola d'Elba, senza rinunciare a privacy, architettura e servizi.",
  location: "Isola d'Elba, Toscana",
  email: "info@elbalucevillas.it",
  phone: "+39 0565 000 000",
  navItems: [
    { label: "Progetto", href: "#progetto" },
    { label: "Ville", href: "#ville" },
    { label: "Location", href: "#location" },
    { label: "Gallery", href: "#gallery" },
    { label: "Investimento", href: "#investimento" },
    { label: "Contatti", href: "#contatti" },
  ],
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
}
