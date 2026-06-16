"use client";



import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { User, Sparkles } from "lucide-react";

import FeatureShell from "@/components/FeatureShell";

import JamStreakWidget, { BadgeGallery } from "@/components/JamStreakWidget";
import { fetchJamStreak, type JamStreak } from "@/lib/streaks";

import ToolsStrip from "@/components/ToolsStrip";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { FILTER_OPTIONS } from "@/lib/studio";

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



interface ProfilePanelProps {

  viewUserId?: string;

}



export default function ProfilePanel({ viewUserId }: ProfilePanelProps) {

  const { user } = useAuth();

  const targetId = viewUserId ?? user?.id;

  const isOwnProfile = !viewUserId || viewUserId === user?.id;



  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [form, setForm] = useState({

    display_name: "",

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



  const load = useCallback(async () => {

    if (!targetId) {

      setLoading(false);

      return;

    }

    try {

      const p = await fetchProfile(targetId);

      if (p) {

        setProfile(p);

        if (isOwnProfile) {

          setForm({

            display_name: p.display_name,

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

    } catch {

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

    load();

  }, [load]);

  useEffect(() => {
    if (!targetId) return;
    fetchJamStreak(targetId).then(setStreak);
  }, [targetId]);



  const handleSave = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!user?.id || !isOwnProfile) return;

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

    try {

      const name = displayName(profile, user.name ?? user.email);

      const p = await updateProfileStatus(user.id, statusForm, name);

      setProfile(p);

      setStatusSaved(true);

      setTimeout(() => setStatusSaved(false), 2000);

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

          ? "This is what collaborators see when you apply to projects or join circles."

          : "See what they're into and how to connect."

      }

      maxWidth="md"

      headerRight={

        !isOwnProfile ? (

          <Link href="/profile">

            <Button variant="secondary" size="sm">

              Your Profile

            </Button>

          </Link>

        ) : undefined

      }

    >

      {isOwnProfile && (

        <div className="mb-8 space-y-8">

          <JamStreakWidget showBadges={false} />

          {streak && <BadgeGallery earnedIds={streak.earned_badges} />}

          <ToolsStrip variant="compact" title="Your Tools" />

        </div>

      )}



      {loading ? (

        <p className="text-cj-gold-muted">Loading...</p>

      ) : (

        <div className="space-y-6">

          {profile?.status_text && (

            <div className="cj-card border-cj-gold/40">

              <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">

                <Sparkles className="h-3 w-3" /> Current status

              </p>

              <p className="mt-2 font-display text-lg text-cj-gold-bright">&ldquo;{profile.status_text}&rdquo;</p>

              <div className="mt-2 flex flex-wrap gap-2">

                {profile.status_mood && (

                  <span className="cj-tag border-cj-gold/40 text-cj-gold">

                    {STATUS_MOODS.find((m) => m.value === profile.status_mood)?.label ?? profile.status_mood}

                  </span>

                )}

                {profile.status_artist && (

                  <span className="cj-tag border-cj-gold-border text-cj-gold-muted">{profile.status_artist}</span>

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

                Powers discovery — musicians with matching vibes, genres, and cities surface in your orbit.

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

                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Status</label>

                <input

                  value={statusForm.status_text}

                  onChange={(e) => setStatusForm({ ...statusForm, status_text: e.target.value })}

                  placeholder="Currently deep in Floating Points..."

                  className="cj-input !pl-4 mt-1"

                />

              </div>



              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Artist (optional)</label>

                  <input

                    value={statusForm.status_artist}

                    onChange={(e) => setStatusForm({ ...statusForm, status_artist: e.target.value })}

                    placeholder="Floating Points, Radiohead..."

                    className="cj-input !pl-4 mt-1"

                  />

                </div>

                <div>

                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Mood</label>

                  <select

                    value={statusForm.status_mood}

                    onChange={(e) => setStatusForm({ ...statusForm, status_mood: e.target.value as StatusMood })}

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

              <div>

                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Display name</label>

                <input

                  required

                  value={form.display_name}

                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}

                  className="cj-input !pl-4 mt-1"

                />

              </div>

              <div>

                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Primary role</label>

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

                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Genre</label>

                  <input

                    value={form.genre}

                    onChange={(e) => setForm({ ...form, genre: e.target.value.toUpperCase() })}

                    placeholder="ROCK, JAZZ..."

                    className="cj-input !pl-4 mt-1"

                  />

                </div>

                <div>

                  <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">City</label>

                  <input

                    value={form.city}

                    onChange={(e) => setForm({ ...form, city: e.target.value })}

                    placeholder="London, NYC..."

                    className="cj-input !pl-4 mt-1"

                  />

                </div>

              </div>

              <div>

                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Bio</label>

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

              {profile && (

                <p className="text-[10px] text-cj-gold-muted">

                  Last updated {new Date(profile.updated_at).toLocaleString()}

                </p>

              )}

            </form>

          ) : profile ? (

            <div className="cj-card space-y-3">

              <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">

                {profile.role}

                {profile.genre ? ` · ${profile.genre}` : ""}

                {profile.city ? ` · ${profile.city}` : ""}

              </p>

              {profile.bio && <p className="text-sm leading-relaxed text-cj-gold-muted">{profile.bio}</p>}

            </div>

          ) : (

            <p className="text-cj-gold-muted">Profile not found.</p>

          )}

        </div>

      )}

    </FeatureShell>

  );

}


