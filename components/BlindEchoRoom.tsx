"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Mic, MicOff, UserX } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import AppTrail from "@/components/AppTrail";
import PageHeader from "@/components/PageHeader";
import PermissionNotice, { MIC_CONSENT_KEY, hasStoredConsent, storeConsent } from "@/components/PermissionNotice";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMatchSession } from "@/hooks/useMatchSession";
import { useWebRTC } from "@/hooks/useWebRTC";
import {
  getSessionDecisions,
  submitDecision,
  subscribeToDecisions,
} from "@/lib/matchmaking";
import {
  BLIND_ECHO_PROMPTS,
  SESSION_DURATION_SEC,
} from "@/lib/echo-data";

type Phase = "lobby" | "searching" | "session" | "decision" | "done";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BlindEchoRoom() {
  const { user, isAuthenticated, loading } = useAuth();
  const {
    status: matchStatus,
    sessionId,
    isInitiator,
    error: matchError,
    startSearch,
    cancel,
    isLive,
  } = useMatchSession(user?.id, "blind-echo");

  const webrtcEnabled = matchStatus === "matched" && !!sessionId;
  const { connected, audioReady, error: rtcError, remoteAudioRef } = useWebRTC(
    sessionId,
    user?.id ?? "",
    isInitiator,
    webrtcEnabled
  );

  const [phase, setPhase] = useState<Phase>("lobby");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);
  const [promptIndex, setPromptIndex] = useState(0);
  const [decision, setDecision] = useState<"transmit" | "fade" | null>(null);
  const [partnerDecision, setPartnerDecision] = useState<string | null>(null);
  const [mutualTransmit, setMutualTransmit] = useState(false);
  const [micConsented, setMicConsented] = useState(false);
  const streakTracked = useRef(false);

  useEffect(() => {
    setMicConsented(hasStoredConsent(MIC_CONSENT_KEY));
  }, []);

  useEffect(() => {
    if (matchStatus === "searching") setPhase("searching");
    if (matchStatus === "matched" && phase !== "decision" && phase !== "done") {
      if (phase !== "session") {
        setPhase("session");
        setTimeLeft(SESSION_DURATION_SEC);
      }
    }
  }, [matchStatus, phase]);

  useEffect(() => {
    if (!connected || !user?.id || streakTracked.current) return;
    streakTracked.current = true;
    import("@/lib/streaks").then(({ trackWeeklyActivity }) =>
      trackWeeklyActivity(user.id, "blind_echo")
    );
  }, [connected, user?.id]);

  useEffect(() => {
    if (phase !== "session" || !connected) return;
    if (timeLeft <= 0) {
      setPhase("decision");
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, connected]);

  useEffect(() => {
    if (!sessionId || phase !== "decision") return;

    const check = async () => {
      const decisions = await getSessionDecisions(sessionId);
      const mine = decisions.find((d) => d.user_id === user?.id);
      const theirs = decisions.find((d) => d.user_id !== user?.id);
      if (theirs) setPartnerDecision(theirs.decision);
      if (
        mine?.decision === "transmit" &&
        theirs?.decision === "transmit"
      ) {
        setMutualTransmit(true);
      }
    };

    check();
    const interval = setInterval(check, 2000);
    const unsub = subscribeToDecisions(sessionId, check);
    return () => {
      clearInterval(interval);
      unsub();
    };
  }, [sessionId, phase, user?.id]);

  const handleEnter = useCallback(async () => {
    setPhase("searching");
    await startSearch();
  }, [startSearch]);

  const handleDecision = async (d: "transmit" | "fade") => {
    setDecision(d);
    if (sessionId && user?.id) {
      await submitDecision(sessionId, user.id, d);
    }
    if (d === "fade") {
      setPhase("done");
    }
  };

  useEffect(() => {
    if (phase !== "decision" || !decision || decision === "fade") return;
    if (partnerDecision === "transmit") {
      setMutualTransmit(true);
      setPhase("done");
    } else if (partnerDecision === "fade") {
      setPhase("done");
    }
  }, [phase, decision, partnerDecision]);

  const handleReset = () => {
    cancel();
    streakTracked.current = false;
    setPhase("lobby");
    setDecision(null);
    setPartnerDecision(null);
    setMutualTransmit(false);
    setPromptIndex(0);
  };

  if (loading) {
    return (
      <AppChrome>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-cj-gold-muted">Loading...</p>
        </div>
      </AppChrome>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppChrome>
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse at center, #6B1FA0 0%, #3D0066 50%, #1A0030 100%)",
        }}
      >
        <PageHeader title="Blind Echo" showDot backHref="/community" />
        <div className="mx-auto max-w-md px-6 pt-4">
          <AppTrail />
        </div>
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-cj-purple-card">
            <UserX className="h-8 w-8 text-cj-gold-muted" />
          </div>
          <h1 className="cj-heading-display text-3xl md:text-4xl">
            Sign In to Match
          </h1>
          <p className="mt-4 text-sm text-cj-gold-muted">
            Blind Echo uses real matchmaking — you need an account so others can
            find you.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/login?returnUrl=/blind-echo">
              <Button variant="primary">Sign In</Button>
            </Link>
            <Link href="/register?returnUrl=/blind-echo">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </div>
      </div>
      </AppChrome>
    );
  }

  return (
    <AppChrome>
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at center, #6B1FA0 0%, #3D0066 50%, #1A0030 100%)",
      }}
    >
      <PageHeader title="Blind Echo" showDot backHref="/community" />
      <div className="mx-auto max-w-lg px-6 pt-4">
        <AppTrail />
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center">
        {!isLive && (
          <p className="mb-6 rounded border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
            Demo mode — add Supabase env vars for live matching (see DEPLOY.md)
          </p>
        )}

        {phase === "lobby" && (
          <>
            <p className="text-xs uppercase tracking-widest text-cj-gold-muted">
              High Intent · 7 Minutes · Live Audio
            </p>
            <h1 className="cj-heading-display mt-4 text-4xl">Ready to Echo?</h1>
            {!micConsented ? (
              <div className="mt-8 w-full">
                <PermissionNotice
                  title="Microphone access"
                  learnMoreHref="/privacy"
                  acceptLabel="I understand — continue"
                  onAccept={() => {
                    storeConsent(MIC_CONSENT_KEY);
                    setMicConsented(true);
                  }}
                  body={
                    <>
                      <p>
                        Blind Echo matches you with another musician for a live audio session. Your
                        browser will ask for microphone access when the session starts.
                      </p>
                      <p>
                        Audio is transmitted in real time via WebRTC. We do not record sessions on
                        our servers unless you separately upload to the Vault.
                      </p>
                    </>
                  }
                />
              </div>
            ) : (
              <>
                <p className="mt-4 text-sm text-cj-gold-muted">
                  You&apos;ll be matched anonymously with another musician. Allow mic access when
                  prompted. At the end: transmit or fade.
                </p>
                <Button variant="primary" className="mt-10" onClick={handleEnter}>
                  Enter the Room
                </Button>
              </>
            )}
          </>
        )}

        {phase === "searching" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-cj-gold" />
            <h1 className="cj-heading-display mt-6 text-2xl">
              Scanning for Signal...
            </h1>
            <p className="mt-4 text-sm text-cj-gold-muted">
              Waiting for another musician to enter. Have a friend join on the
              same deployed URL.
            </p>
            {matchError && (
              <p className="mt-4 text-sm text-amber-400">{matchError}</p>
            )}
            <Button variant="secondary" className="mt-8" onClick={handleReset}>
              Cancel
            </Button>
          </>
        )}

        {phase === "session" && (
          <>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
              {connected ? (
                <span className="flex items-center gap-1 text-cj-gold-bright">
                  <Mic className="h-3 w-3" /> Connected
                </span>
              ) : audioReady ? (
                <span className="text-cj-gold-muted">Linking audio...</span>
              ) : (
                <span className="flex items-center gap-1 text-cj-gold-muted">
                  <MicOff className="h-3 w-3" /> Requesting mic
                </span>
              )}
            </div>
            {rtcError && (
              <p className="mb-4 text-xs text-amber-400">{rtcError}</p>
            )}

            <div className="font-display text-6xl text-cj-gold md:text-7xl">
              {formatTime(timeLeft)}
            </div>
            <p className="mt-2 text-xs uppercase tracking-widest text-cj-gold-muted">
              Session Active
            </p>

            <div className="mt-12 w-full rounded-xl border border-cj-gold-border bg-cj-purple-card/60 p-8 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                Deep Prompt {promptIndex + 1} of {BLIND_ECHO_PROMPTS.length}
              </p>
              <p className="mt-4 text-lg text-cj-gold">
                {BLIND_ECHO_PROMPTS[promptIndex]}
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={promptIndex === 0}
                onClick={() => setPromptIndex((i) => i - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={promptIndex >= BLIND_ECHO_PROMPTS.length - 1}
                onClick={() => setPromptIndex((i) => i + 1)}
              >
                Next Prompt
              </Button>
            </div>

            <div className="mt-10 flex h-16 w-full items-end justify-center gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-cj-gold/60 animate-pulse"
                  style={{
                    height: `${20 + Math.sin(i * 0.8) * 15 + (i % 3) * 5}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {phase === "decision" && (
          <>
            <h1 className="cj-heading-display text-3xl md:text-4xl">
              Time&apos;s Up.
            </h1>
            <p className="mt-4 text-sm text-cj-gold-muted">
              Both parties must transmit simultaneously to reveal profiles.
            </p>
            <div className="mt-10 flex gap-6">
              <Button variant="primary" onClick={() => handleDecision("transmit")}>
                Transmit
              </Button>
              <Button variant="secondary" onClick={() => handleDecision("fade")}>
                Fade
              </Button>
            </div>
          </>
        )}

        {phase === "done" && (
          <>
            <h1 className="cj-heading-display text-3xl">
              {mutualTransmit
                ? "Mutual Transmit!"
                : decision === "transmit"
                  ? "Transmitting..."
                  : "Faded Out."}
            </h1>
            <p className="mt-4 text-sm text-cj-gold-muted">
              {mutualTransmit
                ? "You both transmitted. Profiles unlocked."
                : decision === "transmit"
                  ? partnerDecision === "fade"
                    ? "They faded. You disappear cleanly."
                    : "Waiting for your match to transmit..."
                  : "You chose to fade. Clean exit. No trace."}
            </p>
            <Button variant="secondary" className="mt-10" onClick={handleReset}>
              Back to Start
            </Button>
          </>
        )}
      </div>
    </div>
    </AppChrome>
  );
}
