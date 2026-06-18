"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  aggregateCityOnline,
  fetchMapPresence,
  getYourCity,
  removeMapPresence,
  roundCoordinate,
  subscribeToMapPresence,
  upsertMapPresence,
  type CityOnlineSummary,
  type MapPresenceRow,
} from "@/lib/matchmaking";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { nearestCity } from "@/lib/signal-map-data";
import { GEO_CONSENT_KEY, hasStoredConsent } from "@/components/PermissionNotice";

const MAP_HIDDEN_KEY = "cj-map-hidden";

export function useMapPresence(userId: string | undefined, isAuthenticated: boolean) {
  const [rows, setRows] = useState<MapPresenceRow[]>([]);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [autoAttempted, setAutoAttempted] = useState(false);
  const [needsGeoConsent, setNeedsGeoConsent] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const data = await fetchMapPresence();
    setRows(data);
    if (userId) setVisible(data.some((r) => r.user_id === userId));
  }, [userId]);

  const cities = useMemo(
    () => aggregateCityOnline(rows, userId),
    [rows, userId]
  );

  const yourCity = useMemo(
    () => (userId ? getYourCity(rows, userId) : null),
    [rows, userId]
  );

  const totalOnline = useMemo(() => rows.length, [rows]);

  const appearOnMap = useCallback(async () => {
    if (!userId || !isAuthenticated) return;
    if (!hasStoredConsent(GEO_CONSENT_KEY)) {
      setNeedsGeoConsent(true);
      return;
    }
    if (!isSupabaseConfigured()) {
      setGeoError("Configure Supabase to appear on the map");
      return;
    }
    setLoading(true);
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await upsertMapPresence(
          userId,
          pos.coords.longitude,
          pos.coords.latitude
        );
        await refresh();
        setVisible(true);
        setLoading(false);
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.removeItem(MAP_HIDDEN_KEY);
        }
        import("@/lib/streaks").then(({ trackWeeklyActivity }) =>
          trackWeeklyActivity(userId, "signal_map")
        );
      },
      () => {
        setGeoError("Location permission denied");
        setLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }, [userId, isAuthenticated, refresh]);

  const hideFromMap = useCallback(async () => {
    if (userId) {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(MAP_HIDDEN_KEY, userId);
      }
      await removeMapPresence(userId);
    }
    setVisible(false);
    await refresh();
  }, [userId, refresh]);

  useEffect(() => {
    refresh();
    return subscribeToMapPresence(refresh);
  }, [refresh]);

  useEffect(() => {
    if (!userId || !isAuthenticated || autoAttempted || visible || loading) return;
    if (!isSupabaseConfigured()) return;
    if (!hasStoredConsent(GEO_CONSENT_KEY)) {
      setAutoAttempted(true);
      return;
    }
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(MAP_HIDDEN_KEY) === userId) {
      setAutoAttempted(true);
      return;
    }
    setAutoAttempted(true);
    appearOnMap();
  }, [userId, isAuthenticated, autoAttempted, visible, loading, appearOnMap]);

  return {
    cities,
    yourCity,
    totalOnline,
    visible,
    geoError,
    loading,
    appearOnMap,
    hideFromMap,
    isLive: isSupabaseConfigured(),
    needsGeoConsent,
    dismissGeoConsent: () => setNeedsGeoConsent(false),
  };
}

/** For demo / manual city pin without GPS */
export async function appearInCity(userId: string, citySlug: string) {
  const { cityBySlug } = await import("@/lib/signal-map-data");
  const city = cityBySlug(citySlug);
  if (!city) return;
  const [lng, lat] = city.coordinates;
  await upsertMapPresence(userId, lng + (Math.random() - 0.5) * 0.5, lat + (Math.random() - 0.5) * 0.5);
}

export { roundCoordinate, nearestCity };
