import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { WhatsAppButton } from "@/components/layout/WhatsAppButton"
import { ArchitectureSection } from "@/components/sections/ArchitectureSection"
import { ContactLeadSection } from "@/components/sections/ContactLeadSection"
import { DroneVideoSection } from "@/components/sections/DroneVideoSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { HeroSection } from "@/components/sections/HeroSection"
import { ImmersiveGallerySection } from "@/components/sections/ImmersiveGallerySection"
import { InvestmentSection } from "@/components/sections/InvestmentSection"
import { KeyFiguresSection } from "@/components/sections/KeyFiguresSection"
import { LifestyleSection } from "@/components/sections/LifestyleSection"
import { LocationSection } from "@/components/sections/LocationSection"
import { ProjectIntroSection } from "@/components/sections/ProjectIntroSection"
import { TimelineSection } from "@/components/sections/TimelineSection"
import { VillasOverviewSection } from "@/components/sections/VillasOverviewSection"
import { MarqueeText } from "@/components/motion/MarqueeText"

const marqueeKeywords = [
  "Isola d'Elba",
  "Architettura mediterranea",
  "Privacy assoluta",
  "Vista mare",
  "Pietra locale",
  "Luce naturale",
  "Residenze esclusive",
  "Toscana",
  "Piscina privata",
  "Progetto contemporaneo",
]

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        {/* Brand keyword marquee strip */}
        <div className="overflow-hidden border-y border-border/50 bg-[#efe7d8] py-4">
          <MarqueeText
            items={marqueeKeywords}
            speed={55}
            itemClassName="text-[0.68rem] uppercase tracking-[0.28em] text-[#172522]/50"
          />
        </div>

        <ProjectIntroSection />
        <KeyFiguresSection />
        <VillasOverviewSection />
        <DroneVideoSection />
        <ImmersiveGallerySection />
        <ArchitectureSection />
        <LocationSection />
        <LifestyleSection />
        <InvestmentSection />
        <TimelineSection />
        <ContactLeadSection />
        <FaqSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
