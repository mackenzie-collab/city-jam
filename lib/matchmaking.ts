import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  nearestCity,
  drifterAlias,
  CITY_DOTS,
  cityBySlug,
  resolveCitySlugFromText,
} from "@/lib/signal-map-data";

export type MatchMode = "blind-echo" | "echo-roulette";

export interface MatchResult {
  status: "waiting" | "matched" | "error" | "offline";
  sessionId?: string;
  isInitiator?: boolean;
  partnerId?: string;
  message?: string;
}

export async function tryMatch(
  userId: string,
  mode: MatchMode,
  frequency?: number
): Promise<MatchResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: "offline",
      message: "Supabase not configured — see DEPLOY.md",
    };
  }

  const supabase = getSupabase();
  if (!supabase) return { status: "error", message: "No Supabase client" };

  const { data, error } = await supabase.rpc("try_match", {
    p_user_id: userId,
    p_mode: mode,
    p_frequency: frequency ?? null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  const result = data as {
    status: string;
    session_id?: string;
    is_initiator?: boolean;
    partner_id?: string;
  };

  if (result.status === "matched") {
    return {
      status: "matched",
      sessionId: result.session_id,
      isInitiator: result.is_initiator ?? false,
      partnerId: result.partner_id,
    };
  }

  return { status: "waiting" };
}

export async function cancelMatch(userId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase
    .from("match_queue")
    .delete()
    .eq("user_id", userId)
    .eq("status", "waiting");
}

/** Leave queue or end an active matched session */
export async function leaveMatch(userId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("match_queue").delete().eq("user_id", userId);
}

export async function pollMatchStatus(userId: string): Promise<MatchResult | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("match_queue")
    .select("status, session_id, is_initiator")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data?.status === "matched" && data.session_id) {
    return {
      status: "matched",
      sessionId: data.session_id,
      isInitiator: data.is_initiator ?? false,
    };
  }
  return null;
}

export function subscribeToMatch(
  userId: string,
  onMatched: (sessionId: string, isInitiator: boolean) => void
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`match:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "match_queue",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const row = payload.new as {
          status: string;
          session_id?: string;
          is_initiator?: boolean;
        };
        if (row.status === "matched" && row.session_id) {
          onMatched(row.session_id, row.is_initiator ?? false);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function submitDecision(
  sessionId: string,
  userId: string,
  decision: "transmit" | "fade"
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("session_decisions").upsert({
    session_id: sessionId,
    user_id: userId,
    decision,
  });
}

export async function getSessionDecisions(
  sessionId: string
): Promise<{ user_id: string; decision: string }[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("session_decisions")
    .select("user_id, decision")
    .eq("session_id", sessionId);
  return data ?? [];
}

export function subscribeToDecisions(
  sessionId: string,
  onUpdate: () => void
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`decisions:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "session_decisions",
        filter: `session_id=eq.${sessionId}`,
      },
      () => onUpdate()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export interface MapPresenceRow {
  user_id: string;
  lng: number;
  lat: number;
  city_slug: string | null;
  alias: string | null;
  updated_at: string;
}

/** Resolve city from stored coords (fixes stale city_slug after hub list updates) */
function cityForPresence(row: MapPresenceRow): string {
  return nearestCity(Number(row.lng), Number(row.lat)).slug;
}

export interface CityOnlineSummary {
  slug: string;
  name: string;
  coordinates: [number, number];
  onlineCount: number;
  drifters: string[];
  hub?: boolean;
}

/** Round to ~11 km — neighborhood level, not exact address */
export function roundCoordinate(value: number): number {
  return Math.round(value * 10) / 10;
}

const PRESENCE_TTL_MS = 15 * 60 * 1000;

function isFresh(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < PRESENCE_TTL_MS;
}

export async function upsertMapPresence(
  userId: string,
  lng: number,
  lat: number
): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: "No Supabase client" };
  const city = nearestCity(lng, lat);
  const { error } = await supabase.from("map_presence").upsert({
    user_id: userId,
    lng: roundCoordinate(lng),
    lat: roundCoordinate(lat),
    city_slug: city.slug,
    alias: drifterAlias(userId),
    updated_at: new Date().toISOString(),
  });
  return error ? { error: error.message } : {};
}

export async function upsertMapPresenceFromCitySlug(
  userId: string,
  citySlug: string
): Promise<{ error?: string }> {
  const city = cityBySlug(citySlug);
  if (!city) return { error: "Unknown city" };
  const [lng, lat] = city.coordinates;
  const jitter = () => (Math.random() - 0.5) * 0.3;
  return upsertMapPresence(userId, lng + jitter(), lat + jitter());
}

async function upsertMapPresenceFromProfileCity(
  userId: string
): Promise<{ error?: string; usedProfileCity?: boolean }> {
  const { fetchProfile } = await import("@/lib/profiles");
  const profile = await fetchProfile(userId);
  const slug = profile?.city ? resolveCitySlugFromText(profile.city) : null;
  if (!slug) return { error: "Set your city in Profile to appear on the map" };
  const result = await upsertMapPresenceFromCitySlug(userId, slug);
  return result.error ? result : { usedProfileCity: true };
}

/** Register map presence when going live — GPS when allowed, else profile city */
export async function registerLiveMapPresence(
  userId: string,
  options?: { allowGeolocation?: boolean }
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return {};

  if (
    options?.allowGeolocation !== false &&
    typeof navigator !== "undefined" &&
    navigator.geolocation
  ) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 60_000,
          timeout: 10_000,
        });
      });
      return upsertMapPresence(userId, pos.coords.longitude, pos.coords.latitude);
    } catch {
      // Fall back to profile city
    }
  }

  return upsertMapPresenceFromProfileCity(userId);
}

export async function fetchMapPresence(): Promise<MapPresenceRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("map_presence").select("*");
  return (data ?? []).filter((r) => isFresh(r.updated_at));
}

export function aggregateCityOnline(rows: MapPresenceRow[]): CityOnlineSummary[] {
  const byCity = new Map<string, { drifters: string[] }>();

  for (const row of rows) {
    const slug = cityForPresence(row);
    const entry = byCity.get(slug) ?? { drifters: [] };
    entry.drifters.push(row.alias ?? drifterAlias(row.user_id));
    byCity.set(slug, entry);
  }

  return CITY_DOTS.map((city) => {
    const entry = byCity.get(city.slug);
    return {
      slug: city.slug,
      name: city.name,
      coordinates: city.coordinates,
      onlineCount: entry?.drifters.length ?? 0,
      drifters: entry?.drifters ?? [],
      hub: city.hub,
    };
  }).sort((a, b) => b.onlineCount - a.onlineCount);
}

export function getYourCity(
  rows: MapPresenceRow[],
  userId: string
): CityOnlineSummary | null {
  const row = rows.find((r) => r.user_id === userId);
  if (!row) return null;
  const slug = cityForPresence(row);
  const city = cityBySlug(slug);
  if (!city) return null;
  const inCity = rows.filter((r) => cityForPresence(r) === slug);
  return {
    slug: city.slug,
    name: city.name,
    coordinates: city.coordinates,
    onlineCount: inCity.length,
    drifters: inCity.map((r) => r.alias ?? drifterAlias(r.user_id)),
    hub: city.hub,
  };
}

export function subscribeToMapPresence(onUpdate: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel("map-presence")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "map_presence" },
      () => onUpdate()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function removeMapPresence(userId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("map_presence").delete().eq("user_id", userId);
}
