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
    <section className="bg-cj-purple-dark px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-6">Process</span>
        <h2 className="cj-heading-display text-5xl md:text-7xl">
          Four Steps.
          <br />
          <span className="text-cj-gold-bright">Then It&apos;s Gone.</span>
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="font-display text-6xl text-cj-gold/40 md:text-7xl">
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-xl uppercase text-cj-gold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-cj-gold-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
