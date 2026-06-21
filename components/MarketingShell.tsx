import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import GlobalPlayerBar from "@/components/GlobalPlayerBar";
import GrainOverlay from "@/components/GrainOverlay";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <AudioPlayerProvider>
      <div className="cj-app relative min-h-[100dvh] cj-page-enter bg-brand-black">
        <GrainOverlay className="fixed inset-0 z-0" intensity={0.03} />
        <Navbar />
        <div className="relative z-[1] pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-16">
          {children}
        </div>
        <GlobalPlayerBar />
        <MobileNav />
      </div>
    </AudioPlayerProvider>
  );
}
