import Link from "next/link";
import GrainOverlay from "@/components/GrainOverlay";
import PosterMotif from "@/components/PosterMotif";
import BarcodeDivider from "@/components/BarcodeDivider";
import SideABStrip from "@/components/SideABStrip";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

const sideA = [
  { label: "Audio-only", value: "No photos. No vanity metrics." },
  { label: "Anonymous", value: "Matched by sound, not looks." },
  { label: "7 minutes", value: "Deep sessions with a match gate." },
];

const sideB = [
  { label: "Echo Roulette", value: "Spin the dial. Go live instantly." },
  { label: "Project Match", value: "Post what your track needs." },
  { label: "Zero algorithms", value: "Musicians, not content farms." },
];

export default function Hero() {
  return (
    <section className="cj-section-poster relative flex min-h-[92dvh] flex-col justify-center overflow-hidden px-0 py-16 sm:py-20 md:py-24">
      <div className="absolute inset-0 bg-brand-black" aria-hidden />
      <div className="absolute inset-0 bg-brand-purple/40" aria-hidden />
      <GrainOverlay warm intensity={0.04} />

      <div className="absolute bottom-0 left-3 top-24 hidden w-6 sm:left-6 md:block">
        <BarcodeDivider orientation="vertical" className="h-full opacity-80" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="cj-page-enter relative z-[2] lg:col-span-7 lg:pb-8">
            <BrandLogo size={44} className="mb-6 sm:mb-8" priority />
            <span className="cj-badge mb-5 sm:mb-6">
              The rebellion starts here
            </span>

            <h1 className="cj-poster-headline">
              Make music{" "}
              <span className="text-brand-gold">fun again</span>
            </h1>

            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-cj-text-muted sm:mt-8 md:text-lg">
              An app for musicians. Not fans. Not listeners. Musicians. Meet your
              people. Build your band. Make noise together.
            </p>

            <div className="cj-mobile-cta-stack mt-8 sm:mt-10">
              <Link href="/community" className="no-underline">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Enter the community
                </Button>
              </Link>
              <Link href="/echo-roulette" className="no-underline">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Try as guest
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative z-[1] flex min-h-[320px] items-center justify-center lg:col-span-5 lg:min-h-[520px]">
            <PosterMotif variant="hero" dominant opacity={1} className="lg:-mr-4" />
          </div>
        </div>

        <SideABStrip sideA={sideA} sideB={sideB} className="relative z-[2] mt-12 sm:mt-16" compact />
      </div>
    </section>
  );
}
