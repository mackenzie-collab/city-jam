"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Plus, Check, Square, Trash2 } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createTask,
  createWorkspace,
  deleteTask,
  deleteWorkspace,
  fetchProjects,
  fetchTasks,
  fetchWorkspaces,
  toggleTask,
  type CollabTask,
  type CollabWorkspace,
  studioUnavailable,
} from "@/lib/studio";

export default function CollabPanel() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<CollabWorkspace[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<CollabTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWs, setNewWs] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [newTask, setNewTask] = useState("");

  const loadWs = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    const [ws, projs] = await Promise.all([fetchWorkspaces(user.id), fetchProjects(user.id)]);
    setProjects(projs.map((p) => ({ id: p.id, title: p.title })));
    setWorkspaces(ws);
    if (ws.length && !activeId) setActiveId(ws[0].id);
    setLoading(false);
  }, [user?.id, activeId]);

  const loadTasks = useCallback(async () => {
    if (!activeId) return;
    setTasks(await fetchTasks(activeId));
  }, [activeId]);

  useEffect(() => {
    loadWs();
  }, [loadWs]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newWs.trim()) return;
    const ws = await createWorkspace(user.id, {
      title: newWs.trim(),
      project_id: newProjectId || undefined,
    });
    setNewWs("");
    setNewProjectId("");
    setActiveId(ws.id);
    loadWs();
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !newTask.trim()) return;
    await createTask(activeId, newTask.trim());
    setNewTask("");
    loadTasks();
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const activeWs = workspaces.find((w) => w.id === activeId);

  const workspaceForm = (
    <form onSubmit={addWorkspace} className="space-y-2 pt-2">
      <input
        required
        placeholder="Workspace name"
        value={newWs}
        onChange={(e) => setNewWs(e.target.value)}
        className="cj-input !py-2 !pl-3 w-full text-xs"
      />
      {projects.length > 0 && (
        <select
          value={newProjectId}
          onChange={(e) => setNewProjectId(e.target.value)}
          className="cj-input !py-2 !pl-3 w-full text-xs"
        >
          <option value="">Link to project (optional)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      )}
      <Button type="submit" variant="secondary" size="sm" className="w-full">
        <Plus className="mr-1 h-3 w-3" /> Create
      </Button>
    </form>
  );

  return (
    <FeatureShell
      title="Collab Workspace"
      icon={Users}
      badge="Studio"
      heading={
        <>
          Build Together / <span className="text-cj-gold-bright">In Sync.</span>
        </>
      }
      subtitle="Project boards with tasks, progress tracking, and links to your studio projects."
      maxWidth="xl"
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        {loading ? (
          <p className="text-center text-cj-gold-muted">Loading...</p>
        ) : workspaces.length === 0 ? (
          <div>
            <EmptyState
              icon={Users}
              title="No Workspaces Yet"
              description="Create a collab board for your next track."
            />
            <div className="mx-auto mt-4 max-w-md">{workspaceForm}</div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Workspaces</p>
              {workspaces.map((ws) => (
                <div key={ws.id} className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveId(ws.id)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm uppercase tracking-wide transition-colors ${
                      activeId === ws.id
                        ? "border-cj-gold bg-cj-purple-card text-cj-gold"
                        : "border-cj-gold-border text-cj-gold-muted hover:border-cj-gold/50"
                    }`}
                  >
                    {ws.title}
                  </button>
                  {user?.id && (
                    <button
                      type="button"
                      onClick={() => deleteWorkspace(ws.id, user.id).then(loadWs)}
                      className="px-2 text-cj-gold-muted hover:text-red-400"
                      aria-label="Delete workspace"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              {workspaceForm}
            </aside>

            <div className="cj-card min-h-[360px]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display uppercase text-cj-gold">{activeWs?.title ?? "Board"}</h3>
                {tasks.length > 0 && (
                  <span className="text-xs text-cj-gold-muted">
                    {doneCount}/{tasks.length} done ({progress}%)
                  </span>
                )}
              </div>
              {tasks.length > 0 && (
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-cj-dark">
                  <div
                    className="h-full bg-cj-gold transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <form onSubmit={addTask} className="mb-6 flex gap-2">
                <input
                  placeholder="Add task — mix vocals, record bass, upload stems..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="cj-input !pl-4 flex-1"
                />
                <Button type="submit" variant="secondary" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              <ul className="space-y-1">
                {tasks.map((t) => (
                  <li key={t.id} className="group flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTask(t.id, !t.done).then(loadTasks)}
                      className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-cj-purple/30"
                    >
                      {t.done ? (
                        <Check className="h-4 w-4 shrink-0 text-cj-gold-bright" />
                      ) : (
                        <Square className="h-4 w-4 shrink-0 text-cj-gold-muted" />
                      )}
                      <span
                        className={`text-sm ${t.done ? "text-cj-gold-muted line-through" : "text-cj-gold"}`}
                      >
                        {t.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id).then(loadTasks)}
                      className="opacity-0 transition-opacity group-hover:opacity-100 text-cj-gold-muted hover:text-red-400"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-cj-gold-muted">
                    No tasks yet. Add recording, mixing, and release checklist items.
                  </p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </FeatureShell>
  );
}
