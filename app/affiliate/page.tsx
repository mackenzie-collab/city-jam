import type { Metadata } from "next";

import AffiliateLanding from "@/components/affiliate/AffiliateLanding";

export const metadata: Metadata = {
  title: "Affiliate Waitlist — City Jam",
  description:
    "Join the City Jam affiliate waitlist. Opens June 24, 2026. Earn £26.40 per active referral after a 30-minute onboarding.",
  openGraph: {
    title: "City Jam Affiliate Waitlist — Earn While You Jam",
    description:
      "Waitlist opens June 24. Launch July 29. Join the founding affiliate cohort and earn from Day 1.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "City Jam Affiliate Waitlist" }],
  },
};

export default function AffiliatePage() {
  return (
    <main id="main-content">
      <AffiliateLanding />
    </main>
  );
}
