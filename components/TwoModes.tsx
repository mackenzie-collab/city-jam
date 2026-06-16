import Link from "next/link";
import { Zap, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

const modes = [
  {
    title: "Blind Echo",
    tag: "High Intent",
    icon: Zap,
    description:
      "7-minute timed session. Deep prompts. A match gate at the end — both sides decide.",
    href: "/blind-echo",
  },
  {
    title: "Echo Roulette",
    tag: "Casual",
    icon: Shuffle,
    description:
      "Spin an analog radio dial, lock into a frequency, and get matched to whoever is live.",
    href: "/echo-roulette",
  },
];

export default function TwoModes() {
  return (
    <section className="bg-cj-purple px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-6">Pick Your Frequency</span>
        <h2 className="cj-heading-display text-5xl md:text-7xl">
          Two Modes.
          <br />
          <span className="text-cj-gold-bright">One Truth.</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="cj-card flex flex-col border-cj-gold-border transition-colors hover:border-cj-gold/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <mode.icon className="h-8 w-8 text-cj-gold" />
                <span className="cj-badge text-[10px]">{mode.tag}</span>
              </div>
              <h3 className="font-display text-3xl uppercase text-cj-gold">
                {mode.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-cj-gold-muted">
                {mode.description}
              </p>
              <Link href={mode.href} className="mt-8">
                <Button variant="secondary">Enter</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
