import GrainOverlay from "@/components/GrainOverlay";
import PosterMotif from "@/components/PosterMotif";
import BarcodeDivider from "@/components/BarcodeDivider";

const steps = [
  {
    number: "01",
    title: "Build your sound profile",
    description:
      "Pick instruments, genres, who you seek. No photo. No real name.",
  },
  {
    number: "02",
    title: "Choose your mode",
    description: "Deep 7-min session or quick dial spin.",
  },
  {
    number: "03",
    title: "Connect anonymously",
    description:
      "Matched by musical taste alone. You hear them, they hear you.",
  },
  {
    number: "04",
    title: "Transmit or fade",
    description:
      "Mutual transmit — profiles revealed. Fade — disappear cleanly.",
  },
];

export default function FourSteps() {
  return (
    <section className="cj-section cj-section-poster relative overflow-hidden bg-brand-black">
      <GrainOverlay intensity={0.035} />
      <PosterMotif variant="section" opacity={0.4} />
      <div className="relative mx-auto max-w-6xl">
        <BarcodeDivider className="mb-6 max-w-md opacity-70" />
        <span className="cj-badge mb-4 sm:mb-6">Process</span>
        <h2 className="cj-poster-headline text-3xl sm:text-4xl md:text-5xl">
          Four steps.{" "}
          <span className="text-brand-gold">Then it&apos;s gone.</span>
        </h2>

        <div className="mt-10 grid gap-0 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="border-b border-[var(--cj-zine-border)] py-6 sm:odd:pr-8 sm:even:pl-8 sm:[&:nth-child(-n+2)]:border-t"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl tabular-nums text-brand-gold sm:text-4xl">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-lg uppercase tracking-[0.06em] text-cj-text sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm leading-relaxed text-cj-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
              {i === 1 && (
                <BarcodeDivider className="mt-6 max-w-[120px] opacity-50 sm:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
