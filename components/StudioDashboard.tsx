"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Briefcase,
  FolderKanban,
  Headphones,
  Plus,
  Users,
  Music,
} from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createProject,
  fetchProjects,
  fetchProjectNeeds,
  fetchVaultItems,
  fetchWorkspaces,
  fetchTasks,
  fetchMyCircles,
  fetchListeningRooms,
  type MusicProject,
  studioUnavailable,
} from "@/lib/studio";

export default function StudioDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [stats, setStats] = useState({ needs: 0, vault: 0, tasks: 0, circles: 0, rooms: 0 });
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", genre: "" });

  const load = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    const [projs, needs, vault, workspaces, circles, rooms] = await Promise.all([
      fetchProjects(user.id),
      fetchProjectNeeds(),
      fetchVaultItems(user.id),
      fetchWorkspaces(user.id),
      fetchMyCircles(user.id),
      fetchListeningRooms(),
    ]);
    setProjects(projs);
    let taskCount = 0;
    for (const ws of workspaces) {
      const tasks = await fetchTasks(ws.id);
      taskCount += tasks.filter((t) => !t.done).length;
    }
    setStats({
      needs: needs.length,
      vault: vault.length,
      tasks: taskCount,
      circles: circles.length,
      rooms: rooms.length,
    });
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    await createProject(user.id, form);
    setShowNew(false);
    setForm({ title: "", description: "", genre: "" });
    load();
  };

  const statCards = [
    { label: "Open Needs", value: stats.needs, href: "/project-match", icon: Briefcase },
    { label: "Vault Items", value: stats.vault, href: "/vault", icon: Archive },
    { label: "Open Tasks", value: stats.tasks, href: "/collab", icon: FolderKanban },
    { label: "Circles", value: stats.circles, href: "/circles", icon: Users },
    { label: "Listening Rooms", value: stats.rooms, href: "/listening-rooms", icon: Headphones },
  ];

  return (
    <FeatureShell
      title="Studio"
      icon={Music}
      badge="Your Workspace"
      heading={
        <>
          Your Music / <span className="text-cj-gold-bright">Studio.</span>
        </>
      }
      subtitle="Projects, vault, collab, and matchmaking — all connected in one place."
      maxWidth="xl"
      headerRight={
        <Button variant="primary" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="mr-1 h-4 w-4" /> New Project
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div>
          {showNew && (
            <form onSubmit={handleCreate} className="cj-card mb-8 space-y-4">
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

          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map(({ label, value, href, icon: Icon }) => (
              <Link key={href} href={href} className="cj-card group flex items-center gap-4 py-4 no-underline">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark">
                  <Icon className="h-5 w-5 text-cj-gold-muted group-hover:text-cj-gold" />
                </div>
                <div>
                  <p className="font-display text-2xl text-cj-gold">{loading ? "—" : value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">{label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-cj-gold">Your Projects</h2>
              <Link href="/collab" className="text-xs uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
                Open Collab
              </Link>
            </div>
            {loading ? (
              <p className="text-cj-gold-muted">Loading...</p>
            ) : projects.length === 0 ? (
              <EmptyState
                icon={Music}
                title="No Projects Yet"
                description="Create a project to organize vault files, collab tasks, and needs."
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
                        {p.genre && `${p.genre} · `}
                        {p.description || "No description"}
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
