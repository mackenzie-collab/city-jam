"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Music } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import ToolsStrip from "@/components/ToolsStrip";
import JamStreakWidget from "@/components/JamStreakWidget";
import ProjectKanban from "@/components/ProjectKanban";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createCommunityPost } from "@/lib/community";
import { displayName, fetchProfile } from "@/lib/profiles";
import {
  createProject,
  fetchProjects,
  type MusicProject,
  studioUnavailable,
} from "@/lib/studio";

export default function StudioDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", genre: "" });

  const load = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    setProjects(await fetchProjects(user.id));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const project = await createProject(user.id, form);
    try {
      const profile = await fetchProfile(user.id);
      const name = displayName(profile, user.name ?? user.email);
      await createCommunityPost(user.id, name, {
        kind: "project",
        title: `New project: ${project.title}`,
        body: form.description || "Started a new track on City Jam.",
        ref_id: project.id,
      });
    } catch {
      /* optional */
    }
    setShowNew(false);
    setForm({ title: "", description: "", genre: "" });
    load();
  };

  return (
    <FeatureShell
      title="Studio"
      icon={Music}
      badge="Project Management"
      heading={
        <>
          Your Music / <span className="text-cj-gold-bright">Command Center.</span>
        </>
      }
      subtitle="Kanban board, projects, and every tool — connected to your community feed."
      maxWidth="xl"
      headerRight={
        <div className="flex gap-2">
          <Link href="/community">
            <Button variant="secondary" size="sm">
              Community
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setShowNew(true)}>
            <Plus className="mr-1 h-4 w-4" /> New Project
          </Button>
        </div>
      }
    >
      <div className="mb-8">
        <JamStreakWidget />
      </div>

      <div className="mb-10">
        <ToolsStrip title="Explore tools" variant="full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div className="space-y-10">
          {showNew && (
            <form onSubmit={handleCreate} className="cj-card space-y-4">
              <p className="text-xs uppercase tracking-widest text-cj-gold-muted">New music project</p>
              <input
                required
                placeholder="Project title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="cj-input !pl-4"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="cj-input !pl-4 min-h-[80px]"
              />
              <input
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value.toUpperCase() })}
                className="cj-input !pl-4"
              />
              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  Create Project
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <ProjectKanban projects={projects} onProjectsUpdated={load} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-cj-gold">All Projects</h2>
              <Link href="/community" className="text-xs uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
                View Feed
              </Link>
            </div>
            {loading ? (
              <p className="text-cj-gold-muted">Loading...</p>
            ) : projects.length === 0 ? (
              <EmptyState
                icon={Music}
                title="No Projects Yet"
                description="Create a project — it shows on your board and community feed."
                actionLabel="New Project"
                onAction={() => setShowNew(true)}
              />
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/studio/projects/${p.id}`}
                    className="cj-card flex items-center justify-between py-4 no-underline transition-colors hover:border-cj-gold/60"
                  >
                    <div>
                      <h3 className="font-display text-lg uppercase text-cj-gold">{p.title}</h3>
                      <p className="mt-1 text-xs text-cj-gold-muted">
                        {(p.stage ?? "ideas").toUpperCase()}
                        {p.genre && ` · ${p.genre}`}
                      </p>
                    </div>
                    <span className="cj-status-open">{p.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </FeatureShell>
  );
}
