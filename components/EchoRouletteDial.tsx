"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Mic } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMatchSession } from "@/hooks/useMatchSession";
import { useWebRTC } from "@/hooks/useWebRTC";
import PermissionNotice, { MIC_CONSENT_KEY, hasStoredConsent, storeConsent } from "@/components/PermissionNotice";
import { Button } from "@/components/ui/button";
import {
  FM_CHANNELS,
  angleToFreq,
  freqToAngle,
  snapToNearestChannel,
} from "@/lib/echo-data";

interface EchoRouletteDialProps {
  inputType?: string;
  keyFocus?: string;
}

export default function EchoRouletteDial({
  inputType = "Full Band",
  keyFocus = "Jam Sessions",
}: EchoRouletteDialProps) {
  const { user, isAuthenticated } = useAuth();
  const dialRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [frequency, setFrequency] = useState(104.2);
  const [angle, setAngle] = useState(() => freqToAngle(104.2));
  const [locked, setLocked] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [micConsented, setMicConsented] = useState(false);
  const [showMicNotice, setShowMicNotice] = useState(false);

  useEffect(() => {
    setMicConsented(hasStoredConsent(MIC_CONSENT_KEY));
  }, []);

  const snappedFreq = snapToNearestChannel(frequency);
  const {
    status: matchStatus,
    sessionId,
    isInitiator,
    error: matchError,
    startSearch,
    cancel,
    isLive,
  } = useMatchSession(user?.id, "echo-roulette", locked ? snappedFreq : undefined);

  const webrtcActive = matchStatus === "matched" && !!sessionId;
  const { connected, remoteAudioRef, error: rtcError, cleanup: cleanupRtc } = useWebRTC(
    sessionId,
    user?.id ?? "",
    isInitiator,
    webrtcActive
  );

  useEffect(() => {
    if (matchStatus === "matched" && user?.id) {
      import("@/lib/streaks").then(({ trackWeeklyActivity }) =>
        trackWeeklyActivity(user.id, "echo_roulette")
      );
    }
  }, [matchStatus, user?.id]);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!dialRef.current) return;
      const rect = dialRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rad = Math.atan2(clientY - cy, clientX - cx);
      const deg = (rad * 180) / Math.PI;
      setAngle(deg);
      setFrequency(parseFloat(angleToFreq(deg).toFixed(1)));
      setLocked(false);
      setConnecting(false);
      cancel();
    },
    [cancel]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    dragging.current = false;
    const snapped = snapToNearestChannel(frequency);
    setFrequency(snapped);
    setAngle(freqToAngle(snapped));
    setLocked(true);
  };

  const handleDisconnect = async () => {
    cleanupRtc();
    setConnecting(false);
    setLocked(false);
    await cancel();
  };

  const handleConnect = async () => {
    if (connecting || matchStatus === "searching") return;
    if (!hasStoredConsent(MIC_CONSENT_KEY)) {
      setShowMicNotice(true);
      return;
    }
    setConnecting(true);
    await startSearch();
    setConnecting(false);
  };

  const channelIndex = FM_CHANNELS.indexOf(snappedFreq);

  return (
    <div className="flex flex-col items-center">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="w-full overflow-hidden border-b border-cj-gold-border bg-cj-purple-card py-2">
        <div className="animate-ticker whitespace-nowrap font-mono text-xs text-cj-gold">
          <span className="mx-8">
            Frequency: {frequency.toFixed(1)} · Input: {inputType} · Key Focus:{" "}
            {keyFocus}
          </span>
          <span className="mx-8">
            Frequency: {frequency.toFixed(1)} · Input: {inputType} · Key Focus:{" "}
            {keyFocus}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-6 py-10 text-center">
        <h2 className="cj-heading-display text-2xl md:text-3xl">
          Drag the Dial to Find a Frequency
        </h2>

        <p className="mt-8 font-display text-7xl text-cj-gold md:text-8xl">
          {frequency.toFixed(1)}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-cj-gold-muted">
          FM · MHZ
        </p>

        <div
          ref={dialRef}
          className="relative mx-auto mt-10 h-[300px] w-[300px] cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="absolute inset-0 rounded-full border-2 border-cj-purple/50 bg-[#2a2a2a] shadow-inner" />

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 300">
            {[0, 45, 90, 135].map((deg) => (
              <line
                key={deg}
                x1="150"
                y1="150"
                x2={150 + 140 * Math.cos((deg * Math.PI) / 180)}
                y2={150 + 140 * Math.sin((deg * Math.PI) / 180)}
                stroke="rgba(201,168,0,0.15)"
                strokeWidth="1"
              />
            ))}
          </svg>

          {FM_CHANNELS.map((ch, i) => {
            const a = (freqToAngle(ch) * Math.PI) / 180;
            const x = 150 + 125 * Math.cos(a);
            const y = 150 + 125 * Math.sin(a);
            return (
              <div
                key={ch}
                className={`absolute h-1.5 w-1.5 rounded-full ${
                  i === channelIndex && locked ? "bg-cj-gold" : "bg-cj-gold/30"
                }`}
                style={{ left: x - 3, top: y - 3 }}
              />
            );
          })}

          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cj-gold shadow-[0_0_12px_rgba(201,168,0,0.6)]" />

          <div
            className="absolute h-5 w-5 rounded-full border-2 border-cj-purple-card bg-cj-gold shadow-[0_0_16px_rgba(201,168,0,0.8)]"
            style={{
              left: 150 + 135 * Math.cos((angle * Math.PI) / 180) - 10,
              top: 150 + 135 * Math.sin((angle * Math.PI) / 180) - 10,
            }}
          />
        </div>

        {locked && (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cj-gold px-4 py-2 text-xs uppercase tracking-widest text-cj-gold">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-cj-gold" />
            Signal Locked · {inputType}
          </div>
        )}

        {connected && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-cj-gold-bright">
              <Mic className="h-3 w-3" /> Live on {snappedFreq} FM
            </div>
            <Button variant="secondary" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        )}

        {!isAuthenticated && locked && (
          <div className="mt-10 rounded-xl border border-cj-gold-border bg-cj-purple-card p-6">
            <p className="text-sm text-cj-gold-muted">
              Sign in to connect with real musicians on this frequency.
            </p>
            <Link
              href={`/login?returnUrl=${encodeURIComponent("/echo-roulette")}`}
              className="mt-4 inline-block"
            >
              <Button variant="primary">Sign In</Button>
            </Link>
          </div>
        )}

        {isAuthenticated && locked && !connected && (
          <div className="mt-10 rounded-xl border border-cj-gold-border bg-cj-purple-card p-6">
            {!isLive && (
              <p className="mb-4 text-xs text-amber-400">
                Add Supabase env vars for live connections (DEPLOY.md)
              </p>
            )}
            {matchStatus === "searching" ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-cj-gold" />
                <p className="text-sm text-cj-gold-muted">
                  Tuning into {snappedFreq} FM — waiting for another signal...
                </p>
                <Button variant="secondary" size="sm" onClick={() => { setConnecting(false); cancel(); }}>
                  Stop
                </Button>
              </div>
            ) : showMicNotice ? (
              <PermissionNotice
                title="Microphone access"
                learnMoreHref="/privacy"
                acceptLabel="I understand — connect"
                onDecline={() => setShowMicNotice(false)}
                onAccept={() => {
                  storeConsent(MIC_CONSENT_KEY);
                  setMicConsented(true);
                  setShowMicNotice(false);
                  void (async () => {
                    setConnecting(true);
                    await startSearch();
                    setConnecting(false);
                  })();
                }}
                body={
                  <>
                    <p>
                      Echo Roulette connects you with another musician on this frequency. Your browser
                      will request microphone access for the live session.
                    </p>
                    <p>Audio is peer-to-peer via WebRTC and is not stored on our servers.</p>
                  </>
                }
              />
            ) : (
              <>
                <p className="text-sm text-cj-gold-muted">
                  Lock confirmed. Connect to whoever&apos;s live on this frequency.
                </p>
                {(matchError || rtcError) && (
                  <p className="mt-2 text-xs text-amber-400">{matchError || rtcError}</p>
                )}
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleConnect}
                  disabled={connecting}
                >
                  {connecting ? "Connecting..." : "Connect"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
