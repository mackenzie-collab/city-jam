import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { STOCK } from "@/lib/brand-assets";

const stats = [
  { value: "100%", label: "Audio-Only" },
  { value: "7 MIN", label: "Per Session" },
  { value: "0", label: "Photos Needed" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
      <Image
        src={STOCK.hero}
        alt={STOCK.heroAlt}
        fill
        priority
        className="object-cover object-[center_30%] sm:object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-cj-purple/88 sm:bg-cj-purple/85" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-cj-purple via-cj-purple/70 to-cj-purple/50 sm:via-cj-purple/60 sm:to-cj-purple/40" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl">
        <span className="cj-badge mb-6 sm:mb-8">The rebellion starts here</span>

        <h1 className="cj-heading-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl">
          Make Music
          <br />
          <span className="text-cj-gold-bright">Fun Again.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cj-gold-muted sm:mt-8 sm:text-base md:text-lg">
          An app for musicians. Not fans. Not listeners. Musicians. Meet your
          people. Build your band. Make noise together.
        </p>

        <div className="cj-mobile-cta-stack mt-8 sm:mt-10">
          <Link href="/community" className="no-underline">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Enter the Community
            </Button>
          </Link>
          <Link href="/echo-roulette" className="no-underline">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Try as Guest
            </Button>
          </Link>
          <Link href="/register" className="no-underline">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              Join the Rebellion
            </Button>
          </Link>
        </div>

        <div className="mt-12 border-t border-cj-gold-border pt-6 sm:mt-16 sm:pt-8">
          <p className="mb-6 text-[10px] uppercase tracking-widest text-cj-gold-muted sm:mb-8 sm:text-xs">
            Audio-Only · Anonymous · No Algorithms
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-2xl text-cj-gold sm:text-3xl md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-widest text-cj-gold-muted sm:text-[10px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
