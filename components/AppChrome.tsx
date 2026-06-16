"use client";

import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pb-20 md:pb-0">{children}</div>
      <MobileNav />
    </>
  );
}
