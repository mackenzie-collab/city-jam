"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { fetchProjects, updateProject, type MusicProject, studioUnavailable } from "@/lib/studio";

export const STAGES = [
  { id: "ideas", label: "Ideas", color: "border-purple-500/40" },
  { id: "writing", label: "Writing", color: "border-blue-500/40" },
  { id: "recording", label: "Recording", color: "border-green-500/40" },
  { id: "mixing", label: "Mixing", color: "border-yellow-500/40" },
  { id: "release", label: "Release", color: "border-cj-gold/50" },
] as const;

export type ProjectStage = (typeof STAGES)[number]["id"];

export default function ProjectKanban() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);

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

  const moveToStage = async (projectId: string, stage: ProjectStage) => {
    if (!user?.id) return;
    await updateProject(projectId, user.id, { stage });
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, stage } : p)));
  };

  if (loading) return <p className="text-sm text-cj-gold-muted">Loading board...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl uppercase text-cj-gold">Project Board</h2>
        <Link href="/studio" className="text-[10px] uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
          + New project
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map(({ id, label, color }) => {
          const column = projects.filter((p) => (p.stage ?? "ideas") === id);
          return (
            <div
              key={id}
              className={`min-w-[200px] flex-1 rounded-xl border ${color} bg-cj-dark/50 p-3`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragging) {
                  moveToStage(dragging, id);
                  setDragging(null);
                }
              }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                {label} ({column.length})
              </p>
              <ul className="space-y-2">
                {column.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/studio/projects/${p.id}`}
                      draggable
                      onDragStart={() => setDragging(p.id)}
                      onDragEnd={() => setDragging(null)}
                      className="block cursor-grab rounded-lg border border-cj-gold-border bg-cj-purple-card px-3 py-2 no-underline transition-colors hover:border-cj-gold/50 active:cursor-grabbing"
                    >
                      <p className="text-sm font-semibold uppercase text-cj-gold">{p.title}</p>
                      {p.genre && <p className="mt-0.5 text-[10px] text-cj-gold-muted">{p.genre}</p>}
                    </Link>
                  </li>
                ))}
                {column.length === 0 && (
                  <p className="py-4 text-center text-[10px] text-cj-gold-muted/60">Drop here</p>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
