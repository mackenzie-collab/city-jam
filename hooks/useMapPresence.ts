"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  aggregateCityOnline,
  fetchMapPresence,
  getYourCity,
  registerLiveMapPresence,
  removeMapPresence,
  subscribeToMapPresence,
  upsertMapPresence,
  upsertMapPresenceFromCitySlug,
  type MapPresenceRow,
} from "@/lib/matchmaking";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cityBySlug, resolveCitySlugFromText } from "@/lib/signal-map-data";
import { fetchProfile } from "@/lib/profiles";
import { GEO_CONSENT_KEY, hasStoredConsent } from "@/components/PermissionNotice";

const MAP_HIDDEN_KEY = "cj-map-hidden";
const PRESENCE_HEARTBEAT_MS = 5 * 60 * 1000;

export function useMapPresence(userId: string | undefined, isAuthenticated: boolean) {
  const [rows, setRows] = useState<MapPresenceRow[]>([]);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [autoAttempted, setAutoAttempted] = useState(false);
  const [needsGeoConsent, setNeedsGeoConsent] = useState(false);
  const lastCoords = useRef<{ lng: number; lat: number } | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const data = await fetchMapPresence();
    setRows(data);
    if (userId) setVisible(data.some((r) => r.user_id === userId));
  }, [userId]);

  const cities = useMemo(() => aggregateCityOnline(rows), [rows]);

  const yourCity = useMemo(
    () => (userId ? getYourCity(rows, userId) : null),
    [rows, userId]
  );

  const totalOnline = useMemo(() => rows.length, [rows]);

  const applyPresence = useCallback(
    async (lng: number, lat: number) => {
      if (!userId) return false;
      const result = await upsertMapPresence(userId, lng, lat);
      if (result.error) {
        setGeoError(result.error);
        return false;
      }
      lastCoords.current = { lng, lat };
      await refresh();
      setVisible(true);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(MAP_HIDDEN_KEY);
      }
      return true;
    },
    [userId, refresh]
  );

  const tryProfileCityFallback = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;
    const profile = await fetchProfile(userId);
    const slug = profile?.city ? resolveCitySlugFromText(profile.city) : null;
    if (!slug) {
      setGeoError("Set your city in Profile (e.g. Manila) or allow location");
      return false;
    }
    const result = await upsertMapPresenceFromCitySlug(userId, slug);
    if (result.error) {
      setGeoError(result.error);
      return false;
    }
    const city = cityBySlug(slug);
    if (city) {
      const [lng, lat] = city.coordinates;
      lastCoords.current = { lng, lat };
    } else {
      lastCoords.current = null;
    }
    await refresh();
    setVisible(true);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(MAP_HIDDEN_KEY);
    }
    return true;
  }, [userId, refresh]);

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
      const ok = await tryProfileCityFallback();
      setLoading(false);
      if (!ok) setGeoError("Geolocation not supported");
      return;
    }
    const loadingGuard = window.setTimeout(() => {
      setLoading(false);
      setGeoError("Location timed out — tap Show on Map to retry");
    }, 16000);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        window.clearTimeout(loadingGuard);
        await applyPresence(pos.coords.longitude, pos.coords.latitude);
        setLoading(false);
      },
      async () => {
        window.clearTimeout(loadingGuard);
        const ok = await tryProfileCityFallback();
        if (!ok) setGeoError("Location permission denied — set city in Profile");
        setLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }, [userId, isAuthenticated, applyPresence, tryProfileCityFallback]);

  const hideFromMap = useCallback(async () => {
    if (userId) {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(MAP_HIDDEN_KEY, userId);
      }
      lastCoords.current = null;
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
      setNeedsGeoConsent(true);
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

  useEffect(() => {
    if (!visible || !userId) return;
    const tick = async () => {
      const coords = lastCoords.current;
      if (coords) {
        await upsertMapPresence(userId, coords.lng, coords.lat);
      } else {
        await registerLiveMapPresence(userId, { allowGeolocation: false });
      }
      await refresh();
    };
    const id = window.setInterval(tick, PRESENCE_HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [visible, userId, refresh]);

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
  await upsertMapPresenceFromCitySlug(userId, citySlug);
}
