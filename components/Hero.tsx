import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "100%", label: "Audio-Only" },
  { value: "7 MIN", label: "Per Session" },
  { value: "0", label: "Photos Needed" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-cj-purple px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-8">The rebellion starts here</span>

        <h1 className="cj-heading-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
          Make Music
          <br />
          <span className="text-cj-gold-bright">Fun Again.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-cj-gold-muted md:text-lg">
          An app for musicians. Not fans. Not listeners. Musicians. Meet your
          people. Build your band. Make noise together.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/community">
            <Button variant="primary" size="lg">
              Enter the Community
            </Button>
          </Link>
          <Link href="/echo-roulette">
            <Button variant="secondary" size="lg">
              Try as Guest
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" size="lg">
              Join the Rebellion
            </Button>
          </Link>
        </div>

        <div className="mt-16 border-t border-cj-gold-border pt-8">
          <p className="mb-8 text-xs uppercase tracking-widest text-cj-gold-muted">
            Audio-Only · Anonymous · No Algorithms
          </p>
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-cj-gold md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-cj-gold-muted">
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
