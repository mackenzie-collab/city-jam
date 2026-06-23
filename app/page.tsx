import MarketingShell from "@/components/MarketingShell";
import Hero from "@/components/Hero";
import BlindEchoFeature from "@/components/home/BlindEchoFeature";
import HomeExperience from "@/components/home/HomeExperience";
import SignalMapSection from "@/components/home/SignalMapSection";
import ScenePreviewCarousel from "@/components/home/ScenePreviewCarousel";
import MusicianGallery from "@/components/MusicianGallery";
import TwoModes from "@/components/TwoModes";
import FourSteps from "@/components/FourSteps";
import ZeroVisualBias from "@/components/ZeroVisualBias";
import MoreToolsGrid from "@/components/MoreToolsGrid";
import GuestModeCTA from "@/components/GuestModeCTA";
import Footer from "@/components/Footer";
import AffiliateLanding from "@/components/affiliate/AffiliateLanding";
import AffiliateShell from "@/components/affiliate/AffiliateShell";

export default function HomePage() {
  return (
    <MarketingShell>
      <HomeExperience
        appContent={
          <main className="relative z-[1] bg-cj-bg">
            <Hero />
            <BlindEchoFeature />
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
        }
        affiliateContent={
          <AffiliateShell className="min-h-0 bg-[var(--color-bg-deep)]">
            <main id="main-content">
              <AffiliateLanding embedded />
            </main>
          </AffiliateShell>
        }
      />
    </MarketingShell>
  );
}
