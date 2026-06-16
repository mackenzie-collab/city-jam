import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchMapPresence } from "@/lib/matchmaking";
import { type UserProfile, type StatusMood } from "@/lib/profiles";

export interface DiscoverMatch {
  profile: UserProfile;
  score: number;
  reason: string;
  onlineOnMap: boolean;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export function discoveryUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are",
  "currently", "deep", "looking", "studio", "mixing", "with", "my", "i", "am", "im",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function overlappingKeywords(a: string, b: string): string[] {
  const setB = new Set(extractKeywords(b));
  return extractKeywords(a).filter((w) => setB.has(w));
}

function normalizeCity(city: string): string {
  return city.trim().toLowerCase();
}

function scoreCandidate(
  me: UserProfile,
  other: UserProfile,
  mapUserIds: Set<string>
): { score: number; reasons: string[]; onlineOnMap: boolean } {
  let score = 0;
  const reasons: string[] = [];
  const onlineOnMap = mapUserIds.has(other.user_id);

  if (me.status_mood && other.status_mood && me.status_mood === other.status_mood) {
    score += 30;
    reasons.push(`Both ${moodLabel(other.status_mood as StatusMood)}`);
  } else if (
    me.status_mood === "open-to-collab" ||
    other.status_mood === "open-to-collab"
  ) {
    score += 18;
    reasons.push("Open to collab");
  }

  if (me.genre && other.genre && me.genre.toUpperCase() === other.genre.toUpperCase()) {
    score += 25;
    reasons.push(`Same genre · ${other.genre}`);
  }

  if (me.role && other.role && me.role === other.role) {
    score += 20;
    reasons.push(`Same role · ${other.role}`);
  } else if (me.role && other.role && me.role !== "OTHER" && other.role !== "OTHER") {
    score += 8;
    reasons.push(`Complementary · ${other.role}`);
  }

  if (me.city && other.city && normalizeCity(me.city) === normalizeCity(other.city)) {
    score += 20;
    reasons.push(`Same city · ${other.city}`);
  }

  if (
    me.status_artist &&
    other.status_artist &&
    me.status_artist.toLowerCase() === other.status_artist.toLowerCase()
  ) {
    score += 20;
    reasons.push(`Into ${other.status_artist}`);
  } else {
    const artistKeywords = overlappingKeywords(
      me.status_artist || me.status_text,
      other.status_artist || other.status_text
    );
    if (artistKeywords.length > 0) {
      score += 15;
      reasons.push(`Shared vibe · ${artistKeywords.slice(0, 2).join(", ")}`);
    }
  }

  const textOverlap = overlappingKeywords(me.status_text, other.status_text);
  if (textOverlap.length > 0 && !reasons.some((r) => r.startsWith("Shared vibe"))) {
    score += 12;
    reasons.push(`Overlapping interests · ${textOverlap.slice(0, 2).join(", ")}`);
  }

  if (onlineOnMap) {
    score += 10;
    reasons.push("Recently on the map");
  }

  if (other.status_text && score === 0) {
    score += 5;
    reasons.push("Active in the scene");
  }

  return { score, reasons: reasons.slice(0, 3), onlineOnMap };
}

function moodLabel(mood: StatusMood): string {
  const labels: Record<StatusMood, string> = {
    listening: "listening",
    writing: "writing",
    recording: "recording",
    "open-to-collab": "open to collab",
    "": "",
  };
  return labels[mood] ?? mood;
}

export async function discoverMusicians(userId: string, limit = 12): Promise<DiscoverMatch[]> {
  if (discoveryUnavailable()) return [];

  const [{ data: me, error: meError }, { data: profiles, error }, presence] = await Promise.all([
    db().from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
    db()
      .from("user_profiles")
      .select("*")
      .neq("user_id", userId)
      .order("status_updated_at", { ascending: false, nullsFirst: false }),
    fetchMapPresence().catch(() => []),
  ]);

  if (meError) throw meError;
  if (error) throw error;
  if (!me) return [];

  const others = profiles ?? [];
  const mapUserIds = new Set(presence.map((p) => p.user_id));

  const ranked = others
    .map((other) => {
      const { score, reasons, onlineOnMap } = scoreCandidate(me, other, mapUserIds);
      return {
        profile: other as UserProfile,
        score,
        reason: reasons.length > 0 ? reasons.join(" · ") : "In your orbit",
        onlineOnMap,
      };
    })
    .filter((m) => m.score > 0 || m.profile.status_text)
    .sort((a, b) => b.score - a.score || (b.profile.status_updated_at ?? "").localeCompare(a.profile.status_updated_at ?? ""))
    .slice(0, limit);

  return ranked;
}
