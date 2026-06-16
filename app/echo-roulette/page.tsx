"use client";

import { useState } from "react";
import { Crosshair, Radio, Wifi } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EchoRouletteDial from "@/components/EchoRouletteDial";

type Step = "role" | "dial";
type Role = "tune-in" | "go-live" | null;

export default function EchoRoulettePage() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>(null);

  const selectRole = (selected: Role) => {
    setRole(selected);
    setStep("dial");
  };

  if (step === "dial") {
    return (
      <div className="min-h-screen bg-cj-purple">
        <PageHeader title="Echo Roulette" icon={Crosshair} />
        <EchoRouletteDial
          inputType={role === "go-live" ? "Solo Broadcast" : "Full Band"}
          keyFocus={role === "go-live" ? "Open Frequency" : "Jam Sessions"}
        />
        <div className="border-t border-cj-gold-border py-3 text-center text-[10px] uppercase tracking-widest text-cj-gold-muted">
          8 Channels · Tune In or Go Live · Touch Enabled
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cj-purple">
      <PageHeader title="Echo Roulette" icon={Crosshair} />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-xs uppercase tracking-widest text-cj-gold-muted">
          How do you want in?
        </p>
        <h1 className="cj-heading-display mt-2 text-4xl md:text-6xl">
          Pick Your Role
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <button
            onClick={() => selectRole("tune-in")}
            className="cj-card group text-left transition-all hover:border-cj-gold/60"
          >
            <Radio className="mb-4 h-10 w-10 text-cj-gold" />
            <h2 className="font-display text-2xl uppercase text-cj-gold">
              Tune In
            </h2>
            <p className="mt-3 text-sm text-cj-gold-muted">
              Spin the dial, land on a frequency, and connect with whoever&apos;s
              broadcasting.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-cj-gold">
              Find → Lock In → Connect
            </p>
          </button>

          <button
            onClick={() => selectRole("go-live")}
            className="cj-card group text-left transition-all hover:border-cj-gold/60"
          >
            <Wifi className="mb-4 h-10 w-10 text-cj-gold" />
            <h2 className="font-display text-2xl uppercase text-cj-gold">
              Go Live
            </h2>
            <p className="mt-3 text-sm text-cj-gold-muted">
              Choose your own frequency and broadcast — let drifters find you.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-cj-gold">
              Set Freq → Go Live → Get Found
            </p>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-cj-gold-border bg-cj-purple-card py-3 text-center text-[10px] uppercase tracking-widest text-cj-gold-muted">
        8 Channels · Tune In or Go Live · Touch Enabled
      </div>
    </div>
  );
}
