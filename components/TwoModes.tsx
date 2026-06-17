import Link from "next/link";
import { Button } from "@/components/ui/button";
import CjIcon from "@/components/CjIcon";
import { ICONS } from "@/lib/brand-assets";

const modes = [
  {
    title: "Blind Echo",
    tag: "High Intent",
    icon: ICONS.lightning,
    description:
      "7-minute timed session. Deep prompts. A match gate at the end — both sides decide.",
    href: "/blind-echo",
  },
  {
    title: "Echo Roulette",
    tag: "Casual",
    icon: ICONS.frequencyDial,
    description:
      "Spin an analog radio dial, lock into a frequency, and get matched to whoever is live.",
    href: "/echo-roulette",
  },
];

export default function TwoModes() {
  return (
    <section className="cj-section bg-cj-purple">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-4 sm:mb-6">Pick Your Frequency</span>
        <h2 className="cj-heading-display text-4xl sm:text-5xl md:text-7xl">
          Two Modes.
          <br />
          <span className="text-cj-gold-bright">One Truth.</span>
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="cj-card flex flex-col border-cj-gold-border transition-colors hover:border-cj-gold/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <CjIcon src={mode.icon} alt="" size={32} />
                <span className="cj-badge text-[10px]">{mode.tag}</span>
              </div>
              <h3 className="font-display text-2xl uppercase text-cj-gold sm:text-3xl">
                {mode.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-cj-gold-muted">
                {mode.description}
              </p>
              <Link href={mode.href} className="mt-6 block no-underline sm:mt-8">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Enter
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
