"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FILTER_OPTIONS } from "@/lib/studio";
import { fetchProfile, upsertProfile, type UserProfile } from "@/lib/profiles";

export default function ProfilePanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    display_name: "",
    role: "OTHER",
    genre: "",
    city: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const p = await fetchProfile(user.id);
      if (p) {
        setProfile(p);
        setForm({
          display_name: p.display_name,
          role: p.role,
          genre: p.genre,
          city: p.city,
          bio: p.bio,
        });
      } else {
        setForm((f) => ({
          ...f,
          display_name: user.name ?? user.email.split("@")[0],
        }));
      }
    } catch {
      setForm((f) => ({
        ...f,
        display_name: user.name ?? user.email.split("@")[0],
      }));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      const p = await upsertProfile(user.id, form);
      setProfile(p);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <FeatureShell
      title="Profile"
      icon={User}
      badge="Your Sound"
      heading={
        <>
          Build Your / <span className="text-cj-gold-bright">Sound Profile.</span>
        </>
      }
      subtitle="This is what collaborators see when you apply to projects or join circles."
      maxWidth="md"
    >
      {loading ? (
        <p className="text-cj-gold-muted">Loading...</p>
      ) : (
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
      )}
    </FeatureShell>
  );
}
