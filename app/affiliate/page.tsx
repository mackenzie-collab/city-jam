import type { Metadata } from "next";

import AffiliateLanding from "@/components/affiliate/AffiliateLanding";

export const metadata: Metadata = {
  title: "Affiliate Program — City Jam",
  description:
    "Join the City Jam affiliate program. Earn £26.40 per active referral. Apply before July 22, 2026.",
  openGraph: {
    title: "City Jam Affiliate Program — Earn While You Jam",
    description:
      "Be part of the movement. Launch with us on July 29, 2026 and start earning from Day 1.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "City Jam Affiliate Program" }],
  },
};

export default function AffiliatePage() {
  return (
    <main id="main-content">
      <AffiliateLanding />
    </main>
  );
}
