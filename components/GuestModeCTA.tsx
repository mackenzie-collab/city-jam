import { ButtonLink } from "@/components/ui/button";
import VinylCard from "@/components/analog/VinylCard";

export default function GuestModeCTA() {
  return (
    <section className="cj-section bg-cj-bg">
      <VinylCard className="mx-auto max-w-4xl text-center">
        <span className="cj-badge mb-4 sm:mb-6">No commitment</span>
        <h2 className="cj-headline text-3xl sm:text-4xl md:text-5xl">
          Try before you{" "}
          <span className="text-label-amber">transmit</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-cj-text-muted sm:mt-6">
          Spin the dial as a guest. Explore the signal map. No account needed
          to feel the vibe — but you&apos;ll need one to connect.
        </p>
        <div className="cj-mobile-cta-stack mx-auto mt-8 max-w-md justify-center sm:mt-10">
          <ButtonLink href="/echo-roulette" variant="primary" size="lg" className="w-full">
            Try as guest
          </ButtonLink>
          <ButtonLink href="/register" variant="secondary" size="lg" className="w-full">
            Join the rebellion
          </ButtonLink>
        </div>
      </VinylCard>
    </section>
  );
}
