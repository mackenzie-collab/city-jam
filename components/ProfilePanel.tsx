"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Sparkles, Users, Trash2 } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import JamStreakWidget, { BadgeGallery } from "@/components/JamStreakWidget";
import ToolsStrip from "@/components/ToolsStrip";
import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FILTER_OPTIONS } from "@/lib/studio";
import { fetchUserPosts, type FeedItem, FEED_KIND_LABEL } from "@/lib/community";
import { fetchJamStreak, type JamStreak } from "@/lib/streaks";
import {
  fetchProfile,
  upsertProfile,
  updateProfileStatus,
  STATUS_MOODS,
  STATUS_PRESETS,
  displayName,
  type StatusMood,
  type UserProfile,
} from "@/lib/profiles";
import { CITY_DOTS } from "@/lib/signal-map-data";

interface ProfilePanelProps {
  viewUserId?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProfilePanel({ viewUserId }: ProfilePanelProps) {
  const { user, deleteAccount } = useAuth();
  const targetId = viewUserId ?? user?.id;
  const isOwnProfile = !viewUserId || viewUserId === user?.id;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    display_name: "",
    username: "",
    manifesto_quote: "",
    role: "OTHER",
    genre: "",
    city: "",
    bio: "",
  });
  const [statusForm, setStatusForm] = useState({
    status_text: "",
    status_artist: "",
    status_mood: "" as StatusMood,
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState<JamStreak | null>(null);
  const [activity, setActivity] = useState<FeedItem[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    if (!targetId) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const [p, posts] = await Promise.all([
        fetchProfile(targetId),
        fetchUserPosts(targetId).catch(() => [] as FeedItem[]),
      ]);
      setActivity(posts);
      if (p) {
        setProfile(p);
        if (isOwnProfile) {
          setForm({
            display_name: p.display_name,
            username: p.username ?? "",
            manifesto_quote: p.manifesto_quote ?? "",
            role: p.role,
            genre: p.genre,
            city: p.city,
            bio: p.bio,
          });
          setStatusForm({
            status_text: p.status_text ?? "",
            status_artist: p.status_artist ?? "",
            status_mood: (p.status_mood ?? "") as StatusMood,
          });
        }
      } else if (isOwnProfile && user) {
        setForm((f) => ({
          ...f,
          display_name: user.name ?? user.email.split("@")[0],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
      if (isOwnProfile && user) {
        setForm((f) => ({
          ...f,
          display_name: user.name ?? user.email.split("@")[0],
        }));
      }
    }
    setLoading(false);
  }, [targetId, isOwnProfile, user]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    if (!targetId) return;
    fetchJamStreak(targetId).then(setStreak);
  }, [targetId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !isOwnProfile) return;
    setError(null);
    try {
      const p = await upsertProfile(user.id, form);
      setProfile(p);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleStatusSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !isOwnProfile) return;
    setError(null);
    try {
      const name = displayName(profile, user.name ?? user.email);
      const p = await updateProfileStatus(user.id, statusForm, name);
      setProfile(p);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
      fetchUserPosts(user.id).then(setActivity).catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const applyPreset = (preset: (typeof STATUS_PRESETS)[number]) => {
    setStatusForm({
      status_text: preset.text,
      status_artist: preset.artist ?? "",
      status_mood: preset.mood ?? ("" as StatusMood),
    });
  };

  const handleDeleteAccount = async () => {
    if (!user?.id || deleteConfirm !== "DELETE") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Account deletion failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <FeatureShell
      title={isOwnProfile ? "Profile" : displayName(profile)}
      icon={User}
      badge={isOwnProfile ? "Your Sound" : "Musician"}
      heading={
        isOwnProfile ? (
          <>
            Build Your / <span className="text-cj-gold-bright">Sound Profile.</span>
          </>
        ) : (
          <>
            {displayName(profile)} / <span className="text-cj-gold-bright">Profile.</span>
          </>
        )
      }
      subtitle={
        isOwnProfile
          ? "Your status powers discovery — collaborators see this across community, rooms, and the map."
          : "See what they're into and connect via community or studio."
      }
      maxWidth="md"
      headerRight={
        !isOwnProfile ? (
          user ? (
            <Link href="/profile">
              <Button variant="secondary" size="sm">
                Your Profile
              </Button>
            </Link>
          ) : (
            <Link href={`/login?returnUrl=/profile?user=${viewUserId}`}>
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )
        ) : (
          <Link href="/scene">
            <Button variant="secondary" size="sm">
              Scene
            </Button>
          </Link>
        )
      }
    >
      {isOwnProfile && (
        <div className="mb-8">
          <ToolsStrip variant="compact" title="Your Tools" />
        </div>
      )}

      {loading ? (
        <p className="text-cj-gold-muted">Loading...</p>
      ) : (
        <div className="space-y-6">
          {streak && (
            <div className="space-y-4">
              {isOwnProfile ? (
                <JamStreakWidget showBadges={false} />
              ) : (
                <div className="cj-card border-label-amber/30">
                  <p className="text-xs font-medium text-label-amber/80">Jam Streak</p>
                  <p className="mt-2 font-display text-4xl text-cj-gold">
                    {streak.current_week_streak}
                    <span className="ml-2 text-sm uppercase text-cj-gold-muted">weeks</span>
                  </p>
                </div>
              )}
              <BadgeGallery earnedIds={streak.earned_badges} />
            </div>
          )}

          {profile?.status_text && (
            <div className="cj-card border-cj-gold/40">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                <Sparkles className="h-3 w-3" /> Current status
              </p>
              <p className="mt-2 font-display text-lg text-cj-gold-bright">
                &ldquo;{profile.status_text}&rdquo;
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.status_mood && (
                  <span className="cj-tag border-cj-gold/40 text-cj-gold">
                    {STATUS_MOODS.find((m) => m.value === profile.status_mood)?.label ??
                      profile.status_mood}
                  </span>
                )}
                {profile.status_artist && (
                  <span className="cj-tag border-cj-gold-border text-cj-gold-muted">
                    {profile.status_artist}
                  </span>
                )}
              </div>
              {profile.status_updated_at && (
                <p className="mt-2 text-[10px] text-cj-gold-muted">
                  Updated {new Date(profile.status_updated_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {isOwnProfile && (
            <form onSubmit={handleStatusSave} className="cj-card space-y-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-cj-gold-muted">
                <Sparkles className="h-4 w-4" /> Set your status
              </p>
              <p className="text-xs text-cj-gold-muted">
                Powers discovery — musicians with matching vibes surface in your orbit.
              </p>

              <div className="flex flex-wrap gap-2">
                {STATUS_PRESETS.map((preset) => (
                  <button
                    key={preset.text}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="cj-tag cursor-pointer border-cj-gold-border text-cj-gold-muted transition-colors hover:border-cj-gold/50 hover:text-cj-gold"
                  >
                    {preset.text}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Status
                </label>
                <input
                  value={statusForm.status_text}
                  onChange={(e) => setStatusForm({ ...statusForm, status_text: e.target.value })}
                  placeholder="Currently deep in Floating Points..."
                  className="cj-input !pl-4 mt-1"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    Artist (optional)
                  </label>
                  <input
                    value={statusForm.status_artist}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, status_artist: e.target.value })
                    }
                    placeholder="Floating Points, Radiohead..."
                    className="cj-input !pl-4 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    Mood
                  </label>
                  <select
                    value={statusForm.status_mood}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, status_mood: e.target.value as StatusMood })
                    }
                    className="cj-input !pl-4 !w-full mt-1"
                  >
                    <option value="">None</option>
                    {STATUS_MOODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" disabled={!statusForm.status_text.trim()}>
                {statusSaved ? "Status live!" : "Update Status"}
              </Button>
            </form>
          )}

          {isOwnProfile ? (
            <form onSubmit={handleSave} className="cj-card space-y-4">
              {profile?.cover_image_url && (
                <div className="flex justify-center py-2">
                  <VinylPhotoFrame src={profile.cover_image_url} alt="Cover preview" size={168} maxVw={40} />
                </div>
              )}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Cover image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-xs text-cj-gold-muted"
                  disabled={coverUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user?.id) return;
                    setCoverUploading(true);
                    setError(null);
                    try {
                      const { uploadCoverImage } = await import("@/lib/profiles");
                      const url = await uploadCoverImage(user.id, file);
                      const p = await upsertProfile(user.id, { cover_image_url: url });
                      setProfile(p);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Cover upload failed");
                    } finally {
                      setCoverUploading(false);
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Display name
                </label>
                <input
                  required
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="cj-input !pl-4 mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Username
                </label>
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })
                  }
                  placeholder="yourhandle"
                  className="cj-input !pl-4 mt-1"
                />
                {form.username && (
                  <p className="mt-1 text-[10px] text-cj-gold-muted">
                    Public profile: /profile/{form.username}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Manifesto quote
                </label>
                <textarea
                  value={form.manifesto_quote}
                  onChange={(e) => setForm({ ...form, manifesto_quote: e.target.value })}
                  placeholder="Your sound philosophy in one line..."
                  className="cj-input !pl-4 mt-1 min-h-[80px] cj-typewriter"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Primary role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="cj-input !pl-4 !w-full mt-1"
                >
                  {FILTER_OPTIONS.filter((f) => f !== "ALL").map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    Genre
                  </label>
                  <input
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value.toUpperCase() })}
                    placeholder="ROCK, JAZZ..."
                    className="cj-input !pl-4 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    City
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Manila, London, Tokyo…"
                    list="profile-city-options"
                    className="cj-input !pl-4 mt-1"
                  />
                  <datalist id="profile-city-options">
                    {CITY_DOTS.map((city) => (
                      <option key={city.slug} value={city.name} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="What you play, what you're looking for..."
                  className="cj-input !pl-4 mt-1 min-h-[120px]"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" variant="primary">
                {saved ? "Saved!" : "Save Profile"}
              </Button>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/settings/account" className="text-xs uppercase tracking-widest text-cj-gold hover:underline">
                  Connected accounts
                </Link>
                <Link href="/settings/security" className="text-xs uppercase tracking-widest text-cj-gold hover:underline">
                  Security & MFA
                </Link>
              </div>
              {profile && (
                <p className="text-[10px] text-cj-gold-muted">
                  Last updated {new Date(profile.updated_at).toLocaleString()}
                </p>
              )}
            </form>
          ) : profile ? (
            <div className="cj-card space-y-4">
              {profile.cover_image_url && (
                <div className="flex justify-center py-2">
                  <VinylPhotoFrame
                    src={profile.cover_image_url}
                    alt={displayName(profile)}
                    size={192}
                    maxVw={44}
                  />
                </div>
              )}
              <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                {profile.role}
                {profile.genre ? ` · ${profile.genre}` : ""}
                {profile.city ? ` · ${profile.city}` : ""}
              </p>
              {profile.bio && (
                <p className="text-sm leading-relaxed text-cj-gold-muted">{profile.bio}</p>
              )}
              <Link
                href="/scene"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-cj-gold hover:opacity-80"
              >
                <Users className="h-3 w-3" /> Explore the Scene
              </Link>
            </div>
          ) : (
            <p className="text-cj-gold-muted">Profile not found.</p>
          )}

          {activity.length > 0 && (
            <section className="cj-card">
              <p className="mb-4 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                Recent activity
              </p>
              <ul className="space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="border-b border-cj-gold-border/30 pb-3 last:border-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="cj-tag">{FEED_KIND_LABEL[item.kind]}</span>
                      <span className="text-[10px] text-cj-gold-muted">
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                    {item.title && (
                      <p className="mt-1 text-sm font-display uppercase text-cj-gold">{item.title}</p>
                    )}
                    <p className="mt-1 text-sm text-cj-gold-muted">{item.body}</p>
                    {item.href && (
                      <Link href={item.href} className="mt-1 inline-block text-xs text-cj-gold underline">
                        View →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isOwnProfile && (
            <section className="cj-card border-red-500/30">
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-300/80">
                <Trash2 className="h-4 w-4" /> Delete account
              </p>
              <p className="mt-2 text-sm text-cj-gold-muted">
                Permanently removes your profile, map presence, match queue entries, community posts,
                vault metadata, and local session data. This cannot be undone.
              </p>
              {!deleteOpen ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4 border-red-500/40 text-red-300"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete my account
                </Button>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-cj-gold-muted">
                    Type <strong className="text-cj-gold">DELETE</strong> to confirm.
                  </p>
                  <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="cj-input !pl-4"
                    placeholder="DELETE"
                    autoComplete="off"
                  />
                  {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="border-red-500/40 text-red-300"
                      disabled={deleteConfirm !== "DELETE" || deleting}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? "Deleting..." : "Confirm deletion"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setDeleteOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </FeatureShell>
  );
}
