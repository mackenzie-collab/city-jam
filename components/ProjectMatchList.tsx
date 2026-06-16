"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import AuthBanner from "@/components/AuthBanner";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  FILTER_OPTIONS,
  ROLE_ICONS,
  createProjectNeed,
  fetchProjectNeeds,
  type FilterOption,
  type ProjectNeed,
  studioUnavailable,
} from "@/lib/studio";

export default function ProjectMatchList() {
  const { user, isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("ALL");
  const [listings, setListings] = useState<ProjectNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", role: "VOCALIST", genre: "" });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchProjectNeeds(activeFilter === "ALL" ? undefined : activeFilter);
      setListings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await createProjectNeed(user.id, form);
      setShowForm(false);
      setForm({ title: "", role: "VOCALIST", genre: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post failed");
    }
  };

  return (
    <FeatureShell
      title="Project Match"
      icon={Briefcase}
      badge="Studio"
      heading={
        <>
          Match On / <span className="text-cj-gold-bright">Project Need.</span>
        </>
      }
      subtitle="Post what your track needs. Get matched with musicians actively looking for exactly that."
      headerRight={
        isAuthenticated ? (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="mr-1 h-4 w-4" /> Post
          </Button>
        ) : undefined
      }
      footer={
        !isAuthenticated ? (
          <AuthBanner message="Sign in to post your own project needs." returnUrl="/project-match" />
        ) : undefined
      }
    >
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`cj-pill ${activeFilter === filter ? "cj-pill-active" : ""}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {showForm && isAuthenticated && (
        <form onSubmit={handlePost} className="cj-card mt-6 space-y-4">
          <p className="text-xs uppercase tracking-widest text-cj-gold-muted">New project need</p>
          <input
            required
            placeholder="e.g. Rock vocalist in need"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="cj-input !pl-4"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="cj-input !pl-4 !w-auto"
            >
              {FILTER_OPTIONS.filter((f) => f !== "ALL").map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              placeholder="Genre (ROCK, JAZZ…)"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value.toUpperCase() })}
              className="cj-input !pl-4 flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Publish
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {error && <p className="mt-4 text-sm text-cj-gold-bright/90">{error}</p>}

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-center text-cj-gold-muted">Loading...</p>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Projects Yet"
            description="Post the first need or widen your filter."
            actionLabel={isAuthenticated ? "Post a Need" : undefined}
            onAction={isAuthenticated ? () => setShowForm(true) : undefined}
          />
        ) : (
          listings.map((project) => (
            <div key={project.id} className="cj-card flex items-center gap-4 py-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark text-xl">
                {ROLE_ICONS[project.role] ?? ROLE_ICONS.DEFAULT}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg uppercase text-cj-gold">{project.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="cj-tag">{project.role}</span>
                  {project.genre && <span className="cj-tag">{project.genre}</span>}
                </div>
              </div>
              <span className="cj-status-open shrink-0">{project.status}</span>
            </div>
          ))
        )}
      </div>
    </FeatureShell>
  );
}
