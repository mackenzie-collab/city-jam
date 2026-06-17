import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MusicianGallery from "@/components/MusicianGallery";
import CommunityPreview from "@/components/CommunityPreview";
import TwoModes from "@/components/TwoModes";
import FourSteps from "@/components/FourSteps";
import ZeroVisualBias from "@/components/ZeroVisualBias";
import MoreToolsGrid from "@/components/MoreToolsGrid";
import GuestModeCTA from "@/components/GuestModeCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MusicianGallery />
      <CommunityPreview />
      <TwoModes />
      <FourSteps />
      <ZeroVisualBias />
      <MoreToolsGrid />
      <GuestModeCTA />
      <Footer />
    </main>
  );
}
