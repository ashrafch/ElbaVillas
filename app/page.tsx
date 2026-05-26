import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { ArchitectureSection } from "@/components/sections/ArchitectureSection"
import { ContactLeadSection } from "@/components/sections/ContactLeadSection"
import { DroneVideoSection } from "@/components/sections/DroneVideoSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { HeroSection } from "@/components/sections/HeroSection"
import { ImmersiveGallerySection } from "@/components/sections/ImmersiveGallerySection"
import { InvestmentSection } from "@/components/sections/InvestmentSection"
import { LifestyleSection } from "@/components/sections/LifestyleSection"
import { LocationSection } from "@/components/sections/LocationSection"
import { ProjectIntroSection } from "@/components/sections/ProjectIntroSection"
import { VillasOverviewSection } from "@/components/sections/VillasOverviewSection"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProjectIntroSection />
        <VillasOverviewSection />
        <DroneVideoSection />
        <ImmersiveGallerySection />
        <ArchitectureSection />
        <LocationSection />
        <LifestyleSection />
        <InvestmentSection />
        <ContactLeadSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
