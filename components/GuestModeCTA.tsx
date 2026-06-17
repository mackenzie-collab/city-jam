import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuestModeCTA() {
  return (
    <section className="cj-section bg-cj-purple">
      <div className="mx-auto max-w-4xl text-center">
        <span className="cj-badge mb-4 sm:mb-6">No Commitment</span>
        <h2 className="cj-heading-display text-4xl sm:text-5xl md:text-7xl">
          Try Before You
          <br />
          <span className="text-cj-gold-bright">Transmit.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-cj-gold-muted sm:mt-6 sm:text-base">
          Spin the dial as a guest. Explore the signal map. No account needed
          to feel the vibe — but you&apos;ll need one to connect.
        </p>
        <div className="cj-mobile-cta-stack mx-auto mt-8 max-w-md justify-center sm:mt-10">
          <Link href="/echo-roulette" className="no-underline">
            <Button variant="primary" size="lg" className="w-full">
              Try as Guest
            </Button>
          </Link>
          <Link href="/register" className="no-underline">
            <Button variant="secondary" size="lg" className="w-full">
              Join the Rebellion
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
