import MarketingShell from "@/components/MarketingShell";
import Hero from "@/components/Hero";
import SignalMapSection from "@/components/home/SignalMapSection";
import ScenePreviewCarousel from "@/components/home/ScenePreviewCarousel";
import MusicianGallery from "@/components/MusicianGallery";
import TwoModes from "@/components/TwoModes";
import FourSteps from "@/components/FourSteps";
import ZeroVisualBias from "@/components/ZeroVisualBias";
import MoreToolsGrid from "@/components/MoreToolsGrid";
import GuestModeCTA from "@/components/GuestModeCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <MarketingShell>
      <main className="relative z-[1] bg-cj-bg">
        <Hero />
        <SignalMapSection />
        <ScenePreviewCarousel />
        <MusicianGallery />
        <TwoModes />
        <FourSteps />
        <ZeroVisualBias />
        <MoreToolsGrid />
        <GuestModeCTA />
        <Footer />
      </main>
    </MarketingShell>
  );
}
