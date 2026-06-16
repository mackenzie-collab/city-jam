"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

interface SignalPayload {
  type: "offer" | "answer" | "ice";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  from: string;
}

export function useWebRTC(
  sessionId: string | null,
  userId: string,
  isInitiator: boolean,
  enabled: boolean
) {
  const [connected, setConnected] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    setConnected(false);
    setAudioReady(false);
  }, []);

  useEffect(() => {
    if (!enabled || !sessionId || !isSupabaseConfigured()) return;

    const supabase = getSupabase();
    if (!supabase) return;

    let cancelled = false;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    const channel = supabase.channel(`webrtc:${sessionId}`, {
      config: { broadcast: { self: false } },
    });

    const sendSignal = (payload: Omit<SignalPayload, "from">) => {
      channel.send({
        type: "broadcast",
        event: "signal",
        payload: { ...payload, from: userId },
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: "ice", candidate: event.candidate.toJSON() });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") setConnected(true);
      if (pc.connectionState === "failed") {
        setError("Connection failed — try again");
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch(() => {});
      }
      setConnected(true);
    };

    channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
      const msg = payload as SignalPayload;
      if (msg.from === userId) return;

      try {
        if (msg.type === "offer" && msg.sdp) {
          await pc.setRemoteDescription(msg.sdp);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({ type: "answer", sdp: answer });
        } else if (msg.type === "answer" && msg.sdp) {
          await pc.setRemoteDescription(msg.sdp);
        } else if (msg.type === "ice" && msg.candidate) {
          await pc.addIceCandidate(msg.candidate);
        }
      } catch {
        setError("Signaling error");
      }
    });

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setAudioReady(true);

        await channel.subscribe();

        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendSignal({ type: "offer", sdp: offer });
        }
      } catch {
        setError("Microphone access denied — allow mic to connect");
      }
    };

    start();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      cleanup();
    };
  }, [sessionId, userId, isInitiator, enabled, cleanup]);

  return { connected, audioReady, error, remoteAudioRef, cleanup };
}
