"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cancelMatch,
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

  const startSearch = useCallback(async () => {
    if (!userId) return;
    if (!isSupabaseConfigured()) {
      setStatus("offline");
      setError("Live matching needs Supabase — see DEPLOY.md");
      return;
    }

    setStatus("searching");
    setError(null);

    const result: MatchResult = await tryMatch(userId, mode, frequency);

    if (result.status === "matched" && result.sessionId) {
      setSessionId(result.sessionId);
      setIsInitiator(result.isInitiator ?? false);
      setStatus("matched");
    } else if (result.status === "waiting") {
      setStatus("searching");
    } else if (result.status === "offline") {
      setStatus("offline");
      setError(result.message ?? "Offline mode");
    } else {
      setStatus("error");
      setError(result.message ?? "Match failed");
    }
  }, [userId, mode, frequency]);

  const cancel = useCallback(async () => {
    if (userId) await cancelMatch(userId);
    setStatus("idle");
    setSessionId(null);
    setIsInitiator(false);
  }, [userId]);

  useEffect(() => {
    if (!userId || status !== "searching") return;

    return subscribeToMatch(userId, (sid, initiator) => {
      setSessionId(sid);
      setIsInitiator(initiator);
      setStatus("matched");
    });
  }, [userId, status]);

  useEffect(() => {
    return () => {
      if (userId) cancelMatch(userId);
    };
  }, [userId]);

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
