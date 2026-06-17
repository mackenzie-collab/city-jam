"use client";

import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="cj-app relative min-h-screen">
      <div className="cj-grain" aria-hidden="true" />
      <Navbar />
      <div className="relative z-[1] pb-20 md:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
