import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuestModeCTA() {
  return (
    <section className="bg-cj-purple px-6 py-24 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <span className="cj-badge mb-6">No Commitment</span>
        <h2 className="cj-heading-display text-5xl md:text-7xl">
          Try Before You
          <br />
          <span className="text-cj-gold-bright">Transmit.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-cj-gold-muted">
          Spin the dial as a guest. Explore the signal map. No account needed
          to feel the vibe — but you&apos;ll need one to connect.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/echo-roulette">
            <Button variant="primary" size="lg">
              Try as Guest
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Join the Rebellion
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
