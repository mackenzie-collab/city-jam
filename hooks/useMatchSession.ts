"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cancelMatch,
  leaveMatch,
  pollMatchStatus,
  subscribeToMatch,
  tryMatch,
  type MatchMode,
  type MatchResult,
} from "@/lib/matchmaking";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function useMatchSession(
  userId: string | undefined,
  mode: MatchMode,
  frequency?: number
) {
  const [status, setStatus] = useState<
    "idle" | "searching" | "matched" | "error" | "offline"
  >("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyMatch = useCallback((result: MatchResult) => {
    if (result.status === "matched" && result.sessionId) {
      setSessionId(result.sessionId);
      setIsInitiator(result.isInitiator ?? false);
      setStatus("matched");
    }
  }, []);

  const startSearch = useCallback(async () => {
    if (!userId) return;
    if (!isSupabaseConfigured()) {
      setStatus("offline");
      setError("Live matching needs Supabase — see DEPLOY.md");
      return;
    }

    setStatus("searching");
    setError(null);

    const roundedFreq =
      frequency != null ? Math.round(frequency * 10) / 10 : undefined;
    const result: MatchResult = await tryMatch(userId, mode, roundedFreq);

    if (result.status === "matched" && result.sessionId) {
      applyMatch(result);
    } else if (result.status === "waiting") {
      setStatus("searching");
    } else if (result.status === "offline") {
      setStatus("offline");
      setError(result.message ?? "Offline mode");
    } else {
      setStatus("error");
      setError(result.message ?? "Match failed");
    }
  }, [userId, mode, frequency, applyMatch]);

  const cancel = useCallback(async () => {
    if (userId) await leaveMatch(userId);
    setStatus("idle");
    setSessionId(null);
    setIsInitiator(false);
  }, [userId]);

  useEffect(() => {
    if (!userId || status !== "searching") return;

    const unsub = subscribeToMatch(userId, (sid, initiator) => {
      setSessionId(sid);
      setIsInitiator(initiator);
      setStatus("matched");
    });

    const interval = setInterval(async () => {
      const polled = await pollMatchStatus(userId);
      if (polled) applyMatch(polled);
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [userId, status, applyMatch]);

  return {
    status,
    sessionId,
    isInitiator,
    error,
    startSearch,
    cancel,
    isLive: isSupabaseConfigured(),
  };
}
