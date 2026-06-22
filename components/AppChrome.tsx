"use client";

import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import GlobalPlayerBar from "@/components/GlobalPlayerBar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="cj-app relative min-h-[100dvh] bg-cj-bg">
      <Navbar />
      <div className="relative z-[1] pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-16">
        {children}
      </div>
      <GlobalPlayerBar />
      <MobileNav />
    </div>
  );
}
