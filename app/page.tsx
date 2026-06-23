import MarketingShell from "@/components/MarketingShell";
import HomeExperience from "@/components/home/HomeExperience";
import HomeLanding from "@/components/home/HomeLanding";
import AffiliateLanding from "@/components/affiliate/AffiliateLanding";
import AffiliateShell from "@/components/affiliate/AffiliateShell";

export default function HomePage() {
  return (
    <MarketingShell>
      <HomeExperience
        appContent={
          <AffiliateShell className="min-h-0 bg-[var(--color-bg-deep)]">
            <main id="main-content">
              <HomeLanding embedded />
            </main>
          </AffiliateShell>
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
