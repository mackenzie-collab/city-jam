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
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteSetRef = useRef(false);

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    iceQueueRef.current = [];
    remoteSetRef.current = false;
    setConnected(false);
    setAudioReady(false);
  }, []);

  const flushIceQueue = useCallback(async (pc: RTCPeerConnection) => {
    if (!pc.remoteDescription) return;
    const pending = [...iceQueueRef.current];
    iceQueueRef.current = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        /* ignore stale candidates */
      }
    }
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
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        setError("Connection lost — try again");
        setConnected(false);
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    const handleSignal = async (msg: SignalPayload) => {
      if (msg.from === userId) return;

      try {
        if (msg.type === "offer" && msg.sdp) {
          await pc.setRemoteDescription(msg.sdp);
          remoteSetRef.current = true;
          await flushIceQueue(pc);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({ type: "answer", sdp: answer });
        } else if (msg.type === "answer" && msg.sdp) {
          await pc.setRemoteDescription(msg.sdp);
          remoteSetRef.current = true;
          await flushIceQueue(pc);
          setConnected(pc.connectionState === "connected");
        } else if (msg.type === "ice" && msg.candidate) {
          if (remoteSetRef.current && pc.remoteDescription) {
            await pc.addIceCandidate(msg.candidate);
          } else {
            iceQueueRef.current.push(msg.candidate);
          }
        }
      } catch {
        setError("Signaling error");
      }
    };

    channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
      await handleSignal(payload as SignalPayload);
    });

    const sendOffer = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignal({ type: "offer", sdp: offer });
    };

    const start = async () => {
      try {
        await channel.subscribe();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setAudioReady(true);

        if (isInitiator) {
          await sendOffer();
          const retry = setInterval(() => {
            if (cancelled || pc.connectionState === "connected" || pc.remoteDescription) {
              clearInterval(retry);
              return;
            }
            sendOffer().catch(() => {});
          }, 3000);
          setTimeout(() => clearInterval(retry), 30000);
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
  }, [sessionId, userId, isInitiator, enabled, cleanup, flushIceQueue]);

  return { connected, audioReady, error, remoteAudioRef, cleanup };
}
