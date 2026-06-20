import Link from "next/link";
import VinylDisc from "@/components/analog/VinylDisc";
import SignalMapAmbient from "@/components/SignalMapAmbient";
import { Button } from "@/components/ui/button";
import VinylLogo from "@/components/VinylLogo";

const stats = [
  { value: "100%", label: "Audio-Only", bar: 100 },
  { value: "7 MIN", label: "Per Session", bar: 70 },
  { value: "0", label: "Photos Needed", bar: 0 },
];

function RecordDot() {
  return (
    <span className="inline-flex items-baseline" aria-hidden>
      <VinylDisc size={14} className="ml-0.5 inline-block align-middle" />
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
      <div className="absolute inset-0 bg-cj-purple-dark" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-br from-cj-purple-map via-cj-purple-dark to-wax-burgundy/30"
        aria-hidden
      />
      <SignalMapAmbient className="mix-blend-screen" opacity={0.28} />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="cj-page-enter order-2 lg:order-1">
          <VinylLogo size={72} className="mb-6 justify-start sm:mb-8" priority />
          <span className="cj-badge mb-6 sm:mb-8">The rebellion starts here</span>

          <h1 className="cj-headline text-5xl uppercase sm:text-6xl md:text-7xl lg:text-8xl">
            Make Music
            <br />
            Fun{" "}
            <span className="text-cj-gold-bright">
              Again<RecordDot />
            </span>
          </h1>
          <p className="sr-only">Make Music Fun Again.</p>

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

          <div className="mt-12 sm:mt-16">
            <p className="cj-label-stamp mb-4 text-[10px] sm:text-xs">
              Audio-Only · Anonymous · No Algorithms
            </p>
            <div className="cj-vu-meter rounded-lg overflow-hidden">
              {stats.map((stat) => (
                <div key={stat.label} className="cj-vu-segment">
                  <div className="cj-vu-bar" aria-hidden>
                    <div
                      className="cj-vu-bar-fill"
                      style={{ width: `${stat.bar}%` }}
                    />
                  </div>
                  <p className="font-mono text-xl text-cj-gold sm:text-2xl md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-nav text-cj-gold-muted sm:text-[10px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="order-1 flex items-center justify-center lg:order-2"
          aria-hidden
        >
          <div className="group relative">
            <VinylDisc size={280} spinning className="sm:!w-[320px] sm:!h-[320px] md:!w-[380px] md:!h-[380px]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-24 origin-right rotate-[-25deg] rounded-full bg-gradient-to-r from-cj-gold/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
