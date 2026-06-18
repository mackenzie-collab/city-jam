"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchProjects,
  updateProject,
  type MusicProject,
  studioUnavailable,
} from "@/lib/studio";

export const STAGES = [
  { id: "ideas", label: "Ideas", color: "border-purple-500/40" },
  { id: "writing", label: "Writing", color: "border-blue-500/40" },
  { id: "recording", label: "Recording", color: "border-green-500/40" },
  { id: "mixing", label: "Mixing", color: "border-yellow-500/40" },
  { id: "release", label: "Release", color: "border-cj-gold/50" },
] as const;

export type ProjectStage = (typeof STAGES)[number]["id"];

const DRAG_MIME = "application/x-cj-project-id";

interface ProjectKanbanProps {
  projects?: MusicProject[];
  onProjectsUpdated?: () => void;
}

export default function ProjectKanban({
  projects: externalProjects,
  onProjectsUpdated,
}: ProjectKanbanProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [internalProjects, setInternalProjects] = useState<MusicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);
  const draggedRef = useRef(false);

  const projects = externalProjects ?? internalProjects;

  const load = useCallback(async () => {
    if (externalProjects) {
      setLoading(false);
      return;
    }
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setInternalProjects(await fetchProjects(user.id));
    } catch {
      setError("Could not load project board");
    } finally {
      setLoading(false);
    }
  }, [user?.id, externalProjects]);

  useEffect(() => {
    load();
  }, [load]);

  const moveToStage = async (projectId: string, stage: ProjectStage) => {
    if (!user?.id) return;
    const prev = projects;
    const next = prev.map((p) => (p.id === projectId ? { ...p, stage } : p));
    if (!externalProjects) setInternalProjects(next);
    try {
      setError(null);
      await updateProject(projectId, user.id, { stage });
      onProjectsUpdated?.();
    } catch {
      if (!externalProjects) setInternalProjects(prev);
      setError("Could not move project — try again");
    }
  };

  if (studioUnavailable() && !externalProjects) {
    return (
      <p className="text-sm text-cj-gold-muted">
        Project board requires Supabase — configure env vars to save projects.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-cj-gold-muted">Loading board...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl uppercase text-cj-gold">Project Board</h2>
        <Link href="/studio" className="text-[10px] uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
          + New project
        </Link>
      </div>
      {error && <p className="mb-3 text-xs text-amber-400">{error}</p>}
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x-mandatory">
        {STAGES.map(({ id, label, color }) => {
          const column = projects.filter((p) => (p.stage ?? "ideas") === id);
          return (
            <div
              key={id}
              className={`min-w-[min(85vw,220px)] flex-1 snap-start rounded-xl border ${color} bg-cj-dark/50 p-3 sm:min-w-[200px]`}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const projectId =
                  e.dataTransfer.getData(DRAG_MIME) || dragIdRef.current;
                if (projectId) moveToStage(projectId, id);
                dragIdRef.current = null;
              }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                {label} ({column.length})
              </p>
              <ul className="space-y-2">
                {column.map((p) => (
                  <li key={p.id}>
                    <div
                      draggable
                      onDragStart={(e) => {
                        draggedRef.current = false;
                        dragIdRef.current = p.id;
                        e.dataTransfer.setData(DRAG_MIME, p.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDrag={(e) => {
                        if (e.clientX !== 0 || e.clientY !== 0) draggedRef.current = true;
                      }}
                      onDragEnd={() => {
                        dragIdRef.current = null;
                      }}
                      onClick={() => {
                        if (!draggedRef.current) router.push(`/studio/projects/${p.id}`);
                      }}
                      className="cursor-pointer rounded-lg border border-cj-gold-border bg-cj-purple-card px-3 py-2 transition-colors hover:border-cj-gold/50 active:cursor-grabbing"
                    >
                      <p className="text-sm font-semibold uppercase text-cj-gold">{p.title}</p>
                      {p.genre && (
                        <p className="mt-0.5 text-[10px] text-cj-gold-muted">{p.genre}</p>
                      )}
                      <div className="relative mt-2 md:hidden">
                        <label className="sr-only" htmlFor={`stage-${p.id}`}>
                          Move {p.title}
                        </label>
                        <select
                          id={`stage-${p.id}`}
                          value={p.stage ?? "ideas"}
                          onChange={(e) =>
                            moveToStage(p.id, e.target.value as ProjectStage)
                          }
                          className="w-full appearance-none rounded border border-cj-gold-border bg-cj-dark py-1.5 pl-2 pr-7 text-[10px] uppercase tracking-wider text-cj-gold"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-cj-gold-muted" />
                      </div>
                    </div>
                  </li>
                ))}
                {column.length === 0 && (
                  <p className="py-4 text-center text-[10px] text-cj-gold-muted/60">
                    Drop here
                  </p>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
