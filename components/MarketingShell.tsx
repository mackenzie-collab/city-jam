import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cj-app relative min-h-screen">
      <div className="cj-grain" aria-hidden="true" />
      <Navbar />
      <div className="relative z-[1] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
